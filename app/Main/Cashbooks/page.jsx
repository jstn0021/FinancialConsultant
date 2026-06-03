"use client";
import CashbooksTable from "@/app/components/Tables/cashbookTable";
import { useBanner } from "@/hooks/Context/banner";
import axios from "axios";
import React, { useEffect, useState } from "react";

const CashbooksList = () => {
  const [cashbook, setCashbook] = useState([]);
  const { showSuccess, showError } = useBanner();
  // fetch the data for list of cashbooks
  const fetchCashbooks = async () => {
    try {
      const cashbk = await axios.get("/api/cashbooks");
      setCashbook(cashbk?.data?.cashbooks || []);
      console.log(cashbk);
    } catch (err) {
      // showError
      showError("Failed to Fetch the Data");
    }
  };
  // use Effect once Renders
  useEffect(() => {
    fetchCashbooks();
  }, []);
  return (
    <>
      <div>CashbooksList</div>
      {/* call the cashbookTable */}
      <CashbooksTable
        tableHeader={[
          "Project",
          "Currency",
          "Category",
          "Date Start",
          "Date End",
          "",
        ]}
        tbdata={cashbook}
      />
    </>
  );
};

export default CashbooksList;
