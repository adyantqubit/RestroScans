import { useState } from "react";

export function useInvoiceDetailState() {
  const [isLoading, setLoading] = useState(false);
  return { isLoading, setLoading };
}
