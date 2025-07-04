import React from "react";

const CheckIcon = ({size = 6}) => {
  return (
    <svg
      className={`w-${size} h-${size}`}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 11.917L9.724 16.5 19 7.5" />
    </svg>
  );
};

export default CheckIcon;
