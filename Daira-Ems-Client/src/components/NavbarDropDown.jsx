import { useState } from 'react';

// eslint-disable-next-line react/prop-types
const NavItemWithDropdown = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <li
      className="relative px-3 py-2 pt-4 text-white transition duration-150 ease-in-out transform hover:scale-105 hover:text-white hover:shadow-lg rounded-lg cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <a href="#" className="flex items-center">
        {title}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 ml-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.293 7.707a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </a>
      {isOpen && (
        <div className="absolute z-10 left-0 mt-2 bg-zinc-800/90 shadow-lg ring-1 ring-zinc-900/5 w-48 rounded-lg">
          {children}
        </div>
      )}
      <style>{`
        li:hover div {
          background-color: #f4543;
        }

        li:hover ul {
          border-radius: 0.5rem; /* Add the desired border radius */
        }
      `}</style>
    </li>
  );
};

export default NavItemWithDropdown;
