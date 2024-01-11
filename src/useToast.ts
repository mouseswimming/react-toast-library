import { useContext } from "react";
import { ToastContext } from "./ToastContext";

export function useToast() {
  const value = useContext(ToastContext);
  if (value == null) {
    throw new Error("useToast should be used with provider");
  }

  return value;
}
