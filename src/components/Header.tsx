import React from 'react';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { getDisplayDateString, DAY_LABELS, getCurrentDayOfWeek } from '../utils/dateUtils';
import { Task } from '../types';

interface HeaderProps {
  todayTasks: Task[];
}

export const Header: React.FC<HeaderProps> = ({ todayTasks }) => {
  const currentDay = getCurrentDayOfWeek();
  const completedCount = todayTasks.filter((t) => t.isCompleted).length;
  const totalCount = todayTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllDone = totalCount > 0 && completedCount === totalCount;

  return (
    <header className="sticky top-0 z-30 ios-glass-header border-b border-slate-200/80 px-5 py-3.5 transition-all">
      <div className="max-w-md mx-auto flex flex-col gap-2.5">
        {/* Top Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-ios-blue to-ios-green flex items-center justify-center p-[2px] shadow-ios-glow">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-ios-blue" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 font-sans">
                RoutineFlow
                {isAllDone && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-ios-green/15 text-ios-green border border-ios-green/30">
                    <Sparkles className="w-3 h-3" /> ALL DONE
                  </span>
                )}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                {getDisplayDateString()}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-ios-blue to-ios-green font-sans">
              {DAY_LABELS[currentDay].short}曜日
            </span>
          </div>
        </div>

        {/* Progress Bar Row */}
        {totalCount > 0 && (
          <div className="flex flex-col gap-1 pt-0.5">
            <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
              <span>本日の達成率</span>
              <span className="text-slate-800 font-bold">
                {completedCount} / {totalCount} 件 ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden border border-slate-300/50 relative">
              <div
                className="h-full bg-gradient-to-r from-ios-blue to-ios-green transition-all duration-500 ease-out rounded-full shadow-ios-glow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
