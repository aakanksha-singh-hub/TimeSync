import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { ClockIcon, CalendarIcon, GlobeIcon } from "lucide-react";
import { City } from "@/data/cities";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RealTimeClockProps {
  city: City;
  is24HourFormat?: boolean;
  showSeconds?: boolean;
  showDate?: boolean;
  showTimezone?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animated?: boolean;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({
  city,
  is24HourFormat = false,
  showSeconds = true,
  showDate = true,
  showTimezone = true,
  size = "md",
  className,
  animated = true,
}) => {
  const [currentTime, setCurrentTime] = useState<DateTime>(
    DateTime.now().setZone(city.timezone)
  );
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(DateTime.now().setZone(city.timezone));
    };

    // Update immediately
    updateTime();

    // Set up interval for updates
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [city.timezone]);

  // Handle page visibility to optimize performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const timeFormat = is24HourFormat
    ? showSeconds
      ? "HH:mm:ss"
      : "HH:mm"
    : showSeconds
    ? "h:mm:ss a"
    : "h:mm a";

  const formattedTime = currentTime.toFormat(timeFormat);
  const formattedDate = currentTime.toFormat("EEEE, MMMM d, yyyy");
  const utcOffset = currentTime.toFormat("ZZZZZ");
  const timezoneName = currentTime.toFormat("ZZZZ");

  const sizeClasses = {
    sm: {
      time: "text-lg font-light",
      date: "text-xs",
      container: "p-3",
      icon: "h-3 w-3",
    },
    md: {
      time: "text-2xl font-light",
      date: "text-sm",
      container: "p-4",
      icon: "h-4 w-4",
    },
    lg: {
      time: "text-4xl font-light",
      date: "text-lg",
      container: "p-6",
      icon: "h-5 w-5",
    },
  };

  const currentSizeClasses = sizeClasses[size];

  const getGreeting = () => {
    const hour = currentTime.hour;
    if (hour < 5) return "🌙 Late Night";
    if (hour < 12) return "🌅 Good Morning";
    if (hour < 17) return "☀️ Good Afternoon";
    if (hour < 21) return "🌇 Good Evening";
    return "🌃 Good Night";
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const clockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      variants={clockVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "bg-gradient-to-br from-background to-accent/5 rounded-xl border shadow-sm",
        currentSizeClasses.container,
        className
      )}
    >
      {/* City Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{city.flag}</span>
          <div>
            <div className="font-semibold text-sm">{city.name}</div>
            <div className="text-xs text-muted-foreground">{city.country}</div>
          </div>
        </div>
        {size !== "sm" && (
          <Badge variant="outline" className="text-xs">
            {getGreeting()}
          </Badge>
        )}
      </div>

      {/* Time Display */}
      <motion.div
        variants={animated ? pulseVariants : {}}
        animate={animated && isVisible ? "pulse" : ""}
        className="flex items-center gap-2 mb-2"
      >
        <ClockIcon
          className={cn(currentSizeClasses.icon, "shrink-0 opacity-60")}
        />
        <span
          className={cn(currentSizeClasses.time, "font-mono tracking-tight")}
        >
          {formattedTime}
        </span>
      </motion.div>

      {/* Date Display */}
      {showDate && (
        <div className="flex items-center gap-2 mb-3 text-muted-foreground">
          <CalendarIcon
            className={cn(currentSizeClasses.icon, "shrink-0 opacity-60")}
          />
          <span className={currentSizeClasses.date}>{formattedDate}</span>
        </div>
      )}

      {/* Timezone Info */}
      {showTimezone && (
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground">
            <GlobeIcon
              className={cn(currentSizeClasses.icon, "shrink-0 opacity-60")}
            />
            <span className="text-xs font-mono">{utcOffset}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {timezoneName}
          </Badge>
        </div>
      )}
    </motion.div>
  );
};

export default RealTimeClock;
