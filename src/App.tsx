import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useTimeSyncStore } from "@/store/useTimeSyncStore";
import { useTheme } from "@/components/ui/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "@/pages/Landing";
import EnhancedTimeSync from "@/components/EnhancedTimeSync";
import EmbedPage from "@/pages/EmbedPage";
import EmbedGeneratorPage from "@/pages/EmbedGenerator";
import "./App.css";

// Theme sync component to connect store with theme provider
const ThemeSync: React.FC = () => {
  const { theme } = useTimeSyncStore();
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [theme, setTheme]);

  return null;
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="timesync-theme">
        <div className="min-h-screen bg-background text-foreground">
          <Router>
            <ThemeSync />
            <Routes>
              {/* Landing page as default */}
              <Route path="/" element={<Landing />} />

              {/* Main application */}
              <Route path="/app" element={<EnhancedTimeSync />} />

              {/* Embed widget page */}
              <Route path="/embed" element={<EmbedPage />} />

              {/* Embed generator page */}
              <Route path="/embed-generator" element={<EmbedGeneratorPage />} />

              {/* Redirect old URLs to app */}
              <Route
                path="/converter"
                element={<Navigate to="/app" replace />}
              />
              <Route
                path="/timesync"
                element={<Navigate to="/app" replace />}
              />

              {/* Catch all - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                },
              }}
            />
          </Router>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
