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
      <div className="bg-ios-card/90 border border-white/10 p-1 rounded-2xl flex items-center gap-1 overflow-x-auto no-scrollbar shadow-ios">
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
                  ? 'bg-ios-blue text-black font-bold shadow-ios'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-1 font-semibold">
                {DAY_LABELS[day].short}
                {isCurrentRealDay && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-ios-blue'}`}
                  />
                )}
              </span>
              <span className={`text-[10px] ${isSelected ? 'text-black/80 font-bold' : 'text-slate-500'}`}>
                {completed}/{count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Viewing Day Bar */}
      <div className="flex items-center justify-between bg-ios-card border border-white/10 p-3.5 rounded-2xl shadow-ios">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ios-blue" />
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            {DAY_LABELS[viewingDay].full}
            {isTodayView && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-ios-blue/20 text-ios-blue border border-ios-blue/30">
                今日
              </span>
            )}
          </h2>
        </div>

        <button
          onClick={() => setShowQuickAddModal(true)}
          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-ios-blue text-black hover:bg-ios-blue/90 transition-all shadow-ios active:scale-95"
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
                  ? 'bg-white text-black font-bold border-white shadow-ios'
                  : 'bg-ios-card border-white/10 text-slate-400 hover:text-white'
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
        <div className="p-4 rounded-2xl bg-gradient-to-r from-ios-blue/20 via-ios-green/20 to-ios-purple/20 border border-ios-green/50 flex items-center gap-3.5 shadow-ios animate-ios-pop">
          <div className="w-11 h-11 rounded-2xl bg-ios-green/30 border border-ios-green flex items-center justify-center flex-shrink-0">
            <Trophy className="w-5 h-5 text-ios-green" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1">
              素晴らしい！全タスク達成 <Sparkles className="w-4 h-4 text-ios-yellow" />
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
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
        <div className="p-6 text-center bg-ios-card/40 border border-ios-green/30 rounded-2xl flex flex-col items-center gap-2 animate-ios-pop">
          <CheckCircle2 className="w-10 h-10 text-ios-green" />
          <p className="text-sm font-bold text-white">すべてのタスクを達成しました！</p>
          <p className="text-xs text-slate-400">本日のルーティンはすべて完了して表示からクリアされました。</p>
        </div>
      ) : (
        <div className="p-8 text-center bg-ios-card/50 border border-dashed border-white/10 rounded-2xl flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-ios-cardHover flex items-center justify-center text-slate-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-300">
              {DAY_LABELS[viewingDay].short}曜日のルーティンは未登録です
            </p>
            <p className="text-xs text-slate-400 mt-1">
              新しいルーティンを追加して毎日の習慣を作ろう！
            </p>
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setShowQuickAddModal(true)}
              className="text-xs font-bold px-4 py-2 rounded-xl bg-ios-blue text-black shadow-ios active:scale-95"
            >
              クイック追加
            </button>
            <button
              onClick={() => onNavigateToRoutineSetup(viewingDay)}
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-ios-card border border-white/10 text-slate-300"
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
            className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-ios-card/70 border border-white/10 text-xs text-slate-300 hover:text-white transition-all active:scale-[0.99] shadow-ios"
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
            <div className="space-y-2 mt-2 pt-1 border-t border-white/5 animate-ios-pop">
              <p className="text-[11px] text-slate-400 px-1 mb-1">
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
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-ios-card border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto sm:hidden -mt-2 mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">
                {DAY_LABELS[viewingDay].short}曜日 タスク追加
              </h3>
              <button
                onClick={() => setShowQuickAddModal(false)}
                className="w-7 h-7 rounded-full bg-ios-cardHover text-slate-400 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  やる事 (タスク名)
                </label>
                <input
                  type="text"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  placeholder="例: 朝のストレッチ、読書"
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-ios-blue"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  時間帯・カテゴリ
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as Category)}
                  className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-ios-blue"
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
                  className="flex-1 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-slate-400"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-ios-blue text-black text-xs font-bold shadow-ios active:scale-95 disabled:opacity-40"
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
