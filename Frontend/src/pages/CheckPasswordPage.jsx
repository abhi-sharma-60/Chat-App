import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { LuCircleUserRound } from "react-icons/lu";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white/90 backdrop-blur-md max-w-md w-full rounded-3xl shadow-xl p-8 border border-purple-200 text-black">
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-2 text-purple-700">
            {location?.state?.name}
          </h2>
        </div>

        <h3 className="text-center underline text-xl text-purple-700 mb-6">
          We are glad you are here for BaatCheet !!
        </h3>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-purple-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={`${
                location?.state?.name
                  ? `${location.state.name.split(" ")[0]}, enter your password`
                  : "Enter your password"
              }`}
              className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg py-3 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-purple-700">
          <Link
            to="/forgot"
            className="font-semibold underline hover:text-purple-900"
          >
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
