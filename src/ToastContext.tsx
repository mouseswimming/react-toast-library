import { ReactNode, createContext, useState } from "react";
import { createPortal } from "react-dom";

const POSITIONS = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
] as const;

type ToastOption = {
  autoDismiss: boolean;
  autoDismissTimeout: number;
  position: (typeof POSITIONS)[number];
};

type Toast = {
  id: string;
  text: string;
  options: ToastOption;
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (
    text: string,
    options?: Partial<ToastOption & { id: string }>
  ) => string;
  removeToast: (id: string) => void;
};

const DEFAULT_OPTIONS: ToastOption = {
  autoDismiss: true,
  autoDismissTimeout: 3000,
  position: "top-right",
};

export const ToastContext = createContext<ToastContextType | null>(null);

type ToastProviderProps = {
  children: ReactNode;
};

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function addToast(
    text: string,
    {
      id = crypto.randomUUID(),
      ...userToastOptions
    }: Partial<ToastOption & { id: string }> = {}
  ) {
    const options = { ...DEFAULT_OPTIONS, ...userToastOptions };

    setToasts((prev) => [...prev, { id, text, options }]);

    if (options.autoDismiss) {
      setTimeout(() => removeToast(id), options.autoDismissTimeout);
    }

    return id;
  }

  const toastByPosition = toasts.reduce((grouped, toast) => {
    const { position } = toast.options;
    if (grouped[position] == null) {
      grouped[position] = [];
    }
    grouped[position].push(toast);
    return grouped;
  }, {} as Record<string, Toast[]>);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {createPortal(
        <>
          {Object.entries(toastByPosition).map(([position, toasts]) => (
            <div className={`toast-container ${position}`} key={position}>
              {toasts.map((toast) => (
                <Toast
                  key={toast.id}
                  text={toast.text}
                  remove={() => removeToast(toast.id)}
                />
              ))}
            </div>
          ))}
        </>,
        document.querySelector("#toast-container") as HTMLDivElement
      )}
    </ToastContext.Provider>
  );
}

type ToastProps = {
  text: string;
  remove: () => void;
};

function Toast({ text, remove }: ToastProps) {
  return (
    <div className="toast" onClick={remove}>
      {text}
    </div>
  );
}
