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
    skills: "",
    studyYear: "",
  });

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "skills" ? value.split(",").map(skill => skill.trim()) : value
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
          skills: "",
          studyYear: "",
        });
        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5 mb-10">
      <div className="text-black bg-white w-full max-w-md rounded overflow-hidden p-6 mx-auto shadow-lg">
        <h3 className="text-2xl font-semibold text-center mb-6">Join BaatCheet!</h3>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
              value={data.name}
              onChange={handleOnchange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="college" className="font-medium">College Name</label>
            <input
              type="text"
              id="college"
              name="college"
              placeholder="Enter your college name"
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
              value={data.college}
              onChange={handleOnchange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="branch" className="font-medium">Branch</label>
              <input
                type="text"
                id="branch"
                name="branch"
                placeholder="Your branch"
                className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
                value={data.branch}
                onChange={handleOnchange}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="course" className="font-medium">Course</label>
              <input
                type="text"
                id="course"
                name="course"
                placeholder="Your course"
                className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
                value={data.course}
                onChange={handleOnchange}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="studyYear" className="font-medium">Year of Study</label>
            <select
              id="studyYear"
              name="studyYear"
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
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

          <div className="flex flex-col gap-1">
            <label htmlFor="skills" className="font-medium">Skills (comma-separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              placeholder="React, Node.js, Python..."
              className="bg-slate-50 px-4 py-2 rounded-md border focus:outline-primary"
              value={data.skills}
              onChange={handleOnchange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic" className="font-medium">
              Profile Picture
              <div className="h-14 bg-slate-50 flex justify-center items-center border rounded hover:border-primary cursor-pointer mt-1">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-4 hover:text-red-600"
                    onClick={handleClearUploadPhoto}
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
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-white text-lg px-4 py-2 rounded-md hover:bg-secondary mt-4 font-bold transition-colors"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link to="/email" className="text-primary hover:text-secondary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;