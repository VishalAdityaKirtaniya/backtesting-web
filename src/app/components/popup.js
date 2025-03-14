import React, { useEffect, useState } from "react";
import CSVTable from "./show_csv";

const Popup = ({ expandedStrategy, setExpandedStrategy }) => {
  const [strategyData, setStrategyData] = useState({
    Graph: null,
    robustness: null,
    trade_logs: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const flaskurl = process.env.NEXT_PUBLIC_FLASK_URL;

  useEffect(() => {
    // Fetch API only when expandedStrategy exists
    if (!expandedStrategy) return;

    const fetchStrategyData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${flaskurl}/trade_logs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            strategy_name: expandedStrategy["Strategy Name"],
            stock_symbol: expandedStrategy["Stock Symbol"],
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setStrategyData({
          Graph: data.Graph,
          robustness: data.robustness,
          trade_logs: data.trade_logs,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategyData();
  }, [expandedStrategy]); // Runs when expandedStrategy is set

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="relative h-[85vh] w-[90vw] z-30 flex flex-col overflow-auto bg-gray-100 rounded-lg shadow-lg">
        {/* Close Button */}
        <button
          onClick={() => setExpandedStrategy(null)}
          className="absolute top-4 right-4 text-xl font-bold bg-gray-200 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition-all z-50"
        >
          ✖
        </button>

        {/* Loading/Error Handling */}
        {loading ? (
          <p className="text-center text-lg font-semibold">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : strategyData ? (
          <div className="h-full w-full flex gap-2 p-6 overflow-hidden">
            {/* Content Grid */}
            <div className="flex flex-col gap-2 justify-between h-full w-1/2">
              {/* Graph */}
              <div className="h-[55%] w-full">
                <h2 className="text-lg font-semibold text-gray-700">
                  Performance Graph:
                </h2>
                <img
                  src={`data:image/png;base64,${strategyData.Graph}`}
                  alt="Backtesting Graph"
                  className="h-full rounded-md shadow-md"
                />
              </div>

              {/* Trade Log */}
              <div className="flex flex-col w-full h-[40%]">
                <h3 className="text-lg font-medium text-gray-700">
                  Trade Log:
                </h3>
                <CSVTable jsonData={strategyData.trade_logs} />
              </div>
            </div>

            <div className="flex flex-row w-1/2 h-full">
              {/* Robustness Test */}
              <div className="overflow-scroll">
                <h3 className="text-lg font-medium text-gray-700">
                  Robustness Test:
                </h3>
                <CSVTable jsonData={strategyData.robustness} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-lg">No data available</p>
        )}
      </div>
    </div>
  );
};

export default Popup;
