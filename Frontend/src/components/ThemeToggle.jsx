import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/userSlice";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        dispatch(toggleTheme());
      }}
      className={`p-3 rounded-full transition-all duration-300 hover-lift shadow-lg ${
        theme === "light"
          ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600"
          : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
      }`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FaMoon className="w-4 h-4" />
      ) : (
        <FaSun className="w-4 h-4" />
      )}
    </button>
  );
};

export default ThemeToggle;