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
          ? "bg-black/60 backdrop-blur-sm"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl shadow-lg border p-6 relative ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
        >
          <IoCloseSharp size={22} />
        </button>

        <h2 className="text-2xl font-bold text-center mb-2">Profile Details</h2>
        <p className="text-sm text-center mb-4">
          Edit your profile information
        </p>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={data.name}
              onChange={handleOnChange}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition ${
                theme === "dark"
                  ? "bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-purple-500"
                  : "bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-purple-500"
              }`}
            />
          </div>

          {/* Profile Picture */}
          <div>
            <label className="block font-medium mb-1">Profile Photo:</label>
            <div className="flex items-center gap-4 mt-1">
              <Avatar
                width={48}
                height={48}
                imageUrl={data.profile_pic}
                name={data?.name}
              />
              <button
                className={`text-sm font-medium underline hover:opacity-80 ${
                  theme === "dark" ? "text-white" : "text-purple-600"
                }`}
                onClick={handleOpenUploadPhoto}
              >
                Change Photo
              </button>
              <input
                type="file"
                id="profile_pic"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </div>
          </div>

          <Divider />

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded border ${
                theme === "dark"
                  ? "border-gray-600 hover:bg-gray-800"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700`}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetails);
