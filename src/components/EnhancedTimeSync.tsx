import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  Home,
  Code,
  Clock,
  Globe,
  Sparkles,
  Calendar,
  Download,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { cities, type City } from "@/data/cities";
import CitySearch from "./CitySearch";
import EnhancedDateTimePicker from "./EnhancedDateTimePicker";

interface ConversionResult {
  sourceCity: City;
  targetCity: City;
  sourceTime: DateTime;
  targetTime: DateTime;
}

const EnhancedTimeSync: React.FC = () => {
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

  const handleSwapCities = () => {
    const temp = sourceCity;
    setSourceCity(targetCity);
    setTargetCity(temp);
  };

  const generateCalendarEvent = (
    title: string,
    startTime: DateTime,
    endTime: DateTime
  ) => {
    const formatDate = (date: DateTime) => {
      return date.toFormat("yyyyMMdd'T'HHmmss'Z'");
    };

    const eventData = {
      title: encodeURIComponent(title),
      start: formatDate(startTime.toUTC()),
      end: formatDate(endTime.toUTC()),
      details: encodeURIComponent(
        `Meeting scheduled across timezones:\n${sourceCity.name}: ${startTime
          .setZone(sourceCity.timezone)
          .toFormat("h:mm a, cccc")}\n${targetCity.name}: ${endTime
          .setZone(targetCity.timezone)
          .toFormat("h:mm a, cccc")}`
      ),
      location: encodeURIComponent(`${sourceCity.name} & ${targetCity.name}`),
    };

    return eventData;
  };

  const exportToGoogleCalendar = () => {
    const startTime = conversion.sourceTime;
    const endTime = startTime.plus({ hours: 1 }); // 1-hour meeting
    const event = generateCalendarEvent(
      `Meeting: ${sourceCity.name} & ${targetCity.name}`,
      startTime,
      endTime
    );

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.title}&dates=${event.start}/${event.end}&details=${event.details}&location=${event.location}`;
    window.open(googleUrl, "_blank");
  };

  const downloadICSFile = () => {
    const startTime = conversion.sourceTime;
    const endTime = startTime.plus({ hours: 1 });

    const formatICSDate = (date: DateTime) =>
      date.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TimeSync//TimeSync App//EN
BEGIN:VEVENT
UID:timesync-${Date.now()}@timesync.app
DTSTAMP:${formatICSDate(DateTime.now())}
DTSTART:${formatICSDate(startTime)}
DTEND:${formatICSDate(endTime)}
SUMMARY:Meeting: ${sourceCity.name} & ${targetCity.name}
DESCRIPTION:Meeting scheduled across timezones:\\n${
      sourceCity.name
    }: ${startTime.setZone(sourceCity.timezone).toFormat("h:mm a, cccc")}\\n${
      targetCity.name
    }: ${startTime.setZone(targetCity.timezone).toFormat("h:mm a, cccc")}
LOCATION:${sourceCity.name} & ${targetCity.name}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `meeting-${sourceCity.name}-${targetCity.name}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const conversion = getConversion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2 text-2xl font-bold">
                <Home className="h-10 w-10" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">
                Time Converter
              </h1>
            </div>
          </div>
          <Link to="/embed-generator">
            <Button className="gap-2">
              <Code className="h-4 w-4" />
              Generate Embed
            </Button>
          </Link>
        </motion.div>

        {/* Main Converter */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 relative h-full"
          >
            {/* FROM Section */}
            <Card className="relative overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  FROM
                </CardTitle>
                {/* Compact time toggle and picker */}
                <div className="flex flex-col gap-1 mt-2">
                  <label className="font-normal text-xs flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useCurrentTime}
                      onChange={e => setUseCurrentTime(e.target.checked)}
                      className="accent-primary scale-90"
                    />
                    Use current time
                  </label>
                  {!useCurrentTime && (
                    <EnhancedDateTimePicker
                      value={customDateTime}
                      onChange={setCustomDateTime}
                      timezone={sourceCity.timezone}
                      is24HourFormat={true}
                      label={undefined}
                      className="p-2 text-xs"
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <CitySearch
                  value={sourceCity}
                  onChange={(city) => city && setSourceCity(city)}
                  placeholder="Select source city..."
                  label="Source City"
                />

                {sourceCity && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-3 py-4"
                  >
                    <div className="text-4xl">{sourceCity.flag}</div>
                    <div>
                      <h3 className="font-bold text-xl">{sourceCity.name}</h3>
                      <p className="text-muted-foreground">
                        {sourceCity.country}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-mono font-bold">
                        {conversion.sourceTime.toFormat("HH:mm:ss")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {conversion.sourceTime.toFormat("cccc, LLLL d, yyyy")}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {conversion.sourceTime.toFormat("ZZZZ")}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Swap Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 md:block hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwapCities}
                className="rounded-full bg-background shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Swap Button */}
            <div className="md:hidden flex justify-center -my-3 relative z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapCities}
                className="gap-2 bg-background shadow-lg"
              >
                <ArrowUpDown className="h-4 w-4" />
                Swap
              </Button>
            </div>

            {/* TO Section */}
            <Card className="relative overflow-hidden h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  TO
                </CardTitle>
                {/* Spacer to align with FROM card's toggle */}
                <div style={{ height: '28px' }} />
              </CardHeader>
              <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                <CitySearch
                  value={targetCity}
                  onChange={(city) => city && setTargetCity(city)}
                  placeholder="Select target city..."
                  label="Target City"
                />

                {targetCity && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-3 py-4"
                  >
                    <div className="text-4xl">{targetCity.flag}</div>
                    <div>
                      <h3 className="font-bold text-xl">{targetCity.name}</h3>
                      <p className="text-muted-foreground">
                        {targetCity.country}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="text-3xl font-mono font-bold text-primary">
                        {conversion.targetTime.toFormat("HH:mm:ss")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {conversion.targetTime.toFormat("cccc, LLLL d, yyyy")}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {conversion.targetTime.toFormat("ZZZZ")}
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Difference */}
          {sourceCity && targetCity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Sparkles className="h-3 w-3" />
                      Time Difference Analysis
                    </div>

                    {(() => {
                      // Calculate timezone offset difference in minutes
                      const sourceOffset = conversion.sourceTime.offset;
                      const targetOffset = conversion.targetTime.offset;
                      const offsetDiffMinutes = targetOffset - sourceOffset;
                      const offsetDiffHours = offsetDiffMinutes / 60;

                      // Calculate if target is ahead or behind
                      const isAhead = offsetDiffMinutes > 0;
                      const absDiffHours = Math.abs(offsetDiffHours);
                      const wholeHours = Math.floor(absDiffHours);
                      const remainingMinutes = Math.round(
                        (absDiffHours - wholeHours) * 60
                      );

                      // Check if dates are different and determine day relationship
                      const sourceDate = conversion.sourceTime.startOf("day");
                      const targetDate = conversion.targetTime.startOf("day");
                      const dayDiff = targetDate.diff(sourceDate, "days").days;
                      const isDifferentDay = Math.abs(dayDiff) >= 1;

                      // Determine if target is ahead or behind in terms of days
                      let dayRelationship = null;
                      if (isDifferentDay) {
                        if (dayDiff > 0) {
                          dayRelationship = `${targetCity.name} is 1 day ahead`;
                        } else if (dayDiff < 0) {
                          dayRelationship = `${targetCity.name} is 1 day behind`;
                        }
                      }

                      // Format the time difference display
                      let timeDiffDisplay = "";
                      if (offsetDiffMinutes === 0) {
                        timeDiffDisplay = "Same timezone";
                      } else {
                        const sign = isAhead ? "+" : "-";
                        if (remainingMinutes > 0) {
                          timeDiffDisplay = `${sign}${wholeHours}h ${remainingMinutes}m`;
                        } else {
                          timeDiffDisplay = `${sign}${wholeHours}h`;
                        }
                      }

                      return (
                        <div className="space-y-2">
                          {/* Main time difference */}
                          <div className="text-xl font-bold">
                            {timeDiffDisplay}
                          </div>

                          {/* Ahead/Behind indicator and Date difference in same row */}
                          <div className="flex flex-col items-center gap-1">
                            {offsetDiffMinutes !== 0 && (
                              <Badge
                                variant={isAhead ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {targetCity.name} is{" "}
                                {isAhead ? "ahead" : "behind"}
                              </Badge>
                            )}

                            {isDifferentDay && dayRelationship && (
                              <div className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs">
                                {dayRelationship}
                              </div>
                            )}
                          </div>

                          {/* Compact timezone info */}
                          <div className="text-xs text-muted-foreground">
                            <div className="flex justify-center items-center gap-2 flex-wrap">
                              <span className="truncate">
                                {sourceCity.name}:{" "}
                                {conversion.sourceTime.toFormat("ZZZZZ")}
                              </span>
                              <span>→</span>
                              <span className="truncate">
                                {targetCity.name}:{" "}
                                {conversion.targetTime.toFormat("ZZZZZ")}
                              </span>
                            </div>
                            {offsetDiffMinutes !== 0 && (
                              <div className="text-center mt-1 text-xs">
                                {conversion.sourceTime.toFormat("h:mm a")} in{" "}
                                {sourceCity.name} ={" "}
                                {conversion.targetTime.toFormat("h:mm a")} in{" "}
                                {targetCity.name}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Calendar Export Section */}
          {sourceCity && targetCity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                <CardContent className="pt-4 pb-4">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-3 w-3" />
                      Schedule Meeting Across Timezones
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                      <Button
                        onClick={exportToGoogleCalendar}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Add to Google Calendar
                      </Button>

                      <Button
                        onClick={downloadICSFile}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download .ics File
                      </Button>

                      <Button
                        variant="ghost"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <Link to="/embed-generator">
                          <Share2 className="h-4 w-4" />
                          Create Widget
                        </Link>
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Creates a 1-hour meeting starting at the current time in
                      both locations
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedTimeSync;
