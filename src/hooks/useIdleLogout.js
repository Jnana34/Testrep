import { useEffect } from "react";

const useIdleLogout = (timeout, onIdleCallback, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onIdleCallback, timeout);
    };

    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, onIdleCallback, enabled]);
};

export default useIdleLogout;
