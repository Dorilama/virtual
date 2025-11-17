import { useSignal } from "@preact/signals";
import RowVirtualizer from "./RowVirtualizer";
import "./app.css";

export function App() {
  const show = useSignal(true);
  return (
    <>
      <h1>Vite + Preact</h1>
      <label>
        <input
          type="checkbox"
          name="show"
          onClick={() => (show.value = !show.value)}
          checked={show.value}
        />
        show
      </label>

      {show.value ? <RowVirtualizer /> : ""}
    </>
  );
}
