"use client";

import { useState } from "react";
import Image from "next/image";
import Loading from "../components/loading";
import Popup from "../components/popup";
import BuySell from "../components/buy_sell";

export default function ExecuteStrategies() {
  const [expandedStrategy, setExpandedStrategy] = useState(null);
  const [notification, setNotification] = useState(false);
  const [initialPortfolioValue, setInitialPortfolioValue] = useState(100000);
  const [stockSymbol, setStockSymbol] = useState("RELIANCE.NS");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [tradeSize, setTradeSize] = useState(30);
  const [results, setResults] = useState({
    master_results: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const flaskurl = process.env.NEXT_PUBLIC_FLASK_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "initialPortfolioValue")
      setInitialPortfolioValue(Number(value));
    if (name === "stockSymbol") setStockSymbol(value);
    if (name === "startDate") setStartDate(value);
    if (name === "tradeSize") setTradeSize(Number(value));
  };

  // Handle fetching backtest results
  const fetchResults = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults({ master_results: [], notifications: [] }); // ✅ Always an object

    const requestData = {
      initial_portfolio_value: initialPortfolioValue,
      stock_symbol: stockSymbol,
      start_date: startDate,
      trade_size: tradeSize,
    };

    try {
      const res = await fetch(`${flaskurl}/execute-strategies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      if (!res.ok)
        throw new Error(
          "Failed to fetch data. Please check the strategy name."
        );
      const data = await res.json();
      console.log(data);
      setResults({
        notifications: data.notifications || [],
        master_results: Array.isArray(data.master_results)
          ? data.master_results
          : [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 py-4">
        Backtesting Strategies
      </h1>

      {/* Form and Results Container */}
      <div
        className={`flex ${
          results.master_results.length > 0
            ? "items-start justify-center gap-10"
            : "items-center justify-evenly"
        } h-[90%] w-full p-4`}
      >
        {/* Form */}
        <form
          onSubmit={fetchResults}
          className="w-lg max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col gap-4"
        >
          <label
            htmlFor="initialPortfolioValue"
            className="block text-xs font-medium text-gray-700"
          >
            Initial Portfolio Value:
          </label>
          <input
            type="number"
            id="initialPortfolioValue"
            name="initialPortfolioValue"
            value={initialPortfolioValue}
            onChange={handleChange}
            className="w-full text-xs p-2 border border-gray-300 rounded-md"
            required
          />

          <label
            htmlFor="stockSymbol"
            className="block text-xs font-medium text-gray-700"
          >
            Stock Symbol:
          </label>
          <input
            type="text"
            id="stockSymbol"
            name="stockSymbol"
            value={stockSymbol}
            onChange={handleChange}
            className="w-full text-xs p-2 border border-gray-300 rounded-md"
            required
          />

          <label
            htmlFor="startDate"
            className="block text-xs font-medium text-gray-700"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={startDate}
            onChange={handleChange}
            className="w-full text-xs p-2 border border-gray-300 rounded-md"
            required
          />

          <label
            htmlFor="tradeSize"
            className="block text-xs font-medium text-gray-700"
          >
            Trade Size:
          </label>
          <input
            type="number"
            id="tradeSize"
            name="tradeSize"
            value={tradeSize}
            onChange={handleChange}
            className="w-full text-xs p-2 border border-gray-300 rounded-md"
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700"
          >
            Fetch Results
          </button>

          {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        </form>

        {/* Display Results */}

        {results.master_results.length > 0 && (
          <div className="w-full h-full max-w-5xl flex flex-col justify-between gap-5 bg-white p-6 rounded-lg shadow-lg">
            <div className="w-full h-[5%] flex justify-end items-center">
              <button
                onClick={() => setNotification(true)}
                className="text-xl font-bold bg-gray-200 h-[35px] w-[35px] rounded-lg shadow-md hover:bg-gray-300 transition-all z-30 flex justify-center items-center"
              >
                <Image
                  src="/notification.svg"
                  height={15}
                  width={15}
                  alt="notification icon"
                />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 h-[95%]">
              {results.master_results.map((strategy, index) => (
                <button
                  key={index}
                  onClick={() => setExpandedStrategy(strategy)}
                  className="py-4 bg-gray-200 text-sm font-semibold text-gray-700 rounded-lg shadow-md hover:bg-gray-300 transition-all flex flex-col items-center justify-center text-center"
                >
                  <span className="text-grey-700">
                    {strategy["Strategy Name"]}
                  </span>
                  {/* <span className='text-sm text-gray-500'>{strategy["Start Date"]} | Trade Size: {strategy["Trade Size"]}</span> */}
                </button>
              ))}
            </div>
          </div>
        )}
        {loading && <Loading />}
        {expandedStrategy && (
          <Popup
            expandedStrategy={expandedStrategy}
            setExpandedStrategy={setExpandedStrategy}
          />
        )}
        {notification && (
          <BuySell
            notification={results.notifications}
            onClose={() => setNotification(false)}
          />
        )}
      </div>
    </div>
  );
}
