import { useState } from "react";

export function useAppState() {
  const [isLoading, setLoading] = useState(false)
  return { isLoading, setLoading };
}
