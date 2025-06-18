import React from "react";
import EnhancedTimeSync from "@/components/EnhancedTimeSync";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/10">
      <EnhancedTimeSync />
    </div>
  );
};

export default Index;
