import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuild, type Guild } from "../../context/GuildContext";
import DashboardHeader from "../DashboardHeader";
import DashboardSidebar from "../DashboardSidebar";
import Spinner from "../Spinner";
import { View } from "../../utils/types";
import { viewRegistry } from "./modules/registry";

const DashboardView = () => {
  const { id } = useParams();
  const { guild, setGuild } = useGuild();
  const [loading, setLoading] = useState(true);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [activeView, setActiveView] = useState<View>(View.Dashboard); // This state is not currently used to render the view.
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/servers", { replace: true }); // redirect if no guild id
    }

    const fetchGuilds = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "http://localhost:3001/api/user/mutual-guilds",
          {
            credentials: "include",
          }
        );

        const data: Guild[] = await res.json();
        setGuilds(data);

        const found = data.find((g) => g.id === id);
        if (found) {
          setGuild(found);
        } else {
          navigate("/servers", { replace: true });
        }
      } catch (err) {
        console.error("Failed to load guild", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [id]);

  const renderView = () => {
    if (!guild) return null;

    const Component = viewRegistry[activeView] as React.ComponentType<{
      currentGuild: Guild;
    }>;
    const props = { currentGuild: guild };

    return <Component {...props} />;
  };

  return (
    <div className="flex h-screen text-gray-200 font-sans">
      <DashboardSidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <header className=" fixed h-16 w-full bg-gradient-to-r from-gray-800 via-gray-900 to-gray-950 z-10 shadow-md">
            <div className="flex items-center justify-between gap-x-px h-16">
              <div className="relative">
                <div className="flex items-center gap-3 p-2 pr-3 pl-3 rounded-sm transition animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-700" />
                  <div className="ml-3 text-left space-y-2">
                    <div className="w-24 h-4 bg-gray-700 rounded" />
                    <div className="w-40 h-3 bg-gray-700 rounded" />
                  </div>
                  <div className="w-5 h-5 ml-3 bg-gray-700 rounded" />
                </div>
              </div>
              <div className="flex items-center animate-pulse mr-68">
                <div className="w-32 h-10 bg-gray-700 rounded-lg" />
              </div>
            </div>
          </header>
        ) : (
          <DashboardHeader
            currentGuild={guild!}
            guilds={guilds}
            onSelectGuild={function (guild: Guild): void {
              navigate(`/dashboard/${guild.id}`);
              setGuild(guild);
              setActiveView(View.Dashboard);
            }}
          />
        )}
        {loading ? ( // If still loading, show spinner
          <div className="flex items-center justify-center h-screen">
            <Spinner size="lg" />
          </div>
        ) : guild ? ( // If not loading and guild is found, render the view
          renderView()
        ) : (
          <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <p className="text-gray-400 text-5xl p-6 text-center">
              404: Guild not found or not accessible.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              ← Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
