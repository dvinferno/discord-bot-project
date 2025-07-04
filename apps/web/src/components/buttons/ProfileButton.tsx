import { useState, useRef, useEffect } from "react";

type Props = {
  className?: string;
  label?: string;
  avatarUrl?: string;
  dropdownContent: React.ReactNode;
};

export default function ProfileButton({
  className = "",
  label,
  avatarUrl,
  dropdownContent,
}: Props) {
  // State to manage the dropdown's visibility
  const [isOpen, setIsOpen] = useState(false);
  // Refs to the button and dropdown elements for click outside detection
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to toggle the dropdown's visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Effect to handle clicks outside the button and dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the button and dropdown
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown
        setIsOpen(false);
      }
    };

    // Add event listener for mousedown events
    document.addEventListener("mousedown", handleClickOutside);
    // Clean up the event listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [buttonRef, dropdownRef]); // Re-run the effect if buttonRef or dropdownRef change

  return (
    // Relative wrapper for positioning the dropdown
    <div className="relative">
      {/* Button to trigger the dropdown */}
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={`flex items-center cursor-pointer w-full gap-3 p-2 pr-3 pl-3 bg-white/5 rounded-sm transition ${className}`}
      >
        {/* User avatar */}
        <img
          className="w-8 h-8 rounded-full"
          src={avatarUrl}
          alt="Rounded avatar"
        />
        {/* User label (username/global name) */}
        <div className="font-medium dark:text-white">
          {label && <span>{label}</span>}
        </div>
      </button>
      {/* Dropdown menu, conditionally rendered */}

      <div
        ref={dropdownRef}
        className={`absolute right-0 mt-2 w-full rounded-sm shadow-lg z-10 bg-gray-800 transform scale-y-0 origin-top transition-transform duration-100 ease-in-out ${
          isOpen ? "max-h-60 scale-y-100" : "max-h scale-y-0"
        }`}
      >
        {/* Content of the dropdown */}
        {dropdownContent}
      </div>
    </div>
  );
}
