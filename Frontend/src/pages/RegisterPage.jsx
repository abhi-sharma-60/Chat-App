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
   // skills: "",
    studyYear: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]:
        name === "skills"
          ? value.split(",").map((skill) => skill.trim())
          : value,
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
         // skills: "",
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
    <div className=" text-black h-screen overflow-y-auto bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
  <div className="max-w-md mx-auto my-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-purple-200">
 <h3 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
          Go For BaatCheet 👋🏻 & Collaborate !
        </h3>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-semibold text-purple-600">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-purple-50 text-black px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.name}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold text-purple-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-purple-50 text-black px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold text-purple-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-purple-50  text-black px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* College */}
          <div className="flex flex-col gap-1">
            <label htmlFor="college" className="font-semibold text-purple-600">
              College Name
            </label>
            <input
              type="text"
              id="college"
              name="college"
              placeholder="Enter your college name"
              className="bg-purple-50  text-black px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.college}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Branch and Course */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="branch" className="font-semibold text-purple-600">
                Branch
              </label>
              <input
                type="text"
                id="branch"
                name="branch"
                placeholder="Your branch"
                className="bg-purple-50 text-black  px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
                value={data.branch}
                onChange={handleOnchange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="course" className="font-semibold text-purple-600">
                Course
              </label>
              <input
                type="text"
                id="course"
                name="course"
                placeholder="Your course"
                className="bg-purple-50  text-black px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
                value={data.course}
                onChange={handleOnchange}
                required
              />
            </div>
          </div>

          {/* Study Year */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="studyYear"
              className="font-semibold text-purple-600"
            >
              Year of Study
            </label>
            <select
              id="studyYear"
              name="studyYear"
              className="bg-purple-50 text-black  px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
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

          {/* Skills 
          <div className="flex flex-col gap-1">
            <label htmlFor="skills" className="font-semibold text-purple-600">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="React, Node.js, Python..."
              className="bg-purple-50 px-4 py-3 rounded-lg border border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 transition"
              value={data.skills}
              onChange={handleOnchange}
              required
            />
          </div>
            */}


          {/* Profile Picture */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="profile_pic"
              className="font-semibold text-purple-600"
            >
              Profile Picture
              <div
                className="mt-1 h-14 bg-purple-50 flex justify-between items-center border border-purple-300 rounded-lg px-4 cursor-pointer hover:border-purple-500 transition"
                onClick={() => document.getElementById("profile_pic").click()}
              >
                <p className="text-sm max-w-[280px] text-ellipsis overflow-hidden whitespace-nowrap">
                  {uploadPhoto?.name
                    ? uploadPhoto?.name
                    : "Click to upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg text-red-600 hover:text-red-800"
                    onClick={handleClearUploadPhoto}
                    aria-label="Remove profile photo"
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>

            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              accept="image/*"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg py-3 transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-purple-700">
          Already have an account?{" "}
          <Link
            to="/email"
            className="font-semibold underline hover:text-purple-900"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
