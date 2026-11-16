import { useState } from "react";

export function useGlobalColorState() {
  const [color, setColor] = useState(null); // Our menu set in this variable
  return { color, setColor };
}
