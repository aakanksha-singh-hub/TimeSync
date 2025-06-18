import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, RefreshCwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedDateTimePickerProps {
  value: DateTime;
  onChange: (dateTime: DateTime) => void;
  timezone: string;
  is24HourFormat?: boolean;
  showSeconds?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const EnhancedDateTimePicker: React.FC<EnhancedDateTimePickerProps> = ({
  value,
  onChange,
  timezone,
  is24HourFormat = false,
  showSeconds = false,
  label,
  className,
  disabled = false,
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [timeInput, setTimeInput] = useState("");

  // Current date time in the specified timezone
  const localDateTime = value.setZone(timezone);
  const currentDate = localDateTime.toJSDate();

  // Update time input when value changes
  useEffect(() => {
    const format = is24HourFormat
      ? showSeconds
        ? "HH:mm:ss"
        : "HH:mm"
      : showSeconds
      ? "hh:mm:ss a"
      : "hh:mm a";

    setTimeInput(localDateTime.toFormat(format));
  }, [value, timezone, is24HourFormat, showSeconds, localDateTime]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    const newDateTime = localDateTime.set({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    });

    onChange(newDateTime);
    setIsCalendarOpen(false);
  };

  const handleTimeChange = (timeStr: string) => {
    setTimeInput(timeStr);

    // Parse time input
    try {
      let parsedTime: DateTime;

      if (is24HourFormat) {
        const timeParts = timeStr.split(":");
        const hours = parseInt(timeParts[0]) || 0;
        const minutes = parseInt(timeParts[1]) || 0;
        const seconds = showSeconds ? parseInt(timeParts[2]) || 0 : 0;

        if (
          hours < 0 ||
          hours > 23 ||
          minutes < 0 ||
          minutes > 59 ||
          seconds < 0 ||
          seconds > 59
        ) {
          return; // Invalid time
        }

        parsedTime = localDateTime.set({
          hour: hours,
          minute: minutes,
          second: seconds,
        });
      } else {
        // Parse 12-hour format
        const timeRegex = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)$/i;
        const match = timeStr.match(timeRegex);

        if (match) {
          let hours = parseInt(match[1]);
          const minutes = parseInt(match[2]);
          const seconds = showSeconds ? parseInt(match[3]) || 0 : 0;
          const meridiem = match[4].toLowerCase();

          if (
            hours < 1 ||
            hours > 12 ||
            minutes < 0 ||
            minutes > 59 ||
            seconds < 0 ||
            seconds > 59
          ) {
            return; // Invalid time
          }

          if (meridiem === "pm" && hours !== 12) hours += 12;
          if (meridiem === "am" && hours === 12) hours = 0;

          parsedTime = localDateTime.set({
            hour: hours,
            minute: minutes,
            second: seconds,
          });
        } else {
          return; // Invalid format
        }
      }

      if (parsedTime.isValid) {
        onChange(parsedTime);
      }
    } catch (error) {
      // Invalid time input, don't update
    }
  };

  const handleCurrentTime = () => {
    const currentTime = DateTime.now().setZone(timezone);
    onChange(currentTime);
  };

  const isToday = localDateTime.hasSame(
    DateTime.now().setZone(timezone),
    "day"
  );

  const formatDateDisplay = () => {
    return localDateTime.toFormat("EEEE, MMMM d, yyyy");
  };

  const getTimezoneOffset = () => {
    const offset = localDateTime.offset / 60;
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            {label && <CardTitle className="text-lg">{label}</CardTitle>}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{timezone}</span>
              <Badge variant="outline" className="text-xs">
                {getTimezoneOffset()}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCurrentTime}
            disabled={disabled}
            className="text-xs gap-1"
          >
            <RefreshCwIcon className="w-3 h-3" />
            Now
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Display and Picker */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date</Label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className={cn(
                  "w-full justify-start text-left font-normal h-auto p-3",
                  !currentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{formatDateDisplay()}</span>
                  {isToday && (
                    <span className="text-xs text-primary">Today</span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Time</Label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={timeInput}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={disabled}
              placeholder={is24HourFormat ? "14:30" : "2:30 PM"}
              className="pl-10 font-mono text-base"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Format: {is24HourFormat ? "HH:MM" : "h:MM AM/PM"}
            {showSeconds && (is24HourFormat ? ":SS" : ":SS")}
          </div>
        </div>
<<<<<<< HEAD

        {/* Live Time Display */}
        <motion.div
          className="p-4 rounded-lg bg-muted/30 border border-border/50"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">
              Selected Time
            </div>
            <motion.div
              className="font-mono text-2xl font-bold text-primary"
              key={timeInput}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {timeInput}
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Time Presets */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Set</Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "9:00 AM", time: { hour: 9, minute: 0 } },
              { label: "12:00 PM", time: { hour: 12, minute: 0 } },
              { label: "3:00 PM", time: { hour: 15, minute: 0 } },
              { label: "6:00 PM", time: { hour: 18, minute: 0 } },
            ].map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => {
                  const newTime = localDateTime.set(preset.time);
                  onChange(newTime);
                }}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
=======
>>>>>>> 560aac6 (UI fixes: theme toggle, card alignment, icon sizing, header improvements, and git setup)
      </CardContent>
    </Card>
  );
};

export default EnhancedDateTimePicker;
