"use client";
import { use, useCallback, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Table from "@/app/components/table";
import axios from "axios";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formDates, getUser } from "@/functions/formattDate";

import useUserContext from "@/hooks/Context/UserContext";
import { GetPurchaseWithUserId } from "@/functions/purchase";

const MyRequisitionList = () => {
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [purchaseID, setPurchaseId] = useState("");
  const [limit] = useState(15);
  const { user } = useUserContext();
  const [page, setPage] = useState(1);
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [dateStartDefault, setDateStartDefault] = useState();
  const [dateEndDefault, setDateEndDefault] = useState();
  const [totalPages, setTotalPages] = useState();
  const [activeTab, setActiveTab] = useState("All");

  const fetchPurchaseDetails = async () => {
    try {
      const data = await GetPurchaseWithUserId(
        user?.userID,
        dateStart,
        dateEnd,
        page,
        limit,
        activeTab,
        // wala nang searchId dito — client-side na yung search
      );
      setPurchaseDetails(data.data);
      setTotalPages(data.totalPages);
      setDateStartDefault(data.rangeStart?.split("T")[0]);
      setDateEndDefault(data.rangeEnd?.split("T")[0]);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIs404(true);
      } else {
        console.error("Error fetching purchase details:", error);
      }
    }
  };

  useEffect(() => {
    if (!user?.userID) return;
    fetchPurchaseDetails();
  }, [user?.userID]);

  useEffect(() => {
    fetchPurchaseDetails();
  }, [page, activeTab]);

  useEffect(() => {
    if (dateStart || dateEnd) {
      fetchPurchaseDetails();
    }
  }, [dateStart, dateEnd]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // LIVE SEARCH — client-side, real-time as you type
  const handleChangeId = useCallback((e) => {
    setPurchaseId(e.target.value);
  }, []);

  const displayedList = useMemo(() => {
    if (!purchaseID || purchaseID.trim() === "") {
      return purchaseDetails || [];
    }
    return (purchaseDetails || []).filter((e) =>
      String(e.PurchaseID)
        .toLowerCase()
        .includes(purchaseID.trim().toLowerCase()),
    );
  }, [purchaseID, purchaseDetails]);

  if (!user) {
    return (
      <>
        <h4>loading</h4>
      </>
    );
  }

  const handleChangeDate = (e) => {
    switch (e.target.name) {
      case "dateStart":
        setDateStart(e.target.value);
        break;
      case "dateEnd":
        setDateEnd(e.target.value);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="flex relative mb-5 w-auto"></div>
      <div className="grid grid-row-3 mb-10">
        <hr className="border-t border-gray-300" />
        <div className="flex text-xl">
          <div className="py-4 grow mr-20 w-50 h-auto flex flex-row text-center items-start justify-start  text-white font-bold">
            <h2 className="text-black text-2xl">Search ID: </h2>
            <input
              type="text"
              className="bg-gray-100 ml-4 text-black outline-2 outline-gray-300 text-lg"
              value={purchaseID}
              onChange={handleChangeId}
              placeholder="Enter Purchase ID"
            />
            <button>
              <FiSearch
                size={28}
                className="ml-2 text-white hover:text-black hover:bg-btnRed cursor-pointer font-extrabold outline outline-darkRed 
           bg-darkRed p-1 w-10"
              />
            </button>
          </div>
          <div className="basis-64 py-4 ml-30 w-50 h-10 flex flex-row items-start justify-center  ">
            <h2 className="text-black text-2xl font-bold">Start: </h2>
            <input
              type="date"
              name="dateStart"
              className="bg-gray-100 ml-4 text-black outline-2  outline-gray-300 text-lg w-35"
              onChange={(e) => handleChangeDate(e)}
              value={dateStart || dateStartDefault || ""}
            />
          </div>
          <div className="basis-64 w-50 h-10 flex flex-row items-start justify-center p-4">
            <h2 className="text-black text-2xl font-bold">End: </h2>
            <input
              type="date"
              name="dateEnd"
              className="bg-gray-100 ml-4 text-black outline-2  outline-gray-300 text-lg "
              value={dateEnd || dateEndDefault || ""}
              onChange={(e) => handleChangeDate(e)}
            />
          </div>
        </div>
        <hr className="border-t border-gray-300" />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("All")}
          className={`px-4 py-2 border ${
            activeTab === "All" ?
              "bg-white text-black"
            : "bg-darkRed text-white"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setActiveTab("Pending")}
          className={`px-4 py-2 border ${
            activeTab === "Pending" ?
              "bg-white text-black"
            : "bg-darkRed text-white"
          }`}
        >
          Pending
        </button>

        <button
          onClick={() => setActiveTab("Approved")}
          className={`px-4 py-2 border ${
            activeTab === "Approved" ?
              "bg-white text-black"
            : "bg-darkRed text-white"
          }`}
        >
          Approved
        </button>
      </div>

      <div className="max-h-200 overflow-hidden">
        <Table
          tableHeader={[
            "REQUEST ID",
            "ITEMS",
            "TOTAL",
            "STATUS",
            "REQUISITION DATE",
            "ACTION",
          ]}
          list={[]}
          ownList={displayedList}
        />
      </div>
      {/* paginations */}
      <div className="flex justify-center items-center mt-5 ">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 bg-btnRed outline outline-darkRed hover:bg-white mr-1"
          disabled={page === 1}
        >
          <FiChevronLeft size={22} />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-1 border-r-2 border-gray-500 ${
              page === index + 1 ?
                "bg-darkRed text-white"
              : "bg-gray-200 hover:bg-darkRed hover:text-white"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border-2 border-black bg-black text-white hover:text-black  hover:bg-white ml-1"
          disabled={page === totalPages}
        >
          <FiChevronRight size={22} />
        </button>
      </div>
    </>
  );
};

export default MyRequisitionList;
