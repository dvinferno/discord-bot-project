import { createContext, useContext, useState, useEffect } from "react";

// Define a clear User type. You should customize this based on the actual Discord user structure.
interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  email?: string;
}

// Context type
interface UserContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

// Create the UserContext with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}, // placeholder default function
});

// Provider component to wrap around your app
export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [user, setUser] = useState<DiscordUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/validate", {
          credentials: "include",
        });

        const data = await response.json();

        if (data.authenticated) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to consume the user context in other components
export const useUser = () => useContext(UserContext);
