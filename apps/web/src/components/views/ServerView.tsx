import { useEffect, useState } from "react";
import Navbar from "./../Navbar";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import { useGuild, type Guild } from "../../context/GuildContext.tsx";
import { useUser } from "../../context/UserContext.tsx";

/**
 * Renders a card for a single Discord server.
 */
const ServerCard: React.FC<{ server: Guild }> = ({ server }) => {
  return (
    <button className="cursor-pointer lg:w-64 lg:h-64 md:w-48 md:h-48 w-48 h-48 bg-gray-700/20 p-8 pl-16 pr-16 rounded-xl shadow-lg space-y-4 group transition-all duration-300 hover:bg-gray-800 hover:shadow-indigo-500/20 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
      <div className="flex flex-col items-center space-y-2">
        <img
          src={server.icon ?? undefined}
          alt={`${server.name} icon`}
          className="aspect-square rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <h3 className="text-sm font-semibold text-white mt-2 truncate max-w-[10rem] text-center">
          {server.name}
        </h3>
        <div className="flex justify-center gap-3 text-xs text-gray-400 mt-1">
          {server.presenceCount != null && (
            <span className="text-green-400">
              ● {server.presenceCount.toLocaleString()} Online
            </span>
          )}
          {server.memberCount != null && (
            <span className="text-gray-300">
              👥 {server.memberCount.toLocaleString()} Members
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

/**
 * Renders the view for displaying a user's Discord servers.
 */
const ServerView = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGuild } = useGuild();
  const { user } = useUser();

  useEffect(() => {
    // Redirect to Discord authentication if user is not logged in
    if (!user) {
      window.location.href = "http://localhost:3001/api/auth/discord";
      return;
    }

    fetch("http://localhost:3001/api/user/mutual-guilds", {
      credentials: "include", // send cookies
    }) // Fetch mutual guilds (servers the bot and user share)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGuilds(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch guilds", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="font-sans">
      <Navbar /> {/* Navigation bar */}
      <main className="min-h-screen flex flex-col items-center px-6 pt-40 text-white">
        <h1 className="text-4xl font-bold mb-4">My Servers</h1> {/* Page title */}

        {/* Loading state */}
        {loading && (
          <div className="p-16 m-16">
            <Spinner size="lg" />
          </div>
        )}

        {/* No servers found state */}
        {!loading && guilds.length === 0 && (
          <div className="text-center mt-6">
            <p className="text-2xl text-gray-400 mb-4">
              No servers found that you can manage.
            </p>
            <button
              // Opens the bot's Discord invite link in a new tab
              onClick={() => {
                window.open("https://discord.com/oauth2/authorize?client_id=1337861308166438932", "_blank");
              }}
              className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 hover:scale-105 transform transition"
            >
              {/* Discord icon and text for the button */}
              <span className="flex items-center justify-center gap-2">
                <FaDiscord className="w-5 h-5" />
                Add to Discord
              </span>
            </button>
          </div>
        )}

        {/* Servers found state */}
        {!loading && guilds.length > 0 && (
          <div className="text-gray-200">
            <div className="w-full max-w-4xl text-center">
              <p className="text-gray-400 mb-12">
                Select a server to continue to the dashboard.
              </p>
              {/* Grid of server cards */}
              <div className="flex gap-8 content-center">
                {guilds.map((guild) => (
                  <>
                    <Link
                      className="flex-auto"
                      key={guild.id}
                      to={`/dashboard/${guild.id}`}
                      onClick={() => {
                        setGuild(guild);
                      }}
                    >
                      <ServerCard server={guild} />
                    </Link>
                  </>
                ))}
              </div>
              {/* Button to add the bot to Discord */}
              <button
                // Opens the bot's Discord invite link in a new tab
                onClick={() => {
                  window.open(
                    "https://discord.com/oauth2/authorize?client_id=1337861308166438932",
                    "_blank"
                  );
                }}
                className="cursor-pointer mt-10 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transform transition-transform duration-300 hover:scale-105"
              >
                {/* Discord icon and text for the button */}
                <span className="flex items-center justify-center gap-3">
                  <FaDiscord className="w-7 h-7" />
                  Add to Discord
                </span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServerView;
