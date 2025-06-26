import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

export default Loading;