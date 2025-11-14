import { useRef, useEffect, useMemo, useState } from "preact/hooks";
import { signal, useComputed, useSignal } from "@preact/signals";
import { signalFunctions } from "@dorilama/byos/@preact-signals";
import { useVirtualizer } from "@dorilama/virtual-byos";
import "./app.css";

const scrollElement = signal<HTMLDivElement | null>(null);
const { virtualizer, state, cleanup } = useVirtualizer(signalFunctions, {
  count: 10000,
  getScrollElement: () => scrollElement.value,
  estimateSize: () => 35,
  overscan: 5,
});

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
        />
        show
      </label>

      {show.value ? <RowVirtualizer /> : ""}
    </>
  );
}

function RowVirtualizer() {
  const parentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollElement.value = parentRef.current;
  }, [parentRef]);
  useEffect(() => {
    return cleanup;
  }, []);

  return (
    <div
      ref={parentRef}
      class="card"
      style="height: 200px; width: 400px; overflow: auto"
    >
      <div
        style={{
          height: `${state.value.getTotalSize}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {state.value.getVirtualItems.map((item) => {
          return (
            <div
              key={item.index}
              class={item.index % 2 ? "ListItemOdd" : "ListItemEven"}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${item.size}px`,
                transform: `translateY(${item.start}px)`,
              }}
            >
              Row {item.index}
            </div>
          );
        })}
      </div>
    </div>
  );
}
