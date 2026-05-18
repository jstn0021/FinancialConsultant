"use client";

import React, { useMemo, useState } from "react";

const FormulaBuilder = ({ data, setData }) => {
  const [targetColumn, setTargetColumn] = useState("");
  const [formula, setFormula] = useState("");

  // Dynamic headers from current dataset
  const headers = useMemo(() => {
    if (!data || data.length === 0) return [];

    return Object.keys(data[0]);
  }, [data]);

  // Dynamic numeric columns only
  const numericHeaders = useMemo(() => {
    if (!data || data.length === 0) return [];

    return headers.filter((header) =>
      data.some(
        (row) => typeof row[header] === "number" || !isNaN(Number(row[header])),
      ),
    );
  }, [headers, data]);

  // Apply formula dynamically
  const applyFormula = () => {
    if (!targetColumn || !formula) return;

    const updatedData = data.map((row) => {
      try {
        let expression = formula;

        // Replace column names with row values dynamically
        numericHeaders.forEach((header) => {
          const escapedHeader = header.replace(
            /[-\/\\^$*+?.()|[\]{}]/g,
            "\\$&",
          );

          const regex = new RegExp(`\\b${escapedHeader}\\b`, "g");

          expression = expression.replace(regex, Number(row[header] || 0));
        });

        // Calculate formula
        const result = Function(`"use strict"; return (${expression})`)();

        return {
          ...row,
          [targetColumn]: Number(result) || 0,
        };
      } catch (err) {
        console.log("Formula Error:", err);

        return row;
      }
    });

    setData(updatedData);
  };

  return (
    <div className=" p-4 rounded bg-white mb-10">
      <h2 className="font-bold text-lg mb-4">Create Formula</h2>

      {/* TARGET COLUMN */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Target Column</label>

        <select
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full bg-gray-100"
        >
          <option value="">Select Numeric Column</option>

          {numericHeaders.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
      </div>

      {/* FORMULA */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Formula</label>

        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Approved Cost - Claim Amount"
          className="border border-gray-300 p-2 rounded w-full bg-gray-100 "
        />
      </div>

      {/* AVAILABLE COLUMNS */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Available Numeric Columns</p>

        <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2">
          {numericHeaders.map((header) => (
            <button
              key={header}
              type="button"
              onClick={() =>
                setFormula((prev) => (prev ? `${prev} ${header}` : header))
              }
              className="bg-lightRed text-white px-2 py-1 rounded text-sm  hover:bg-black "
            >
              {header}
            </button>
          ))}
        </div>
      </div>

      {/* EXAMPLES */}
      <div className="text-sm text-gray-600 mb-4">
        <p className="font-semibold">Examples:</p>

        <ul className="list-disc ml-5">
          <li>Approved Cost - Claim Amount</li>

          <li>Approved Cost - Previous Claimed</li>

          <li>Approved Cost * 9</li>

          <li>(Approved Cost - Claim Amount) * 0.12</li>
        </ul>
      </div>
      <div className="w-ful relative">
        <button
          onClick={applyFormula}
          className="bg-lightRed text-white px-2 py-1 rounded text-sm  hover:bg-black absolute right-0 "
        >
          Apply Formula
        </button>
      </div>
    </div>
  );
};

export default FormulaBuilder;
