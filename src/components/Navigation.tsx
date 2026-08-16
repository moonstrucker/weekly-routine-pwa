import React from 'react';
import { CheckSquare, CalendarDays, Settings } from 'lucide-react';
import { ViewTab } from '../types';

interface NavigationProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  todayUncompletedCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  todayUncompletedCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-2xl border-t border-slate-200/80 pt-2 pb-1.5 px-6 select-none">
      <div className="max-w-md mx-auto flex flex-col gap-1">
        <div className="flex justify-around items-center">
          {/* Today Tab */}
          <button
            onClick={() => setActiveTab('today')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-4 transition-all duration-200 ${
              activeTab === 'today'
                ? 'text-ios-blue font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <CheckSquare className="w-5 h-5 stroke-[2.2]" />
              {todayUncompletedCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-ios-red text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-ios">
                  {todayUncompletedCount > 9 ? '9+' : todayUncompletedCount}
                </span>
              )}
            </div>
            <span className="text-[10px]">今日のタスク</span>
          </button>

          {/* Routine Tab */}
          <button
            onClick={() => setActiveTab('routine')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-4 transition-all duration-200 ${
              activeTab === 'routine'
                ? 'text-ios-blue font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <CalendarDays className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px]">曜日別設定</span>
          </button>

          {/* Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`relative flex flex-col items-center gap-0.5 py-1 px-4 transition-all duration-200 ${
              activeTab === 'settings'
                ? 'text-ios-blue font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <Settings className="w-5 h-5 stroke-[2.2]" />
            <span className="text-[10px]">設定・データ</span>
          </button>
        </div>

        {/* iOS Home Indicator Bar */}
        <div className="w-32 h-1 bg-slate-400/60 rounded-full mx-auto mt-1" />
      </div>
    </nav>
  );
};
