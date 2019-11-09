import { useRef } from "react";

export default function useDestructiveReadMap() {
  const map = useRef([]);

  const put = (key, value) => {
    map.current = ((m) => {
      const update = {};
      update[key] = value;
      const withUpdate = Object.assign({}, m, update);
      return withUpdate;
    })(map.current);
  };

  const read = (key) => {
    var value;

    map.current = ((m) => {
      value = map[key];
      const withoutKey = Object.assign({}, map);
      delete withoutKey[key];

      return withoutKey;
    })(map.current);

    return value;
  };

  return [
    put,
    read,
  ];
}
