// views/modules/Dashboard.tsx
import { MdSpaceDashboard } from "react-icons/md";
import type { viewProps } from "../../../utils/types";

export const moduleInfo = {
  id: "dashboard",
  name: "Dashboard",
  icon: MdSpaceDashboard,
};

const DashboardView: React.FC<viewProps> = ({ currentGuild }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4  text-white">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-gray-400 text-lg">
        Welcome to the dashboard for {currentGuild?.name || "your guild"}!
      </p>
    </div>
  );
};

export default DashboardView;
