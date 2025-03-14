import React from "react";

const Notifications = ({ notifications, typeOfLogs }) => {
  return (
    <div className="w-full h-full bg-gray-200 rounded-lg mx-auto p-6 overflow-scroll">
      <h2 className="text-xl font-bold mb-4">{typeOfLogs}</h2>

      {notifications.map((strategy, index) => (
        <div key={index}>
          {/* Strategy Name */}
          <h3 className="text-lg font-semibold text-blue-600">
            {strategy["Strategy Name"]}
          </h3>

          <div className="flex justify-between h-full w-full">
            {/* Buy Sell Logs */}
            <div className="w-full">
              {strategy[typeOfLogs] && // Ensure it exists before accessing properties
                ["today", "week", "month"].map(
                  (period) =>
                    strategy[typeOfLogs][period]?.length > 0 && ( // Use optional chaining to avoid errors
                      <div key={period} className="mt-2">
                        <h5 className="text-xs font-medium text-gray-600">
                          {period.toUpperCase()}
                        </h5>
                        <ul className="list-disc ml-5 text-gray-500">
                          {strategy[typeOfLogs][period].map((log, idx) => (
                            <li key={idx}>
                              {log.datetime} - {log.type}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
