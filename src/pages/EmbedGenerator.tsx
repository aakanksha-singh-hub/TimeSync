import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Code,
  Copy,
  Eye,
  Clock,
  Globe,
  Sparkles,
  Calendar,
  ExternalLink,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle,
  RefreshCw,
  Palette,
  Plus,
  X,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { cities } from "@/data/cities";
import type { City } from "@/data/cities";
import CitySearch from "@/components/CitySearch";
import CircularTimePicker from "@/components/CircularTimePicker";

interface EmbedConfig {
  targetCities: City[];
  referenceCity: City | null;
  customTime?: DateTime;
  useCurrentTime: boolean;
  theme: "light" | "dark";
  size: "small" | "medium" | "large" | "full-width";
}

const EmbedGeneratorPage: React.FC = () => {
  const [config, setConfig] = useState<EmbedConfig>({
    targetCities: [],
    referenceCity: null,
    customTime: DateTime.now(),
    useCurrentTime: true,
    theme: "light",
    size: "medium",
  });

  const [step, setStep] = useState<
    "cities" | "reference" | "time" | "customize" | "generate"
  >("cities");
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Size configurations
  const sizeConfigs = {
    small: {
      name: "Small",
      description: "Compact widget for sidebars",
      width: 300,
      height: 180,
      icon: Smartphone,
      maxCities: 2,
    },
    medium: {
      name: "Medium",
      description: "Perfect for blog posts",
      width: 500,
      height: 250,
      icon: Tablet,
      maxCities: 4,
    },
    large: {
      name: "Large",
      description: "Detailed view with more cities",
      width: 700,
      height: 350,
      icon: Monitor,
      maxCities: 6,
    },
    "full-width": {
      name: "Full Width",
      description: "Responsive full-width widget",
      width: "100%",
      height: 200,
      icon: Monitor,
      maxCities: 8,
    },
  };

  const updateConfig = <K extends keyof EmbedConfig>(
    key: K,
    value: EmbedConfig[K]
  ) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };

      // Adjust cities count based on size
      if (key === "size") {
        const sizeConfig = sizeConfigs[value as EmbedConfig["size"]];
        newConfig.targetCities = prev.targetCities.slice(
          0,
          sizeConfig.maxCities
        );
      }

      return newConfig;
    });

    // Force preview refresh
    setPreviewKey((prev) => prev + 1);
  };

  const addTargetCity = (city: City) => {
    if (config.targetCities.find((c) => c.id === city.id)) return;

    const maxCities = sizeConfigs[config.size].maxCities;
    if (config.targetCities.length < maxCities) {
      updateConfig("targetCities", [...config.targetCities, city]);
    } else {
      toast.error(
        `Maximum ${maxCities} cities allowed for ${
          sizeConfigs[config.size].name
        } size`
      );
    }
  };

  const removeTargetCity = (cityId: string) => {
    updateConfig(
      "targetCities",
      config.targetCities.filter((c) => c.id !== cityId)
    );
  };

  const generateEmbedUrl = () => {
    const params = new URLSearchParams({
      cities: config.targetCities
        .map((c) => c.name.replace(/\s+/g, "+"))
        .join(","),
      theme: config.theme,
      size: config.size,
    });

    if (config.referenceCity) {
      params.set("ref", config.referenceCity.name.replace(/\s+/g, "+"));
    }

    if (!config.useCurrentTime && config.customTime) {
      params.set("time", config.customTime.toISO());
    }

    return `${window.location.origin}/embed?${params.toString()}`;
  };

  const generateIframeCode = () => {
    const url = generateEmbedUrl();
    const sizeConfig = sizeConfigs[config.size];

    return `<iframe
  src="${url}"
  width="${sizeConfig.width === "100%" ? "100%" : sizeConfig.width}"
  height="${sizeConfig.height}"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="TimeSync World Clock Widget"
></iframe>`;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      setCopySuccess(true);
      toast.success("Embed code copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const canProceedToNext = () => {
    switch (step) {
      case "cities":
        return config.targetCities.length > 0;
      case "reference":
        return config.referenceCity !== null;
      case "time":
        return true;
      case "customize":
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    const steps = [
      "cities",
      "reference",
      "time",
      "customize",
      "generate",
    ] as const;
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps = [
      "cities",
      "reference",
      "time",
      "customize",
      "generate",
    ] as const;
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

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
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">
                Embed Generator
              </h1>
            </div>
          </div>
          <Badge variant="secondary" className="text-sm">
            Step{" "}
            {["cities", "reference", "time", "customize", "generate"].indexOf(
              step
            ) + 1}{" "}
            of 5
          </Badge>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Cities</span>
            <span>Reference</span>
            <span>Time</span>
            <span>Customize</span>
            <span>Generate</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ([
                    "cities",
                    "reference",
                    "time",
                    "customize",
                    "generate",
                  ].indexOf(step) +
                    1) *
                  20
                }%`,
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === "cities" && (
                    <>
                      <Globe className="h-5 w-5" />
                      Select Cities
                    </>
                  )}
                  {step === "reference" && (
                    <>
                      <Clock className="h-5 w-5" />
                      Reference City
                    </>
                  )}
                  {step === "time" && (
                    <>
                      <Calendar className="h-5 w-5" />
                      Time Selection
                    </>
                  )}
                  {step === "customize" && (
                    <>
                      <Palette className="h-5 w-5" />
                      Customize Widget
                    </>
                  )}
                  {step === "generate" && (
                    <>
                      <Code className="h-5 w-5" />
                      Generate Code
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Select Cities */}
                {step === "cities" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Choose the cities you want to display in your widget
                    </p>

                    <CitySearch
                      value={null}
                      onChange={(city) => city && addTargetCity(city)}
                      placeholder="Search and add cities..."
                      label="Add Cities"
                    />

                    {config.targetCities.length > 0 && (
                      <div className="space-y-2">
                        <Label>
                          Selected Cities ({config.targetCities.length}/
                          {sizeConfigs[config.size].maxCities})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {config.targetCities.map((city) => (
                            <Badge
                              key={city.id}
                              variant="secondary"
                              className="text-sm px-3 py-1"
                            >
                              {city.flag} {city.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                                onClick={() => removeTargetCity(city.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Reference City */}
                {step === "reference" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Select the reference city (the time you want to convert
                      from)
                    </p>

                    <CitySearch
                      value={config.referenceCity}
                      onChange={(city) => updateConfig("referenceCity", city)}
                      placeholder="Search for reference city..."
                      label="Reference City"
                    />

                    {config.referenceCity && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">
                            {config.referenceCity.flag}
                          </span>
                          <div>
                            <div className="font-semibold">
                              {config.referenceCity.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {config.referenceCity.country}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          This will be used as the base time for conversions
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Time Selection */}
                {step === "time" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Choose whether to use current time or set a custom time
                    </p>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="current-time">Use current time</Label>
                      <Switch
                        id="current-time"
                        checked={config.useCurrentTime}
                        onCheckedChange={(checked) =>
                          updateConfig("useCurrentTime", checked)
                        }
                      />
                    </div>

                    {!config.useCurrentTime && (
                      <div className="space-y-4">
                        <Label>Select custom date and time</Label>
                        <CircularTimePicker
                          value={{
                            hours: config.customTime?.hour || 0,
                            minutes: config.customTime?.minute || 0,
                          }}
                          onChange={(time) => {
                            const newTime = (
                              config.customTime || DateTime.now()
                            ).set({ hour: time.hours, minute: time.minutes });
                            updateConfig("customTime", newTime);
                          }}
                          is24Hour={true}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4: Customize */}
                {step === "customize" && (
                  <div className="space-y-6">
                    <p className="text-muted-foreground">
                      Customize the appearance and size of your widget
                    </p>

                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label>Theme</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            config.theme === "light" ? "default" : "outline"
                          }
                          onClick={() => updateConfig("theme", "light")}
                          className="h-12 gap-2"
                        >
                          ☀️ Light
                        </Button>
                        <Button
                          variant={
                            config.theme === "dark" ? "default" : "outline"
                          }
                          onClick={() => updateConfig("theme", "dark")}
                          className="h-12 gap-2"
                        >
                          🌙 Dark
                        </Button>
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-3">
                      <Label>Widget Size</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(sizeConfigs).map(
                          ([key, sizeConfig]) => {
                            const Icon = sizeConfig.icon;
                            return (
                              <Button
                                key={key}
                                variant={
                                  config.size === key ? "default" : "outline"
                                }
                                className="h-auto p-4 justify-start"
                                onClick={() => updateConfig("size", key as any)}
                              >
                                <div className="flex items-center gap-3 w-full">
                                  <Icon className="h-5 w-5" />
                                  <div className="text-left">
                                    <div className="font-semibold">
                                      {sizeConfig.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {sizeConfig.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {typeof sizeConfig.width === "number"
                                        ? `${sizeConfig.width}×${sizeConfig.height}px`
                                        : `${sizeConfig.width} × ${sizeConfig.height}px`}
                                      • Max {sizeConfig.maxCities} cities
                                    </div>
                                  </div>
                                </div>
                              </Button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Generate Code */}
                {step === "generate" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Your embed code is ready! Copy and paste it into any
                      website.
                    </p>

                    <div className="space-y-3">
                      <Label>Embed Code</Label>
                      <div className="relative">
                        <Textarea
                          value={generateIframeCode()}
                          readOnly
                          className="font-mono text-sm resize-none"
                          rows={8}
                        />
                        <Button
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleCopyCode}
                        >
                          {copySuccess ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Direct URL</Label>
                      <div className="flex gap-2">
                        <Textarea
                          value={generateEmbedUrl()}
                          readOnly
                          className="font-mono text-sm flex-1"
                          rows={2}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(generateEmbedUrl());
                            toast.success("URL copied!");
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === "cities"}
                  >
                    Previous
                  </Button>

                  {step !== "generate" ? (
                    <Button
                      onClick={nextStep}
                      disabled={!canProceedToNext()}
                      className="gap-2"
                    >
                      Next
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        window.open(generateEmbedUrl(), "_blank");
                      }}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Widget
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Live Preview Panel */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewKey((prev) => prev + 1)}
                    className="gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {config.targetCities.length > 0 && config.referenceCity ? (
                  <div className="space-y-4">
                    <div className="border rounded-xl p-4 bg-muted/20">
                      <iframe
                        key={previewKey}
                        src={generateEmbedUrl()}
                        width={sizeConfigs[config.size].width}
                        height={sizeConfigs[config.size].height}
                        frameBorder="0"
                        className="rounded-lg shadow-lg border-0 w-full max-w-full"
                        title="TimeSync Widget Preview"
                      />
                    </div>

                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>📐 Size: {sizeConfigs[config.size].name}</div>
                      <div>🏙️ Cities: {config.targetCities.length}</div>
                      <div>🎨 Theme: {config.theme}</div>
                      <div>
                        ⏰ Time: {config.useCurrentTime ? "Current" : "Custom"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-semibold">
                        Preview will appear here
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Complete the steps to see your widget preview
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbedGeneratorPage;
