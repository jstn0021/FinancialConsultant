"use client";
import CashbooksTable from "@/app/components/Tables/cashbookTable";
import { useBanner } from "@/hooks/Context/banner";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CashbookDetailed = () => {
  const params = useParams();
  const { showSucess, showError } = useBanner();
  const [data, setData] = useState([]);
  const [date, setDate] = useState();
  const [currency, setCurrency] = useState();
  const [category, setCategory] = useState();
  // fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/cashbooks/${params.cashbookId}`);
      setData(response?.data?.cashbooksDetails || []);
      setCategory(response.data.category);
      setCurrency(response.data.currency);
      setDate(response.data?.createdAt.split("T")[0]);
    } catch (err) {
      showError("Failed to fetch the data");
    }
  };
  // first render
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <div>
        {/* header */}
        <table className="border">
          <tbody>
            <tr className="border-b border-gray-300 text-left ">
              <td className="p-2 border border-l bg-black text-white">
                Project
              </td>
              <td className="p-2">9665R7268</td>
              <td>
                <input
                  type="text"
                  placeholder="ZPC-LC1"
                  className="border border-gray-300 bg-gray-200 text-black print:border-0 print:outline-none print:bg-transparent"
                />
              </td>
              <td className="p-2">{date?.replaceAll("-", "/")}</td>
            </tr>
            <tr className="border-b border-gray-300 text-left">
              <td className="border border-l p-2 bg-black text-white">
                {" "}
                Currency
              </td>
              <td colSpan={2} className="p-2">
                {currency === "PH" ? "PHilippine Peso" : "US DOLLAR"}
              </td>
              <td className="p-2">{currency === "PH" ? "PHP" : "USD"}</td>
            </tr>

            <tr className="border-b border-gray-300 text-left">
              <td className="border border-l p-2 bg-black text-white">
                {" "}
                Cash/Bank
              </td>
              <td className="p-2">
                <span
                  className={`px-3 rounded-full ${category === "Cash" ? "border border-black" : ""} `}
                >
                  Cash
                </span>
                <span
                  className={`px-3 rounded-full ${category === "Bank" ? "border border-black" : ""} `}
                >
                  Bank
                </span>
              </td>
              <td>
                {" "}
                <input
                  type="text"
                  placeholder="(A/C No.　BDO# 105790173323　 )"
                  className="border border-gray-300 bg-gray-200 text-black print:border-0 print:outline-none print:bg-transparent"
                />
              </td>
              <td className="p-2">003N1</td>
            </tr>
          </tbody>
        </table>
        {/* cashbooksTable Component */}
        <div className="mt-3">
          <CashbooksTable
            tableHeader={[
              "Date",
              "Description",
              "Account Code",
              "Payee/Payor",
              "payment",
            ]}
            tbdatDetailes={data}
          />
        </div>
      </div>
    </>
  );
};

export default CashbookDetailed;
