import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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

  const [localDate, setLocalDate] = useState(() => {
    const now = new Date();
    now.setHours(value.hours, value.minutes, 0, 0);
    return now;
  });

  useEffect(() => {
    // Sync localDate when value changes from outside
    const newDate = new Date(localDate);
    newDate.setHours(value.hours, value.minutes, 0, 0);
    setLocalDate(newDate);
    // eslint-disable-next-line
  }, [value.hours, value.minutes]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value + 'T' + formatTime());
    setLocalDate(newDate);
    onChange({ hours: newDate.getHours(), minutes: newDate.getMinutes() });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(localDate);
    newDate.setHours(hours, minutes, 0, 0);
    setLocalDate(newDate);
    onChange({ hours, minutes });
  };

  const formatDate = () => {
    return localDate.toISOString().slice(0, 10);
  };

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <span>Set Date & Time</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formatDate()}
              onChange={handleDateChange}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={formatTime()}
              onChange={handleTimeChange}
              className="mt-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CircularTimePicker;
