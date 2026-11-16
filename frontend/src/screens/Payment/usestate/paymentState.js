import { useState } from "react";

export function usePaymentState() {
  const [value, setValue] = useState("Cash");
  const [isModalOpen, setIsModalOpen] = useState(false);
  return { value, setValue, isModalOpen, setIsModalOpen };
}
