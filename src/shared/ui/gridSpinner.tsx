'use client';

import React from 'react';
import { GridLoader } from 'react-spinners';

const GridLoadingSpinner = ({ text }: { text: string }) => {
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <GridLoader color="green" cssOverride={{ width: '100%' }} />
      <span className="text-xl text-gray-400">{text}</span>
    </div>
  );
};

export default GridLoadingSpinner;
