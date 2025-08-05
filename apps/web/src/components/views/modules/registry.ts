// views/registry.ts
import DashboardView from "./Dashboard";
import WelcomeView from "./Welcome";
import { View } from "../../../utils/types";

export const viewRegistry: {
    [key in View]?: React.FC<any>;
} = {
    [View.Dashboard]: DashboardView,
    [View.Welcome]: WelcomeView,
};