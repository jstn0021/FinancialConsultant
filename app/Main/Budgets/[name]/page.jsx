"use client";
import { useParams } from "next/navigation";
import React from "react";

const SubMain = () => {
  const params = useParams();
  return (
    <div>
      <div>{params.name}</div>
    </div>
  );
};

export default SubMain;
