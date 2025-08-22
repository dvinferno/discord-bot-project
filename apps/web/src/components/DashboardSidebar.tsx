import { Link } from "react-router-dom";
import Logo from "./Logo";
import { View, type ModuleInfo } from "../utils/types";
import { useEffect, useState } from "react";
import { getModules } from "../utils/getModules";

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavItem: React.FC<{
  view: View;
  activeView: View;
  setActiveView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <button
      onClick={() => {
        setActiveView(view);
      }}
      className={`cursor-pointer flex items-center w-full px-4 py-3 text-sm font-medium text-left rounded-lg transition-colors duration-200 ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const DashboardSidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
}) => {
  const [modules, setModules] = useState<ModuleInfo[]>([]);

  useEffect(() => {
    getModules().then(setModules);
  }, []);

  return (
    <div className="w-64 bg-gray-900/70 p-4 flex flex-col shadow-md">
      {/* Logo and Bot Name */}
      <div className="flex items-center mb-3">
        <Link className="flex items-center" to="/">
          <div className="inline-block p-1 bg-indigo-600/70 rounded-md shadow-lg">
            <Logo label="" className="h-10" />
          </div>
          <span className="ml-4 text-xl font-semibold text-white">
            Untitled Bot {/* Consider making this dynamic or a constant */}
          </span>
        </Link>
      </div>
      {/* Navigation Links */}
      <div className="border-t border-gray-700/80 mb-4"></div>
      <nav className="flex-1 space-y-2">
        {modules.map((mod) => {
          const Icon = mod.icon;
          return (
            <NavItem
              key={mod.id}
              view={mod.id as View}
              activeView={activeView}
              setActiveView={setActiveView} // Pass the setActiveView function
              // @ts-ignore
              icon={<Icon className="w-5 h-5" />}
              label={mod.name}
            />
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardSidebar;
