import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface CircularTimePickerProps {
  value: { hours: number; minutes: number };
  onChange: (time: { hours: number; minutes: number }) => void;
  is24Hour?: boolean;
  onToggle24Hour?: () => void;
  className?: string;
}

const CircularTimePicker: React.FC<CircularTimePickerProps> = ({
  value,
  onChange,
  is24Hour = false,
  onToggle24Hour,
  className,
}) => {
  const [mode, setMode] = useState<"hours" | "minutes">("hours");
  const [isDragging, setIsDragging] = useState(false);
  const clockRef = useRef<HTMLDivElement>(null);

  // Convert 24h to 12h format for display
  const display12Hour = is24Hour ? value.hours : value.hours % 12 || 12;
  const amPm = value.hours >= 12 ? "PM" : "AM";

  // Calculate angle for clock hands
  const getAngle = (val: number, max: number) => {
    return (val * 360) / max - 90; // -90 to start from 12 o'clock
  };

  // Generate clock numbers
  const generateNumbers = () => {
    const numbers = [];
    const max = mode === "hours" ? (is24Hour ? 24 : 12) : 12; // Changed minutes to show 5-minute increments
    const step = mode === "hours" ? 1 : 1;

    for (let i = 0; i < max; i += step) {
      const angle = (i * 360) / max - 90;
      const radius = 85;
      const x = Math.cos((angle * Math.PI) / 180) * radius;
      const y = Math.sin((angle * Math.PI) / 180) * radius;

      let displayValue = i;
      if (mode === "hours") {
        displayValue = is24Hour ? i : i === 0 ? 12 : i;
      } else {
        displayValue = i * 5; // Show 5-minute increments (0, 5, 10, 15, ...)
      }

      const isSelected =
        (mode === "hours" &&
          (is24Hour ? value.hours === i : display12Hour === displayValue)) ||
        (mode === "minutes" && Math.floor(value.minutes / 5) === i);

      numbers.push(
        <motion.div
          key={i}
          className={cn(
            "absolute w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer transition-all duration-200 select-none",
            isSelected
              ? "bg-primary text-primary-foreground shadow-lg scale-110 z-10"
              : "hover:bg-muted hover:scale-105 text-muted-foreground hover:text-foreground"
          )}
          style={{
            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
          }}
          onClick={() => handleNumberClick(i)}
          whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {displayValue.toString().padStart(2, "0")}
        </motion.div>
      );
    }
    return numbers;
  };

  const handleNumberClick = (num: number) => {
    if (mode === "hours") {
      let newHours = num;
      if (!is24Hour) {
        if (num === 12) newHours = 0;
        if (amPm === "PM" && num !== 12) newHours += 12;
        if (amPm === "AM" && num === 12) newHours = 0;
      }
      onChange({ hours: newHours, minutes: value.minutes });
      setMode("minutes");
    } else {
      const minutes = num * 5;
      onChange({ hours: value.hours, minutes });
    }
  };

  const handleAmPmToggle = (period: "AM" | "PM") => {
    const newHours =
      period === "PM" ? (value.hours % 12) + 12 : value.hours % 12;
    onChange({ hours: newHours, minutes: value.minutes });
  };

  const formatTime = () => {
    const hours = is24Hour
      ? value.hours.toString().padStart(2, "0")
      : display12Hour.toString();
    const minutes = value.minutes.toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const resetToCurrentTime = () => {
    const now = new Date();
    onChange({
      hours: now.getHours(),
      minutes: now.getMinutes(),
    });
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>Set Time</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToCurrentTime}
            className="text-xs gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Now
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Display */}
        <div className="text-center">
          <motion.div
            className="font-mono text-4xl font-bold mb-2"
            key={formatTime()}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {formatTime()}
            {!is24Hour && (
              <span className="text-2xl ml-2 text-muted-foreground">
                {amPm}
              </span>
            )}
          </motion.div>

          {/* 24h Toggle */}
          {onToggle24Hour && (
            <div className="flex items-center justify-center gap-3 text-sm">
              <Label htmlFor="24hour" className="cursor-pointer">
                24-hour format
              </Label>
              <Switch
                id="24hour"
                checked={is24Hour}
                onCheckedChange={onToggle24Hour}
              />
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={mode === "hours" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("hours")}
            className="relative"
          >
            Hours
            {mode === "hours" && (
              <motion.div
                className="absolute inset-0 bg-primary rounded-md"
                layoutId="mode-indicator"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10">Hours</span>
          </Button>
          <Button
            variant={mode === "minutes" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("minutes")}
            className="relative"
          >
            <span className="relative z-10">Minutes</span>
          </Button>
        </div>

        {/* Circular Clock */}
        <div className="flex justify-center">
          <div className="relative w-64 h-64">
            <div
              ref={clockRef}
              className="w-full h-full rounded-full border-2 border-primary/20 bg-gradient-to-br from-muted/30 to-muted/10 relative shadow-inner"
            >
              {/* Clock center dot */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg" />

              {/* Clock hand */}
              <motion.div
                className="absolute top-1/2 left-1/2 origin-bottom bg-primary rounded-full z-10 shadow-lg"
                style={{
                  width: "3px",
                  height: "75px",
                  transform: `translate(-50%, -100%) rotate(${
                    mode === "hours"
                      ? getAngle(
                          is24Hour ? value.hours : display12Hour,
                          is24Hour ? 24 : 12
                        )
                      : getAngle(Math.floor(value.minutes / 5), 12)
                  }deg)`,
                }}
                animate={{
                  rotate:
                    mode === "hours"
                      ? getAngle(
                          is24Hour ? value.hours : display12Hour,
                          is24Hour ? 24 : 12
                        )
                      : getAngle(Math.floor(value.minutes / 5), 12),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />

              {/* Numbers */}
              <div className="absolute inset-0 flex items-center justify-center">
                {generateNumbers()}
              </div>
            </div>
          </div>
        </div>

        {/* AM/PM Selector for 12-hour format */}
        {!is24Hour && (
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={amPm === "AM" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAmPmToggle("AM")}
            >
              AM
            </Button>
            <Button
              variant={amPm === "PM" ? "default" : "outline"}
              size="sm"
              onClick={() => handleAmPmToggle("PM")}
            >
              PM
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            {mode === "hours"
              ? "Select hour, then minutes will auto-open"
              : "Select minutes in 5-minute increments"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircularTimePicker;
