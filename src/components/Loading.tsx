
import { Cloud } from "lucide-react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated background clouds */}
      <div className="absolute inset-0 opacity-20">
        <Cloud className="absolute top-20 left-10 w-16 h-16 text-blue-200 animate-pulse" style={{ animationDelay: '0s' }} />
        <Cloud className="absolute top-32 right-20 w-20 h-20 text-indigo-200 animate-pulse" style={{ animationDelay: '1s' }} />
        <Cloud className="absolute bottom-40 left-1/4 w-12 h-12 text-slate-300 animate-pulse" style={{ animationDelay: '2s' }} />
        <Cloud className="absolute bottom-20 right-1/3 w-24 h-24 text-blue-100 animate-pulse" style={{ animationDelay: '0.5s' }} />
        <Cloud className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 text-indigo-100 animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Loading content */}
      <div className="text-center z-10">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <Cloud className="w-10 h-10 text-slate-600 animate-bounce" />
          </div>
        </div>
        
        <h1 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">
          Time Zone Converter
        </h1>
        
        <div className="flex items-center justify-center space-x-1 mb-6">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        <p className="text-slate-500 font-light">
          Loading your global time experience...
        </p>
      </div>
    </div>
  );
};

export default Loading;
