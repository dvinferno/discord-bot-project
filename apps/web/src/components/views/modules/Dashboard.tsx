// views/modules/Dashboard.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { HiUsers } from "react-icons/hi2";
import { IoIosStats } from "react-icons/io";
import { FaCopy } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { BsFillDoorOpenFill } from "react-icons/bs";
import { IoMdRefresh } from "react-icons/io";

import { MdSpaceDashboard } from "react-icons/md";
import type { viewProps } from "../../../utils/types";
import React from "react";

export const moduleInfo = {
  id: "dashboard",
  name: "Dashboard",
  icon: MdSpaceDashboard,
};

function copy(text: string) {
  navigator.clipboard.writeText(text);
}

// --- Mock Data ---
const mockServer = {
  id: "123456789012345678",
  name: "Acme HQ",
  iconUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=acme",
  memberCount: 1423,
  onlineCount: 318,
  botCount: 7,
  owner: {
    name: "Dante V.",
    avatar: "https://api.dicebear.com/7.x/thumbs/svg?seed=dante",
  },
  createdAt: "2021-04-18",
  locale: "en-US",
  boostLevel: 2,
  boosts: 5,
  inviteUrl: "https://discord.gg/your-invite",
};

const analyticsCommands = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 23 },
  { name: "Thu", value: 110 },
  { name: "Fri", value: 33 },
  { name: "Sat", value: 90 },
  { name: "Sun", value: 130 },
];

const activityFeed = [
  {
    id: 1,
    ts: "12:01 PM",
    text: "Warned @spammer for link spam",
    type: "mod" as const,
  },
  {
    id: 2,
    ts: "11:58 AM",
    text: "New member joined: @PixelPanda",
    type: "join" as const,
  },
  {
    id: 3,
    ts: "11:40 AM",
    text: "Command used: /poll create",
    type: "cmd" as const,
  },
  {
    id: 4,
    ts: "10:12 AM",
    text: "Left server: @OldTimer42",
    type: "leave" as const,
  },
  {
    id: 5,
    ts: "Yesterday",
    text: "AutoMod timed out @RudeDude (toxicity)",
    type: "mod" as const,
  },
  {
    id: 6,
    ts: "Yesterday",
    text: "AutoMod timed out @RudeDude (toxicity)",
    type: "mod" as const,
  },
  {
    id: 7,
    ts: "Yesterday",
    text: "AutoMod timed out @RudeDude (toxicity)",
    type: "mod" as const,
  },
  {
    id: 8,
    ts: "Yesterday",
    text: "AutoMod timed out @RudeDude (toxicity)",
    type: "mod" as const,
  },
];

