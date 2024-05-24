import { useEffect, useState } from "react";

export const useTimer = () => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (timer <= 0) {
        return;
      }

      setTimer(timer - 1);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [timer]);

  return {
    timer,
    setTimer,
  };
};
