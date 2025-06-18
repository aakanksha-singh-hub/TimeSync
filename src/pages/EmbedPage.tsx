import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Copy,
  Eye,
  Clock,
  Globe,
  Sparkles,
  Calendar,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  RefreshCw,
  Palette,
  Plus,
  X,
  Home,
  Settings,
  Sun,
  Moon,
  Zap,
  ChevronRight,
  ChevronDown,
  Play,
  ArrowRight,
  ArrowLeft,
  Target,
  Timer,
  MapPin,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { cities } from "@/data/cities";
import type { City } from "@/data/cities";
import CitySearch from "@/components/CitySearch";
import CircularTimePicker from "@/components/CircularTimePicker";

interface EmbedConfig {
  targetCities: City[];
  referenceCity: City | null;
  customTime?: DateTime;
  useCurrentTime: boolean;
  theme: "light" | "dark";
  size: "small" | "medium" | "large" | "full";
  showTimeDifference: boolean;
  showDate: boolean;
  showSeconds: boolean;
  use24Hour: boolean;
  layout: "grid" | "list";
}

interface WidgetPreviewProps {
  config: EmbedConfig;
  isLive: boolean;
}

const WidgetPreview: React.FC<WidgetPreviewProps> = ({ config, isLive }) => {
  const [currentTime, setCurrentTime] = useState(DateTime.now());

  useEffect(() => {
    if (!config.useCurrentTime) return;

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [config.useCurrentTime]);

  const displayTime = config.useCurrentTime
    ? currentTime
    : config.customTime || DateTime.now();

  const sizeConfigs = {
    small: {
      maxCities: 2,
      minHeight: "min-h-[240px]",
      padding: "p-5",
      timeSize: "text-2xl",
      citySize: "text-sm",
      spacing: "gap-4",
      iconSize: "h-4 w-4",
    },
    medium: {
      maxCities: 4,
      minHeight: "min-h-[320px]",
      padding: "p-6",
      timeSize: "text-3xl",
      citySize: "text-base",
      spacing: "gap-5",
      iconSize: "h-5 w-5",
    },
    large: {
      maxCities: 6,
      minHeight: "min-h-[400px]",
      padding: "p-8",
      timeSize: "text-4xl",
      citySize: "text-lg",
      spacing: "gap-6",
      iconSize: "h-6 w-6",
    },
    full: {
      maxCities: 8,
      minHeight: "min-h-[280px]",
      padding: "p-6",
      timeSize: "text-2xl",
      citySize: "text-sm",
      spacing: "gap-4",
      iconSize: "h-4 w-4",
    },
  };

  const sizeConfig = sizeConfigs[config.size];
  const citiesToShow = config.targetCities.slice(0, sizeConfig.maxCities);

  const formatTime = (dateTime: DateTime, timezone: string) => {
    const zonedTime = dateTime.setZone(timezone);
    const format = config.use24Hour
      ? config.showSeconds
        ? "HH:mm:ss"
        : "HH:mm"
      : config.showSeconds
      ? "h:mm:ss a"
      : "h:mm a";
    return zonedTime.toFormat(format);
  };

  const getTimeDifference = (timezone: string) => {
    if (!config.referenceCity || !config.showTimeDifference) return null;

    const refTime = displayTime.setZone(config.referenceCity.timezone);
    const cityTime = displayTime.setZone(timezone);
    const diffHours = cityTime.offset - refTime.offset;

    if (diffHours === 0) return "Same time";
    const sign = diffHours > 0 ? "+" : "";
    return `${sign}${diffHours}h`;
  };

  const getTimeInfo = (timezone: string) => {
    const zonedTime = displayTime.setZone(timezone);
    return {
      time: formatTime(displayTime, timezone),
      date: config.showDate ? zonedTime.toFormat("EEE, MMM d") : null,
      offset: zonedTime.toFormat("ZZ"),
      timeDiff: getTimeDifference(timezone),
    };
  };

  const getGridLayout = () => {
    if (config.layout === "list") return "grid-cols-1";
    if (config.size === "full") {
      return citiesToShow.length <= 4
        ? "grid-cols-2 lg:grid-cols-4"
        : "grid-cols-2 lg:grid-cols-4";
    }
    return citiesToShow.length === 1
      ? "grid-cols-1"
      : citiesToShow.length === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : citiesToShow.length <= 4
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  };

  if (citiesToShow.length === 0) {
    return (
      <div
        className={cn(
          "w-full h-full min-w-0 border border-border/60 rounded-2xl bg-gradient-to-br from-background via-background/98 to-muted/20 backdrop-blur-xl shadow-2xl shadow-primary/5",
          "flex items-center justify-center transition-all duration-500",
          config.theme === "dark" ? "dark" : ""
        )}
        style={{
          minHeight: "180px",
          maxHeight: "100vh",
        }}
      >
        <motion.div
          className="text-center space-y-6 p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary/15 via-primary/8 to-primary/12 border border-primary/15 flex items-center justify-center shadow-2xl shadow-primary/20 backdrop-blur-sm"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Globe className="h-10 w-10 text-primary/80" />
              {/* Inner glow */}
              <div className="absolute inset-2 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-sm" />
            </motion.div>
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/25"
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0],
                boxShadow: [
                  "0 10px 25px -12px rgba(249, 115, 22, 0.25)",
                  "0 15px 35px -12px rgba(249, 115, 22, 0.4)",
                  "0 10px 25px -12px rgba(249, 115, 22, 0.25)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Plus className="h-4 w-4 text-white drop-shadow-sm" />
            </motion.div>
            {/* Ambient glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 blur-2xl -z-10" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Add Your First City
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Select cities from the configuration panel to see your beautiful
              time zone widget come to life
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`widget-${config.theme}`}>
      <div
        className={cn(
          "w-full h-full min-w-0 border border-border/60 rounded-2xl bg-gradient-to-br from-background via-background/98 to-muted/20 backdrop-blur-xl shadow-2xl shadow-primary/5",
          sizeConfig.minHeight,
          "relative overflow-hidden transition-all duration-500 hover:shadow-3xl hover:shadow-primary/10",
          config.theme === "dark" ? "dark" : "",
          "flex flex-col"
        )}
        style={{
          minHeight: config.size === "full" ? "200px" : undefined,
          maxHeight: "100vh",
        }}
      >
        {/* Sophisticated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.1),transparent_40%)] dark:bg-[radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.05),transparent_40%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.015] bg-grid-black/[0.02] dark:bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white_50%,transparent_80%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/[0.02] dark:to-primary/[0.01]" />
        </div>

        {/* Live indicator with enhanced design */}
        {isLive && config.useCurrentTime && (
          <motion.div
            className="absolute top-5 right-5 z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 backdrop-blur-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <motion.div
                className="w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Live
              </span>
            </div>
          </motion.div>
        )}

        <div
          className={cn("flex-1 relative z-10 flex flex-col", sizeConfig.padding)}
        >
          {/* Premium Header Design */}
          <motion.div
            className="flex items-center justify-between mb-4 lg:mb-6 flex-shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-primary to-primary/90 flex items-center justify-center shadow-xl shadow-primary/25">
                  <Clock
                    className={cn("text-primary-foreground", sizeConfig.iconSize)}
                  />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl blur-sm -z-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-foreground tracking-tight">
                  TimeSync
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  World Clock Widget
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!config.useCurrentTime && config.customTime && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 shadow-sm">
                    <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                      {config.customTime.toFormat("MMM d")}
                    </span>
                  </div>
                </motion.div>
              )}
              {config.showTimeDifference && config.referenceCity && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-fuchsia-500/10 border border-purple-500/20 shadow-sm">
                    <Target className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-700 dark:text-purple-400">
                      vs {config.referenceCity.name}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Beautiful Cities Grid */}
          <div
            className={cn(
              "grid flex-1 min-h-0",
              getGridLayout(),
              sizeConfig.spacing,
              "content-start"
            )}
          >
            {citiesToShow.map((city, index) => {
              const timeInfo = getTimeInfo(city.timezone);

              return (
                <motion.div
                  key={city.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.15 + 0.3,
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                >
                  <div
                    className={cn(
                      "relative h-full p-5 rounded-2xl transition-all duration-500 cursor-default",
                      "bg-gradient-to-br from-background/90 via-background/70 to-muted/40",
                      "border border-border/60 backdrop-blur-xl",
                      "hover:shadow-2xl hover:shadow-primary/15 hover:border-border/90",
                      "hover:bg-gradient-to-br hover:from-background/95 hover:via-background/80 hover:to-muted/50",
                      "group-hover:scale-[1.03] group-hover:-translate-y-3",
                      "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/[0.05] before:via-transparent before:to-white/[0.02] before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
                      "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-br after:from-primary/[0.02] after:via-transparent after:to-primary/[0.05] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500"
                    )}
                  >
                    {/* City Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <motion.span
                          className="text-2xl leading-none"
                          whileHover={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {city.flag}
                        </motion.span>
                        <div className="min-w-0 flex-1 space-y-1">
                          <h4
                            className={cn(
                              "font-bold text-foreground leading-tight truncate",
                              sizeConfig.citySize
                            )}
                          >
                            {city.name}
                          </h4>
                          <p className="text-xs text-muted-foreground/80 truncate font-medium">
                            {city.country}
                          </p>
                        </div>
                      </div>

                      {timeInfo.timeDiff && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                        >
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-muted/60 to-muted/40 border border-border/40 shadow-sm">
                            <span className="text-xs font-bold text-muted-foreground">
                              {timeInfo.timeDiff}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Time Display - The Star */}
                    <div className="space-y-3">
                      <motion.div
                        className={cn(
                          "relative font-mono font-black text-foreground tracking-tight leading-none",
                          sizeConfig.timeSize
                        )}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        <span className="relative z-10 bg-gradient-to-br from-foreground via-foreground to-foreground/90 bg-clip-text text-transparent">
                          {timeInfo.time}
                        </span>
                        {/* Subtle glow effect for premium feel */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10 blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </motion.div>

                      {timeInfo.date && (
                        <motion.div
                          className="flex items-center gap-3 text-xs text-muted-foreground"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.7 }}
                        >
                          <span className="font-semibold">{timeInfo.date}</span>
                          <div className="w-1 h-1 bg-muted-foreground/40 rounded-full" />
                          <span className="font-mono font-medium opacity-70">
                            {timeInfo.offset}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Subtle hover gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                    {/* Border glow effect on hover */}
                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 blur-sm" />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Floating Reference Time (Enhanced) */}
          {config.showTimeDifference && config.referenceCity && (
            <motion.div
              className="absolute bottom-5 left-5 right-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="relative">
                <div className="flex items-center justify-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-2xl border border-border/70 shadow-2xl shadow-primary/10">
                  <motion.span
                    className="text-xl"
                    whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    {config.referenceCity.flag}
                  </motion.span>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-sm text-foreground/90">
                      Reference
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      {config.referenceCity.name}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-gradient-to-r from-primary/60 to-primary/40 rounded-full shadow-sm" />
                  <span className="text-sm font-mono font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {formatTime(displayTime, config.referenceCity.timezone)}
                  </span>
                </div>
                {/* Subtle glow around reference time */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-xl -z-10 opacity-50" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmbedPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Check if this is an embed request
  const isEmbedRequest = searchParams.has("cities");

  if (isEmbedRequest) {
    return <EmbedWidget />;
  }

  return <EmbedGenerator />;
};

// Actual embed widget for iframe
const EmbedWidget: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(DateTime.now());

  // Parse URL parameters
  const citiesParam = searchParams.get("cities") || "";
  const referenceParam = searchParams.get("ref");
  const customTime = searchParams.get("time");
  const theme = (searchParams.get("theme") as "light" | "dark") || "light";
  const size =
    (searchParams.get("size") as "small" | "medium" | "large" | "full") ||
    "medium";
  const showTimeDiff = searchParams.get("showTimeDiff") === "true";
  const showDate = searchParams.get("showDate") !== "false";
  const showSeconds = searchParams.get("showSeconds") === "true";
  const use24Hour = searchParams.get("use24Hour") !== "false";
  const layout = (searchParams.get("layout") as "grid" | "list") || "grid";

  const selectedCities = citiesParam
    .split(",")
    .map((cityName) =>
      cities.find(
        (c) =>
          c.name.toLowerCase() ===
          cityName.toLowerCase().replace(/\+/g, " ").trim()
      )
    )
    .filter(Boolean);

  const referenceCity = referenceParam
    ? cities.find(
        (c) =>
          c.name.toLowerCase() ===
          referenceParam.toLowerCase().replace(/\+/g, " ").trim()
      )
    : null;

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.width = "100%";
    document.body.style.height = "100%";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("light");
    }

    let interval: NodeJS.Timeout;
    if (!customTime) {
      interval = setInterval(() => setCurrentTime(DateTime.now()), 1000);
    }

    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.documentElement.style.width = "";
      document.documentElement.style.height = "";
      if (interval) clearInterval(interval);
    };
  }, [theme, customTime]);

  const config: EmbedConfig = {
    targetCities: selectedCities,
    referenceCity,
    customTime: customTime ? DateTime.fromISO(customTime) : undefined,
    useCurrentTime: !customTime,
    theme,
    size,
    showTimeDifference: showTimeDiff,
    showDate,
    showSeconds,
    use24Hour,
    layout,
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        #root {
          width: 100%;
          height: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 640px) {
          .grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
          .lg\\:grid-cols-4 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
      <WidgetPreview config={config} isLive={true} />
    </>
  );
};

// Main embed generator
const EmbedGenerator: React.FC = () => {
  const [config, setConfig] = useState<EmbedConfig>({
    targetCities: [],
    referenceCity: null,
    customTime: DateTime.now(),
    useCurrentTime: true,
    theme: "light",
    size: "medium",
    showTimeDifference: false,
    showDate: true,
    showSeconds: false,
    use24Hour: true,
    layout: "grid",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [copySuccess, setCopySuccess] = useState(false);

  const sizeConfigs = {
    small: {
      name: "Small",
      description: "Compact for sidebars",
      width: 320,
      height: 200,
      maxCities: 2,
      icon: Smartphone,
    },
    medium: {
      name: "Medium",
      description: "Perfect for blogs",
      width: 520,
      height: 280,
      maxCities: 4,
      icon: Tablet,
    },
    large: {
      name: "Large",
      description: "Detailed dashboard",
      width: 720,
      height: 380,
      maxCities: 6,
      icon: Monitor,
    },
    full: {
      name: "Full Width",
      description: "Responsive layout",
      width: "100%",
      height: 220,
      maxCities: 8,
      icon: Monitor,
    },
  };

  const steps = [
    { id: 1, title: "Size & Layout", description: "Choose widget dimensions" },
    { id: 2, title: "Cities", description: "Add locations to display" },
    {
      id: 3,
      title: "Customization",
      description: "Time, theme, and display options",
    },
    { id: 4, title: "Get Code", description: "Copy your embed code" },
  ];

  const updateConfig = <K extends keyof EmbedConfig>(
    key: K,
    value: EmbedConfig[K]
  ) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };
      if (key === "size") {
        const sizeConfig = sizeConfigs[value as EmbedConfig["size"]];
        newConfig.targetCities = prev.targetCities.slice(
          0,
          sizeConfig.maxCities
        );
      }
      return newConfig;
    });
  };

  const addCity = (city: City) => {
    if (config.targetCities.find((c) => c.id === city.id)) return;
    const maxCities = sizeConfigs[config.size].maxCities;
    if (config.targetCities.length < maxCities) {
      updateConfig("targetCities", [...config.targetCities, city]);
    } else {
      toast.error(
        `Maximum ${maxCities} cities for ${sizeConfigs[config.size].name} size`
      );
    }
  };

  const removeCity = (cityId: string) => {
    updateConfig(
      "targetCities",
      config.targetCities.filter((c) => c.id !== cityId)
    );
  };

  const generateEmbedUrl = () => {
    const params = new URLSearchParams({
      cities: config.targetCities
        .map((c) => c.name.replace(/\s+/g, "+"))
        .join(","),
      theme: config.theme,
      size: config.size,
      layout: config.layout,
      showDate: config.showDate.toString(),
      showSeconds: config.showSeconds.toString(),
      use24Hour: config.use24Hour.toString(),
    });

    if (config.referenceCity && config.showTimeDifference) {
      params.set("ref", config.referenceCity.name.replace(/\s+/g, "+"));
      params.set("showTimeDiff", "true");
    }

    if (!config.useCurrentTime && config.customTime) {
      params.set("time", config.customTime.toISO());
    }

    return `${window.location.origin}/embed?${params.toString()}`;
  };

  const generateIframeCode = () => {
    const url = generateEmbedUrl();
    const sizeConfig = sizeConfigs[config.size];

    // Generate responsive iframe code
    if (config.size === "full") {
      return `<!-- TimeSync Responsive Widget -->
<div style="width: 100%; max-width: 1200px; margin: 0 auto;">
  <iframe
    src="${url}"
    width="100%"
    height="${sizeConfig.height}"
    frameborder="0"
    style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; display: block;"
    title="TimeSync World Clock Widget"
    allow="autoplay"
    loading="lazy">
  </iframe>
</div>`;
    }

    return `<!-- TimeSync Widget -->
<div style="width: 100%; max-width: ${sizeConfig.width}px; margin: 0 auto;">
  <iframe
    src="${url}"
    width="100%"
    height="${sizeConfig.height}"
    frameborder="0"
    style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: ${sizeConfig.width}px; display: block;"
    title="TimeSync World Clock Widget"
    allow="autoplay"
    loading="lazy">
  </iframe>
</div>`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      setCopySuccess(true);
      toast.success("Embed code copied!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return true; // Size is always selected
      case 2:
        return config.targetCities.length > 0;
      case 3:
        return true; // Options are optional
      case 4:
        return config.targetCities.length > 0;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 4 && canProceed(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TimeSync</h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  Widget Builder
                </p>
              </div>
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app">
                <Home className="h-4 w-4 mr-2" />
                Back to App
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Intro Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4 mb-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Build Your Widget
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Create beautiful, embeddable world clock widgets with time
                  zone conversion, real-time updates, and calendar integration.
                  Perfect for blogs, Notion, and websites.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Real-time updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Time differences</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span>Responsive design</span>
                </div>
              </div>
            </motion.div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                        currentStep >= step.id
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.id}
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{step.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-16 h-1 mx-4 rounded-full transition-all",
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <Card className="min-h-[400px]">
              <CardContent className="p-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Size & Layout */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Choose Widget Size
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Select the perfect size for your use case
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(sizeConfigs).map(([key, size]) => {
                          const Icon = size.icon;
                          const isSelected = config.size === key;

                          return (
                            <Button
                              key={key}
                              variant={isSelected ? "default" : "outline"}
                              className="h-auto p-4 flex flex-col items-start gap-2"
                              onClick={() =>
                                updateConfig("size", key as EmbedConfig["size"])
                              }
                            >
                              <div className="flex items-center gap-2 w-full">
                                <Icon className="h-5 w-5" />
                                <span className="font-medium">{size.name}</span>
                              </div>
                              <p className="text-sm text-left opacity-70">
                                {size.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs">
                                <Badge variant="secondary">
                                  Max {size.maxCities} cities
                                </Badge>
                                <Badge variant="outline">
                                  {size.width === "100%"
                                    ? "Responsive"
                                    : `${size.width}×${size.height}`}
                                </Badge>
                              </div>
                            </Button>
                          );
                        })}
                      </div>

                      <div>
                        <Label htmlFor="layout" className="text-sm font-medium">
                          Layout Style
                        </Label>
                        <Select
                          value={config.layout}
                          onValueChange={(value: "grid" | "list") =>
                            updateConfig("layout", value)
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid Layout</SelectItem>
                            <SelectItem value="list">List Layout</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Cities */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Add Cities
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Search and add up to{" "}
                          {sizeConfigs[config.size].maxCities} cities to display
                        </p>
                      </div>

                      <CitySearch
                        placeholder="Search cities worldwide..."
                        onChange={(city) => city && addCity(city)}
                        value={null}
                      />

                      {config.targetCities.length > 0 && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              Selected Cities
                            </Label>
                            <Badge variant="secondary">
                              {config.targetCities.length}/
                              {sizeConfigs[config.size].maxCities}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            {config.targetCities.map((city) => (
                              <div
                                key={city.id}
                                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-lg">{city.flag}</span>
                                  <div>
                                    <p className="font-medium">{city.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {city.country}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeCity(city.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Step 3: Customization */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Customize Display
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Configure how your widget looks and behaves
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        {/* Theme */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Theme</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={
                                config.theme === "light" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => updateConfig("theme", "light")}
                              className="flex items-center gap-2"
                            >
                              <Sun className="h-4 w-4" />
                              Light
                            </Button>
                            <Button
                              variant={
                                config.theme === "dark" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => updateConfig("theme", "dark")}
                              className="flex items-center gap-2"
                            >
                              <Moon className="h-4 w-4" />
                              Dark
                            </Button>
                          </div>
                        </div>

                        {/* Time Format */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">
                            Time Format
                          </Label>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="24hour" className="text-sm">
                                24-hour format
                              </Label>
                              <Switch
                                id="24hour"
                                checked={config.use24Hour}
                                onCheckedChange={(checked) =>
                                  updateConfig("use24Hour", checked)
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="seconds" className="text-sm">
                                Show seconds
                              </Label>
                              <Switch
                                id="seconds"
                                checked={config.showSeconds}
                                onCheckedChange={(checked) =>
                                  updateConfig("showSeconds", checked)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Display Options */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label
                              htmlFor="showdate"
                              className="text-sm font-medium"
                            >
                              Show Dates
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Display day and date for each city
                            </p>
                          </div>
                          <Switch
                            id="showdate"
                            checked={config.showDate}
                            onCheckedChange={(checked) =>
                              updateConfig("showDate", checked)
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label
                              htmlFor="timediff"
                              className="text-sm font-medium"
                            >
                              Show Time Differences
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Display time difference from reference city
                            </p>
                          </div>
                          <Switch
                            id="timediff"
                            checked={config.showTimeDifference}
                            onCheckedChange={(checked) =>
                              updateConfig("showTimeDifference", checked)
                            }
                          />
                        </div>

                        {config.showTimeDifference && (
                          <div className="space-y-2 ml-4 p-3 bg-muted/50 rounded-lg">
                            <Label className="text-sm font-medium">
                              Reference City
                            </Label>
                            <CitySearch
                              placeholder="Choose reference timezone..."
                              onChange={(city) =>
                                updateConfig("referenceCity", city)
                              }
                              value={config.referenceCity}
                            />
                          </div>
                        )}
                      </div>

                      <Separator />

                      {/* Time Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label
                              htmlFor="livetime"
                              className="text-sm font-medium"
                            >
                              Use Current Time
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Show live, real-time updates
                            </p>
                          </div>
                          <Switch
                            id="livetime"
                            checked={config.useCurrentTime}
                            onCheckedChange={(checked) =>
                              updateConfig("useCurrentTime", checked)
                            }
                          />
                        </div>

                        {!config.useCurrentTime && (
                          <div className="space-y-3 ml-4 p-3 bg-muted/50 rounded-lg">
                            <Label className="text-sm font-medium">
                              Custom Time
                            </Label>
                            <CircularTimePicker
                              value={{
                                hours: (config.customTime || DateTime.now())
                                  .hour,
                                minutes: (config.customTime || DateTime.now())
                                  .minute,
                              }}
                              onChange={(time) =>
                                updateConfig(
                                  "customTime",
                                  DateTime.now().set({
                                    hour: time.hours,
                                    minute: time.minutes,
                                  })
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Get Code */}
                  {currentStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          Your Widget is Ready!
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Copy the embed code and paste it into your website
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            HTML Embed Code
                          </Label>
                          <div className="relative">
                            <Textarea
                              value={generateIframeCode()}
                              readOnly
                              rows={8}
                              className="font-mono text-sm bg-muted/50 resize-none"
                            />
                            <Button
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={handleCopyCode}
                            >
                              {copySuccess ? (
                                <CheckCircle className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Direct URL
                          </Label>
                          <div className="flex gap-2">
                            <input
                              value={generateEmbedUrl()}
                              readOnly
                              className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm font-mono"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                window.open(generateEmbedUrl(), "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-blue-50 to-primary/5 dark:from-blue-950/50 dark:to-primary/5 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Integration Guide
                            </h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                              <li>
                                • Copy the HTML code and paste into your website
                              </li>
                              <li>
                                • Widget automatically updates and is fully
                                responsive
                              </li>
                              <li>
                                • Works on any website, blog, or dashboard
                              </li>
                              <li>• No JavaScript knowledge required</li>
                            </ul>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                            <h4 className="font-medium text-green-900 dark:text-green-100 mb-3">
                              Quick Integration
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-white/50 dark:bg-black/20"
                                onClick={() =>
                                  window.open("https://notion.so", "_blank")
                                }
                              >
                                <ExternalLink className="h-4 w-4" />
                                Add to Notion
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-white/50 dark:bg-black/20"
                                onClick={() =>
                                  window.open("https://wordpress.com", "_blank")
                                }
                              >
                                <ExternalLink className="h-4 w-4" />
                                WordPress Guide
                              </Button>
                            </div>
                            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                              Perfect for Notion pages, WordPress blogs, and any
                              HTML-enabled platform
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {currentStep < 4 ? (
                  <Button
                    onClick={nextStep}
                    disabled={!canProceed(currentStep)}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setCurrentStep(1)} variant="outline">
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                    {config.useCurrentTime && (
                      <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Live
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WidgetPreview config={config} isLive={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Configuration Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{sizeConfigs[config.size].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cities:</span>
                      <span>
                        {config.targetCities.length}/
                        {sizeConfigs[config.size].maxCities}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Theme:</span>
                      <span className="capitalize">{config.theme}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span>{config.useCurrentTime ? "Live" : "Custom"}</span>
                    </div>
                    {config.showTimeDifference && config.referenceCity && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Reference:
                        </span>
                        <span>{config.referenceCity.name}</span>
                      </div>
                    )}
                  </div>

                  {config.targetCities.length > 0 && (
                    <div className="pt-3 border-t space-y-3">
                      <p className="text-xs font-medium text-muted-foreground">
                        Quick Actions
                      </p>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full justify-start text-xs h-8"
                          onClick={() => setCurrentStep(4)}
                        >
                          <Code className="h-3 w-3 mr-2" />
                          Get Embed Code
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full justify-start text-xs h-8"
                          onClick={() =>
                            window.open(generateEmbedUrl(), "_blank")
                          }
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          Test Widget
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedPage;
