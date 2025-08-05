import type { Guild } from "../context/GuildContext";

export type ModuleInfo = {
    id: string;
    name: string;
    icon: React.FC;
    path: string;
};

// @ts-ignore
export enum View {
    Dashboard = 'dashboard',
    Welcome = 'welcome',
}

export interface viewProps {
    currentGuild?: Guild;
}