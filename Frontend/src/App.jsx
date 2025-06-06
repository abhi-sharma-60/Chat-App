import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";

function App() {
  const theme = useSelector((state) => state.user.theme);

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <>
      <Toaster />
      <main
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
        }`}
      >
        <Outlet />
      </main>
    </>
  );
}

export default App;
