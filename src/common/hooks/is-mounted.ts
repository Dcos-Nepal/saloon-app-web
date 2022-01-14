import * as React from "react";

/**
 * Use this hook to determine whether your component is currently mounted or not
 */
const useMountedRef = (): boolean => {
  const mountedRef = React.useRef(true);

  React.useLayoutEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef.current;
};

export default useMountedRef;
