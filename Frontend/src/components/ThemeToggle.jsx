import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/userSlice";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`p-2 rounded-full transition-colors ${
        theme === "light"
          ? "bg-gray-200 hover:bg-gray-300"
          : "bg-gray-700 hover:bg-gray-600"
      }`}
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <FaMoon className="text-gray-700" />
      ) : (
        <FaSun className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggle;
