"use client";

import { useState, useEffect } from "react";
import CSVTable from "./components/show_csv";
import Link from "next/link";
import Loading from "./components/loading";

export default function Home() {
  const [strategy, setStrategy] = useState("");
  const [initialPortfolioValue, setInitialPortfolioValue] = useState(100000);
  const [stockSymbol, setStockSymbol] = useState("RELIANCE.NS");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [tradeSize, setTradeSize] = useState(30);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [strategies, setStrategies] = useState([]); // Added to store available strategies fetched from the backend

  const flaskurl = process.env.NEXT_PUBLIC_FLASK_URL;

  // Fetch available strategies from the backend when the component mounts
  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const res = await fetch(`${flaskurl}/strategies`); // API endpoint for fetching strategies
        if (!res.ok) throw new Error("Failed to fetch strategies");
        const data = await res.json();
        setStrategies(data.strategies); // Populate the dropdown with fetched strategies
      } catch (err) {
        setError("Error fetching strategies");
        console.error(err);
      }
    };

    fetchStrategies();
  }, []); // Empty dependency array ensures this runs only once

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "strategy") setStrategy(value);
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
    setResults(null);

    const requestData = {
      strategy_name: strategy,
      initial_portfolio_value: initialPortfolioValue,
      stock_symbol: stockSymbol,
      start_date: startDate,
      trade_size: tradeSize,
    };

    try {
      const res = await fetch(`${flaskurl}/backtest`, {
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
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold text-center text-blue-600 py-4'>
        Backtesting Strategies
      </h1>

      {/* Form and Results Container */}
      <div
        className={`flex ${
          results
            ? "items-start justify-center gap-10"
            : "items-center justify-evenly"
        } h-[90%] w-full p-4`}
      >
        {/* Form */}
        <form
          onSubmit={fetchResults}
          className='w-lg max-w-md p-6 bg-white shadow-lg rounded-lg flex flex-col gap-4'
        >
          <label
            htmlFor='strategy'
            className='block text-xs font-medium text-gray-700'
          >
            Strategy Name:
          </label>
          <select
            type='text'
            id='strategy'
            name='strategy'
            value={strategy}
            onChange={handleChange}
            placeholder='Enter strategy name'
            className='w-full text-xs p-2 border border-gray-300 rounded-sm'
            required
          >
            <option value=''>Select a strategy</option>
            {strategies.map((strat, index) => (
              <option key={index} value={strat}>
                {strat}
              </option>
            ))}
          </select>
          <label
            htmlFor='initialPortfolioValue'
            className='block text-xs font-medium text-gray-700'
          >
            Initial Portfolio Value:
          </label>
          <input
            type='number'
            id='initialPortfolioValue'
            name='initialPortfolioValue'
            value={initialPortfolioValue}
            onChange={handleChange}
            className='w-full text-xs p-2 border border-gray-300 rounded-md'
            required
          />

          <label
            htmlFor='stockSymbol'
            className='block text-xs font-medium text-gray-700'
          >
            Stock Symbol:
          </label>
          <input
            type='text'
            id='stockSymbol'
            name='stockSymbol'
            value={stockSymbol}
            onChange={handleChange}
            className='w-full text-xs p-2 border border-gray-300 rounded-md'
            required
          />

          <label
            htmlFor='startDate'
            className='block text-xs font-medium text-gray-700'
          >
            Start Date:
          </label>
          <input
            type='date'
            id='startDate'
            name='startDate'
            value={startDate}
            onChange={handleChange}
            className='w-full text-xs p-2 border border-gray-300 rounded-md'
            required
          />

          <label
            htmlFor='tradeSize'
            className='block text-xs font-medium text-gray-700'
          >
            Trade Size:
          </label>
          <input
            type='number'
            id='tradeSize'
            name='tradeSize'
            value={tradeSize}
            onChange={handleChange}
            className='w-full text-xs p-2 border border-gray-300 rounded-md'
            required
          />

          <button
            type='submit'
            className='w-full py-2 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700'
          >
            Fetch Results
          </button>
          <div className='flex justify-end '>
            <Link
              href='/execute-strategies'
              className='px-2 text-blue-500 text-xs font-xs rounded-md hover:text-blue-900 transition hover:underline'
            >
              All Strategies
            </Link>
          </div>

          {error && <p className='text-center text-red-500 mt-2'>{error}</p>}
        </form>

        {/* Display Results */}
        {results && (
          <div className='w-full h-full max-w-5xl flex gap-2 bg-white p-6 rounded-lg shadow-lg'>
            <div className='flex flex-col gap-2 justify-between h-full w-1/2'>
              {/* Graph */}
              <div className='h-[55%] w-full'>
                <h2 className='text-lg font-semibold text-gray-700 mb-2'>
                  Performance Graph:
                </h2>
                <img
                  src={`data:image/png;base64,${results["Graph Img"]}`}
                  alt='Backtesting Graph'
                  className='w-full rounded-md'
                />
              </div>
              <div className='flex flex-col gap-1 w-full h-[40%]'>
                <h3 className='text-lg font-medium text-gray-700 mb-2'>
                  Trade Log:
                </h3>
                <CSVTable
                  base64Data={results["Trade Log"]}
                  filename={`${strategy}_trade_log.csv`}
                />
              </div>
            </div>

            <div className='flex flex-row gap-4 w-1/2 h-full'>
              {/* Robustness Test CSV */}
              <div className='flex-1 overflow-scroll'>
                <h3 className='text-lg font-medium text-gray-700 mb-2'>
                  Robustness Test:
                </h3>
                <CSVTable
                  base64Data={results["Robustness Test"]}
                  filename={`${strategy}_robustness_test.csv`}
                />
              </div>
            </div>
          </div>
        )}
        {/* Loading Indicator */}
        {loading && <Loading />}
      </div>
    </div>
  );
}
