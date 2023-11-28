import { useRef, useEffect } from 'react';

export function useTraceUpdate(props, marker='') {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log(marker, 'Changed props:', changedProps);
    }
    prev.current = props;
  });
}
