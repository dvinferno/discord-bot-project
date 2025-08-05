import Logo from "./../Logo";
import Navbar from "./../Navbar";
import FeatureCard from "./../buttons/FeatureCard";
import { BsDoorOpen } from "react-icons/bs";
import { FaRegEye, FaDiscord } from "react-icons/fa";
import { MdBarChart } from "react-icons/md";

/**
 * Renders the main landing page view for the application.
 * This component includes a navigation bar, a hero section with a call-to-action,
 * and a features section highlighting the bot's capabilities.
 */
const LandingPageView = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-block p-4 bg-indigo-600/30 mb-6 mt-20 rounded-2xl shadow-lg">
            <Logo className="h-36"></Logo>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Welcome to <span className="text-indigo-400">Untitled Bot</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            The all-in-one solution to manage, moderate, and supercharge your
            Discord servers with the power of AI.
          </p>
          <button
            onClick={() => {
              window.open(
                "https://discord.com/oauth2/authorize?client_id=1337861308166438932",
                "_blank"
              );
            }}
            className="cursor-pointer mt-10 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transform transition-transform duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center gap-3">
              <FaDiscord className="w-7 h-7" />
              Add to Discord
            </span>
          </button>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto mt-20 w-full">
          <h2 className="text-3xl font-bold text-center text-white mb-10">
            Features at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BsDoorOpen className="w-6 h-6 text-indigo-400" />}
              title="Welcome Messages"
              description="Craft the perfect greeting for new members, with AI-powered suggestions."
            />
            <FeatureCard
              icon={<FaRegEye className="w-6 h-6 text-indigo-400" />}
              title="Moderation"
              description="Keep your community safe with powerful word filters and activity logging."
            />
            <FeatureCard
              icon={<MdBarChart className="w-6 h-6 text-indigo-400" />}
              title="Server Analytics"
              description="Visualize your server's growth and engagement with insightful charts."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageView;
