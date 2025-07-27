import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGuild, type Guild } from "../../context/GuildContext";
import DashboardHeader from "../DashboardHeader";
import Spinner from "../Spinner";

const DashboardView = () => {
  const { id } = useParams();
  const { guild, setGuild } = useGuild();
  const [loading, setLoading] = useState(true);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

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
        }
      } catch (err) {
        console.error("Failed to load guild", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuilds();
  }, [id]);

  if (!guild) {
    return (
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
    );
  }

  return (
    <div>
      <DashboardHeader
        currentGuild={guild}
        guilds={guilds}
        onSelectGuild={function (guild: Guild): void {
          navigate(`/dashboard/${guild.id}`);
          setGuild(guild);
        }}
      />
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default DashboardView;
