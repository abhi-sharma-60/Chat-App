import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuCircleUserRound } from "react-icons/lu";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({ email: "" });
        navigate("/password", { state: response?.data?.data });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6">
        <div className="w-fit mx-auto mb-4 text-primary">
          <LuCircleUserRound size={80} />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
          We are glad you are here for <span className="text-primary">BaatCheet</span>!
        </h2>
        <p className="text-center text-gray-600 mb-6">Enter your email to continue</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="example@domain.com"
              className="bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Let's Go
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          New here?{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
