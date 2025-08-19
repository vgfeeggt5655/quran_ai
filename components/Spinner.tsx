
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-16 h-16 border-4 border-teal-500 border-solid border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;
