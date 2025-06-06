import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import uploadFile from "../../helpers/uploadFile";
import Divider from "./Divider";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });
  const uploadPhotoRef = useRef();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.user.theme);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      ...user,
    }));
  }, [user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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

      toast.success(response?.data?.message || "Profile updated!");
      if (response.data.success) {
        dispatch(setUser(response?.data?.data));
        onClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50">
      <div
        className={`p-6 w-full max-w-sm mx-2 rounded-2xl shadow-xl transition-all animate-fade-in-up ${
          isDark ? "bg-zinc-900 text-white" : "bg-white text-zinc-800"
        }`}
      >
        <h2 className="text-xl font-bold mb-1">Edit Profile</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          Update your name and profile photo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={data.name}
              onChange={handleOnChange}
              className={`rounded-lg px-3 py-2 text-sm border ${
                isDark
                  ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
                  : "bg-white border-zinc-300 text-black placeholder-zinc-500"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Profile Photo</label>
            <div className="flex items-center gap-4">
              <Avatar
                width={48}
                height={48}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <button
                type="button"
                onClick={handleOpenUploadPhoto}
                className="text-sm font-medium text-primary hover:underline"
              >
                Change Photo
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
                className="hidden"
              />
            </div>
          </div>

          <Divider />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-1.5 rounded-md text-sm border ${
                isDark
                  ? "border-zinc-600 text-white hover:bg-zinc-800"
                  : "border-zinc-300 text-black hover:bg-zinc-100"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md text-sm bg-primary text-white hover:bg-primary-dark"
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
