import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import { GuildProvider } from "./context/GuildContext.tsx";
import LandingPageView from "./components/views/LandingPageView";
import ServerView from "./components/views/ServerView.tsx";
import Dashboard from "./components/views/DashboardView.tsx";

const App: React.FC = () => {
  return (
    // Background gradient with white text and full height layout
    <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
      <BrowserRouter>
        <UserProvider>
          <GuildProvider>
            <Routes>
              <Route path="/" element={<LandingPageView />} />
              <Route path="/servers" element={<ServerView />} />
              <Route path="/dashboard/:id" element={<Dashboard />} />
            </Routes>
          </GuildProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
