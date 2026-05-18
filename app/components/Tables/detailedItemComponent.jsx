"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinus } from "react-icons/fa";
import FormulaBuilder from "./formulaBuilder";
const DetailedItemComponent = ({ items, id }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});
  const [openFormula, setOpenFormula] = useState(false);

  // Parse JSON data
  useEffect(() => {
    if (items?.json_detailed) {
      try {
        const parsed = JSON.parse(items.json_detailed);
        setData(parsed);
      } catch (err) {
        console.log("Parse Error", err);
      }
    }
    if (items?.total) {
      try {
        const parsed = JSON.parse(items.total);
        setTotal(parsed);
      } catch (err) {
        console.log("Total Parse ", err);
      }
    }
  }, [items]);

  // displayTotal
  const TotalSet = (key) => {
    // reduce to get the total for the specific key
    const totalValue = data.reduce((acc, item) => {
      return acc + (Number(item[key]) || 0);
    }, 0);

    return totalValue;
  };
  const headers = data.length > 0 ? Object.keys(data[0]) : [];
  const textHeaders = headers.filter((h) => typeof data[0][h] !== "number");

  const numericHeaders = headers.filter((h) => typeof data[0][h] === "number");

  // Dynamic headers

  // Handle input change
  const handleChange = (rowIndex, key, value) => {
    const updatedData = [...data];

    // Convert number fields
    if (typeof updatedData[rowIndex][key] === "number") {
      updatedData[rowIndex][key] = Number(value);
    } else {
      updatedData[rowIndex][key] = value;
    }

    setData(updatedData);
  };

  // Add row
  const addRow = () => {
    if (headers.length === 0) return;

    const emptyRow = {};

    headers.forEach((header) => {
      const sampleValue = data[0][header];

      emptyRow[header] = typeof sampleValue === "number" ? 0 : "";
    });

    setData([...data, emptyRow]);
  };

  // Delete row
  const deleteRow = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    setData(updatedData);
  };

  // Save

  // API save here
  const handleSave = async () => {
    try {
      // Create totals object
      const totals = {};

      numericHeaders.forEach((header) => {
        totals[`Total${header}`] = TotalSet(header);
      });

      // Final payload
      const payload = {
        json_detailed: data,
        total: totals,
      };

      console.log(payload);

      await axios.put(`/api/budgets/items/${id}`, payload);

      alert("Saved Successfully");
    } catch (error) {
      console.log("Save Error:", error.response?.data || error.message);
    } finally {
    }
  };

  return (
    <div className="p-4">
      <div className="flex gap-1 justify-end items-end mb-4">
        <button
          onClick={() => setOpenFormula(true)}
          className="bg-lightRed hover:bg-black text-white px-4 py-2 rounded text-sm font-semibold"
        >
          Create Formula
        </button>
        <button
          onClick={addRow}
          className="bg-lightRed hover:bg-black text-white px-4 py-2 rounded text-sm font-semibold"
        >
          + Add Row
        </button>
      </div>

      {openFormula && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg w-[7    10px] max-w-[95%] p-5 relative border border-gray-300">
            {/* CLOSE */}
            <button
              onClick={() => setOpenFormula(false)}
              className="absolute top-3 right-3 text-black font-bold text-lg"
            >
              ✕
            </button>

            {/* TITLE */}

            {/* FORMULA BUILDER */}
            <FormulaBuilder data={data} setData={setData} />
          </div>
        </div>
      )}

      <table className="border border-gray-300 w-full border-collapse">
        <thead className="bg-black text-white text-left sticky top-0 z-10">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border p-2 border-white">
                {header}
              </th>
            ))}

            <th className="border p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-300">
              {headers.map((header) => (
                <td key={header} className="border p-2">
                  <input
                    type={typeof row[header] === "number" ? "number" : "text"}
                    value={row[header]}
                    onChange={(e) =>
                      handleChange(rowIndex, header, e.target.value)
                    }
                    className="bg-gray-200 border border-gray-300 text-black"
                    style={{
                      width: `${String(row[header] || "").length + 3}ch `,
                    }}
                  />
                </td>
              ))}

              <td className="border p-2 ">
                <button
                  onClick={() => deleteRow(rowIndex)}
                  className="bg-darkRed border border-darkRed text-white  hover:bg-white hover:text-black px-2 py-1 rounded text-xs flex justify-center  "
                >
                  <FaMinus size={10} />
                </button>
              </td>
            </tr>
          ))}
          <tr className="font-bold">
            {/* merge TEXT columns only ONCE */}
            <td colSpan={textHeaders.length} className="border p-2 text-center">
              Total
            </td>

            {/* numeric totals */}
            {numericHeaders.map((h) => (
              <td key={h} className="border p-2 text-center">
                {TotalSet(h)}
              </td>
            ))}

            {/* action column */}
            <td className="border p-2" />
          </tr>
        </tbody>
      </table>
      <div className="flex justify-end items-end">
        <button
          onClick={(e) => handleSave()}
          className="rounded bg-lightRed p-2 px-5 mr-4 mt-4 text-white font-semibold border border-darkRed hover:bg-white hover:text-darkRed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DetailedItemComponent;
