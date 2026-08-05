import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery } from 'lucide-react';

export const IPhoneStatusBar: React.FC = () => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black text-white px-6 pt-3 pb-1 flex justify-between items-center select-none text-xs font-semibold z-40 relative">
      {/* Left: Time */}
      <div className="w-20 pl-1 font-bold text-sm tracking-tight text-white/90">
        {timeStr || '9:41'}
      </div>

      {/* Center: Dynamic Island */}
      <div className="w-28 h-7 bg-black rounded-full border border-white/10 flex items-center justify-between px-3 shadow-inner">
        <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-blue-900/30 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-blue-500/40" />
        </div>
      </div>

      {/* Right: Icons (Signal, Wifi, Battery) */}
      <div className="w-20 pr-1 flex items-center justify-end gap-1.5 text-white/90">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <div className="w-5 h-2.5 rounded-[3px] border border-white/80 p-[1px] flex items-center">
            <div className="h-full w-4/5 bg-ios-green rounded-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
};
