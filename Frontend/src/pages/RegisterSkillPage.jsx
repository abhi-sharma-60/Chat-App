import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";
import { useSelector } from "react-redux";

// Language and Role Options
const languageOptions = [
  { value: "c", label: "C" },
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "kotlin", label: "Kotlin" },
  { value: "javascript", label: "JavaScript" },
  { value: "go", label: "Go Lang" },
  { value: "ruby", label: "Ruby" },
  { value: "r", label: "R" },
];

const roleOptions = [
  { value: "full stack", label: "Full Stack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
];

const RegisterSkillPage = () => {

    //const user = useSelector((state) => state?.user);

  const [data, setData] = useState({
    languages: [],
    roles: [],
    description: "",
    github: "",
   // user: user?._id,
    tools: []
  });

  const navigate = useNavigate();

  const handleLanguageChange = (selectedOptions) => {
    setData((prev) => ({
      ...prev,
      languages: selectedOptions || [],
    }));
  };

  const handleRoleChange = (selectedOptions) => {
    setData((prev) => ({
      ...prev,
      roles: selectedOptions || [],
    }));
  };

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/update-skills`;

    const skillPayload = {
      ...data,
      languages: data.languages.map((l) => l.value),
      roles: data.roles.map((r) => r.value),
      tools: typeof data.tools === "string"
        ? data.tools.split(',').map((tool) => tool.trim().toLowerCase()).filter(Boolean)
        : [],
    };
    

    try {
      const response = await axios.post(URL, skillPayload, {
        withCredentials: true,
      });
      toast.success(response?.data?.message || "Skills registered successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error submitting skills");
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 p-6">
  <div className="max-w-md mx-auto my-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-purple-200">
 <h3 className="text-3xl font-extrabold text-center text-purple-700 mb-8">
          Register Your Skills 🚀
        </h3>
        <form className="grid gap-5" onSubmit={handleSubmit}>
          {/* Languages */}
          <div className="flex flex-col gap-1">
            <label htmlFor="languages" className="font-semibold text-purple-600">
              Languages
            </label>
            <Select
              id="languages"
              isMulti
              options={languageOptions}
              value={data.languages}
              onChange={handleLanguageChange}
              className="text-black"
              classNamePrefix="select"
              placeholder="Select languages"
            />
          </div>

          {/* Roles */}
          <div className="flex flex-col gap-1">
            <label htmlFor="roles" className="font-semibold text-purple-600">
              Roles
            </label>
            <Select
              id="roles"
              isMulti
              options={roleOptions}
              value={data.roles}
              onChange={handleRoleChange}
              className="text-black"
              classNamePrefix="select"
              placeholder="Select roles"
            />
          </div>


          {/* Tools */}
<div className="flex flex-col gap-1">
  <label htmlFor="tools" className="font-semibold text-purple-600">
    Tools & Tech Stack
  </label>
  <input
    type="text"
    id="tools"
    name="tools"
    placeholder="e.g., React, Node.js, MongoDB"
    className="bg-purple-50 text-black px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-300"
    value={data.tools}
    onChange={handleOnchange}
  />
</div>


          {/* GitHub */}
          <div className="flex flex-col gap-1">
            <label htmlFor="github" className="font-semibold text-purple-600">
              GitHub Profile URL
            </label>
            <input
              type="url"
              id="github"
              name="github"
              placeholder="https://github.com/username"
              className="bg-purple-50 text-black px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-300"
              value={data.github}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-semibold text-purple-600">
              Short Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe your experience or interests..."
              className="bg-purple-50 text-black px-4 py-3 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-300"
              value={data.description}
              onChange={handleOnchange}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-lg py-3 transition"
          >
            Submit Skills
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterSkillPage;
