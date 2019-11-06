import { useState } from "react";

export default function useDestructiveReadMap(initialState) {
  const [map, setMap] = useState(initialState);

  const put = (key, value) => {
    setMap((m) => {
      const update = {};
      update[key] = value;
      const withUpdate = Object.assign({}, m, update);
      return withUpdate;
    });
  };

  const read = (key) => {
    var value;

    setMap((map) => {
      value = map[key];
      const withoutKey = Object.assign({}, map);
      delete withoutKey[key];
      return withoutKey;
    });

    return value;
  };

  return [
    put,
    read,
  ];
}
