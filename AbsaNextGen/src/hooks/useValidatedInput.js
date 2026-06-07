import { useState } from "react";

export function useValidatedInput(initial, { min, max, label } = {}) {
  const [value, setValue] = useState(initial);
  const [error, setError] = useState("");

  const onChange = (raw) => {
    const num = Number(raw);
    setError("");

    if (raw === "" || raw === "-") {
      setValue(raw);
      return;
    }

    if (isNaN(num)) {
      setError(`${label || "Value"} must be a number`);
      return;
    }

    if (min !== undefined && num < min) {
      setError(
        `${label || "Value"} must be at least ${min.toLocaleString("en-ZA")}`
      );
      setValue(num);
      return;
    }

    if (max !== undefined && num > max) {
      setError(
        `${label || "Value"} must be at most ${max.toLocaleString("en-ZA")}`
      );
      setValue(num);
      return;
    }

    setValue(num);
  };

  const numValue = Number(value) || initial;

  return { value, numValue, error, onChange };
}
