import { useEffect, MutableRefObject } from "react";

function useClickOutside<T extends HTMLDivElement | null>(
  ref: MutableRefObject<T>,
  callback: () => void,
) {
  useEffect(() => {
    const listener = (e: Event) => {
      if (!ref.current || ref.current.contains(e.target as Node)) {
        return;
      }
      callback();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}

export default useClickOutside;
