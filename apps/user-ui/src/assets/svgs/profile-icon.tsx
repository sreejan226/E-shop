// components/icons/profile-icon.tsx
import React from "react";

const ProfileIcon = ({
  size = 24,
  color = "#000",
}: {
  size?: number;
  color?: string;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block" }} // ensures no inline whitespace
    >
      <path d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Z" />
      <path d="M4 22c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  );
};

export default ProfileIcon;
