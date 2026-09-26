# Client API Hook Migration Design

## Purpose

The client currently invokes service endpoint functions directly from authentication providers, pages, components, and reusable data hooks. This migration will route every client API request through `useApi`, using the callback-based pattern already established in `Dashboard.jsx`.

The migration must centralize request loading and error logging without changing existing application behavior. Page-level notifications remain visible, while reusable list and lookup hooks—especially `useSkillsList`—continue to fail silently in the UI.

## Goals

- Use `useApi` for every API call under `client/src`, including calls made by reusable hooks.
- Preserve current request sequencing, state updates, refetch behavior, form behavior, and user notifications.
- Keep one centralized `console.error` in `useApi` and remove other client-side console logging from the migration scope.
- Preserve public interfaces used by existing consumers, including the return value from authentication methods such as `login`.
- Provide consistent keyed loading state for requests without introducing a global API context.

## Non-Goals

- Changing endpoint definitions or the client service layer.
- Changing API payloads, response shapes, notification text, routing, or authorization behavior.
- Adding global success or error notifications.
- Refactoring unrelated UI, form, session, or domain logic.
- Combining domain-specific hooks into a new generalized data-fetching abstraction.

## Selected Approach

Keep `useApi` as a local, callback-based hook and strengthen its contract. Each provider, page, component, or reusable hook will instantiate `useApi` and pass a request function, loading key, and optional callbacks to `callApi`.

This matches the existing Dashboard usage, limits the migration to request orchestration, and avoids the additional coupling of a global request provider or the larger call-site rewrite required by a result-object API.

The usage contract is:

```js
const { loading, callApi } = useApi(initialLoading);

const response = await callApi(request, "requestKey", {
  loading: true,
  onSuccess,
  onError,
});
```

`request` is a zero-argument function that starts the endpoint call. `requestKey` identifies its loading state. All options are optional.

## `useApi` Contract

`useApi` will provide these guarantees:

1. It initializes `loading` from the supplied loading-state object, or an empty object when none is supplied.
2. Unless `options.loading` is explicitly `false`, it sets `loading[requestKey]` to `true` immediately before starting the request.
3. It invokes `onSuccess` with the endpoint response when the request resolves.
4. It returns that same endpoint response to the caller. This allows provider methods such as `login` to preserve their existing public return values.
5. If the request rejects, it logs the error once through the centralized `console.error`, invokes `onError` only when provided, and returns `undefined`.
6. It sets `loading[requestKey]` to `false` after either success or failure. This remains true when `options.loading` is `false`, allowing an initially true loading key to be cleared after a silent background-style request starts.
7. `callApi` and its internal loading setter remain referentially stable so consumers can use them safely in effects and memoized callbacks.

The hook will not display notifications, interpret response payloads, or own domain state.

## Migration Boundaries

The migration covers direct endpoint invocations in:

- `AuthProvider` and authentication pages
- Private dashboard and settings pages
- CRUD list and add/edit pages for projects, experiences, education, achievements, certificates, skills, skill categories, and social platforms
- User image and resume upload components
- Session and password management pages
- Reusable list and lookup hooks for skills, categories, visibilities, social platforms, employment types, certificates, organizations, locations, genders, project categories, and skill levels

Endpoint wrapper modules remain unchanged. They continue to encapsulate HTTP method, URL, and payload details; `useApi` only orchestrates invocation at the consumer boundary.

## Data and Control Flow

For each request:

1. The consumer constructs a zero-argument request function, closing over any required identifiers or payloads.
2. `callApi` optionally activates the named loading key.
3. The endpoint wrapper performs the HTTP request.
4. On success, `useApi` passes the complete response to the consumer callback and returns it.
5. On failure, `useApi` performs the sole console error log and delegates optional UI behavior to the consumer callback.
6. `useApi` clears the named loading key in `finally`.

Existing follow-up actions—such as updating local state, resetting forms, navigating, closing dialogs, or refetching a list—stay in their current success callbacks and retain their existing order.

## Loading-State Policy

API-specific loading indicators should read from the keyed `loading` object when doing so preserves the current UI. Existing non-request UI state remains local.

When the interface needs to identify which item is being changed or deleted, the component may retain the selected item identifier separately while `useApi` owns whether the request is active. Dynamic keys may be used when the existing interface allows simultaneous per-item operations, but the migration will not introduce concurrency behavior that does not exist today.

React Hook Form state remains responsible for client-side validation and form mechanics. API submission state moves to or is backed by `useApi` only where the current UI needs an explicit network loading indicator.

## Error and Notification Policy

- `useApi` contains the only client-side `console.error` used for migrated API failures.
- Other active or commented `console.log`, `console.warn`, and `console.error` calls in `client/src` will be removed as part of the migration audit.
- Pages and interactive components retain their current user-facing success and error notifications through `onSuccess` and `onError` callbacks.
- Reusable list and lookup hooks do not provide `onError` callbacks and do not display failure notifications. This includes `useSkillsList`. A failure leaves their existing/default data intact, clears loading, and is logged only by `useApi`.
- No error is thrown again by `useApi`; failed calls resolve to `undefined` after error handling, matching the callback-oriented design.

## Authentication Compatibility

`AuthProvider` will use `useApi` for Google authentication, credential login, session restoration, and logout. Existing user/session state logic remains intact.

Because `SignIn` awaits the result of `login`, the provider will continue returning its current success value. The response return contract from `callApi` makes this possible without duplicating error handling or bypassing the hook.

## Testing and Verification

The migration will be verified in layers:

1. Focused hook behavior coverage will exercise successful calls, returned responses, success callbacks, optional error callbacks, silent failures, and loading-state cleanup.
2. Existing linting and production build commands will catch invalid hook usage, missing imports, syntax errors, and integration problems.
3. A source audit will confirm that endpoint invocations in `client/src` are routed through `callApi`.
4. A console audit will confirm that the centralized error statement in `useApi` is the only remaining client console statement.
5. Representative flows will be reviewed for preserved behavior: authentication, list loading/deletion, add/edit submission, file upload/removal, dependent lookup fetching, and silent reusable-hook failures.

## Success Criteria

The work is complete when every client API request uses `useApi`, existing user-facing flows behave as before, reusable lookup failures remain silent, authentication callers receive the same useful results, loading indicators settle correctly after success or failure, lint/build verification passes, and no client console calls remain outside the centralized `useApi` error log.
