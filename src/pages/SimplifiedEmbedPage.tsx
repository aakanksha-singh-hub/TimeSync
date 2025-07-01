import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { DateTime } from "luxon";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin } from "lucide-react";
import { cities, type City } from "@/data/cities";

const SimplifiedEmbedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  
  // Parse URL parameters
  const citiesParam = searchParams.get('cities') || 'New York,London';
  const theme = searchParams.get('theme') || 'auto';
  const size = searchParams.get('size') || 'medium';
  const customTime = searchParams.get('time');
  const show24Hour = searchParams.get('show24Hour') === 'true';
  
  // Parse cities from parameter
  const cityNames = citiesParam.split(',').map(name => name.trim());
  const selectedCities = cityNames
    .map(name => cities.find(city => 
      city.name.toLowerCase() === name.toLowerCase() ||
      city.id === name.toLowerCase().replace(/\s+/g, '-')
    ))
    .filter(Boolean) as City[];

  // Use custom time if provided, otherwise current time
  const baseTime = customTime ? DateTime.fromISO(customTime) : currentTime;

  // Size configurations
  const sizeConfig = {
    small: { width: '300px', height: '180px', maxCities: 2 },
    medium: { width: '500px', height: '250px', maxCities: 4 },
    large: { width: '700px', height: '350px', maxCities: 6 }
  };

  const config = sizeConfig[size as keyof typeof sizeConfig] || sizeConfig.medium;
  const displayCities = selectedCities.slice(0, config.maxCities);

  // Format time based on preferences - always show seconds for accuracy
  const formatTime = (dateTime: DateTime) => {
    const format = show24Hour ? "HH:mm:ss" : "h:mm:ss a";
    return dateTime.toFormat(format);
  };

  // Real-time updates - always update every second for accuracy
  useEffect(() => {
    if (customTime) return; // Don't update if custom time is set
    
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [customTime]);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    }
    // 'auto' uses system preference (default)
  }, [theme]);

  return (
    <div 
      className="p-4 bg-background text-foreground"
      style={{ 
        width: config.width, 
        height: config.height,
        fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem'
      }}
    >
      <div className="h-full overflow-hidden">
        {displayCities.length === 0 ? (
          <Card className="h-full">
            <CardContent className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No cities found</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-3 h-full ${
            displayCities.length === 1 ? 'grid-cols-1' :
            displayCities.length <= 2 ? 'grid-cols-1' :
            displayCities.length <= 4 ? 'grid-cols-2' :
            'grid-cols-3'
          }`}>
            {displayCities.map((city) => {
              const cityTime = baseTime.setZone(city.timezone);
              return (
                <Card key={city.id} className="relative overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{city.flag}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {city.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {city.country}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {city.countryCode}
                      </Badge>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-xl font-mono font-bold mb-1">
                        {formatTime(cityTime)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cityTime.toFormat("ccc, MMM d")}
                      </div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {cityTime.toFormat("ZZZZ")}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        
        {/* Branding */}
        <div className="absolute bottom-1 right-2 opacity-50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>TimeSync</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedEmbedPage;
