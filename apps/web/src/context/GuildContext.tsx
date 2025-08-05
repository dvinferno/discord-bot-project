import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Guild = {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
  presenceCount?: number;
};

type GuildContextType = {
  guild: Guild | null;
  setGuild: (guild: Guild | null) => void;
};

const GuildContext = createContext<GuildContextType | undefined>(undefined);

export function GuildProvider({ children }: { children: ReactNode }) {
  const [guild, setGuildState] = useState<Guild | null>(null);

  // Optional: persist guild across page reloads
  useEffect(() => {
    const stored = localStorage.getItem("selected_guild");
    if (stored) {
      try {
        setGuildState(JSON.parse(stored));
      } catch {
        localStorage.removeItem("selected_guild");
      }
    }
  }, []);

  const setGuild = (guild: Guild | null) => {
    setGuildState(guild);
    if (guild) {
      localStorage.setItem("selected_guild", JSON.stringify(guild));
    } else {
      localStorage.removeItem("selected_guild");
    }
  };

  return (
    <GuildContext.Provider value={{ guild, setGuild }}>
      {children}
    </GuildContext.Provider>
  );
}

export function useGuild(): GuildContextType {
  const context = useContext(GuildContext);
  if (!context) {
    throw new Error("useGuild must be used within a GuildProvider");
  }
  return context;
}
