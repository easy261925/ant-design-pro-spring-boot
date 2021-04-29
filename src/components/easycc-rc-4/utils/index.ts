import { useState } from 'react';

export const isEmpty = (value: any) => {
  if (value === undefined || value === null) {
    return true;
  }

  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
};

export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value: number) => value + 1);
}
