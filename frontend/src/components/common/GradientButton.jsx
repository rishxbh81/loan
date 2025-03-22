import React from "react";

const GradientButton = ({ label, onClick }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className="relative inline-block p-px font-semibold leading-6 text-white  shadow-xl cursor-pointer rounded-xl transition-transform duration-300 ease-in-out "
      >
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

        <span
          className="relative z-10 block px-6 py-3 rounded-xl"
          style={{ backgroundColor: "#100f1f" }}
        >
          <div className="relative z-10 flex items-center space-x-2">
            <span className="transition-all duration-500 group-hover:translate-x-1 text-white">
              {label}
            </span>

            <svg
              className="w-6 h-6 transition-transform duration-500 group-hover:translate-x-1  text-white"
              data-slot="icon"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
        </span>
      </button>
    </div>
  );
};

export default GradientButton;
