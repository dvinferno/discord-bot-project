import React from "react";
import { UserProvider } from "./context/UserContext.tsx";
import LandingPageView from "./components/views/LandingPageView";

const App: React.FC = () => {
  return (
    // Background gradient with white text and full height layout
    <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
      <UserProvider>
        <LandingPageView />
      </UserProvider>
    </div>
  );
};

export default App;
