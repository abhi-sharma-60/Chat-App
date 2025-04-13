import React from "react";
const AuthLayouts = ({ children }) => {
  return (
    <>
      <header className="flex justify-center items-center py-3 h-20 shadow-md bg-white">
        <img src="logo.png" alt="logo" width={150} height={40} />
      </header>
      {children}
    </>
  );
};

export default AuthLayouts;
