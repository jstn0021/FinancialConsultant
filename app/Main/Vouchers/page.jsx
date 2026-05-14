"use client";
import VoucherTable from "@/app/components/Tables/voucher-table";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const VouchersList = () => {
  const [vouchers, setVourchers] = useState();
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState();
  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          `/api/vouchers?page=${page}&limit=${limit}`,
        );
        setVourchers(response.data?.data || []);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVouchers();
  }, []);
  return (
    <div>
      <div>
        <VoucherTable
          data={vouchers}
          header={[
            "Vouchers ID",
            "Count",
            "Amount",
            "Claimable",
            "Date Created",
          ]}
        />
      </div>

      {/* paginations */}
      <div className="flex justify-center items-center mt-5">
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
            className={`px-4 py-1 border-r-2 border-gray-500 ${page === index + 1 ? "bg-darkRed text-white" : "bg-gray-200 hover:bg-darkRed hover:text-white"}  `}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 border-2 border-black bg-black text-white hover:text-black hover:bg-white ml-1"
          disabled={page === totalPages}
        >
          <FiChevronRight size={22} />
        </button>
      </div>
    </div>
  );
};

export default VouchersList;
