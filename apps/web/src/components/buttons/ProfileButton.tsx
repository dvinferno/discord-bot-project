// React hooks and components
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import handleLogout from "../../utils/handleLogout";
import { useUser } from "../../context/UserContext";
import { useGuild } from "../../context/GuildContext";

type Props = {
  className?: string; // Optional CSS class names for custom styling
  label?: string; // The text label to display (e.g., username)
  avatarUrl?: string; // The URL for the user's avatar image
};

/**
 * Renders the dropdown menu content for the ProfileButton.
 * It includes links to "My Servers" and a "Log Out" button.
 */
function ProfileDropdown() {
  const { setUser } = useUser(); // Access setUser function from UserContext
  const { setGuild } = useGuild(); // Access setGuild function from GuildContext

  return (
    <div className="py-2">
      {/* Link to the "My Servers" page */}
      <Link
        to="/servers"
        className="block px-4 py-2 text-white hover:bg-gray-700/80"
      >
        My Servers
      </Link>
      {/* Horizontal rule for separation */}
      <hr className="my-2 w-4/5 mx-auto border border-b-0 border-gray-600" />
      {/* Log Out button */}
      <button
        onClick={() => {
          // Clear user and guild context on logout
          setUser(null);
          setGuild(null);
          // Call the utility function to handle the actual logout process (e.g., clear cookies)
          handleLogout(process.env.VITE_API_ENDPOINT!);
        }}
        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700/80"
      >
        Log Out
      </button>
    </div>
  );
}

/**
 * A reusable button component that displays a user's avatar and label,
 * and toggles a dropdown menu on click.
 *
 * @param {Object} props - The component's properties.
 * @param {string} [props.className=""] - Optional CSS classes to apply to the button.
 * @param {string} [props.label] - The text label to display next to the avatar.
 * @param {string} [props.avatarUrl] - The URL for the user's avatar image.
 */
export default function ProfileButton({
  className = "",
  label,
  avatarUrl,
}: Props) {
  // State to manage the dropdown's visibility
  const [isOpen, setIsOpen] = useState(false);
  // Refs to the button and dropdown elements for detecting clicks outside
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Function to toggle the dropdown's visibility
  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Effect to handle clicks outside the button and dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the button and dropdown
      const clickedOutsideButton =
        buttonRef.current && !buttonRef.current.contains(event.target as Node);
      const clickedOutsideDropdown =
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node);

      if (clickedOutsideButton && clickedOutsideDropdown) {
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
    <div className="relative" aria-haspopup="true" aria-expanded={isOpen}>
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
        // Apply dynamic classes for animation and visibility
        className={`absolute right-0 mt-2 w-full rounded-sm shadow-lg z-10 bg-gray-800 transform origin-top transition-transform duration-100 ease-in-out ${
          isOpen
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        }`}
      >
        {/* Content of the dropdown */}
        {<ProfileDropdown />}
      </div>
    </div>
  );
}
