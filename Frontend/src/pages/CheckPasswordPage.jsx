import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { LuCircleUserRound } from "react-icons/lu";
import Avatar from "../components/Avatar";

const CheckPasswordPage = () => {
  const location = useLocation();

  const [data, setData] = useState({
    password: "",
    userId: location?.state?._id || "", // assuming _id is passed in state
  });
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };
  const navigate = useNavigate();
  // const = location.state;

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
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);
      if (response.data.success) {
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
    <div className="mt-5">
      <div className=" text-black bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto  ">
        <div className="w-fit mx-auto mb-4 flex justify-center items-center flex-col">
          {/* <LuCircleUserRound size={80} /> */}
          <Avatar
            width={80}
            height={80}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg mt-2">
            {location?.state?.name}
          </h2>
        </div>

        <h3 className="text-center underline text-xl ">
          We are glad you are here for BaatCheet !!
        </h3>
        <form className="mt-2 grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder={`${
                location?.state?.name
                  ? `${location.state.name.split(" ")[0]}, enter your password`
                  : "Enter your password"
              }`}
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white text-lg  px-4 py-2 rounded hover:bg-secondary mt-2 font-bold "
          >
            Login
          </button>
        </form>
        <p className="text-center my-3">
          <Link to={"/forgot-password"} className=" hover:text-primary font-semibold ">
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
