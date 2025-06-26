import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../../helpers/uploadFile";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";
import { IoCloseSharp } from "react-icons/io5";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user?.profile_pic,
    college: user?.college,
    branch: user?.branch,
    course: user?.course,
    studyYear: user?.studyYear
  });
  const theme = useSelector((state) => state.user.theme);
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    setData((prev) => ({ ...prev, ...user }));
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    setData((prev) => ({
      ...prev,
      profile_pic: uploadPhoto?.url,
    }));
  };

  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-user`;

    try {
      const payload = {
        name: data.name,
        profile_pic: data.profile_pic,
        college: data.college,
        branch: data.branch,
        course: data.course,
        studyYear: data.studyYear,
      };
      
      const response = await axios.post(URL, payload, {
        withCredentials: true,
      });

      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setUser(response?.data?.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        theme === "dark"
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div
        className={`w-full max-w-lg rounded-3xl shadow-2xl border p-8 relative backdrop-blur-xl ${
          theme === "dark"
            ? "bg-gray-900/95 border-gray-700 text-white glass-effect-dark"
            : "bg-white/95 border-purple-200 text-gray-800 glass-effect"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 hover-lift ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-purple-100"
          }`}
        >
          <IoCloseSharp size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Edit Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Update your profile information
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <Avatar
                width={100}
                height={100}
                imageUrl={data.profile_pic}
                name={data?.name}
              />
              <button
                type="button"
                onClick={handleOpenUploadPhoto}
                className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover-lift"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <input
              type="file"
              id="profile_pic"
              className="hidden"
              onChange={handleUploadPhoto}
              ref={uploadPhotoRef}
              accept="image/*"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-2 font-bold text-sm">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={handleOnChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 input-focus ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                  : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
              }`}
              placeholder="Enter your name"
            />
          </div>

          {/* College */}
          <div>
            <label htmlFor="college" className="block mb-2 font-bold text-sm">College</label>
            <input
              id="college"
              name="college"
              type="text"
              value={data.college}
              onChange={handleOnChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 input-focus ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                  : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
              }`}
              placeholder="Enter your college"
            />
          </div>

          {/* Branch and Course */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="branch" className="block mb-2 font-bold text-sm">Branch</label>
              <input
                id="branch"
                name="branch"
                type="text"
                value={data.branch}
                onChange={handleOnChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 input-focus ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
                }`}
                placeholder="Your branch"
              />
            </div>

            <div>
              <label htmlFor="course" className="block mb-2 font-bold text-sm">Course</label>
              <input
                id="course"
                name="course"
                type="text"
                value={data.course}
                onChange={handleOnChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 input-focus ${
                  theme === "dark"
                    ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                    : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
                }`}
                placeholder="Your course"
              />
            </div>
          </div>

          {/* Study Year */}
          <div>
            <label htmlFor="studyYear" className="block mb-2 font-bold text-sm">Study Year</label>
            <select
              id="studyYear"
              name="studyYear"
              value={data.studyYear}
              onChange={handleOnChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all duration-300 input-focus ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
                  : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
              }`}
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <Divider />

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 px-6 py-3 rounded-xl border font-bold transition-all duration-300 hover-lift ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-800"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover-lift"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);