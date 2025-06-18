import React, { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckIcon,
  ChevronDownIcon,
  SearchIcon,
  MapPinIcon,
} from "lucide-react";
import { City, findCitiesByQuery, getCitiesByContinent } from "@/data/cities";
import { cn } from "@/lib/utils";
import Fuse from "fuse.js";

interface CitySearchProps {
  value?: City | null;
  onChange: (city: City | null) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const CitySearch: React.FC<CitySearchProps> = ({
  value,
  onChange,
  placeholder = "Search cities worldwide...",
  className,
  label,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(findCitiesByQuery(""), {
    keys: [
      { name: "name", weight: 2 },
      { name: "country", weight: 1.5 },
      { name: "countryCode", weight: 1 },
      { name: "aliases", weight: 1.5 },
      { name: "timezone", weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
  });

  // Update filtered cities based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCities(findCitiesByQuery("").slice(0, 20));
      return;
    }

    const results = fuse.search(searchQuery);
    setFilteredCities(results.map((result) => result.item).slice(0, 20));
    setHighlightedIndex(0);
  }, [searchQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCities.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (filteredCities[highlightedIndex]) {
          handleCitySelect(filteredCities[highlightedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleCitySelect = (city: City) => {
    onChange(city);
    setOpen(false);
    setSearchQuery("");
  };

  const groupedCities = filteredCities.reduce((acc, city) => {
    if (!acc[city.continent]) {
      acc[city.continent] = [];
    }
    acc[city.continent].push(city);
    return acc;
  }, {} as Record<string, City[]>);

  const getDisplayValue = () => {
    if (value) {
      return (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base">{value.flag}</span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{value.name}</div>
            <div className="text-xs text-muted-foreground truncate">
              {value.country}
            </div>
          </div>
          <Badge variant="secondary" className="text-xs font-mono">
            {value.countryCode}
          </Badge>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <SearchIcon className="h-4 w-4" />
        <span className="text-sm">{placeholder}</span>
      </div>
    );
  };

  const formatTimeOffset = (timezone: string) => {
    try {
      const now = new Date();
      const offset = new Intl.DateTimeFormat("en", {
        timeZone: timezone,
        timeZoneName: "longOffset",
      })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value;
      return offset || "";
    } catch {
      return "";
    }
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "justify-between h-auto min-h-[3rem] p-3 hover:bg-accent/50 transition-colors",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
            onClick={() => !disabled && setOpen(true)}
          >
            {getDisplayValue()}
            <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          side="bottom"
        >
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder="Type to search cities..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              onKeyDown={handleKeyDown}
            />
            <CommandList className="max-h-[300px] overflow-y-auto">
              {filteredCities.length === 0 ? (
                <CommandEmpty className="py-6 text-center text-sm">
                  <MapPinIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  No cities found.
                  <div className="text-xs text-muted-foreground mt-1">
                    Try searching by city name, country, or timezone
                  </div>
                </CommandEmpty>
              ) : (
                Object.entries(groupedCities).map(([continent, cities]) => (
                  <CommandGroup key={continent} heading={continent}>
                    {cities.map((city, index) => {
                      const globalIndex = filteredCities.indexOf(city);
                      const isHighlighted = globalIndex === highlightedIndex;
                      return (
                        <CommandItem
                          key={city.id}
                          value={city.id}
                          onSelect={() => handleCitySelect(city)}
                          className={cn(
                            "flex items-center justify-between p-3 cursor-pointer",
                            isHighlighted && "bg-accent"
                          )}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-lg flex-shrink-0">
                              {city.flag}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {city.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {city.country} •{" "}
                                {formatTimeOffset(city.timezone)}
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs font-mono"
                            >
                              {city.countryCode}
                            </Badge>
                          </div>
                          {value?.id === city.id && (
                            <CheckIcon className="h-4 w-4 ml-2 flex-shrink-0" />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CitySearch;
