import React, { useState, useEffect } from "react";

interface TimerProps {
  isActive: boolean; // To control whether the timer is active or paused
  onTimeEnd: (time: number) => void; // Callback when the time is stopped
}

const Timer: React.FC<TimerProps> = ({ isActive, onTimeEnd }) => {
  const [timeElapsed, setTimeElapsed] = useState(0); // Time in seconds
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start the timer when isActive is true
    if (isActive && intervalId === null) {
      const id = setInterval(() => {
        setTimeElapsed((prev) => prev + 1); // Increment time every second
      }, 1000); // 1 second interval
      setIntervalId(id);
    } else if (!isActive && intervalId !== null) {
      clearInterval(intervalId); // Stop the timer when isActive is false
      onTimeEnd(timeElapsed); // Notify parent component when the timer stops
      setIntervalId(null); // Reset intervalId after stopping the timer
    }

    // Cleanup the interval when the component unmounts or timer stops
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, intervalId, onTimeEnd, timeElapsed]);

  // Convert seconds into minutes and seconds
  const minutes = Math.floor(timeElapsed / 60);
  const seconds = timeElapsed % 60;

  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        fontSize: "20px",
        color: "black",
      }}
    >
      Time: {minutes < 10 ? `0${minutes}` : minutes}:
      {seconds < 10 ? `0${seconds}` : seconds}
    </div>
  );
};

export default Timer;
