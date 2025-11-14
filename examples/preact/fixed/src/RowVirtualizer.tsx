/* @refresh reset */
import { useRef, useEffect } from "preact/hooks";
import { signal, useSignal } from "@preact/signals";
import { signalFunctions } from "@dorilama/byos/@preact-signals";
import { useVirtualizer } from "@dorilama/virtual-byos";

export default function RowVirtualizer() {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const scrollElement = signal<HTMLDivElement | null>(null);
  const virtualizer = useSignal(
    useVirtualizer(
      signalFunctions,
      {
        count: 10000,
        getScrollElement: () => scrollElement.value,
        estimateSize: () => 35,
        overscan: 5,
      },
      [scrollElement]
    )
  );

  const state = virtualizer.value.state;
  const cleanup = virtualizer.value.cleanup;

  useEffect(() => {
    scrollElement.value = parentRef.current;
  }, [parentRef]);
  useEffect(() => {
    virtualizer.value = useVirtualizer(
      signalFunctions,
      {
        count: 10000,
        getScrollElement: () => scrollElement.value,
        estimateSize: () => 35,
        overscan: 5,
      },
      [scrollElement]
    );

    return () => {
      console.log("cleanup");
      cleanup();
    };
  }, [virtualizer]);

  return (
    <div
      ref={parentRef}
      class="List"
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
