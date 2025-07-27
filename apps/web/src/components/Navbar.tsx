import { useState } from "react";
import { useUser } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useGuild } from "../context/GuildContext";
import getDiscordAvatar from "../utils/getDiscordAvatar";

import LinkButton from "./buttons/LinkButton";
import ProfileButton from "./buttons/ProfileButton";
import Logo from "./Logo";

import { FaBars, FaTimes } from "react-icons/fa";
import { DocIcon } from "./../assets/icons/DocIcon";
import { DashIcon } from "./../assets/icons/DashIcon";

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

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { guild } = useGuild();
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleNavbar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Top Navbar */}
      <header className="fixed flex items-center justify-between h-16 px-2 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 z-10 shadow-md">
        <Link to="/">
          <Logo label="Untitled Bot" className="h-10" />
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 items-center">
          <NavButton
            className="text-sm"
            icon={DashIcon}
            label="Dashboard"
            onClick={() => {
              if (guild) {
                navigate(`/dashboard/${guild.id}`);
              } else {
                navigate("/servers");
              }
            }}
          />
          <NavButton className="text-sm" icon={DocIcon} label="Documentation" />

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

        {/* Mobile Menu Toggle */}
        <NavButton
          className="md:hidden text-white"
          onClick={toggleNavbar}
          icon={isOpen ? FaTimes : FaBars}
        />
      </header>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full backdrop-blur-sm transition-all duration-150 ease-in-out transform bg-gradient-to-b from-gray-700/60 via-gray-800/60 to-gray-900/10 z-0 ${
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
            />
          ) : (
            <LinkButton
              text="Login"
              redirectUri="http://localhost:3001/api/auth/discord"
              className="bg-indigo-600 hover:bg-indigo-700/80"
            />
          )}
          <NavButton
            className="text-sm"
            icon={DashIcon}
            label="Dashboard"
            onClick={() => {
              if (guild) {
                navigate(`/dashboard/${guild.id}`);
              } else {
                navigate("/servers");
              }
            }}
          />
          <NavButton icon={DocIcon} label="Documentation" />
        </div>
      </div>
    </>
  );
}
