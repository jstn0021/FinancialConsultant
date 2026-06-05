import React from "react";
import Header from "@/app/components/header";
const layout = ({ children }) => {
  return (
    <div>
      <div>
        <Header title={"My Purchase Requisition"} />
        {children}
      </div>
    </div>
  );
};

export default layout;
