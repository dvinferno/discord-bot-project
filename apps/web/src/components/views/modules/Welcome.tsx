// views/modules/Welcome.tsx
import { BsFillDoorOpenFill } from "react-icons/bs";
import type { viewProps } from "../../../utils/types";

export const moduleInfo = {
  id: "welcome",
  name: "Welcome",
  icon: BsFillDoorOpenFill,
};

const WelcomeView: React.FC<viewProps> = ({ currentGuild }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4  text-white">
      <h1 className="text-4xl font-bold">Welcome</h1>
      <p className="text-gray-400 text-lg">
        Welcome to the dashboard for {currentGuild?.name || "your guild"}!
      </p>
    </div>
  );
};

export default WelcomeView;
