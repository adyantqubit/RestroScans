import { useState } from "react";

export function useCoverState() {
  const [isLoader, setIsLoader] = useState(true)
  return { isLoader, setIsLoader };
}
