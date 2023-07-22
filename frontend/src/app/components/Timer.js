import css from "@/app/styles/practice.module.css";

import { useEffect, useState, useRef } from "react";

export default function Timer({ duration, onTimerEnd, update }) {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const startTimeRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const updateTimer = () => {
      const currentTime = Date.now();
      const startTime = startTimeRef.current;

      if (!startTime) {
        startTimeRef.current = currentTime;
      }

      const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
      const remaining = Math.max(duration - elapsed, 0);

      setTimeRemaining(remaining);
      update(remaining); // It is used to update the elapsed time

      if (remaining <= 0) {
        onTimerEnd(remaining);
        return;
      }

      // Stores unique id of animation
      requestRef.current = requestAnimationFrame(updateTimer);
    };

    requestRef.current = requestAnimationFrame(updateTimer);

    return () => {
      if (requestRef.current) {
        // Cancel animation
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [duration, onTimerEnd]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className={css.timer}>Time Remaining: {formatTime(timeRemaining)}</div>
  );
}
