import { useState } from "react";

export function useScanState() {
  const [scanner, setScanner] = useState([]);
  return { scanner, setScanner };
}
