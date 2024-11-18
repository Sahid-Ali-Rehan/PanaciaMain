import React, { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";

const NotificationBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [timer, setTimer] = useState(5); // 5 seconds to close the notification

  useEffect(() => {
    const interval = setInterval(() => {
      if (isOpen && timer > 0) {
        setTimer(timer - 1);
      }
      if (timer === 0) {
        setIsOpen(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timer]);

  const handleHover = () => {
    clearInterval(timer);
  };

  const handleUnhover = () => {
    setTimer(5); // Reset timer on hover out
  };

  const closeNotification = () => {
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div
        className="fixed top-0 left-0 right-0 bg-blue-500 text-white p-4 flex justify-between items-center z-50"
        onMouseEnter={handleHover}
        onMouseLeave={handleUnhover}
      >
        <span>Limited Time Offer: 30% Off on all items!</span>
        <div className="flex items-center">
          <span>{timer}s</span>
          <AiOutlineClose className="ml-4 cursor-pointer" size={20} onClick={closeNotification} />
        </div>
      </div>
    )
  );
};

export default NotificationBar;
