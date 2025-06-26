import React from "react";

const ProfilePictureModal = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-20">
           {" "}
      <div className="relative">
               {" "}
        <img
          src={imageUrl}
          alt="Profile"
          className="max-w-sm w-full rounded-lg"
        />
               {" "}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 bg-white p-1 rounded-full"
        >
                    ✕        {" "}
        </button>
             {" "}
      </div>
         {" "}
    </div>
  );
};

export default ProfilePictureModal;
