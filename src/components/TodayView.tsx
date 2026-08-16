import React, { useState } from 'react';
import { Task, Category, DayOfWeek } from '../types';
import { TaskItem } from './TaskItem';
import { getCurrentDayOfWeek, DAY_LABELS, DAYS_ORDER } from '../utils/dateUtils';
import { Sparkles, Trophy, Plus, CheckCircle, Calendar, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface TodayViewProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onNavigateToRoutineSetup: (selectedDay?: DayOfWeek) => void;
  onQuickAddTask: (dayOfWeek: DayOfWeek, title: string, category: Category) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  onToggleComplete,
  onNavigateToRoutineSetup,
  onQuickAddTask,
}) => {
  const todayDay = getCurrentDayOfWeek();
  const [viewingDay, setViewingDay] = useState<DayOfWeek>(todayDay);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<Category>('anytime');
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [showCompletedAccordion, setShowCompletedAccordion] = useState(false);

  const dayTasks = tasks.filter((t) => t.dayOfWeek === viewingDay);
  const filteredTasks = dayTasks.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  const uncompletedTasks = filteredTasks.filter((t) => !t.isCompleted);
  const completedTasks = filteredTasks.filter((t) => t.isCompleted);

  const completedCount = dayTasks.filter((t) => t.isCompleted).length;
  const totalCount = dayTasks.length;
  const isTodayView = viewingDay === todayDay;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onQuickAddTask(viewingDay, quickTitle, quickCategory);
    setQuickTitle('');
    setShowQuickAddModal(false);
  };

  return (
    <div className="space-y-4 pb-28">
      {/* iOS Segmented Day Control */}
      <div className="bg-white border border-slate-200/80 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar shadow-ios">
        {DAYS_ORDER.map((day) => {
          const isCurrentRealDay = day === todayDay;
          const isSelected = day === viewingDay;
          const count = tasks.filter((t) => t.dayOfWeek === day).length;
          const completed = tasks.filter((t) => t.dayOfWeek === day && t.isCompleted).length;

          return (
            <button
              key={day}
              onClick={() => setViewingDay(day)}
              className={`flex-1 min-w-[50px] py-2 px-1 rounded-xl flex flex-col items-center gap-0.5 transition-all text-xs select-none active:scale-95 ${
                isSelected
                  ? 'bg-ios-blue text-white font-bold shadow-ios'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1 font-semibold">
                {DAY_LABELS[day].short}
                {isCurrentRealDay && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-ios-blue'}`}
                  />
                )}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-white/90 font-bold' : 'text-slate-400'}`}>
                {completed}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Viewing Day Bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200/80 p-3.5 rounded-2xl shadow-ios">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ios-blue" />
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {DAY_LABELS[viewingDay].full}
            {isTodayView && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ios-blue/15 text-ios-blue border border-ios-blue/30">
                今日
              </span>
            )}
          </h2>
        </div>

        <button
          onClick={() => setShowQuickAddModal(true)}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-ios-blue text-white hover:bg-ios-blue/90 transition-all shadow-ios active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          追加
        </button>
      </div>

      {/* Category Pills */}
      {totalCount > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {(['all', 'morning', 'afternoon', 'evening', 'anytime'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium border transition-all whitespace-nowrap active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-bold border-slate-900 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              {cat === 'all'
                ? 'すべて'
                : cat === 'morning'
                ? '朝'
                : cat === 'afternoon'
                ? '昼'
                : cat === 'evening'
                ? '夜'
                : 'いつでも'}
            </button>
          ))}
        </div>
      )}

      {/* Celebration Banner */}
      {isAllCompleted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-emerald-50 to-purple-50 border border-emerald-300 flex items-center gap-3.5 shadow-ios animate-ios-pop">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 border border-emerald-400 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1">
              素晴らしい！全タスク達成 <Sparkles className="w-4 h-4 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {DAY_LABELS[viewingDay].short}曜日のすべてのルーティンを完了しました！
            </p>
          </div>
        </div>
      )}

      {/* Active Uncompleted Tasks */}
      {uncompletedTasks.length > 0 ? (
        <div className="space-y-2.5">
          {uncompletedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      ) : totalCount > 0 && isAllCompleted ? (
        <div className="p-6 text-center bg-white border border-emerald-200/80 rounded-2xl flex flex-col items-center gap-2 animate-ios-pop shadow-ios">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          <p className="text-sm font-bold text-slate-900">すべてのタスクを達成しました！</p>
          <p className="text-xs text-slate-500">本日のルーティンはすべて完了して表示からクリアされました。</p>
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">
              {DAY_LABELS[viewingDay].short}曜日のルーティンは未登録です
            </p>
            <p className="text-xs text-slate-500 mt-1">
              新しいルーティンを追加して毎日の習慣を作ろう！
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-ios-blue text-white shadow-ios active:scale-95"
            >
              クイック追加
            </button>
            <button
              onClick={() => onNavigateToRoutineSetup(viewingDay)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              設定画面へ
            </button>
          </div>
        </div>
      )}

      {/* Completed Tasks Accordion */}
      {completedTasks.length > 0 && (
        <div className="pt-2">
          <button
            onClick={() => setShowCompletedAccordion(!showCompletedAccordion)}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 hover:text-slate-900 transition-all active:scale-[0.99] shadow-ios"
          >
            <span className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-4 h-4 text-ios-green" />
              完了済みのタスク ({completedTasks.length}件)
            </span>
            {showCompletedAccordion ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showCompletedAccordion && (
            <div className="space-y-2 mt-2 pt-1 border-t border-slate-200/50 animate-ios-pop">
              <p className="text-[11px] text-slate-500 px-1 mb-1">
                ※タップすると未完了に戻して再表示します
              </p>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Add iOS Sheet Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-2 mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">
                {DAY_LABELS[viewingDay].short}曜日 タスク追加
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  やる事 (タスク名)
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="例: 朝のストレッチ、読書"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  時間帯・カテゴリ
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                >
                  <option value="morning">朝 (Morning)</option>
                  <option value="afternoon">昼 (Afternoon)</option>
                  <option value="evening">夜 (Evening)</option>
                  <option value="anytime">いつでも (Anytime)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-bold shadow-ios active:scale-95 disabled:opacity-40"
                >
                  追加する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
