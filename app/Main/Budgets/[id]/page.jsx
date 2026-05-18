"use client";

import DetailedItemComponent from "@/app/components/Tables/detailedItemComponent";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const SubMain = () => {
  const params = useParams();
  const router = useRouter();

  const [data, setData] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`/api/budgets/items/${params.id}`);
      const item = response.data?.item;
      //   const covertedJson = JSON.parse(item?.json_detailed);
      if (!item) {
        router.push("/Main/Budgets");
        return;
      }

      setData(item);
    } catch (err) {
      console.log("API Error:", err.response?.data || err.message);
      router.push("/Main/Budgets");
    }
  }, [params.id, router]);

  useEffect(() => {
    if (params?.id) {
      fetchData();
    }
  }, [fetchData, params?.id]);

  return (
    <div>
      <DetailedItemComponent items={data} id={params.id} />
    </div>
  );
};

export default SubMain;
