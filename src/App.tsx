import { FormEvent, useRef } from "react";
import { useToast } from "./useToast";

function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inputRef.current == null || inputRef.current?.value === "") return;

    addToast(inputRef.current.value, {
      autoDismiss: false,
    });
  }
  return (
    <>
      <h1>Toast Library</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="input the toast content"
          ref={inputRef}
        />
        <button type="submit">Add toast</button>
      </form>
    </>
  );
}

export default App;
