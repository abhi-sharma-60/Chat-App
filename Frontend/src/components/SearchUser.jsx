import React, { useEffect, useState, useRef } from "react";
import { IoIosSearch } from "react-icons/io";
import Loading from "./Loading";
import UserSearchCard from "./UserSearchCard";
import toast from "react-hot-toast";
import axios from "axios";
import { IoCloseSharp } from "react-icons/io5";

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(""); // user search input

  const modalRef = useRef(null);

  const handleSearchUser = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`;

    try {
      setLoading(true);
      const response = await axios.post(URL, {
        search: search,
      });
      setLoading(false);
      setSearchUser(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchUser();
  }, [search]);

  // ⬇️ Detect outside click and close modal
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
    <div className="fixed top-0 left-0 bottom-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10">
      <div ref={modalRef} className="w-full max-w-lg mx-auto mt-10 text-black">
        {/* Input Search User */}
        <div className="bg-white rounded-lg h-14 overflow-hidden flex">
          <input
            type="text"
            placeholder="Search User By Name, Email..."
            className="w-full outline-none py-1 h-full px-5"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center cursor-pointer">
            <IoIosSearch size={25} />
          </div>
        </div>

        {/* Display search results */}
        <div className="bg-white rounded-lg mt-2 w-full p-4 h-[80vh] overflow-y-auto">
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-slate-700">No user found!</p>
          )}

          {loading && (
            <p className="w-full text-center text-slate-700 flex-col">
              <Loading />
            </p>
          )}

          {searchUser.length !== 0 &&
            !loading &&
            searchUser.map((user) => (
              <UserSearchCard key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>

      <div
        className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-white"
        onClick={onClose}
      >
        <button>
          <IoCloseSharp size={40} color="black" />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
