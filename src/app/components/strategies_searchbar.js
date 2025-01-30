import React, { useState, useEffect } from "react";

const StrategySearchForm = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const flaskurl = process.env.FLASK_URL;

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Trigger API call when typing
    if (value) {
      fetch(`${flaskurl}/filter-strategies?query=${value}`)
        .then((response) => response.json())
        .then((data) => setSuggestions(data))
        .catch((error) => console.error("Error fetching suggestions:", error));
    } else {
      setSuggestions([]); // Clear suggestions if input is empty
    }
  };

  return (
    <div className='w-full h-full bg-white shadow-md rounded-lg'>
      <label
        htmlFor='strategy'
        className='block text-lg font-medium text-gray-700'
      >
        Strategy Name:
      </label>
      <input
        type='text'
        id='strategy'
        name='strategy'
        value={query}
        onChange={handleChange}
        placeholder='Enter strategy name'
        className='w-full p-2 border border-gray-300 rounded-md'
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className='bg-white border border-gray-300 rounded-md mt-2 max-h-40 overflow-y-auto'>
          {suggestions.map((strategy, index) => (
            <li
              key={index}
              className='p-2 hover:bg-blue-100 cursor-pointer'
              onClick={() => setQuery(strategy)} // Fill input when suggestion clicked
            >
              {strategy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StrategySearchForm;
