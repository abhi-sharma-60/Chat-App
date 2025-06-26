import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState({
    password: "",
    userId: location?.state?._id || "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/password`;

    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          password: data.password,
          userId: location?.state?._id || "",
        },
        withCredentials: true,
      });
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/90 backdrop-blur-xl max-w-md w-full rounded-3xl shadow-2xl p-8 border border-purple-200 text-black glass-effect">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <Avatar
              width={100}
              height={100}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {location?.state?.name?.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Enter your password to continue
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="block font-bold text-purple-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full bg-purple-50 px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus text-gray-900"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-xl py-4 transition-all duration-300 shadow-lg hover-lift btn-primary"
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/forgot"
            className="font-bold text-purple-600 hover:text-purple-800 underline transition-colors"
          >
            Forgot Password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckPasswordPage;