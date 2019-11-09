import { useRef, useState, useEffect } from "react";
import useDestructiveReadMap from "./useDestructiveReadMap.js";

export default function useKeystrokeMonitor(onPress) {
  const [keysDownCurrently, setKeysDownCurrently] = useState([]);

  const onPressReference = useRef(onPress);

  useEffect(() => {
    onPressReference.current = onPress;
  });

  const [put, read] = useDestructiveReadMap({});

  const down = (event) => {
    if (event.repeat === true || event.altKey === true || event.ctrlKey === true || event.metaKey === true) {
      return;
    }

    setKeysDownCurrently(k => k.concat([event.code]));
    put(event.code, onPressReference.current(event.code));
  };

  const up = (event) => {
    setKeysDownCurrently(k => k.filter((code) => code !== event.code));
    const handler = read(event.code);
    if (!handler) {
      return;
    }

    handler();
  };

  useEffect(() => {
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keyup', up);
      document.removeEventListener('keydown', down);
    };
  }, []);

  return keysDownCurrently;
}
