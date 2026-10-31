import { useCallback } from "react";

import { normalizeFieldErrors } from "../utils/normalizeFieldErrors";

export default function useFieldErrors(setError) {
  const addErrors = useCallback(
    (error) => {
      const fieldErrors = normalizeFieldErrors(error);

      fieldErrors.forEach(([field, message]) => {
        setError(field, { type: "server", message });
      });
    },
    [setError],
  );

  return { addErrors };
}
