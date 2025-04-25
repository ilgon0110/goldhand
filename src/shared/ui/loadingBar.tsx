"use client";

import React from "react";
import { BarLoader } from "react-spinners";

const LoadingBar = () => {
  return (
    <div className="w-full">
      <span className="text-2xl font-bold">로딩중...</span>
      <BarLoader color="green" cssOverride={{ width: "100%" }} />
    </div>
  );
};

export default LoadingBar;
