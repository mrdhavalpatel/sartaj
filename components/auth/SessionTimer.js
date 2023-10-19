import { useState, useEffect } from "react";

const SessionTimer = ({ sessionTimeout, onExpire }) => {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Clear the previous timer on component mount or sessionTimeout change
    if (timer) {
      clearInterval(timer);
    }

    // Start a new timer
    const newTimer = setInterval(() => {
      onExpire();
    }, sessionTimeout);

    setTimer(newTimer);

    return () => {
      clearInterval(newTimer); // Clear the timer on unmount
    };
  }, [sessionTimeout, onExpire]);

  return null;
};

export default SessionTimer;
