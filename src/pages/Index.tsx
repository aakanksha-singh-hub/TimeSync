import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowLeftRight, Copy, Clock, CalendarDays, Cloud } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading";

const timeZones = [
  { value: "America/New_York", label: "New York", abbr: "EST/EDT" },
  { value: "America/Los_Angeles", label: "Los Angeles", abbr: "PST/PDT" },
  { value: "America/Chicago", label: "Chicago", abbr: "CST/CDT" },
  { value: "Europe/London", label: "London", abbr: "GMT/BST" },
  { value: "Europe/Paris", label: "Paris", abbr: "CET/CEST" },
  { value: "Europe/Berlin", label: "Berlin", abbr: "CET/CEST" },
  { value: "Asia/Tokyo", label: "Tokyo", abbr: "JST" },
  { value: "Asia/Shanghai", label: "Shanghai", abbr: "CST" },
  { value: "Asia/Kolkata", label: "Mumbai", abbr: "IST" },
  { value: "Asia/Dubai", label: "Dubai", abbr: "GST" },
  { value: "Australia/Sydney", label: "Sydney", abbr: "AEDT/AEST" },
  { value: "Pacific/Auckland", label: "Auckland", abbr: "NZDT/NZST" },
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fromZone, setFromZone] = useState("America/New_York");
  const [toZone, setToZone] = useState("Europe/London");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [convertedTime, setConvertedTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const convertTime = () => {
    try {
      const dateTimeString = `${format(selectedDate, "yyyy-MM-dd")} ${selectedTime}`;
      const inputDate = parse(dateTimeString, "yyyy-MM-dd HH:mm", new Date());
      
      const now = new Date();
      const fromOffset = new Date(now.toLocaleString("en-US", {timeZone: fromZone})).getTime() - new Date(now.toLocaleString("en-US", {timeZone: "UTC"})).getTime();
      const toOffset = new Date(now.toLocaleString("en-US", {timeZone: toZone})).getTime() - new Date(now.toLocaleString("en-US", {timeZone: "UTC"})).getTime();
      
      const offsetDiff = toOffset - fromOffset;
      const convertedDate = new Date(inputDate.getTime() + offsetDiff);
      
      const toFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        weekday: 'long'
      });
      
      setConvertedTime(toFormatter.format(convertedDate));
    } catch (error) {
      console.log("Conversion error:", error);
      setConvertedTime("Invalid time");
    }
  };

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      convertTime();
    }
  }, [fromZone, toZone, selectedDate, selectedTime, isLoading]);

  const useCurrentTime = () => {
    const now = new Date();
    setSelectedDate(now);
    setSelectedTime(format(now, "HH:mm"));
  };

  const swapTimeZones = () => {
    const temp = fromZone;
    setFromZone(toZone);
    setToZone(temp);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedTime);
    toast({
      title: "Copied",
      description: "Time copied to clipboard",
    });
  };

  const getTimeZoneDisplay = (value: string) => {
    const zone = timeZones.find(z => z.value === value);
    return zone ? `${zone.label} (${zone.abbr})` : value;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 relative overflow-hidden">
      {/* Flowing animated clouds background */}
      <div className="absolute inset-0 opacity-8 pointer-events-none">
        <Cloud 
          className="absolute top-10 left-1/4 w-40 h-40 text-blue-100 animate-pulse" 
          style={{ 
            animationDelay: '0s', 
            animationDuration: '8s',
            transform: 'translateX(-50px)',
            filter: 'blur(1px)'
          }} 
        />
        <Cloud 
          className="absolute top-1/6 right-1/5 w-32 h-32 text-indigo-100 animate-pulse" 
          style={{ 
            animationDelay: '3s', 
            animationDuration: '10s',
            transform: 'translateX(30px)',
            filter: 'blur(0.5px)'
          }} 
        />
        <Cloud 
          className="absolute top-1/3 left-1/6 w-36 h-36 text-slate-200 animate-pulse" 
          style={{ 
            animationDelay: '1.5s', 
            animationDuration: '12s',
            transform: 'translateY(-20px)',
            filter: 'blur(1.5px)'
          }} 
        />
        <Cloud 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 text-blue-50 animate-pulse" 
          style={{ 
            animationDelay: '4s', 
            animationDuration: '9s',
            transform: 'translateX(-80px)',
            filter: 'blur(2px)'
          }} 
        />
        <Cloud 
          className="absolute bottom-1/3 left-1/3 w-28 h-28 text-indigo-50 animate-pulse" 
          style={{ 
            animationDelay: '2s', 
            animationDuration: '11s',
            transform: 'translateY(40px)',
            filter: 'blur(0.8px)'
          }} 
        />
        <Cloud 
          className="absolute top-2/3 right-1/6 w-20 h-20 text-slate-100 animate-pulse" 
          style={{ 
            animationDelay: '5s', 
            animationDuration: '7s',
            transform: 'translateX(60px)',
            filter: 'blur(1.2px)'
          }} 
        />
      </div>

      {/* Minimalist Header */}
      <div className="relative z-10 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-thin text-slate-800 mb-3 tracking-wide">
          TimeSync
        </h1>
        <div className="w-12 h-px bg-slate-300 mx-auto mb-4"></div>
        <p className="text-slate-500 text-sm font-light tracking-wide uppercase">
          Convert Across Time Zones
        </p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12 max-w-4xl relative z-10">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* From Section */}
              <div className="space-y-6">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-4 block">
                    From
                  </Label>
                  <Select value={fromZone} onValueChange={setFromZone}>
                    <SelectTrigger className="h-14 text-base border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeZones.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{zone.label}</span>
                            <span className="text-xs text-slate-500 ml-2">{zone.abbr}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-3 block">
                      Date
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full h-14 justify-start text-left font-normal border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                        >
                          <CalendarDays className="mr-3 h-4 w-4 text-slate-400" />
                          {format(selectedDate, "MMM dd")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            if (date) {
                              setSelectedDate(date);
                              setIsCalendarOpen(false);
                            }
                          }}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-3 block">
                      Time
                    </Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="h-14 text-base border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>

                <Button
                  onClick={useCurrentTime}
                  variant="outline"
                  className="w-full h-12 border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Use Current Time
                </Button>
              </div>

              {/* To Section */}
              <div className="space-y-6">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-4 block">
                    To
                  </Label>
                  <Select value={toZone} onValueChange={setToZone}>
                    <SelectTrigger className="h-14 text-base border-slate-200 bg-slate-50 hover:bg-white transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeZones.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>
                          <div className="flex justify-between items-center w-full">
                            <span className="font-medium">{zone.label}</span>
                            <span className="text-xs text-slate-500 ml-2">{zone.abbr}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Converted Time Display */}
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-3 block">
                    Converted Time
                  </Label>
                  <div className="text-2xl font-light text-slate-900 mb-4 leading-tight">
                    {convertedTime || "Select time to convert"}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="w-full border-slate-300 text-slate-600 hover:bg-white transition-colors"
                    disabled={!convertedTime}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mt-8 pt-8 border-t border-slate-200">
              <Button
                onClick={swapTimeZones}
                variant="outline"
                size="lg"
                className="rounded-full w-14 h-14 border-slate-300 hover:bg-slate-50 transition-all duration-200"
              >
                <ArrowLeftRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