const moduleList = [
  {
    key: "welcome",
    label: "Welcome",
    icon: BsFillDoorOpenFill,
    group: "Essentials",
    description: "Greet new members",
  },
  {
    key: "logging",
    label: "Logging",
    icon: IoIosStats,
    group: "Essentials",
    description: "Track key events",
  },
  {
    key: "moderation",
    label: "Moderation",
    icon: IoIosStats,
    group: "Moderation",
    description: "Protect your server",
  },
  {
    key: "engagement",
    label: "Engagement",
    icon: IoIosStats,
    group: "Engagement",
    description: "Games & levels",
  },
  {
    key: "engagement2",
    label: "Engagement",
    icon: IoIosStats,
    group: "Engagement",
    description: "Games & levels",
  },
];

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: any;
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card className="h-full bg-gray-700 shadow-2xl border-gray-700">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-md p-2 shadow-sm border bg-gray-800 border-gray-700">
            <Icon className="h-5 w-5 text-gray-300" />
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-200">{label}</div>
            <div className="text-xl text-white font-semibold leading-tight">
              {value}
            </div>
            {hint && (
              <div className="text-xs text-muted-foreground">{hint}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ModuleTile({
  icon: Icon,
  title,
  description,
  defaultEnabled = true,
  onOpen,
}: {
  icon: any;
  title: string;
  description: string;
  defaultEnabled?: boolean;
  onOpen?: () => void;
}) {
  const [enabled, setEnabled] = React.useState(defaultEnabled);
  return (
    <div>
      <Card className="h-full bg-gray-700 shadow-2xl border-gray-700">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-md p-2 shadow-sm border bg-gray-800 border-gray-700">
                <Icon className="h-5 w-5 text-gray-300" />
              </div>
              <CardTitle className="text-base text-gray-200">{title}</CardTitle>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={setEnabled}
              aria-label={`Toggle ${title}`}
              className="
    data-[state=checked]:bg-indigo-600
    data-[state=unchecked]:bg-gray-500
    transition-colors 
  "
            />
          </div>
          <CardDescription className="pt-1">{description}</CardDescription>
        </CardHeader>
        <CardFooter className="pt-0">
          <div className="ml-auto">
            <Button
              className="bg-gray-800 shadow-2xl border-gray-700 text-white"
              variant="secondary"
              size="icon"
              onClick={onOpen}
            >
              <IoMdSettings className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

const DashboardView: React.FC<viewProps> = ({ currentGuild }) => {
  const [invite, setInvite] = React.useState(mockServer.inviteUrl);
  const [moduleState, setModuleState] = React.useState<Record<string, boolean>>(
    {
      welcome: true,
      logging: true,
      moderation: true,
      engagement: false,
    }
  );

  return (
    <div className="mt-16 overflow-auto">
      <TooltipProvider>
        <div className="space-y-6 p-4 sm:p-6">
          {/* Overview Grid */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
            <Card className="bg-gray-800 shadow-2xl border-gray-700 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Server Overview</CardTitle>
                <CardDescription>
                  At-a-glance details & quick actions
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                  <Stat
                    icon={HiUsers}
                    label="Members"
                    value={
                      <div className="flex items-center gap-2 ">
                        {mockServer.memberCount}
                        <Badge className="text-green-400">
                          ● Online {mockServer.onlineCount}
                        </Badge>
                        <Badge variant="secondary">
                          Bots {mockServer.botCount}
                        </Badge>
                      </div>
                    }
                  />
                </div>

                <Separator className="bg-gray-700" />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                  <div className="w-full">
                    <label className="text-sm text-gray-300">Invite Link</label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        className="text-white bg-gray-700 border-gray-700"
                        value={invite}
                        onChange={(e) => setInvite(e.target.value)}
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="shrink-0"
                            onClick={() => copy(invite)}
                          >
                            <FaCopy className="mr-2 h-4 w-4" /> Copy
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                      <Button className="shrink-0">
                        <FaExternalLinkAlt className="mr-2 h-4 w-4" /> Open
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 shadow-2xl border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Analytics Snapshot</CardTitle>
                <CardDescription>Past 7 days</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsCommands}
                      margin={{ left: 0, right: 8, top: 10, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis hide />
                      <RTooltip />
                      <Line
                        type="monotone"
                        dataKey="value"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules */}
          <Card className="rounded-2xl bg-gray-800 shadow-2xl border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Module Status</CardTitle>
                  <CardDescription>
                    Enable/disable features and jump into settings
                  </CardDescription>
                </div>
                <Tabs defaultValue="all" className="w-auto">
                  <TabsList className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                    <TabsTrigger
                      value="all"
                      className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white data-[state=active]:shadow-inner transition-colors"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger
                      value="Essentials"
                      className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-colors"
                    >
                      Essentials
                    </TabsTrigger>
                    <TabsTrigger
                      value="Moderation"
                      className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-colors"
                    >
                      Moderation
                    </TabsTrigger>
                    <TabsTrigger
                      value="Engagement"
                      className="text-gray-300 data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-colors"
                    >
                      Engagement
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64 pr-4">
                <ul className="space-y-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {moduleList.map((m) => (
                    <ModuleTile
                      key={m.key}
                      icon={m.icon}
                      title={m.label}
                      description={m.description}
                      defaultEnabled={moduleState[m.key]}
                      onOpen={() => console.log("Open settings:", m.key)}
                    />
                  ))}
                </ul>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Activity & Health */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="lg:col-span-2 rounded-2xl bg-gray-800 shadow-2xl border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest 10 bot events</CardDescription>
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-md bg-gray-600"
                  >
                    <IoMdRefresh className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64 pr-4">
                  <ul className="space-y-3">
                    {activityFeed.map((a) => (
                      <li key={a.id} className="flex items-start gap-3">
                        <Badge
                          variant="secondary"
                          className="rounded-md shrink-0 mt-0.5"
                        >
                          {a.ts}
                        </Badge>
                        <div className="leading-tight">
                          <p className="text-sm text-gray-200">{a.text}</p>
                          <div className="text-xs text-muted-foreground">
                            Type: {a.type}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Footer Quick Strip */}
            <Card className="rounded-2xl bg-gray-800 shadow-2xl border-gray-700">
              <CardContent className="py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="rounded-full" variant="secondary">
                    <IoIosStats className="mr-1 h-3 w-3" /> {mockServer.id}
                  </Badge>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-2xl"
                        onClick={() => copy(mockServer.id)}
                      >
                        <IoIosStats className="mr-2 h-4 w-4" /> Copy Server ID
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copied!</TooltipContent>
                  </Tooltip>
                  <Separator
                    orientation="vertical"
                    className="mx-1 hidden sm:block"
                  />
                  <Badge variant="secondary" className="rounded-full">
                    <IoIosStats className="mr-1 h-3 w-3" /> Modules:{" "}
                    {Object.values(moduleState).filter(Boolean).length}/
                    {Object.keys(moduleState).length} enabled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default DashboardView;
