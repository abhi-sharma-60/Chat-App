import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";
import { LuCircleUserRound } from "react-icons/lu";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className=" text-black bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto  ">
        <div className="w-fit mx-auto mb-4">
          <LuCircleUserRound size={80} />
        </div>

        <h3 className="text-center underline text-xl ">We are glad you are here for BaatCheet !!</h3>
        <form className="mt-2 grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white text-lg  px-4 py-2 rounded hover:bg-secondary mt-2 font-bold "
          >
            Let's Go
          </button>
        </form>
        <p className="text-center my-3">
          New User ?{" "}
          <Link to={"/register"} className=" hover:text-primary font-semibold ">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
