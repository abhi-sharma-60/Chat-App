import React from "react";

const UserDetailModal = ({ user, onClose, theme }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
           {" "}
      <div
        className={`rounded-lg p-5 max-w-sm w-full ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
                <h2 className="text-xl font-semibold mb-4">User Details</h2>   
           {" "}
        <p>
          <strong>Name:</strong> {user.name}
        </p>
               {" "}
        <p>
          <strong>Email:</strong> {user.email}
        </p>
               {" "}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded bg-primary text-white"
        >
                    Close        {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default UserDetailModal;
