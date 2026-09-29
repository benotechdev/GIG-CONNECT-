import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface EventCountdownProps {
  targetDate: string; // e.g. "2026-10-18"
  className?: string;
  showIcon?: boolean;
}

export const EventCountdown: React.FC<EventCountdownProps> = ({
  targetDate,
  className = '',
  showIcon = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPast) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold ${className}`}>
        {showIcon && <Clock className="w-3.5 h-3.5 text-slate-400" />}
        <span>Event In Progress / Ended</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {showIcon && <Clock className="w-4 h-4 text-amber-400 shrink-0" />}

      <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-black">
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded-md text-amber-400 text-center min-w-[32px]">
          {String(timeLeft.days).padStart(2, '0')}
          <span className="block text-[8px] font-sans font-medium text-slate-400">DAYS</span>
        </div>
        <span className="text-amber-400 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded-md text-white text-center min-w-[32px]">
          {String(timeLeft.hours).padStart(2, '0')}
          <span className="block text-[8px] font-sans font-medium text-slate-400">HRS</span>
        </div>
        <span className="text-slate-500 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded-md text-white text-center min-w-[32px]">
          {String(timeLeft.minutes).padStart(2, '0')}
          <span className="block text-[8px] font-sans font-medium text-slate-400">MIN</span>
        </div>
        <span className="text-slate-500 font-bold">:</span>
        <div className="bg-slate-900/90 border border-slate-700/80 px-2 py-1 rounded-md text-emerald-400 text-center min-w-[32px]">
          {String(timeLeft.seconds).padStart(2, '0')}
          <span className="block text-[8px] font-sans font-medium text-slate-400">SEC</span>
        </div>
      </div>
    </div>
  );
};
