import { useState } from "react";

export function useOrderDetailsState() {
  const [isLoading, setLoading] = useState(false);
  return { isLoading, setLoading };
}
