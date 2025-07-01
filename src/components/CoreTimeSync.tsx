import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import ThemeToggle from "./ThemeToggle";
import {
  ArrowUpDown,
  Clock,
  Code,
  Share2,
  ExternalLink,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cities, type City } from "@/data/cities";
import CitySearch from "./CitySearch";
import SimpleDateTimePicker from "./SimpleDateTimePicker";

interface ConversionResult {
  sourceCity: City;
  targetCity: City;
  sourceTime: DateTime;
  targetTime: DateTime;
}

const CoreTimeSync: React.FC = () => {
  const [sourceCity, setSourceCity] = useState<City>(
    cities.find((c) => c.id === "mumbai") || cities[0]
  );
  const [targetCity, setTargetCity] = useState<City>(
    cities.find((c) => c.id === "new-york") || cities[1]
  );
  const [useCurrentTime, setUseCurrentTime] = useState(true);
  const [customDateTime, setCustomDateTime] = useState(DateTime.now());

  const effectiveTime = useCurrentTime ? DateTime.now() : customDateTime;

  const getConversion = (): ConversionResult => {
    const sourceTime = effectiveTime.setZone(sourceCity.timezone);
    const targetTime = sourceTime.setZone(targetCity.timezone);

    return {
      sourceCity,
      targetCity,
      sourceTime,
      targetTime,
    };
  };

  const conversion = getConversion();

  const formatTime = (dateTime: DateTime) => {
    // Always show seconds in 24-hour format for universality
    const format = "HH:mm:ss";
    return dateTime.toFormat(format);
  };

  const formatDate = (dateTime: DateTime) => {
    return dateTime.toFormat("cccc, MMMM d, yyyy");
  };

  const getTimeDifference = () => {
    const diff = conversion.targetTime.offset - conversion.sourceTime.offset;
    const hours = Math.floor(Math.abs(diff) / 60);
    const minutes = Math.abs(diff) % 60;
    const sign = diff >= 0 ? "+" : "-";
    
    if (minutes === 0) {
      return `${sign}${hours}h`;
    }
    return `${sign}${hours}h ${minutes}m`;
  };

  const swapCities = () => {
    setSourceCity(targetCity);
    setTargetCity(sourceCity);
  };

  const generateEmbedUrl = () => {
    const params = new URLSearchParams({
      cities: `${sourceCity.name},${targetCity.name}`,
      theme: 'auto',
      size: 'medium',
      show24Hour: 'true',
    });
    
    if (!useCurrentTime) {
      params.set('time', customDateTime.toISO() || '');
    }
    
    return `${window.location.origin}/embed?${params.toString()}`;
  };

  const generateEmbedCode = () => {
    const url = generateEmbedUrl();
    return `<iframe
  src="${url}"
  width="500"
  height="250"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>`;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      // Simple success feedback without complex toast
      console.log('Embed code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy embed code:', error);
      // Fallback: show the code in an alert
      alert(generateEmbedCode());
    }
  };

  const shareUrl = () => {
    const url = generateEmbedUrl();
    if (navigator.share) {
      navigator.share({
        title: 'TimeSync Widget',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url).catch(() => {
        // Fallback: show URL in alert
        alert(`Widget URL: ${url}`);
      });
    }
  };

  // Real-time updates - always update every second for accuracy
  useEffect(() => {
    if (!useCurrentTime) return;
    
    const interval = setInterval(() => {
      // Force re-render for real-time updates
      setCustomDateTime(DateTime.now());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [useCurrentTime]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TimeSync</span>
            </Link>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button asChild variant="ghost" size="sm">
                <Link to="/" className="flex items-center space-x-2">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-4xl">{/* ...existing code... */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">World Clock & Time Converter</h1>
        <p className="text-muted-foreground">
          Convert time between cities and create embeddable widgets
        </p>
      </div>

      {/* Settings */}
      <div className="mb-6 flex justify-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="current-time"
            checked={useCurrentTime}
            onCheckedChange={setUseCurrentTime}
          />
          <label htmlFor="current-time" className="text-sm font-medium">
            Use current time
          </label>
        </div>
      </div>

      {/* Manual Date/Time Input */}
      {!useCurrentTime && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Clock className="h-5 w-5" />
                Custom Date & Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleDateTimePicker
                value={customDateTime}
                onChange={setCustomDateTime}
                timezone={sourceCity.timezone}
                is24HourFormat={true}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8 items-center">
        {/* Source City */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <span className="text-2xl">{sourceCity.flag}</span>
              FROM
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CitySearch
              value={sourceCity}
              onChange={(city) => city && setSourceCity(city)}
              label="Source City"
            />
            <div className="text-center py-6">
              <div className="text-5xl font-mono font-bold mb-3">
                {formatTime(conversion.sourceTime)}
              </div>
              <div className="text-lg text-muted-foreground mb-3">
                {formatDate(conversion.sourceTime)}
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {conversion.sourceTime.toFormat("ZZZZ")}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Swap Button & Time Difference */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4 py-8">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full shadow-md hover:shadow-lg transition-shadow"
            onClick={swapCities}
          >
            <ArrowUpDown className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Time Difference</div>
            <div className="font-mono font-bold text-lg">{getTimeDifference()}</div>
          </div>
        </div>

        {/* Target City */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              <span className="text-2xl">{targetCity.flag}</span>
              TO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CitySearch
              value={targetCity}
              onChange={(city) => city && setTargetCity(city)}
              label="Target City"
            />
            <div className="text-center py-6">
              <div className="text-5xl font-mono font-bold mb-3">
                {formatTime(conversion.targetTime)}
              </div>
              <div className="text-lg text-muted-foreground mb-3">
                {formatDate(conversion.targetTime)}
              </div>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {conversion.targetTime.toFormat("ZZZZ")}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget Generator - Only working features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Widget Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={copyEmbedCode}
            >
              <Code className="h-4 w-4 mr-2" />
              Copy Embed Code
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={shareUrl}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Widget URL
            </Button>
            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to={generateEmbedUrl()} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Widget
              </Link>
            </Button>
          </div>
          
          {/* Preview of embed code */}
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Embed code preview:</p>
            <code className="text-xs break-all">{generateEmbedCode()}</code>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default CoreTimeSync;
