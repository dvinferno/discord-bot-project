import React from "react";
import { UserProvider } from "./context/UserContext.tsx";

// Components
//import Login from "./components/Login";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
  return (
    // Background gradient with white text and full height layout
    <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
      <UserProvider>
        {/* Top navigation bar */}
        <Navbar />

        {/* Main content container with padding */}
        <main className="p-4">{/* <Login /> */}</main>
      </UserProvider>
    </div>
  );
};

export default App;
