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
            {/* Define application routes */}
            <Routes>
              {/* Route for the landing page */}
              <Route path="/" element={<LandingPageView />} />
              {/* Route for displaying servers */}
              <Route path="/servers" element={<ServerView />} />
              {/* Routes for the dashboard, with an optional ID parameter */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/:id" element={<Dashboard />} /> {/* This route should ideally come after the non-parameterized one if it's meant to be more specific */}
            </Routes>
          </GuildProvider>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
