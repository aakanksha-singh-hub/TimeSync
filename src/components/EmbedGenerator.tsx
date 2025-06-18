import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Settings,
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { DateTime } from "luxon";
import type { City } from "@/data/cities";

interface EmbedConfig {
  cities: City[];
  referenceTime?: DateTime;
  theme: "light" | "dark" | "auto";
  size: "small" | "medium" | "large" | "full-width";
  showSeconds: boolean;
  show24Hour: boolean;
}

interface EmbedGeneratorProps {
  selectedCities: City[];
  customTime?: DateTime;
  onConfigChange?: (config: EmbedConfig) => void;
}

const EmbedGenerator: React.FC<EmbedGeneratorProps> = ({
  selectedCities,
  customTime,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<EmbedConfig>({
    cities: selectedCities.slice(0, 8), // Limit to 8 cities
    referenceTime: customTime,
    theme: "auto",
    size: "medium",
    showSeconds: false,
    show24Hour: true,
  });

  const [activeTab, setActiveTab] = useState<"preview" | "code" | "settings">(
    "preview"
  );
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  // Size configurations with responsive handling
  const sizeConfigs = {
    small: {
      name: "Small",
      description: "Compact widget for sidebars",
      width: 300,
      height: 180,
      icon: Smartphone,
      maxCities: 2,
      gridClass: "grid-cols-1",
    },
    medium: {
      name: "Medium",
      description: "Perfect for blog posts",
      width: 500,
      height: 250,
      icon: Tablet,
      maxCities: 4,
      gridClass: "grid-cols-2",
    },
    large: {
      name: "Large",
      description: "Detailed view with more cities",
      width: 700,
      height: 350,
      icon: Monitor,
      maxCities: 6,
      gridClass: "grid-cols-2 lg:grid-cols-3",
    },
    "full-width": {
      name: "Full Width",
      description: "Responsive full-width widget",
      width: "100%",
      height: 200,
      icon: Monitor,
      maxCities: 8,
      gridClass: "grid-cols-4",
    },
  };

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      cities: selectedCities.slice(0, sizeConfigs[prev.size].maxCities),
      referenceTime: customTime,
    }));
  }, [selectedCities, customTime]);

  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  const updateConfig = <K extends keyof EmbedConfig>(
    key: K,
    value: EmbedConfig[K]
  ) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [key]: value };

      // Adjust cities count based on size
      if (key === "size") {
        const sizeConfig = sizeConfigs[value as EmbedConfig["size"]];
        newConfig.cities = prev.cities.slice(0, sizeConfig.maxCities);
      }

      return newConfig;
    });

    // Force preview refresh
    setPreviewKey((prev) => prev + 1);
  };

  const generateEmbedUrl = () => {
    const params = new URLSearchParams({
      cities: config.cities.map((c) => c.id).join(","),
      theme: config.theme,
      size: config.size,
      showSeconds: config.showSeconds.toString(),
      show24Hour: config.show24Hour.toString(),
    });

    if (config.referenceTime) {
      params.set("time", config.referenceTime.toISO());
    }

    return `${window.location.origin}/embed?${params.toString()}`;
  };

  const generateIframeCode = () => {
    const url = generateEmbedUrl();
    const sizeConfig = sizeConfigs[config.size];
    const width =
      typeof sizeConfig.width === "number"
        ? `${sizeConfig.width}px`
        : sizeConfig.width;

    return `<iframe
  src="${url}"
  width="${sizeConfig.width === "100%" ? "100%" : width}"
  height="${sizeConfig.height}px"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
  title="TimeSync World Clock Widget"
></iframe>`;
  };

  const generateHTMLCode = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <title>World Clock Widget</title>
</head>
<body>
  ${generateIframeCode()}
</body>
</html>`;
  };

  const generateMarkdownCode = () => {
    const url = generateEmbedUrl();
    return `<!-- TimeSync World Clock Widget -->
<iframe 
  src="${url}" 
  width="${sizeConfigs[config.size].width}" 
  height="${sizeConfigs[config.size].height}" 
  frameborder="0">
