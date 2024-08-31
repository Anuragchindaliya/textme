// src/hooks/useDebounce.ts

import { useEffect, useState } from 'react';

// Custom hook for debouncing a value
export function useDebounce<T>(value: T, delay: number=300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup timeout if value changes (before delay is reached)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
