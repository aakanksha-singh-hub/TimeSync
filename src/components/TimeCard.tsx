import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  X,
  Pin,
  PinOff,
  Calendar,
  MoreVertical,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { City } from "@/data/cities";

interface TimeCardProps {
  city: City;
  referenceTime?: DateTime;
  is24Hour?: boolean;
  isPinned?: boolean;
  onRemove?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  onCalendarExport?: () => void;
  className?: string;
  isSource?: boolean;
}

const TimeCard: React.FC<TimeCardProps> = ({
  city,
  referenceTime,
  is24Hour = false,
  isPinned = false,
  onRemove,
  onPin,
  onUnpin,
  onCalendarExport,
  className,
  isSource = false,
}) => {
  const [currentTime, setCurrentTime] = useState<DateTime>(
    referenceTime
      ? referenceTime.setZone(city.timezone)
      : DateTime.now().setZone(city.timezone)
  );
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (referenceTime) {
      setCurrentTime(referenceTime.setZone(city.timezone));
      return;
    }

    // Real-time updates - always update every second for accuracy
    const interval = setInterval(
      () => {
        setCurrentTime(DateTime.now().setZone(city.timezone));
      },
      1000
    );

    return () => clearInterval(interval);
  }, [city.timezone, referenceTime]);

  const formatTime = () => {
    // Always show seconds for accuracy
    const format = is24Hour ? "HH:mm:ss" : "h:mm:ss a";
    return currentTime.toFormat(format);
  };

  const formatDate = () => {
    return currentTime.toFormat("EEE, MMM d");
  };

  const getTimeDifference = () => {
    if (!referenceTime) return null;

    const reference = referenceTime.setZone(city.timezone);
    const now = DateTime.now().setZone(city.timezone);
    const diff = reference.diff(now, "hours").hours;

    if (Math.abs(diff) < 0.1) return null;

    const sign = diff > 0 ? "+" : "";
    return `${sign}${Math.round(diff * 10) / 10}h`;
  };

  const getUtcOffset = () => {
    const offset = currentTime.offset / 60;
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  };

  const handleCopy = async () => {
    try {
      const timeText = `${city.name}: ${formatTime()} (${formatDate()})`;
      await navigator.clipboard.writeText(timeText);
      setCopySuccess(true);
      toast(`Copied ${city.name} time to clipboard`);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handlePin = () => {
    if (isPinned) {
      onUnpin?.();
      toast(`Unpinned ${city.name}`);
    } else {
      onPin?.();
      toast(`Pinned ${city.name}`);
    }
  };

  const timeDiff = getTimeDifference();
  const isCurrentHour = !referenceTime && currentTime.minute < 5;

  return (
    <motion.div
      className={cn(
        "time-card group relative",
        isSource && "ring-2 ring-primary ring-offset-2",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      layout
    >
      {/* Background gradient based on time of day */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-20 transition-opacity duration-500",
          currentTime.hour >= 6 &&
            currentTime.hour < 12 &&
            "bg-gradient-to-br from-yellow-200 to-orange-200",
          currentTime.hour >= 12 &&
            currentTime.hour < 18 &&
            "bg-gradient-to-br from-blue-200 to-cyan-200",
          currentTime.hour >= 18 &&
            currentTime.hour < 22 &&
            "bg-gradient-to-br from-orange-200 to-red-200",
          (currentTime.hour >= 22 || currentTime.hour < 6) &&
            "bg-gradient-to-br from-indigo-200 to-purple-200"
        )}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="text-2xl" role="img" aria-label={city.country}>
            {city.flag}
          </span>
          <div>
            <h3 className="font-display font-semibold text-lg leading-tight">
              {city.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {city.timezone.split("/").pop()?.replace(/_/g, " ")}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8 w-8 p-0"
            aria-label="Copy time"
          >
            <motion.div
              animate={{ scale: copySuccess ? 1.2 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {copySuccess ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-500"
                >
                  <Copy className="h-4 w-4" />
                </motion.div>
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </motion.div>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handlePin}>
                {isPinned ? (
                  <>
                    <PinOff className="h-4 w-4 mr-2" />
                    Unpin city
                  </>
                ) : (
                  <>
                    <Pin className="h-4 w-4 mr-2" />
                    Pin city
                  </>
                )}
              </DropdownMenuItem>
              {onCalendarExport && (
                <DropdownMenuItem onClick={onCalendarExport}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Export to calendar
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onRemove && (
                <DropdownMenuItem
                  onClick={onRemove}
                  className="text-destructive focus:text-destructive"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove city
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Time display */}
      <div className="mb-4 relative z-10">
        <motion.div
          className="font-display text-3xl font-bold tracking-tight"
          key={formatTime()}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {formatTime()}
        </motion.div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-muted-foreground">{formatDate()}</p>
          <Badge variant="secondary" className="text-xs">
            {getUtcOffset()}
          </Badge>
        </div>
      </div>

      {/* Status indicators */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          {isCurrentHour && !referenceTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Live
            </Badge>
          )}
          {timeDiff && (
            <Badge variant="outline" className="text-xs">
              {timeDiff}
            </Badge>
          )}
          {isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
        </div>

        {isSource && <Badge className="text-xs">Source</Badge>}
      </div>

      {/* Subtle glow effect for current hour */}
      {isCurrentHour && !referenceTime && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/10 blur-sm -z-10 animate-pulse" />
      )}
    </motion.div>
  );
};

export default TimeCard;
