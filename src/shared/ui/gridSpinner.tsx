'use client';

import React from 'react';
import { GridLoader } from 'react-spinners';

const GridLoadingSpinner = ({ text }: { text: string }) => {
  return (
    <div aria-label={text} aria-live="polite" className="flex w-full flex-col items-center gap-4" role="status">
      <GridLoader color="green" cssOverride={{ width: '100%' }} />
      <span aria-hidden="true" className="text-xl text-gray-400">
        {text}
      </span>
    </div>
  );
};

export default GridLoadingSpinner;
