import { useState, useEffect, useRef } from "react";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const timeZones = [
  // Americas
  { value: "America/New_York", label: "New York", abbr: "ET", continent: "Americas" },
  { value: "America/Chicago", label: "Chicago", abbr: "CT", continent: "Americas" },
  { value: "America/Denver", label: "Denver", abbr: "MT", continent: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles", abbr: "PT", continent: "Americas" },
  { value: "America/Caracas", label: "Caracas", abbr: "VET", continent: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", abbr: "ART", continent: "Americas" },
  { value: "Pacific/Honolulu", label: "Honolulu", abbr: "HST", continent: "Americas" },

  // Europe & Africa
  { value: "Europe/London", label: "London", abbr: "GMT", continent: "Europe" },
  { value: "Europe/Berlin", label: "Berlin", abbr: "CET", continent: "Europe" },
  { value: "Europe/Cairo", label: "Cairo", abbr: "EET", continent: "Africa" },
  { value: "Atlantic/Azores", label: "Azores", abbr: "AZOT", continent: "Europe" },

  // Asia & Middle East
  { value: "Asia/Tokyo", label: "Tokyo", abbr: "JST", continent: "Asia" },
  { value: "Asia/Shanghai", label: "Singapore", abbr: "SGT", continent: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok", abbr: "ICT", continent: "Asia" },
  { value: "Asia/Yangon", label: "Yangon", abbr: "MMT", continent: "Asia" },
  { value: "Asia/Dhaka", label: "Dhaka", abbr: "BST", continent: "Asia" },
  { value: "Asia/Kathmandu", label: "Kathmandu", abbr: "NPT", continent: "Asia" },
  { value: "Asia/Kolkata", label: "Mumbai", abbr: "IST", continent: "Asia" },
  { value: "Asia/Tashkent", label: "Tashkent", abbr: "UZT", continent: "Asia" },
  { value: "Asia/Kabul", label: "Kabul", abbr: "AFT", continent: "Asia" },
  { value: "Asia/Dubai", label: "Dubai", abbr: "GST", continent: "Asia" },
  { value: "Asia/Tehran", label: "Tehran", abbr: "IRST", continent: "Asia" },
  { value: "Europe/Moscow", label: "Moscow", abbr: "MSK", continent: "Europe" },

  // Oceania
  { value: "Australia/Sydney", label: "Sydney", abbr: "AEST", continent: "Oceania" },
  { value: "Australia/Adelaide", label: "Adelaide", abbr: "ACST", continent: "Oceania" },
  { value: "Pacific/Auckland", label: "Auckland", abbr: "NZST", continent: "Oceania" },
  { value: "Pacific/Noumea", label: "Nouméa", abbr: "NCT", continent: "Oceania" },
  { value: "Pacific/Apia", label: "Apia", abbr: "SST", continent: "Oceania" },
  { value: "Pacific/Kiritimati", label: "Kiritimati", abbr: "LINT", continent: "Oceania" },
];

const Index = () => {
  console.log("Index component re-rendered");
  const [isLoading, setIsLoading] = useState(true);
  const [fromZone, setFromZone] = useState("America/New_York");
  const [toZone, setToZone] = useState("Europe/London");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("12:00");
  const [convertedTime, setConvertedTime] = useState("");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFromDropdownOpen, setIsFromDropdownOpen] = useState(false);
  const [isToDropdownOpen, setIsToDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [toSearchQuery, setToSearchQuery] = useState("");
  const toSearchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Group timezones by continent for display (no pre-filtering here)
  const displayedGroupedTimeZones = timeZones.reduce((acc, zone) => {
    if (!acc[zone.continent]) {
      acc[zone.continent] = [];
    }
    acc[zone.continent].push(zone);
    return acc;
  }, {} as Record<string, typeof timeZones>);

  // Get user's local timezone
  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFromZone(userTimeZone);
  }, []);

  const convertTime = () => {
    try {
      const dateTimeString = `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00`;
      
      // Create a Date object from the input string. 
      // By creating it in a specific timezone first, we get its correct UTC representation.
      const fromDateInFromZone = new Date(new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: fromZone
      }).format(new Date(dateTimeString)));

      // Now convert this UTC timestamp to the target timezone
      const displayFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: toZone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        weekday: 'long'
      });
      
      setConvertedTime(displayFormatter.format(fromDateInFromZone));
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
              <div className="space-y-6 min-w-0">
                <div>
                  <Label className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-4 block">
                    From
                  </Label>
                  <div className="space-y-2 flex flex-col w-full">
                    <Popover open={isFromDropdownOpen} onOpenChange={setIsFromDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Input
                          type="text"
                          placeholder="Search timezone..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            // Explicitly re-focus the input after state update
                            if (searchInputRef.current) {
                              searchInputRef.current.focus();
                            }
                          }}
                          onFocus={() => setIsFromDropdownOpen(true)} // Open dropdown on focus
                          className="mb-2 w-full min-w-0 flex-grow flex-shrink-0 max-w-none overflow-visible whitespace-normal"
                          ref={searchInputRef}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Search timezone..." className="h-9" value={searchQuery} onValueChange={setSearchQuery} />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {Object.entries(displayedGroupedTimeZones).map(([continent, zones]) => (
                              <CommandGroup key={continent} heading={continent}>
                                {zones.map((zone) => (
                                  <CommandItem
                                    key={zone.value}
                                    value={`${zone.label} ${zone.abbr} ${zone.continent} ${zone.value}`.toLowerCase()}
                                    onSelect={() => {
                                      setFromZone(zone.value);
                                      setIsFromDropdownOpen(false); // Close dropdown on select
                                      setSearchQuery(zone.label); // Set input to selected label
                                    }}
                                  >
                                    {zone.label} ({zone.abbr})
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
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
                  <div className="space-y-2 flex flex-col w-full">
                    <Popover open={isToDropdownOpen} onOpenChange={setIsToDropdownOpen}>
                      <PopoverTrigger asChild>
                        <Input
                          type="text"
                          placeholder="Search timezone..."
                          value={toSearchQuery}
                          onChange={(e) => {
                            setToSearchQuery(e.target.value);
                            if (toSearchInputRef.current) {
                              toSearchInputRef.current.focus();
                            }
                          }}
                          onFocus={() => setIsToDropdownOpen(true)}
                          className="mb-2 w-full min-w-0 flex-grow flex-shrink-0 max-w-none overflow-visible whitespace-normal"
                          ref={toSearchInputRef}
                        />
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput placeholder="Search timezone..." className="h-9" value={toSearchQuery} onValueChange={setToSearchQuery} />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            {Object.entries(displayedGroupedTimeZones).map(([continent, zones]) => (
                              <CommandGroup key={continent} heading={continent}>
                                {zones.map((zone) => (
                                  <CommandItem
                                    key={zone.value}
                                    value={`${zone.label} ${zone.abbr} ${zone.continent} ${zone.value}`.toLowerCase()}
                                    onSelect={() => {
                                      setToZone(zone.value);
                                      setIsToDropdownOpen(false);
                                      setToSearchQuery(zone.label);
                                    }}
                                  >
                                    {zone.label} ({zone.abbr})
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
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
