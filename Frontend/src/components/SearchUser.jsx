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

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    rating: 0,
    languages: [],
    roles: [],
    tools: "",
    college: "",
    branch: "",
  });

  const user = useSelector((state) => state.user);
  const theme = useSelector((state) => state.user.theme);
  const modalRef = useRef(null);

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, filters);
      let results = response.data.data || [];

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
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
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

  const labelClass = `block mb-1 font-semibold ${
    theme === "dark" ? "text-white" : "text-purple-800"
  }`;
  const inputClass = `w-full p-2 rounded-lg border ${
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-600"
      : "bg-white text-purple-900 border-purple-300"
  }`;
  const textColor = theme === "dark" ? "text-white" : "text-purple-800";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto flex items-start justify-center px-2 py-8 ${
        theme === "dark"
          ? "bg-black/60 backdrop-blur-sm"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-2xl rounded-2xl shadow-xl border p-6 relative ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white/90 border-purple-200"
        }`}
      >
        <button
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-purple-100"
          }`}
          onClick={onClose}
        >
          <IoCloseSharp size={22} />
        </button>

        <h2 className={`text-2xl font-bold mb-4 text-center ${textColor}`}>
          Search Users
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              className={inputClass}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="text"
              className={inputClass}
              value={filters.email}
              onChange={(e) =>
                setFilters({ ...filters, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Minimum Rating</label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={filters.rating}
              onChange={(e) =>
                setFilters({ ...filters, rating: parseFloat(e.target.value) })
              }
            />
            <p className={`text-sm mt-1 ${textColor}`}>
              Rating: {filters.rating}
            </p>
          </div>

          <div>
            <label className={labelClass}>College</label>
            <input
              type="text"
              className={inputClass}
              value={filters.college}
              onChange={(e) =>
                setFilters({ ...filters, college: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Branch</label>
            <input
              type="text"
              className={inputClass}
              value={filters.branch}
              onChange={(e) =>
                setFilters({ ...filters, branch: e.target.value })
              }
            />
          </div>

          <div>
            <label className={labelClass}>Languages</label>
            <div className={`grid grid-cols-2 gap-x-4 ${textColor}`}>
              {[
                "C",
                "C++",
                "Python",
                "Java",
                "Kotlin",
                "JavaScript",
                "Golang",
              ].map((lang) => (
                <label key={lang} className={`text-sm ${textColor}`}>
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(lang)}
                    onChange={() =>
                      setFilters((prev) => ({
                        ...prev,
                        languages: prev.languages.includes(lang)
                          ? prev.languages.filter((l) => l !== lang)
                          : [...prev.languages, lang],
                      }))
                    }
                  />{" "}
                  {lang}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Roles</label>
            <div className={`grid grid-cols-2 gap-x-4 ${textColor}`}>
              {["Frontend", "Backend", "Web", "Mobile", "Full Stack"].map(
                (role) => (
                  <label key={role} className={`text-sm ${textColor}`}>
                    <input
                      type="checkbox"
                      checked={filters.roles.includes(role)}
                      onChange={() =>
                        setFilters((prev) => ({
                          ...prev,
                          roles: prev.roles.includes(role)
                            ? prev.roles.filter((r) => r !== role)
                            : [...prev.roles, role],
                        }))
                      }
                    />{" "}
                    {role}
                  </label>
                )
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>Tools (comma-separated)</label>
            <input
              type="text"
              className={inputClass}
              value={filters.tools}
              onChange={(e) =>
                setFilters({ ...filters, tools: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={handleSearchUser}
          className="mt-2 px-6 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
        >
          Apply Filters
        </button>

        <div className="max-h-[65vh] overflow-y-auto mt-4">
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
              .filter((u) => u.user && u.user._id !== user?._id)
              .map((u) => (
                <UserSearchCard
                  key={u.user._id}
                  user={u.user}
                  onClose={onClose}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;
