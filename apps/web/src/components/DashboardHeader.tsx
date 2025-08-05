import { useEffect, useRef, useState } from "react";
import { useUser } from "../context/UserContext";
import { type Guild } from "../context/GuildContext";
import ProfileButton from "./buttons/ProfileButton";
import getDiscordAvatar from "../utils/getDiscordAvatar";

interface HeaderProps {
  currentGuild?: Guild;
  guilds: Guild[];
  onSelectGuild: (server: Guild) => void;
}

const fallbackGuild: Guild = {
  id: "0",
  name: "Unknown Server",
  icon: "",
  memberCount: 0,
  presenceCount: 0,
};

const DashboardHeader: React.FC<HeaderProps> = ({
  guilds,
  currentGuild = guilds[0] ?? fallbackGuild,
  onSelectGuild,
}) => {
  const { user } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (guild: Guild) => {
    if (!guild) return;
    if (guild.id !== currentGuild.id) {
      onSelectGuild(guild);
    }
    setIsDropdownOpen(false);
  };

  if (!currentGuild) {
    currentGuild = fallbackGuild;
  }

  return (
    <header className="fixed h-16 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 z-10 shadow-md">
      <div className="flex items-center justify-between gap-x-px h-16">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 p-2 pr-3 pl-3 rounded-sm transition cursor-pointer"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
            <img
              src={currentGuild.icon}
              alt={`${currentGuild.name} icon`}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="ml-3 text-left">
              <h2 className="text-lg font-semibold text-white truncate">
                {currentGuild?.name}
              </h2>
              <p className="text-xs text-gray-400 truncate">
                <span className="text-green-400">●</span>{" "}
                {currentGuild.presenceCount!.toLocaleString()} Online
                <span className="hidden sm:inline">
                  {" "}
                  / {currentGuild.memberCount!.toLocaleString()} Members
                </span>
              </p>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 ml-3 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Backdrop */}
          <div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-200 ease-out ${
              isDropdownOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsDropdownOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <div
            className={`transition-all duration-200 ease-out transform origin-top ${
              isDropdownOpen
                ? "scale-100 opacity-100"
                : "scale-95 opacity-0 pointer-events-none"
            } fixed top-20 left-4 right-4 z-50 w-auto rounded-xl bg-gray-800 border border-gray-700 py-1 shadow-2xl md:absolute md:top-auto md:left-0 md:right-auto md:mt-2 md:w-72 md:rounded-lg md:shadow-xl`}
          >
            <div className="px-4 py-2 border-b border-gray-700">
              <p className="text-sm font-semibold text-white">Switch Server</p>
            </div>
            <div className="max-h-[60vh] md:max-h-60 overflow-y-auto">
              {guilds.map((guild) => (
                <button
                  key={guild.id}
                  onClick={() => handleSelect(guild)}
                  className={`w-full text-left flex items-center px-4 py-3 text-sm transition-colors ${
                    guild.id === currentGuild.id
                      ? "bg-indigo-600 text-white"
                      : "text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <img
                    src={guild.icon!}
                    alt={guild.name}
                    className="w-8 h-8 rounded-lg mr-3"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{guild.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      <span className="text-green-400">●</span>{" "}
                      {currentGuild.presenceCount!.toLocaleString()} Online
                      <span className="hidden sm:inline">
                        {" "}
                        / {currentGuild.memberCount!.toLocaleString()} Members
                      </span>
                    </p>
                  </div>
                  {guild.id === currentGuild.id && (
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center mr-68">
          <ProfileButton
            label={user.global_name ?? user.username}
            avatarUrl={getDiscordAvatar(user)}
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
