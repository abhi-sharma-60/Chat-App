import React, { useEffect, useState, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");

  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.user.theme);
  const modalRef = useRef(null);

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
        searchType: searchType,
      });

      let results = response.data.data || [];

      // Add permanent demo user
      const demoUser = {
        _id: "demo-user-id",
        name: "Demo User",
        email: "demo@example.com",
        profile_pic: "https://via.placeholder.com/150",
        branch: "Computer Science",
        college: "Virtual University",
        skills: ["React", "Node.js", "CSS"],
        about: "I am a demo user to preview chat features!",
      };

      const isMatch =
        demoUser.name.toLowerCase().includes(search.toLowerCase()) ||
        demoUser.college.toLowerCase().includes(search.toLowerCase()) ||
        demoUser.skills
          .join(", ")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        demoUser.branch.toLowerCase().includes(search.toLowerCase());

      if (isMatch) {
        results = [demoUser, ...results];
      }

      setSearchUser(results);
      setLoading(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search, searchType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-2 ${
        theme === "dark"
          ? "bg-black/60 backdrop-blur-sm"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-2xl shadow-xl border p-6 relative
          ${
            theme === "dark"
              ? "bg-gray-900 border-gray-700 text-white"
              : "bg-white/90 border-purple-200 text-purple-800"
          }
        `}
      >
        {/* Close Button */}
        <button
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-purple-100"
          }`}
          onClick={onClose}
        >
          <IoCloseSharp size={22} />
        </button>

        {/* Header */}
        <h2
          className={`text-2xl font-bold mb-4 text-center ${
            theme === "dark" ? "text-white" : "text-purple-800"
          }`}
        >
          Search Users
        </h2>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, branch, college..."
            className={`flex-1 py-2 px-4 rounded-lg border focus:outline-none focus:ring-2
              ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                  : "bg-white border-purple-300 text-purple-900 focus:ring-purple-500"
              }
            `}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className={`py-2 px-4 rounded-lg border focus:outline-none focus:ring-2
              ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white focus:ring-purple-500"
                  : "bg-white border-purple-300 text-purple-900 focus:ring-purple-500"
              }
            `}
          >
            <option value="name">Name</option>
            <option value="college">College</option>
            <option value="skills">Skills</option>
            <option value="branch">Branch</option>
          </select>
        </div>

        {/* Search Results */}
        <div className="max-h-[65vh] overflow-y-auto">
          {loading && (
            <div className="py-6 text-center">
              <Loading />
            </div>
          )}

          {!loading && searchUser.length === 0 && (
            <p
              className={`text-center py-6 ${
                theme === "dark" ? "text-gray-400" : "text-slate-500"
              }`}
            >
              No users found.
            </p>
          )}

          {!loading &&
            searchUser
              .filter((u) => u._id !== user?._id)
              .map((user) => (
                <UserSearchCard key={user._id} user={user} onClose={onClose} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
