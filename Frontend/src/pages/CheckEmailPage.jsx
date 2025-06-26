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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/90 backdrop-blur-md max-w-md w-full rounded-3xl shadow-xl p-8 border border-purple-200 text-black">
        <div className="w-fit mx-auto mb-6 text-purple-700">
          <LuCircleUserRound size={80} />
        </div>

        <h3 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
          We are glad you are here for BaatCheet!!
        </h3>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-purple-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg py-3 transition"
          >
            Let's Go
          </button>
        </form>

        <p className="text-center mt-6 text-purple-700">
          New User?{" "}
          <Link
            to="/register"
            className="font-semibold underline hover:text-purple-900"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
