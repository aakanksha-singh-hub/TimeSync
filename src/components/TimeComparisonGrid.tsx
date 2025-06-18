import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusIcon,
  XIcon,
  PinIcon,
  GripVerticalIcon,
  ClockIcon,
  SunIcon,
  MoonIcon,
  SunriseIcon,
  SunsetIcon,
} from "lucide-react";
import { City } from "@/data/cities";
import { TimeConversion } from "@/store/useTimeSyncStore";
import { cn } from "@/lib/utils";

interface TimeComparisonGridProps {
  conversions: TimeConversion[];
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
  onAddConversion: () => void;
  is24HourFormat?: boolean;
  showSeconds?: boolean;
  className?: string;
  compact?: boolean;
}

const TimeComparisonGrid: React.FC<TimeComparisonGridProps> = ({
  conversions,
  onRemove,
  onTogglePin,
  onAddConversion,
  is24HourFormat = false,
  showSeconds = false,
  className,
  compact = false,
}) => {
  const [currentTimes, setCurrentTimes] = useState<Map<string, DateTime>>(
    new Map()
  );

  // Update all times every second
  useEffect(() => {
    const updateTimes = () => {
      const newTimes = new Map<string, DateTime>();
      conversions.forEach((conversion) => {
        const now = DateTime.now();
        const sourceTime = now.setZone(conversion.sourceCity.timezone);
        const targetTime = now.setZone(conversion.targetCity.timezone);
        newTimes.set(`${conversion.id}-source`, sourceTime);
        newTimes.set(`${conversion.id}-target`, targetTime);
      });
      setCurrentTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, [conversions]);

  const getTimeOfDay = (time: DateTime) => {
    const hour = time.hour;
    if (hour >= 6 && hour < 12)
      return {
        icon: <SunriseIcon className="h-3 w-3" />,
        label: "Morning",
        color: "text-amber-500",
      };
    if (hour >= 12 && hour < 17)
      return {
        icon: <SunIcon className="h-3 w-3" />,
        label: "Afternoon",
        color: "text-yellow-500",
      };
    if (hour >= 17 && hour < 20)
      return {
        icon: <SunsetIcon className="h-3 w-3" />,
        label: "Evening",
        color: "text-orange-500",
      };
    return {
      icon: <MoonIcon className="h-3 w-3" />,
      label: "Night",
      color: "text-blue-500",
    };
  };

  const formatTime = (time: DateTime) => {
    const format = is24HourFormat
      ? showSeconds
        ? "HH:mm:ss"
        : "HH:mm"
      : showSeconds
      ? "h:mm:ss a"
      : "h:mm a";
    return time.toFormat(format);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  if (conversions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("text-center py-12", className)}
      >
        <ClockIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Time Comparisons</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Add cities to compare times across different time zones. Perfect for
          scheduling meetings or coordinating with global teams.
        </p>
        <Button onClick={onAddConversion} className="gap-2">
          <PlusIcon className="h-4 w-4" />
          Add First Comparison
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Time Comparisons</h3>
        <Button
          onClick={onAddConversion}
          size="sm"
          variant="outline"
          className="gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add
        </Button>
      </div>

      <ScrollArea className="h-[400px] w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={cn(
            "grid gap-4",
            compact
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}
        >
          <AnimatePresence>
            {conversions.map((conversion) => {
              const sourceTime = currentTimes.get(`${conversion.id}-source`);
              const targetTime = currentTimes.get(`${conversion.id}-target`);

              if (!sourceTime || !targetTime) return null;

              const sourceTimeOfDay = getTimeOfDay(sourceTime);
              const targetTimeOfDay = getTimeOfDay(targetTime);

              return (
                <motion.div
                  key={conversion.id}
                  variants={itemVariants}
                  layout
                  className="group"
                >
                  <Card className="relative overflow-hidden border-2 border-transparent hover:border-accent/50 transition-all duration-200">
                    {/* Header with actions */}
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVerticalIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          <Badge
                            variant={
                              conversion.isPinned ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {conversion.isPinned ? "Pinned" : "Temp"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onTogglePin(conversion.id)}
                            className="h-8 w-8 p-0"
                          >
                            <PinIcon
                              className={cn(
                                "h-3 w-3",
                                conversion.isPinned && "text-blue-500"
                              )}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onRemove(conversion.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                          >
                            <XIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 space-y-4">
                      {/* Source City */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {conversion.sourceCity.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {conversion.sourceCity.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {conversion.sourceCity.country}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1",
                              sourceTimeOfDay.color
                            )}
                          >
                            {sourceTimeOfDay.icon}
                            <span className="text-xs">
                              {sourceTimeOfDay.label}
                            </span>
                          </div>
                        </div>
                        <div className="bg-accent/10 rounded-lg p-3">
                          <div className="font-mono text-xl font-light">
                            {formatTime(sourceTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {sourceTime.toFormat("EEEE, MMM d")} •{" "}
                            {sourceTime.toFormat("ZZZZZ")}
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-background px-2 text-muted-foreground">
                            converts to
                          </span>
                        </div>
                      </div>

                      {/* Target City */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {conversion.targetCity.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {conversion.targetCity.name}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {conversion.targetCity.country}
                            </div>
                          </div>
                          <div
                            className={cn(
                              "flex items-center gap-1",
                              targetTimeOfDay.color
                            )}
                          >
                            {targetTimeOfDay.icon}
                            <span className="text-xs">
                              {targetTimeOfDay.label}
                            </span>
                          </div>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
                          <div className="font-mono text-xl font-light">
                            {formatTime(targetTime)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {targetTime.toFormat("EEEE, MMM d")} •{" "}
                            {targetTime.toFormat("ZZZZZ")}
                          </div>
                        </div>
                      </div>

                      {/* Time Difference */}
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs">
                          {Math.abs(targetTime.offset - sourceTime.offset) / 60}
                          h difference
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </ScrollArea>
    </div>
  );
};

export default TimeComparisonGrid;
