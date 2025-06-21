import { useEffect } from "react";

// Fixed session duration logout
const useHardLogout = (timeout, onTimeoutCallback, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const timer = setTimeout(onTimeoutCallback, timeout);

    return () => clearTimeout(timer);
  }, [timeout, onTimeoutCallback, enabled]);
};

export default useHardLogout;
