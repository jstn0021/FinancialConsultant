"use client";

import React, { useEffect, useState } from "react";
import VourcherComponent from "@/app/components/vouchers";
import axios from "axios";
import { useParams } from "next/navigation";

const PaymentVouchers = () => {
  const [checks, setCheck] = useState();
  const [files, setFiles] = useState([]);
  const params = useParams();
  const [vouchers, setVouchers] = useState([
    { description1: "", description2: "", amount1: "", amount2: "", total: "" },
  ]);

  useEffect(() => {
    const fetchChecks = async () => {
      try {
        const response = await axios.get(`/api/vouchers/${params.voucherId}`);
        setCheck(response.data?.specificCheck || []);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChecks();
  }, []);

  // ADD VOUCHER
  const handleAdd = () => {
    setVouchers((prev) => [
      ...prev,
      {
        voucherNo: "",
        amount: "",
        description: "",
        amount1: "",
        amount2: "",
        total: "",
      },
    ]);
  };

  // REMOVE VOUCHER
  const handleRemoveVoucher = (indexToRemove) => {
    setVouchers((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // HANDLE CHANGE
  const handleChange = (index, e) => {
    const { name, value } = e.target;

    setVouchers((prev) =>
      prev.map((voucher, i) =>
        i === index ? { ...voucher, [name]: value } : voucher,
      ),
    );
  };
  // HANDLE FILE CHANGE
  const handleFileChange = (e) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    // reset input
    e.target.value = "g";
  };
  // REMOVE FILE
  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      {/* ADD BUTTON */}
      <div className="flex justify-end items-end">
        <button
          onClick={handleAdd}
          className="px-4 py-2 mb-5 text-white rounded font-semibold bg-lightRed hover:bg-gray-400"
        >
          Add
        </button>
      </div>

      {/* VOUCHERS */}
      {checks &&
        checks?.items?.map((check, index) => (
          <div key={index} className="mb-2 border p-2 rounded">
            <VourcherComponent
              key={check.id}
              voucher={check}
              index={index}
              handleChange={handleChange}
            />

            {/* DELETE BUTTON */}
            <div className="flex justify-end mt-3">
              {/* <button
                onClick={() => handleRemoveVoucher(index)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Delete Voucher
              </button> */}
            </div>
          </div>
        ))}

      {/* FILE INPUT */}
      <div className="mt-5 flex justify-end items-end">
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="border p-2 w-50 rounded  text-white bg-lightRed text-sm hover:bg-black"
        />
      </div>

      {/* FILE LIST */}
      <div className="flex justify-end items-end">
        <div className="mt-5">
          <h2 className="font-bold text-lg mb-2">Uploaded Files</h2>
          {files.length === 0 && <p>No files selected</p>}
          {files.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center border p-2 mb-2"
            >
              <div>
                <p>{file.name}</p>

                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>

              <button
                onClick={() => handleRemoveFile(index)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PaymentVouchers;
