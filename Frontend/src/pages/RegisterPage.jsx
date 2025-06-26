import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
    college: "",
    branch: "",
    course: "",
    studyYear: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [uploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate();

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file);
    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleClearUploadPhoto = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadPhoto(null);
    setData((prev) => ({
      ...prev,
      profile_pic: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/register`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
          college: "",
          branch: "",
          course: "",
          studyYear: "",
        });
        setUploadPhoto(null);
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto my-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200 glass-effect">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join BaatCheet! 🚀
          </h3>
          <p className="text-gray-600 text-lg">
            Create your account and start collaborating
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div>
            <label className="block font-bold text-purple-700 mb-2">
              Profile Picture
            </label>
            <div
              className="h-16 bg-purple-50 flex justify-between items-center border border-purple-300 rounded-xl px-4 cursor-pointer hover:border-purple-500 transition-all duration-300 hover-lift"
              onClick={() => document.getElementById("profile_pic").click()}
            >
              <p className="text-sm max-w-[280px] text-ellipsis overflow-hidden whitespace-nowrap text-gray-700">
                {uploadPhoto?.name
                  ? uploadPhoto?.name
                  : "Click to upload profile photo"}
              </p>
              {uploadPhoto?.name && (
                <button
                  className="text-lg text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                  onClick={handleClearUploadPhoto}
                  aria-label="Remove profile photo"
                >
                  <IoClose />
                </button>
              )}
            </div>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              accept="image/*"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-bold text-purple-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.name}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-bold text-purple-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-bold text-purple-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a strong password"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="block font-bold text-purple-700 mb-2">
              College/University
            </label>
            <input
              type="text"
              id="college"
              name="college"
              placeholder="Enter your college name"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.college}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Branch and Course */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="branch" className="block font-bold text-purple-700 mb-2">
                Branch
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                placeholder="Your branch"
                className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
                value={data.branch}
                onChange={handleOnchange}
                required
              />
            </div>

            <div>
              <label htmlFor="course" className="block font-bold text-purple-700 mb-2">
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                placeholder="Your course"
                className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
                value={data.course}
                onChange={handleOnchange}
                required
              />
            </div>
          </div>

          {/* Study Year */}
          <div>
            <label htmlFor="studyYear" className="block font-bold text-purple-700 mb-2">
              Year of Study
            </label>
            <select
              id="studyYear"
              name="studyYear"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.studyYear}
              onChange={handleOnchange}
              required
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-xl py-4 transition-all duration-300 shadow-lg hover-lift btn-primary"
          >
            Create Account
          </button>
        </form>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/email"
              className="font-bold text-purple-600 hover:text-purple-800 underline transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;