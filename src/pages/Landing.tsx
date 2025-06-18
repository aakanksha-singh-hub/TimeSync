import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Globe,
  ArrowRight,
  Zap,
  Calendar,
  Share2,
  Code,
  Monitor,
  Sparkles,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { DateTime } from "luxon";

const Landing: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(DateTime.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const demoLocations = [
    {
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      flag: "🇺🇸",
      country: "USA",
    },
    {
      city: "New York",
      timezone: "America/New_York",
      flag: "🇺🇸",
      country: "USA",
    },
    { city: "London", timezone: "Europe/London", flag: "🇬🇧", country: "UK" },
    { city: "Tokyo", timezone: "Asia/Tokyo", flag: "🇯🇵", country: "Japan" },
  ];

  const getDemoTime = (timezone: string) => {
    return currentTime.setZone(timezone);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TimeSync</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild>
              <Link to="/app">Try Now</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20">
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="flex items-center justify-center mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
              <Globe className="h-16 w-16 text-primary" />
            </div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm font-medium"
            >
              🧭 Create beautiful world clock widgets you can embed anywhere
            </Badge>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Beautiful World Clock
            <br />
            <span className="text-4xl md:text-6xl">Widgets for Everyone</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Create stunning, embeddable world clock widgets with time zone
            conversion, real-time updates, and calendar integration. Perfect for
            blogs, Notion, and websites.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Button
              asChild
              size="lg"
              className="group text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary/90"
            >
              <Link to="/converter" className="flex items-center space-x-2">
                <Clock className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                <span>Try Converter</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4"
            >
              <Link
                to="/embed-generator"
                className="flex items-center space-x-2"
              >
                <Code className="h-5 w-5" />
                <span>Generate Embed</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="text-lg px-8 py-4"
              asChild
            >
              <a href="#demo" className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>View Demo</span>
              </a>
            </Button>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              {
                icon: Globe,
                text: "🌍 Global City Search",
                desc: "Find any city instantly",
              },
              {
                icon: RefreshCw,
                text: "🔄 Real-Time Sync",
                desc: "Always up-to-date",
              },
              {
                icon: Code,
                text: "🔗 Shareable Embeds",
                desc: "One-click embed code",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">{feature.text}</div>
                  <div className="text-xs text-muted-foreground">
                    {feature.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Live Interactive Demo */}
          <motion.div
            id="demo"
            className="relative max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          >
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-3xl" />
            <Card className="relative backdrop-blur-xl bg-card/50 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                    Live World Clock Widget
                  </h3>
                  <p className="text-muted-foreground">
                    See how beautiful your embedded widgets will look
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {demoLocations.map((location, index) => {
                    const time = getDemoTime(location.timezone);
                    return (
                      <motion.div
                        key={location.city}
                        className="text-center p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 border border-border/50 backdrop-blur-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                      >
                        <div className="text-3xl mb-3">{location.flag}</div>
                        <div className="font-semibold text-lg mb-1">
                          {location.city}
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {location.country}
                        </div>
                        <div className="font-mono text-2xl font-bold mb-2 text-primary">
                          {time.toFormat("h:mm:ss a")}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">
                          {time.toFormat("EEE, MMM d")}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          UTC{time.toFormat("ZZ")}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live updating every second
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20 bg-muted/20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need for global time
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for teams, content creators, and
            developers
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {[
            {
              icon: Zap,
              title: "Lightning Fast",
              description:
                "Instant conversions with smart city search and fuzzy matching for 500+ cities worldwide",
              features: ["Smart search", "Instant results", "500+ cities"],
            },
            {
              icon: Code,
              title: "Embeddable Widgets",
              description:
                "Generate beautiful iframe widgets in multiple sizes with responsive design",
              features: [
                "Responsive design",
                "One-click embed",
              ],
            },
            {
              icon: Calendar,
              title: "Calendar Export",
              description:
                "One-click export to Google Calendar, Outlook, or ICS files with timezone conversion",
              features: ["Google Calendar", "Outlook", "ICS files"],
            },
            {
              icon: Share2,
              title: "Easy Sharing",
              description:
                "Generate shareable links and embed codes for blogs, Notion, websites",
              features: ["Shareable links", "Embed codes", "Social sharing"],
            },
            {
              icon: Monitor,
              title: "Real-time Updates",
              description:
                "Widgets automatically update with accurate time across all zones",
              features: ["Auto-updates", "Always accurate", "Live sync"],
            },
            {
              icon: Sparkles,
              title: "Beautiful Themes",
              description:
                "Light and dark themes with customizable colors and layouts",
              features: [
                "Light/Dark themes",
                "Multiple layouts",
              ],
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/20 group">
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {feature.features.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <CheckCircle className="h-3 w-3 text-primary" />
                        {feat}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Embed Preview Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Embed anywhere in seconds
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Copy and paste a simple iframe code to add beautiful world clocks to
            any platform
          </p>

          <div className="bg-muted/50 rounded-xl p-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Code className="h-5 w-5 text-primary" />
              <span className="font-semibold">Generated Embed Code</span>
            </div>
            <code className="text-sm font-mono text-muted-foreground block whitespace-pre-wrap break-all">
              {`<iframe
  src="https://time-sync-sigma.vercel.app/embed?cities=New+York,London,Tokyo&ref=India&time=2025-07-07T14:00Z&theme=dark&size=medium"
  width="100%"
  height="250"
  frameborder="0">
</iframe>`}
            </code>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.6 }}
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to sync the world?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of users who trust TimeSync for their global time
              needs. Start creating beautiful world clock widgets today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-primary to-primary/90"
              >
                <Link to="/app" className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Start Now - It's Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-4"
                asChild
              >
                <a
                  href="https://github.com/yourusername/timesync"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span>View on GitHub</span>
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">TimeSync</span>
            </div>
            <div className="text-muted-foreground text-sm">
              © 2024 TimeSync. Built with ❤️ for global teams.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
