import React, { useEffect, useState } from "react";
import Papa from "papaparse"; // Use PapaParse to parse CSV files
import Link from "next/link";

const CSVTable = ({ base64Data, filename }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (base64Data) {
      try {
        console.log("Decoding Base64 data..."); // Debugging Base64 decoding
        // Decode Base64 string
        const csvText = atob(base64Data);

        console.log("Parsing CSV data..."); // Debugging CSV parsing
        // Parse CSV using PapaParse
        const parsed = Papa.parse(csvText, { header: true });
        setData(parsed.data); // Set parsed data
        setLoading(false);
      } catch (error) {
        console.error("Error decoding or parsing Base64 CSV:", error);
        setLoading(false);
      }
    }
  }, [base64Data]);

  if (loading) {
    return <div>Loading CSV data...</div>;
  }

  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  // Extract headers from the first item in the data array
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  // Function to handle CSV download
  const handleDownloadCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","), // Headers
        ...data.map((row) => headers.map((header) => row[header]).join(",")), // Rows
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='mt-4 border overflow-x-auto p-1 rounded-md bg-gray-50 w-full'>
      {/* Download Button */}
      <div className='flex justify-end mb-2'>
        <button
          onClick={handleDownloadCSV}
          className='py-1 px-2 text-blue-500 text-xs font-xs rounded-md hover:text-blue-900 transition hover:underline'
        >
          Download CSV
        </button>
      </div>

      {/* Table */}
      <table className='min-w-full bg-white border-collapse border border-gray-300'>
        <thead>
          <tr className='bg-gray-200'>
            {headers.map((header) => (
              <th
                key={header}
                className='px-2 py-2 text-left text-xs font-medium text-gray-700 border'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className='border-t'>
              {headers.map((header) => (
                <td key={header} className=' text-xs text-gray-600 border'>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CSVTable;
