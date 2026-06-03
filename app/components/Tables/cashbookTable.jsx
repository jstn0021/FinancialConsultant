import Link from "next/link";
import React, { useState } from "react";

const CashbooksTable = (props) => {
  const { tableHeader, tbdata, tbdatDetailes } = props;
  const [modal, setModal] = useState(false);
  return (
    <>
      <div className="table-container w-full">
        <table className="border border-gray-300 w-full ">
          <thead className="bg-black text-white border-3  sticky  top-0 z-10 ">
            <tr>
              {tableHeader.map((header, index) => (
                <th
                  key={index}
                  className="border-b border-gray-300 text-left px-4 py-2 text-sm font-bold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* for list books */}
            {tbdata?.map((data, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td>
                  <h3 className="px-4 py-3">{data.project}</h3>
                </td>
                <td>
                  <h3 className="px-4 py-3">{data.currency}</h3>
                </td>
                <td>
                  <h3 className="px-4 py-3">{data.category}</h3>
                </td>
                <td>
                  <h3 className="px-4 py-3">
                    {data.dateRangeStart.split("T")[0]}
                  </h3>
                </td>
                <td>
                  <h3 className="px-4 py-3">
                    {data.dateRangeEnd.split("T")[0]}
                  </h3>
                </td>
                <td>
                  <Link
                    className="px-4 py-1 bg-btnRed text-white font-bold rounded-lg border hover:border hover:border-darkRed hover:text-black hover:bg-white"
                    href={`/Main/Cashbooks/${data.cashbook_id}`}
                  >
                    view
                  </Link>
                </td>
              </tr>
            ))}

            {/* cashbooks detailed parts*/}
            {tbdatDetailes?.map((data, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-2 py-2">
                  <input
                    className="border border-gray-300 bg-gray-200 text-black print:border-0 print:outline-none print:bg-transparent"
                    type="date"
                    value={data.date.split("T")[0] || ""}
                  />
                </td>
                <td className="px-2 py-2">
                  <textarea
                    className="border border-gray-300 bg-gray-200 text-black h-30 w-50 print:border-0 print:outline-none print:bg-transparent"
                    type="text"
                    // style={{
                    //   width: `${String(data.description || "").length + 3}ch`,
                    // }}
                    value={data.description || ""}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    className="border border-gray-300 bg-gray-200 text-black print:border-0 print:outline-none print:bg-transparent"
                    type="text"
                    value={data.A_C_code || " "}
                  />
                </td>
                <td className="px-2 py-2">
                  <textarea
                    className="border border-gray-300 bg-gray-200 h-20 text-black print:border-0 print:outline-none print:bg-transparent"
                    type="text"
                    // style={{
                    //   width: `${String(data.payee_payer || "").length + 3}ch`,
                    // }}
                    value={data.payee_payer || ""}
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    className="border border-gray-300 bg-gray-200 text-black print:border-0 print:outline-none print:bg-transparent"
                    type="number"
                    value={data.payment || 0}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CashbooksTable;
