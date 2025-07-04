import { useState } from "react";
import { useUser } from "../context/UserContext";

import LinkButton from "./buttons/LinkButton";
import ProfileButton from "./buttons/ProfileButton";

import { FaBars, FaTimes } from "react-icons/fa";
import { DocIcon } from "./../assets/icons/DocIcon";
import { DashIcon } from "./../assets/icons/DashIcon";

function Logo() {
  return (
    <a href="/" className="flex items-center gap-2">
      <img src="/src/assets/icon.png" className="h-12" alt="Bot Logo" />
      <p className="text-xl font-bold text-white">Untitled Bot</p>
    </a>
  );
}

type NavButtonProps = {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>> | React.ElementType;
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
  return (
    <button
      onClick={onClick}
      className={`flex items-center cursor-pointer gap-2 p-2 hover:bg-white/10 rounded-sm transition ${className}`}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {label && <span>{label}</span>}
    </button>
  );
}

const handleLogout = async () => {
  try {
    window.location.href = "http://localhost:3001/logout"; // Redirect the user
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

function ProfileDropdown() {
  return (
    <div className="py-2">
      <a
        href="/servers"
        className="block px-4 py-2 text-white hover:bg-gray-700/80"
      >
        My Servers
      </a>
      <hr className="my-2 w-4/5 mx-auto border border-b-0 border-gray-600" />
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700/80"
      >
        Log Out
      </button>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  // Returns avatar URL or fallback based on Discord discriminator
  const getDiscordAvatar = (user: {
    avatar: string | null;
    discriminator: string;
    id: string;
  }) => {
    if (!user.avatar) {
      const defaultAvatarIndex = parseInt(user.discriminator) % 5;
      return `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=512`;
  };

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed flex items-center justify-between h-16 px-2 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 z-10 shadow-md">
        <Logo />
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 items-center">
          <NavButton className="text-sm" icon={DashIcon} label="Dashboard" />
          <NavButton className="text-sm" icon={DocIcon} label="Documentation" />

          {user ? (
            <ProfileButton
              label={user.global_name ?? user.username}
              avatarUrl={getDiscordAvatar(user)}
              dropdownContent={<ProfileDropdown />}
            />
          ) : (
            <LinkButton
              text="Login"
              redirectUri="http://localhost:3001/auth/discord"
              className="bg-indigo-600 hover:bg-indigo-700/80"
            />
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <NavButton
          className="md:hidden text-white"
          onClick={toggleNavbar}
          icon={isOpen ? FaTimes : FaBars}
        />
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full backdrop-blur-sm transition-all duration-150 ease-in-out transform bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 z-0 ${
          isOpen
            ? "max-h-60 opacity-100 scale-y-100"
            : "max-h-0 opacity-0 scale-y-0"
        } origin-top`}
      >
        <div className="flex flex-col gap-4 p-4">
          {user ? (
            <ProfileButton
              label={user.global_name ?? user.username}
              avatarUrl={getDiscordAvatar(user)}
              dropdownContent={<ProfileDropdown />}
            />
          ) : (
            <LinkButton
              text="Login"
              redirectUri="http://localhost:3001/auth/discord"
              className="bg-indigo-600 hover:bg-indigo-700/80"
            />
          )}
          <NavButton icon={DashIcon} label="Dashboard" />
          <NavButton icon={DocIcon} label="Documentation" />
        </div>
      </div>
    </>
  );
}
