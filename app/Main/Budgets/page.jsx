"use client";
import BudgetComponentTable from "@/app/components/Tables/budgetComponent";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Budgets = () => {
  const [BudgetInfo, setBudgetInfo] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/api/budgets");
      console.log(res?.data);
      const withIds = (res.data?.items || []).map((item) => ({
        ...item,
        id: item.id || Date.now() + Math.random(),
        children: (item.children || []).map((child) => ({
          ...child,
          id: child.id || Date.now() + Math.random(),
        })),
      }));

      setBudgetInfo(withIds);
    };

    fetch();
  }, []);
  useEffect(() => {
    console.log(BudgetInfo);
  }, []);
  return (
    <div>
      <div className="grid grid-row-3 mb-5">
        <hr className="border-t border-gray-300" />
        <div className="h-15"></div>
        <hr className="border-t border-gray-300" />
      </div>
      <BudgetComponentTable items={BudgetInfo} setItems={setBudgetInfo} />
    </div>
  );
};

export default Budgets;
