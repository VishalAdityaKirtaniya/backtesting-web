import React from "react";
import Notifications from "./notification";

const BuySell = ({ notification, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="h-[370px] w-[60vw] bg-white flex justify-evenly items-center rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 text-xl font-bold bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all z-50"
        >
          ✖
        </button>
        <div className="h-[90%] w-[45%] rounded-lg">
          <Notifications
            notifications={notification}
            typeOfLogs={"Pre Buy Sell Logs"}
          />
        </div>
        <div className="h-[90%] w-[45%]">
          <Notifications
            notifications={notification}
            typeOfLogs={"Buy Sell Logs"}
          />
        </div>
      </div>
    </div>
  );
};

export default BuySell;
