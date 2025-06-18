import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTime } from "luxon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Clock,
  Share,
  Calendar,
  Settings,
  Plus,
  ArrowLeftRight,
  Sparkles,
  Grid,
  List,
  Copy,
  Code,
  Sun,
  Moon,
  Monitor,
  Palette,
  Zap,
  Timer,
  Globe,
  Star,
} from "lucide-react";

import { useTimeSyncStore } from "@/store/useTimeSyncStore";
import { cities, type City } from "@/data/cities";
import { cn } from "@/lib/utils";

import TimeCard from "./TimeCard";
import EnhancedCitySearch from "./EnhancedCitySearch";
import CircularTimePicker from "./CircularTimePicker";
import EmbedGenerator from "./EmbedGenerator";

interface ModernTimeSyncProps {
  className?: string;
}

const ModernTimeSync: React.FC<ModernTimeSyncProps> = ({ className }) => {
  const {
    sourceCity,
    targetCities,
    selectedDateTime,
    realTimeMode,
    show24Hour,
    showSeconds,
    compactView,
    theme,
    setSourceCity,
    addTargetCity,
    removeTargetCity,
    setSelectedDateTime,
    swapCities,
    pinnedCities,
    addPinnedCity,
    removePinnedCity,
    toggleRealTimeMode,
    toggle24Hour,
    toggleSeconds,
    setTheme,
    toggleCompactView,
  } = useTimeSyncStore();

  const [activeTab, setActiveTab] = useState<"converter" | "embed">(
    "converter"
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSettings, setShowSettings] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Initialize with user's timezone if needed
  useEffect(() => {
    if (!sourceCity) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const defaultCity =
        cities.find((city) => city.timezone === userTimezone) || cities[0];
      setSourceCity(defaultCity);
    }

    if (targetCities.length === 0) {
      const defaultTargets = [
        cities.find((city) => city.id === "london"),
        cities.find((city) => city.id === "new_york"),
        cities.find((city) => city.id === "tokyo"),
      ].filter(Boolean) as City[];

      defaultTargets.forEach((city) => addTargetCity(city));
    }
  }, []);

  const handleAddCity = (city: City) => {
    if (
      !targetCities.find((c) => c.id === city.id) &&
      sourceCity?.id !== city.id
    ) {
      addTargetCity(city);
      toast(`Added ${city.name} to comparison`);
    } else {
      toast(`${city.name} is already in your comparison`);
    }
  };

  const handleRemoveCity = (cityId: string) => {
    removeTargetCity(cityId);
    const city = targetCities.find((c) => c.id === cityId);
    if (city) {
      toast(`Removed ${city.name} from comparison`);
    }
  };

  const handleSwapCities = async () => {
    if (!sourceCity || targetCities.length === 0) return;

    setIsSwapping(true);

    // Animate swap
    await new Promise((resolve) => setTimeout(resolve, 300));

    const firstTarget = targetCities[0];
    removeTargetCity(firstTarget.id);
    addTargetCity(sourceCity);
    setSourceCity(firstTarget);

    setIsSwapping(false);
    toast("Cities swapped!");
  };

  const handleTimeChange = (time: { hours: number; minutes: number }) => {
    if (!sourceCity) return;

    const newDateTime = DateTime.now()
      .setZone(sourceCity.timezone)
      .set({ hour: time.hours, minute: time.minutes, second: 0 });

    setSelectedDateTime(newDateTime);
    toast("Reference time updated");
  };

  const handleCurrentTime = () => {
    setSelectedDateTime(DateTime.now());
    toast("Reset to current time");
  };

  const allCities = sourceCity ? [sourceCity, ...targetCities] : targetCities;
  const referenceTime = realTimeMode ? undefined : selectedDateTime;

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-background via-background to-muted/20",
        className
      )}
    >
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TimeSync
            </h1>
            <p className="text-muted-foreground mt-1">
              Beautiful time zone comparison and embeddable widgets
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  {theme === "light" && <Sun className="h-4 w-4" />}
                  {theme === "dark" && <Moon className="h-4 w-4" />}
                  {theme === "system" && <Monitor className="h-4 w-4" />}
                  Theme
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-2" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-2" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="h-4 w-4 mr-2" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Display Settings</DialogTitle>
                  <DialogDescription>
                    Customize how time information is displayed
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>24-hour format</Label>
                    <Switch
                      checked={show24Hour}
                      onCheckedChange={toggle24Hour}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Show seconds</Label>
                    <Switch
                      checked={showSeconds}
                      onCheckedChange={toggleSeconds}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Real-time mode</Label>
                    <Switch
                      checked={realTimeMode}
                      onCheckedChange={toggleRealTimeMode}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Compact view</Label>
                    <Switch
                      checked={compactView}
                      onCheckedChange={toggleCompactView}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab as any}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger
              value="converter"
              className="flex items-center space-x-2"
            >
              <Clock className="h-4 w-4" />
              <span>Time Converter</span>
            </TabsTrigger>
            <TabsTrigger value="embed" className="flex items-center space-x-2">
              <Code className="h-4 w-4" />
              <span>Embed Widget</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="mt-8 space-y-8">
            {/* Source City Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="card-modern">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Source City</span>
                    {!realTimeMode && (
                      <Badge variant="outline" className="ml-auto">
                        <Timer className="h-3 w-3 mr-1" />
                        Reference Mode
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <EnhancedCitySearch
                      placeholder="Select source city..."
                      value={sourceCity}
                      onSelect={setSourceCity}
                      pinnedCities={pinnedCities}
                    />

                    <div className="flex space-x-2">
                      {!realTimeMode && (
                        <Dialog
                          open={showTimePicker}
                          onOpenChange={setShowTimePicker}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" className="flex-1">
                              <Clock className="h-4 w-4 mr-2" />
                              Set Time
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Select Reference Time</DialogTitle>
                            </DialogHeader>
                            <CircularTimePicker
                              value={{
                                hours: selectedDateTime?.hour || 12,
                                minutes: selectedDateTime?.minute || 0,
                              }}
                              onChange={handleTimeChange}
                              is24Hour={show24Hour}
                              onToggle24Hour={toggle24Hour}
                            />
                          </DialogContent>
                        </Dialog>
                      )}

                      <Button
                        variant="outline"
                        onClick={handleCurrentTime}
                        disabled={realTimeMode}
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Now
                      </Button>
                    </div>
                  </div>

                  {sourceCity && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TimeCard
                        city={sourceCity}
                        referenceTime={referenceTime}
                        is24Hour={show24Hour}
                        showSeconds={showSeconds}
                        isPinned={pinnedCities.some(
                          (p) => p.id === sourceCity.id
                        )}
                        onPin={() => addPinnedCity(sourceCity)}
                        onUnpin={() => removePinnedCity(sourceCity.id)}
                        isSource
                        className="max-w-md mx-auto"
                      />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Target Cities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="card-modern">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="h-5 w-5" />
                      <span>Compare Cities</span>
                      <Badge variant="secondary">{targetCities.length}</Badge>
                    </CardTitle>

                    <div className="flex items-center space-x-2">
                      {/* View Mode Toggle */}
                      <div className="flex rounded-lg border p-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="h-8 px-3"
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="h-8 px-3"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Swap Cities */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSwapCities}
                        disabled={
                          !sourceCity || targetCities.length === 0 || isSwapping
                        }
                        className="gap-2"
                      >
                        <motion.div
                          animate={{ rotate: isSwapping ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ArrowLeftRight className="h-4 w-4" />
                        </motion.div>
                        Swap
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Add City Search */}
                    <EnhancedCitySearch
                      placeholder="Add a city to compare..."
                      onSelect={handleAddCity}
                      pinnedCities={pinnedCities}
                    />

                    {/* Cities Grid */}
                    <AnimatePresence mode="popLayout">
                      {targetCities.length > 0 ? (
                        <motion.div
                          className={cn(
                            "gap-6",
                            viewMode === "grid"
                              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                              : "flex flex-col space-y-4"
                          )}
                          layout
                        >
                          {targetCities.map((city, index) => (
                            <motion.div
                              key={city.id}
                              layout
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                              }}
                            >
                              <TimeCard
                                city={city}
                                referenceTime={referenceTime}
                                is24Hour={show24Hour}
                                showSeconds={showSeconds}
                                isPinned={pinnedCities.some(
                                  (p) => p.id === city.id
                                )}
                                onRemove={() => handleRemoveCity(city.id)}
                                onPin={() => addPinnedCity(city)}
                                onUnpin={() => removePinnedCity(city.id)}
                              />
                            </motion.div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          className="text-center py-12 text-muted-foreground"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium">
                            No cities to compare
                          </p>
                          <p className="text-sm">
                            Add cities above to start comparing time zones
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="embed" className="mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <EmbedGenerator
                initialCities={allCities}
                referenceTime={referenceTime}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ModernTimeSync;
