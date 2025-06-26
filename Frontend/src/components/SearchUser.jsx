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

  const labelClass = `block mb-2 font-bold text-sm ${
    theme === "dark" ? "text-white" : "text-gray-700"
  }`;
  const inputClass = `w-full p-3 rounded-xl border transition-all duration-300 input-focus ${
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-600 focus:border-purple-500"
      : "bg-white text-gray-900 border-gray-300 focus:border-purple-500"
  }`;
  const textColor = theme === "dark" ? "text-white" : "text-gray-800";

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto flex items-start justify-center px-4 py-8 ${
        theme === "dark"
          ? "bg-black/70 backdrop-blur-sm"
          : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div
        ref={modalRef}
        className={`w-full max-w-4xl rounded-3xl shadow-2xl border p-8 relative backdrop-blur-xl ${
          theme === "dark"
            ? "bg-gray-900/95 border-gray-700 glass-effect-dark"
            : "bg-white/95 border-purple-200 glass-effect"
        }`}
      >
        <button
          className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 hover-lift ${
            theme === "dark" ? "hover:bg-gray-700" : "hover:bg-purple-100"
          }`}
          onClick={onClose}
        >
          <IoCloseSharp size={24} />
        </button>

        <div className="text-center mb-8">
          <h2 className={`text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent`}>
            Discover People
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Find developers and collaborators based on skills and interests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              className={inputClass}
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              placeholder="Search by name..."
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
              placeholder="Search by email..."
            />
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
              placeholder="Search by college..."
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
              placeholder="Search by branch..."
            />
          </div>

          <div>
            <label className={labelClass}>Minimum Rating</label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={filters.rating}
                onChange={(e) =>
                  setFilters({ ...filters, rating: parseFloat(e.target.value) })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span className="font-bold text-purple-600">
                  {filters.rating} ⭐
                </span>
                <span>5</span>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Tools (comma-separated)</label>
            <input
              type="text"
              className={inputClass}
              value={filters.tools}
              onChange={(e) =>
                setFilters({ ...filters, tools: e.target.value })
              }
              placeholder="React, Node.js, Python..."
            />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Programming Languages</label>
                <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl border ${
                  theme === "dark" ? "border-gray-600 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                }`}>
                  {[
                    "C",
                    "C++",
                    "Python",
                    "Java",
                    "Kotlin",
                    "JavaScript",
                    "Golang",
                  ].map((lang) => (
                    <label key={lang} className={`flex items-center gap-2 text-sm ${textColor} cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors`}>
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
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <span className="font-medium">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Developer Roles</label>
                <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl border ${
                  theme === "dark" ? "border-gray-600 bg-gray-800/50" : "border-gray-200 bg-gray-50"
                }`}>
                  {["Frontend", "Backend", "Web", "Mobile", "Full Stack"].map(
                    (role) => (
                      <label key={role} className={`flex items-center gap-2 text-sm ${textColor} cursor-pointer hover:bg-purple-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors`}>
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
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="font-medium">{role}</span>
                      </label>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleSearchUser}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover-lift"
          >
            🔍 Search Users
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto srollbar">
          {loading && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800">
                <Loading />
                <span className="font-medium">Searching for users...</span>
              </div>
            </div>
          )}

          {!loading && searchUser.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <p className={`text-lg font-medium ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}>
                No users found
              </p>
              <p className="text-gray-500 mt-2">
                Try adjusting your search filters
              </p>
            </div>
          )}

          {!loading && searchUser.length > 0 && (
            <div className="space-y-3">
              {searchUser
                .filter((u) => u.user && u.user._id !== user?._id)
                .map((u) => (
                  <UserSearchCard
                    key={u.user._id}
                    user={u.user}
                    onClose={onClose}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;