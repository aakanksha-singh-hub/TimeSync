import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, RefreshCwIcon } from "lucide-react";

interface SimpleDateTimePickerProps {
  value: DateTime;
  onChange: (dateTime: DateTime) => void;
  timezone: string;
  is24HourFormat?: boolean;
}

const SimpleDateTimePicker: React.FC<SimpleDateTimePickerProps> = ({
  value,
  onChange,
  timezone,
  is24HourFormat = false,
}) => {
  const [dateInput, setDateInput] = useState("");

  // Current date time in the specified timezone
  const localDateTime = value.setZone(timezone);

  // Update date input when value changes
  useEffect(() => {
    setDateInput(localDateTime.toFormat("yyyy-MM-dd"));
  }, [value, timezone, localDateTime]);

  const handleDateChange = (dateStr: string) => {
    setDateInput(dateStr);
    try {
      const [year, month, day] = dateStr.split("-").map(Number);
      if (year && month && day) {
        const newDateTime = localDateTime.set({ year, month, day });
        if (newDateTime.isValid) {
          onChange(newDateTime);
        }
      }
    } catch (error) {
      console.error("Invalid date:", error);
    }
  };

  const handleTimeChange = (timeStr: string) => {
    try {
      // timeStr comes in HH:MM format from HTML time input
      const [hours, minutes] = timeStr.split(":").map(Number);
      if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        const newDateTime = localDateTime.set({ hour: hours, minute: minutes, second: 0 });
        if (newDateTime.isValid) {
          onChange(newDateTime);
        }
      }
    } catch (error) {
      console.error("Invalid time:", error);
    }
  };

  const handleCurrentTime = () => {
    const currentTime = DateTime.now().setZone(timezone);
    onChange(currentTime);
  };

  const getTimezoneOffset = () => {
    const offset = localDateTime.offset / 60;
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  };

  const isToday = localDateTime.hasSame(DateTime.now().setZone(timezone), "day");

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Custom Date & Time</CardTitle>
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
            className="text-xs gap-1"
          >
            <RefreshCwIcon className="w-3 h-3" />
            Now
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Date</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateInput}
              onChange={(e) => handleDateChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {isToday && (
            <p className="text-xs text-primary">Today</p>
          )}
        </div>

        {/* Time Input */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Time</Label>
          <div className="relative">
            <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="time"
              value={localDateTime.toFormat("HH:mm")}
              onChange={(e) => handleTimeChange(e.target.value)}
              className="pl-10 font-mono"
              step="60"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Use the time picker above to select hours and minutes
          </div>
        </div>

        {/* Current time display */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="text-sm text-muted-foreground">Selected time:</div>
          <div className="text-lg font-mono font-bold">
            {localDateTime.toFormat(is24HourFormat ? "HH:mm" : "h:mm a")}
          </div>
          <div className="text-sm text-muted-foreground">
            {localDateTime.toFormat("cccc, MMMM d, yyyy")}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimpleDateTimePicker;
