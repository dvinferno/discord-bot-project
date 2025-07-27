import { useEffect, useState } from "react";
import Navbar from "./../Navbar";
import { FaDiscord } from "react-icons/fa";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
};

const ServerCard: React.FC<{ server: Guild }> = ({ server }) => {
  return (
    <button className="bg-gray-800/50 p-8 pl-16 pr-16 rounded-xl shadow-lg space-y-4 group transition-all duration-300 hover:bg-gray-800 hover:shadow-indigo-500/20 hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500">
      <div className="flex flex-col items-center space-y-2">
        <img
          src={server.icon ?? undefined}
          alt={`${server.name} icon`}
          className="w-24 h-24 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
        />

        <h3 className="text-xl font-bold text-white">{server.name}</h3>
        {/* <p className="text-sm text-gray-400">{server.memberCount.toLocaleString()} Members</p> */}
      </div>
    </button>
  );
};

const ServerView = () => {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/api/user/mutual-guilds", {
      credentials: "include", // send cookies
    })
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
      <Navbar />
      <main className="min-h-screen flex flex-col items-center px-6 pt-40 text-white">
        <h1 className="text-4xl font-bold mb-4">My Servers</h1>

        {loading && (
          <div className="p-16 m-16">
            <Spinner size="lg" />
          </div>
        )}

        {!loading && guilds.length === 0 && (
          <div className="text-center mt-6">
            <p className="text-2xl text-gray-400 mb-4">
              No servers found that you can manage.
            </p>
            <button
              onClick={() => {
                // Add your invite link logic here
              }}
              className="mt-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 hover:scale-105 transform transition"
            >
              <span className="flex items-center justify-center gap-2">
                <FaDiscord className="w-5 h-5" />
                Add to Discord
              </span>
            </button>
          </div>
        )}

        {!loading && guilds.length > 0 && (
          <div className="text-gray-200">
            <div className="w-full max-w-4xl text-center">
              <p className="text-gray-400 mb-12">
                Select a server to continue to the dashboard.
              </p>
              <div className="flex gap-8 content-center">
                {guilds.map((guild) => (
                  <>
                    <Link
                      className="flex-auto"
                      key={guild.id}
                      to={`/dashboard`}
                    >
                      <ServerCard server={guild} />
                    </Link>
                  </>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServerView;
