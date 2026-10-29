# Theme Rules

Keep the light and dark themes paired by semantic level on every page and component. When using a primary color in light mode, use the primary token in dark mode; follow the same rule for secondary and tertiary colors.

## Surface palette

| Level | Light | Dark |
| --- | --- | --- |
| Primary | `#ffffff` | `#09090b` |
| Secondary | `#f4f4f5` | `#18181b` |
| Tertiary | `#e4e4e7` | `#27272a` |

Use the matching Tailwind tokens together:

```jsx
className="bg-light-bg-primary dark:bg-dark-bg-primary"
className="bg-light-bg-secondary dark:bg-dark-bg-secondary"
className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary"
```

The same pairing rule applies to text, borders, inputs, hover states, and disabled states. Use their `light-*` and `dark-*` tokens at the same semantic level. For example, pair `text-light-text-secondary` with `dark:text-dark-text-secondary`, and `hover:bg-light-bg-tertiary` with `dark:hover:bg-dark-bg-tertiary`.

Avoid raw white, black, or gray utility colors for theme surfaces and content. Use the semantic tokens so light and dark components stay aligned. Keep button accents separate from the neutral theme: CustomButtons use blue, ActionButtons use green, and destructive or validation feedback may use red.
