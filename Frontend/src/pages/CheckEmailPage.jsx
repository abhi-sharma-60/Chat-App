import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuCircleUserRound } from "react-icons/lu";

const CheckEmailPage = () => {
  const [data, setData] = useState({ email: "" });
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/90 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-8 border border-purple-200 text-black glass-effect">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <LuCircleUserRound size={40} className="text-white" />
          </div>

          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Welcome to BaatCheet!
          </h3>
          <p className="text-gray-600 text-lg">
            Connect, collaborate, and chat with developers
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block font-bold text-purple-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full bg-purple-50 px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus text-gray-900"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-xl py-4 transition-all duration-300 shadow-lg hover-lift btn-primary"
          >
            Continue
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            New to BaatCheet?{" "}
            <Link
              to="/register"
              className="font-bold text-purple-600 hover:text-purple-800 underline transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage;