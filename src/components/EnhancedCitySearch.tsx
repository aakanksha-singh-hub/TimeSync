import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Clock,
  MapPin,
  Zap,
  Star,
  Globe,
  ChevronDown,
} from "lucide-react";
import { DateTime } from "luxon";
import Fuse from "fuse.js";
import { cn } from "@/lib/utils";
import { cities, type City } from "@/data/cities";

interface EnhancedCitySearchProps {
  placeholder?: string;
  value?: City;
  onSelect: (city: City) => void;
  className?: string;
  disabled?: boolean;
  pinnedCities?: City[];
  recentCities?: string[];
}

const EnhancedCitySearch: React.FC<EnhancedCitySearchProps> = ({
  placeholder = "Search cities...",
  value,
  onSelect,
  className,
  disabled = false,
  pinnedCities = [],
  recentCities = [],
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Initialize Fuse for fuzzy search
  const fuse = new Fuse(cities, {
    keys: [
      { name: "name", weight: 0.6 },
      { name: "country", weight: 0.3 },
      { name: "timezone", weight: 0.1 },
    ],
    threshold: 0.3,
    includeScore: true,
    shouldSort: true,
  });

  // Get UTC offset display
  const getUtcOffset = (city: City) => {
    const time = DateTime.now().setZone(city.timezone);
    const offset = time.offset / 60;
    const sign = offset >= 0 ? "+" : "";
    return `UTC${sign}${offset}`;
  };

  // Get timezone abbreviation
  const getTimezoneAbbr = (city: City) => {
    const time = DateTime.now().setZone(city.timezone);
    return time.toFormat("ZZZZ");
  };

  // Search cities with fuzzy matching
  const searchCities = (query: string): City[] => {
    if (!query) {
      const pinnedCityObjects = pinnedCities || [];
      const recentCityObjects = cities.filter(
        (city) =>
          recentCities.includes(city.id) &&
          !pinnedCities?.some((p) => p.id === city.id)
      );
      const popularCities = cities.filter(
        (city) =>
          [
            "london",
            "new_york",
            "tokyo",
            "paris",
            "sydney",
            "dubai",
            "singapore",
            "los_angeles",
          ].includes(city.id) &&
          !pinnedCities?.some((p) => p.id === city.id) &&
          !recentCities.includes(city.id)
      );

      return [
        ...pinnedCityObjects,
        ...recentCityObjects,
        ...popularCities.slice(0, 8),
      ];
    }

    const results = fuse.search(query);
    return results.map((result) => result.item).slice(0, 10);
  };

  const filteredCities = searchCities(search);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 px-4 text-left font-normal hover:bg-accent/50",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {value ? (
              <>
                <span
                  className="text-xl flex-shrink-0"
                  role="img"
                  aria-label={value.country}
                >
                  {value.flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">
                    {value.name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {value.country} • {getTimezoneAbbr(value)}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate">{placeholder}</span>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <CommandInput
              placeholder="Search cities..."
              value={search}
              onValueChange={setSearch}
              className="pl-10"
            />
          </div>

          <CommandList>
            <ScrollArea className="h-[300px]">
              <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                <div className="flex flex-col items-center space-y-2">
                  <Globe className="h-8 w-8 text-muted-foreground/50" />
                  <p>No cities found.</p>
                </div>
              </CommandEmpty>

              {filteredCities.map((city) => {
                const isPinned =
                  pinnedCities?.some((p) => p.id === city.id) || false;
                const isRecent = recentCities.includes(city.id);
                const currentTime = DateTime.now().setZone(city.timezone);

                return (
                  <CommandItem
                    key={city.id}
                    value={city.id}
                    onSelect={() => {
                      onSelect(city);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span
                        className="text-2xl flex-shrink-0"
                        role="img"
                        aria-label={city.country}
                      >
                        {city.flag}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground truncate">
                            {city.name}
                          </span>
                          {isPinned && (
                            <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                          )}
                          {isRecent && !isPinned && (
                            <Clock className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            {city.country}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getTimezoneAbbr(city)}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-1 flex-shrink-0 ml-3">
                      <span className="text-sm font-mono font-medium">
                        {currentTime.toFormat("HH:mm")}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getUtcOffset(city)}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default EnhancedCitySearch;