</iframe>`;
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy code");
    }
  };

  const openPreview = () => {
    const url = generateEmbedUrl();
    window.open(
      url,
      "_blank",
      "width=800,height=600,scrollbars=yes,resizable=yes"
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-2 mb-4"
        >
          <Code className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Embed Generator</h2>
        </motion.div>
        <p className="text-muted-foreground">
          Create beautiful, responsive world clock widgets for any website
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as any)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Live Preview</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {sizeConfigs[config.size].name}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openPreview}
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
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

                {/* Preview Info */}
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>
                      📐{" "}
                      {typeof sizeConfigs[config.size].width === "number"
                        ? `${sizeConfigs[config.size].width}px`
                        : sizeConfigs[config.size].width}{" "}
                      × {sizeConfigs[config.size].height}px
                    </span>
                    <span>🏙️ {config.cities.length} cities</span>
                    <span>🎨 {config.theme} theme</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewKey((prev) => prev + 1)}
                    className="flex items-center gap-1"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Code Tab */}
        <TabsContent value="code" className="space-y-4">
          <div className="grid gap-4">
            {/* iframe Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>iframe Embed Code</span>
                  <Badge>Recommended</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Copy and paste this code into any website or blog
                </p>
              </CardHeader>
              <CardContent>
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
                    onClick={() => handleCopyCode(generateIframeCode())}
                  >
                    {copySuccess ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* HTML Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Complete HTML</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Full HTML document with the widget embedded
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={generateHTMLCode()}
                    readOnly
                    className="font-mono text-sm resize-none"
                    rows={8}
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(generateHTMLCode())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Markdown Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Markdown</CardTitle>
                <p className="text-sm text-muted-foreground">
                  For GitHub README, documentation sites, or Markdown blogs
                </p>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Textarea
                    value={generateMarkdownCode()}
                    readOnly
                    className="font-mono text-sm resize-none"
                    rows={6}
                  />
                  <Button
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleCopyCode(generateMarkdownCode())}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Direct URL */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Direct URL</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Direct link to the widget for sharing or bookmarking
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Textarea
                    value={generateEmbedUrl()}
                    readOnly
                    className="font-mono text-sm flex-1"
                    rows={2}
                  />
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCopyCode(generateEmbedUrl())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={openPreview}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-6">
            {/* Size Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-primary" />
                  Widget Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(sizeConfigs).map(([key, sizeConfig]) => {
                    const Icon = sizeConfig.icon;
                    return (
                      <motion.div
                        key={key}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-all",
                          config.size === key
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => updateConfig("size", key as any)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-6 w-6 text-primary" />
                          <div>
                            <div className="font-semibold">
                              {sizeConfig.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {sizeConfig.description}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {typeof sizeConfig.width === "number"
                                ? `${sizeConfig.width}×${sizeConfig.height}px`
                                : `${sizeConfig.width} × ${sizeConfig.height}px`}
                              • Max {sizeConfig.maxCities} cities
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-primary" />
                  Theme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={config.theme}
                  onValueChange={(value) => updateConfig("theme", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto (follows system)</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Display Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show24Hour">24-hour format</Label>
                    <p className="text-sm text-muted-foreground">
                      Display time in 24-hour format instead of 12-hour
                    </p>
                  </div>
                  <Switch
                    id="show24Hour"
                    checked={config.show24Hour}
                    onCheckedChange={(checked) =>
                      updateConfig("show24Hour", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showSeconds">Show seconds</Label>
                    <p className="text-sm text-muted-foreground">
                      Include seconds in the time display
                    </p>
                  </div>
                  <Switch
                    id="showSeconds"
                    checked={config.showSeconds}
                    onCheckedChange={(checked) =>
                      updateConfig("showSeconds", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cities Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Selected Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    {config.cities.length} of{" "}
                    {sizeConfigs[config.size].maxCities} cities selected for{" "}
                    {sizeConfigs[config.size].name} size
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.cities.map((city) => (
                      <Badge
                        key={city.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {city.flag} {city.name}
                      </Badge>
                    ))}
                  </div>
                  {config.referenceTime && (
                    <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          Custom time:{" "}
                          {config.referenceTime.toFormat(
                            "EEEE, MMMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmbedGenerator;
