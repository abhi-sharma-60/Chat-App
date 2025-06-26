import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Select from "react-select";

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

const EditSkillPage = () => {
  const [data, setData] = useState({
    languages: [],
    roles: [],
    description: "",
    github: "",
    tools: []
  });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const URL = `${import.meta.env.VITE_BACKEND_URL}/api/get-skills`;

        const res = await axios.get(URL, {
          withCredentials: true,
        });

        const fetched = res.data.data[0];

        setData({
          languages: (fetched.languages || []).map((lang) =>
            languageOptions.find((opt) => opt.value === lang)
          ).filter(Boolean),

          roles: (fetched.roles || []).map((role) =>
            roleOptions.find((opt) => opt.value === role)
          ).filter(Boolean),

          description: fetched.description || "",
          github: fetched.github || "",
          tools: (fetched.tools || []).join(", "),
        });
      } catch (err) {
        console.error("Error fetching skills:", err);
        toast.error("Failed to fetch skills.");
      }
    };

    fetchSkills();
  }, []);

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
      toast.success(response?.data?.message || "Skills updated successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating skills");
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      borderColor: state.isFocused ? '#8b5cf6' : '#d1d5db',
      borderRadius: '12px',
      padding: '8px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(139, 92, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#8b5cf6',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '8px',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#5b21b6',
      fontWeight: '600',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#5b21b6',
      '&:hover': {
        backgroundColor: '#c7d2fe',
        color: '#4c1d95',
      },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto my-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-purple-200 glass-effect">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your Skills & Expertise 🚀
          </h3>
          <p className="text-gray-600 text-lg">
            Showcase your technical skills and experience
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Languages */}
          <div>
            <label htmlFor="languages" className="block font-bold text-purple-700 mb-2">
              Programming Languages
            </label>
            <Select
              id="languages"
              isMulti
              options={languageOptions}
              value={data.languages}
              onChange={handleLanguageChange}
              styles={customSelectStyles}
              placeholder="Select programming languages..."
              className="text-black"
            />
          </div>

          {/* Roles */}
          <div>
            <label htmlFor="roles" className="block font-bold text-purple-700 mb-2">
              Developer Roles
            </label>
            <Select
              id="roles"
              isMulti
              options={roleOptions}
              value={data.roles}
              onChange={handleRoleChange}
              styles={customSelectStyles}
              placeholder="Select your roles..."
              className="text-black"
            />
          </div>

          {/* Tools */}
          <div>
            <label htmlFor="tools" className="block font-bold text-purple-700 mb-2">
              Tools & Technologies
            </label>
            <input
              type="text"
              id="tools"
              name="tools"
              placeholder="React, Node.js, MongoDB, Docker, AWS..."
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.tools}
              onChange={handleOnchange}
            />
            <p className="text-sm text-gray-500 mt-1">Separate multiple tools with commas</p>
          </div>

          {/* GitHub */}
          <div>
            <label htmlFor="github" className="block font-bold text-purple-700 mb-2">
              GitHub Profile URL
            </label>
            <input
              type="url"
              id="github"
              name="github"
              placeholder="https://github.com/yourusername"
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus"
              value={data.github}
              onChange={handleOnchange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block font-bold text-purple-700 mb-2">
              About You (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Tell others about your experience, interests, or what you're working on..."
              className="w-full bg-purple-50 text-black px-4 py-4 rounded-xl border border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 input-focus resize-none"
              value={data.description}
              onChange={handleOnchange}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-lg font-bold rounded-xl py-4 transition-all duration-300 shadow-lg hover-lift btn-primary"
          >
            Save Skills
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditSkillPage;