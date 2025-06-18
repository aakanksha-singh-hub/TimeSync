import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClockIcon, ExternalLinkIcon, CopyIcon } from "lucide-react";
import { City, getCityById } from "@/data/cities";
import { cn } from "@/lib/utils";

interface EmbedWidgetProps {
  sourceCity?: string;
  targetCities?: string[];
  referenceTime?: string;
  theme?: "light" | "dark" | "auto";
  compact?: boolean;
  showBranding?: boolean;
  className?: string;
}

const EmbedWidget: React.FC<EmbedWidgetProps> = ({
  sourceCity = "new-york",
  targetCities = ["london", "tokyo"],
  referenceTime,
  theme = "auto",
  compact = false,
  showBranding = true,
  className,
}) => {
  const [currentTime, setCurrentTime] = useState(DateTime.now());
  const [displayTime, setDisplayTime] = useState<DateTime>(DateTime.now());

  const source = getCityById(sourceCity);
  const targets = targetCities
    .map((id) => getCityById(id))
    .filter(Boolean) as City[];

  useEffect(() => {
    if (referenceTime) {
      const parsed = DateTime.fromISO(referenceTime);
      if (parsed.isValid) {
        setDisplayTime(parsed);
        return;
      }
    }

    const interval = setInterval(() => {
      const now = DateTime.now();
      setCurrentTime(now);
      if (!referenceTime) {
        setDisplayTime(now);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [referenceTime]);

  const handleCopyTime = (city: City, time: DateTime) => {
    const timeStr = time.setZone(city.timezone).toFormat("h:mm a");
    navigator.clipboard.writeText(`${timeStr} in ${city.name}`);
  };

  const openFullApp = () => {
    const params = new URLSearchParams({
      ref: sourceCity,
      targets: targetCities.join(","),
      ...(referenceTime && { time: referenceTime }),
    });
    window.open(`${window.location.origin}?${params.toString()}`, "_blank");
  };

  if (!source) {
    return (
      <Card className="p-4 text-center text-muted-foreground">
        <p>Invalid source city</p>
      </Card>
    );
  }

  const formatTime = (city: City, time: DateTime) => {
    const cityTime = time.setZone(city.timezone);
    return {
      time: cityTime.toFormat("h:mm a"),
      date: cityTime.toFormat("MMM d"),
      offset: cityTime.toFormat("ZZZZZ"),
      isToday: cityTime.hasSame(DateTime.now().setZone(city.timezone), "day"),
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full max-w-md mx-auto",
        theme === "dark" && "dark",
        className
      )}
    >
      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <CardContent
          className={cn("p-4 space-y-3", compact && "p-3 space-y-2")}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Zones</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={openFullApp}
              className="h-8 w-8 p-0"
            >
              <ExternalLinkIcon className="h-3 w-3" />
            </Button>
          </div>

          {/* Reference Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{source.flag}</span>
              <div>
                <div className="font-semibold text-sm">{source.name}</div>
                <div className="text-xs text-muted-foreground">
                  {source.country}
                </div>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-lg font-medium">
                    {formatTime(source, displayTime).time}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatTime(source, displayTime).date} •{" "}
                    {formatTime(source, displayTime).offset}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyTime(source, displayTime)}
                  className="h-8 w-8 p-0"
                >
                  <CopyIcon className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          {/* Target Cities */}
          {targets.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Other Zones
              </div>
              {targets.map((city) => {
                const timeInfo = formatTime(city, displayTime);
                return (
                  <div
                    key={city.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-accent/5 border border-accent/10"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{city.flag}</span>
                      <div>
                        <div className="text-sm font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {timeInfo.date} • {timeInfo.offset}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-medium">
                        {timeInfo.time}
                      </div>
                      {timeInfo.isToday && (
                        <Badge variant="secondary" className="text-xs">
                          Today
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Branding */}
          {showBranding && (
            <div className="pt-2 border-t border-border/30">
              <button
                onClick={openFullApp}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Powered by TimeSync
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmbedWidget;

// Helper function to generate embed code
export const generateEmbedCode = (config: {
  sourceCity: string;
  targetCities: string[];
  referenceTime?: string;
  theme?: "light" | "dark" | "auto";
  compact?: boolean;
  width?: number;
  height?: number;
}) => {
  const params = new URLSearchParams({
    ref: config.sourceCity,
    targets: config.targetCities.join(","),
    ...(config.referenceTime && { time: config.referenceTime }),
    ...(config.theme && { theme: config.theme }),
    ...(config.compact && { compact: "true" }),
  });

  const embedUrl = `${window.location.origin}/embed?${params.toString()}`;

  return {
    iframe: `<iframe src="${embedUrl}" width="${config.width || 320}" height="${
      config.height || 240
    }" frameborder="0" style="border-radius: 8px;"></iframe>`,
    url: embedUrl,
    script: `<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = '${embedUrl}';
    iframe.width = '${config.width || 320}';
    iframe.height = '${config.height || 240}';
    iframe.frameBorder = '0';
    iframe.style.borderRadius = '8px';
    document.currentScript.parentNode.insertBefore(iframe, document.currentScript);
  })();
</script>`,
  };
};
