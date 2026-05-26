"use client";
import { FiEdit } from "react-icons/fi";
import React from "react";
const ConfirmBox = React.memo((props) => {
  const { content, handleclose, handleConfirm, id } = props;
  return (
    <>
      <div className=" h-full flex justify-center items-center ">
        <div className=" w-auto h-auto p-3 rounded-2xl shadow-lg shadow-gray-600 bg-gray-100 z-10 opacity-100 fixed   ">
          <div className="  pt-5 pb-5 px-3 w-auto h-auto rounded-2xl bg-white flex justify-center items-center flex-col">
            <h4 className="text-xl font-bold  ">{content}</h4>

            <h4 className="font-semibold text-2xl text-darkRed">
              {id} <span className="text-black">?</span>
            </h4>
          </div>
          <div className=" mt-3 flex items-end gap-3 justify-end">
            <button
              onClick={(e) => handleclose()}
              className="px-5 py-2 bg-darkRed border  border-darkRed text-white font-bold rounded hover:bg-red-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={(e) => handleConfirm()}
              className="px-6 py-2 bg-lightRed border border-darkRed text-white font-bold rounded hover:bg-red-200 hover:text-black transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

export default ConfirmBox;
