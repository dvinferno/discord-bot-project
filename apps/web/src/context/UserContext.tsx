import { createContext, useContext, useState, useEffect } from "react";

// Define a clear User type. You should customize this based on the actual Discord user structure.
// This interface represents the structure of a Discord user object.
interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name?: string; // Discord's new global display name
  email?: string; // Optional email, depending on OAuth scopes
}

// Define the shape of the UserContext value.
interface UserContextType {
  user: DiscordUser | null; // The current authenticated user, or null if not authenticated.
  setUser: React.Dispatch<React.SetStateAction<DiscordUser | null>>; // Function to update the user state.
}

// Create the UserContext with initial default values.
// These defaults are placeholders and will be overridden by the Provider's actual state.
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}, // A no-op function as a default placeholder.
});

// UserProvider component to wrap around parts of your application that need user context.
// It manages the user's authentication state and provides it to its children.
export const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  // Initialize user state from localStorage for persistence across sessions.
  // If a user is found in localStorage, parse it; otherwise, default to null.
  const [user, setUser] = useState<DiscordUser | null>(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        return JSON.parse(stored) as DiscordUser;
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem("user"); // Clear invalid data
        return null;
      }
    }
    return null;
  });

  // useEffect hook to perform authentication check on component mount.
  useEffect(() => {
    // Asynchronous function to validate the user's authentication status with the backend.
    const checkAuth = async () => {
      try {
        // Make a request to the backend's authentication validation endpoint.
        // 'credentials: "include"' ensures cookies (like session IDs) are sent.
        const response = await fetch(
          `${process.env.VITE_API_ENDPOINT}/api/auth/validate`,
          {
            credentials: "include",
          }
        );
        
        // Parse the JSON response from the backend.
        const data = await response.json();

        if (data.authenticated) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          setUser(null);
          localStorage.removeItem("user");
        }
      } catch (err) {
        // If there's an error during the fetch (e.g., network issue, server down),
        // assume the user is not authenticated and clear their state.
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    checkAuth();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    // Provide the current user state and the setUser function to all children components.
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to easily consume the UserContext in any functional component.
// Throws an error if used outside of a UserProvider, ensuring correct usage.
export const useUser = () => useContext(UserContext);
