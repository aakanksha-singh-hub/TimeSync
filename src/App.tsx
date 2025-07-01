import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import ErrorBoundary from "@/components/ErrorBoundary";
import Landing from "@/pages/Landing";
import CoreTimeSync from "@/components/CoreTimeSync";
import SimplifiedEmbedPage from "@/pages/SimplifiedEmbedPage";
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="timesync-theme">
        <div className="min-h-screen bg-background text-foreground">
          <Router>
            <Routes>
              {/* Landing page as homepage */}
              <Route path="/" element={<Landing />} />
              
              {/* Main application */}
              <Route path="/app" element={<CoreTimeSync />} />
              
              {/* Embed widget page */}
              <Route path="/embed" element={<SimplifiedEmbedPage />} />
              
              {/* Redirect old URLs */}
              <Route path="/converter" element={<Navigate to="/app" replace />} />
              <Route path="/timesync" element={<Navigate to="/app" replace />} />
              <Route path="/embed-generator" element={<Navigate to="/app" replace />} />
              
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
