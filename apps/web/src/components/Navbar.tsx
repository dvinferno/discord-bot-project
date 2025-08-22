import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Contexts
import { useUser } from "../context/UserContext"; // User authentication context
import { useGuild } from "../context/GuildContext"; // Guild (server) context

// Components
import LinkButton from "./buttons/LinkButton";
import ProfileButton from "./buttons/ProfileButton";
import Logo from "./Logo";

// Icons
import { FaBars, FaTimes } from "react-icons/fa";
import { DocIcon } from "./../assets/icons/DocIcon";
import { DashIcon } from "./../assets/icons/DashIcon";

// Utilities
import getDiscordAvatar from "../utils/getDiscordAvatar";

type NavButtonProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ElementType; // Icon component
  onClick?: () => void;
  className?: string;
  label?: string;
};

function NavButton({
  icon: Icon,
  onClick,
  className = "",
  label,
}: NavButtonProps) {
  // Renders a clickable navigation button with an optional icon and label.
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-2 p-2 text-white hover:bg-white/10 rounded-sm transition ${className}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label && <span>{label}</span>}
    </button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile navbar open/close
  const { guild, setGuild } = useGuild(); // Access current guild from context
  const { user } = useUser(); // Access user data from context
  const navigate = useNavigate(); // Hook for programmatic navigation

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed flex items-center justify-between h-16 px-2 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 z-50 shadow-md">
        {/* Logo - links to home page */}
        <Link to="/">
          <Logo label="Untitled Bot" className="h-10 " />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 items-center">
          {/* Dashboard Button */}
          <NavButton
            className="text-sm"
            icon={DashIcon}
            label="Dashboard"
            onClick={() => {
              if (guild && user) {
                navigate(`/dashboard/${guild.id}`);
              } else {
                setGuild(null); // Clear guild context
                navigate("/servers");
              }
            }}
          />
          {/* Documentation Button */}
          <NavButton className="text-sm" icon={DocIcon} label="Documentation" />

          {/* User Profile or Login Button */}
          {user ? (
            <ProfileButton
              label={user.global_name ?? user.username}
              avatarUrl={getDiscordAvatar(user)}
            />
          ) : (
            <LinkButton
              text="Login"
              redirectUri="http://localhost:3001/api/auth/discord"
              className="bg-indigo-600 hover:bg-indigo-700/80"
            />
          )}
        </nav>

        {/* Mobile Menu Toggle Button (Hamburger/Close icon) */}
        <NavButton
          className="md:hidden text-white"
          onClick={toggleNavbar}
          icon={isOpen ? FaTimes : FaBars}
        />
      </header>

      {/* Mobile Menu Dropdown (hidden on desktop) */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full backdrop-blur-sm transition-all duration-150 ease-in-out transform bg-gradient-to-b from-gray-700/60 via-gray-800/60 to-gray-900/10 z-40 ${
          isOpen
            ? "max-h-60 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-0"
        } origin-top`}
      >
        <div className="flex flex-col gap-4 p-4">
          {/* User Profile or Login Button for mobile */}
          {user ? (
            <ProfileButton
              label={user.global_name ?? user.username}
              avatarUrl={getDiscordAvatar(user)}
            />
          ) : (
            <LinkButton
              text="Login"
              redirectUri="http://localhost:3001/api/auth/discord"
              className="bg-indigo-600 hover:bg-indigo-700/80"
            />
          )}
          {/* Dashboard Button for mobile */}
          <NavButton
            className="text-sm"
            icon={DashIcon}
            label="Dashboard"
            onClick={() => {
              if (guild && user) {
                navigate(`/dashboard/${guild.id}`);
              } else {
                setGuild(null); // Clear guild context
                navigate("/servers");
              }
            }}
          />
          {/* Documentation Button for mobile */}
          <NavButton icon={DocIcon} label="Documentation" />
        </div>
      </div>
    </>
  );
}
