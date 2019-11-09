import { useRef, useState, useEffect } from "react";
import useDestructiveReadMap from "./useDestructiveReadMap.js";

export default function useKeystrokeMonitor(onPress, onRelease) {
  const onPressReference = useRef(onPress);
  const onReleaseReference = useRef(onRelease);

  useEffect(() => {
    onPressReference.current = onPress;
    onReleaseReference.current = onRelease;
  });

  const [put, read] = useDestructiveReadMap({});

  const down = (event) => {
    if (event.repeat === true || event.altKey === true || event.ctrlKey === true || event.metaKey === true) {
      return;
    }

    put(event.code, onPressReference.current(event.code));
  };

  const up = (event) => {
    const handler = read(event.code);
    if (!handler) {
      return;
    }

    handler();
    onReleaseReference.current(event.code);
  };

  useEffect(() => {
    document.addEventListener('keyup', up);
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keyup', up);
      document.removeEventListener('keydown', down);
    };
  }, []);
}
