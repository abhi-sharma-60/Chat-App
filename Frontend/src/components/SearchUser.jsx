import React, { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name"); // Add search type state

  const user = useSelector((state) => state.user);
  const modalRef = useRef(null);

  const handleSearchUser = async () => {
    if (!search.trim()) {
      setSearchUser([]);
      return;
    }
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;
    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
        searchType: searchType
      });
      setSearchUser(response.data.data || []);
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-black/50 p-2 z-10">
      <div ref={modalRef} className="w-full max-w-lg mx-auto mt-10 text-black">
        <div className="bg-white rounded-lg p-4 shadow-lg">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full outline-none py-2 px-4 border rounded-lg focus:border-primary"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:border-primary"
            >
              <option value="name">Name</option>
              <option value="college">College</option>
              <option value="skills">Skills</option>
              <option value="branch">Branch</option>
            </select>
          </div>

          <div className="max-h-[70vh] overflow-y-auto rounded-lg">
            {searchUser.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-4">No users found</p>
            )}
            {loading && (
              <div className="text-center py-4">
                <Loading />
              </div>
            )}

            {searchUser.length > 0 &&
              !loading &&
              searchUser
                .filter((u) => u._id !== user?._id)
                .map((user) => (
                  <UserSearchCard key={user._id} user={user} onClose={onClose} />
                ))}
          </div>
        </div>

        <button
          className="absolute top-4 right-4 p-2 hover:bg-gray-200 rounded-full transition-colors"
          onClick={onClose}
        >
          <IoCloseSharp size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;