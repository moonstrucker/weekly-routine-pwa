import React, { useState, useRef } from 'react';
import { Task, DayOfWeek, Category } from '../types';
import { TaskItem } from './TaskItem';
import { DAY_LABELS, DAYS_ORDER } from '../utils/dateUtils';
import { Plus, Copy, Edit3, Layers, GripVertical } from 'lucide-react';

interface RoutineManagerProps {
  tasks: Task[];
  initialDay?: DayOfWeek;
  onAddTask: (dayOfWeek: DayOfWeek, title: string, category: Category, note?: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Omit<Task, 'id'>>) => void;
  onDeleteTask: (taskId: string) => void;
  onReorderTasks: (dayOfWeek: DayOfWeek, sourceIndex: number, destinationIndex: number) => void;
  onCopyTasksToDays: (fromDay: DayOfWeek, targetDays: DayOfWeek[]) => void;
}

export const RoutineManager: React.FC<RoutineManagerProps> = ({
  tasks,
  initialDay = 'mon',
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onReorderTasks,
  onCopyTasksToDays,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('anytime');
  const [note, setNote] = useState('');
  const [copyTargets, setCopyTargets] = useState<DayOfWeek[]>([]);

  // Drag and drop state (HTML5 + Touch)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const touchStartIndexRef = useRef<number | null>(null);
  const touchOverIndexRef = useRef<number | null>(null);

  const dayTasks = tasks.filter((t) => t.dayOfWeek === selectedDay);

  // HTML5 Drag Handlers
  const handleDragStart = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    }
  };

  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorderTasks(selectedDay, draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch Drag Handlers (Mobile / PWA support)
  const handleTouchStart = (index: number) => {
    touchStartIndexRef.current = index;
    touchOverIndexRef.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartIndexRef.current === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemContainer = element?.closest('[data-task-index]');
    if (itemContainer) {
      const targetIndexStr = itemContainer.getAttribute('data-task-index');
      if (targetIndexStr !== null) {
        const targetIndex = parseInt(targetIndexStr, 10);
        if (!isNaN(targetIndex) && touchOverIndexRef.current !== targetIndex) {
          touchOverIndexRef.current = targetIndex;
          setDragOverIndex(targetIndex);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    const src = touchStartIndexRef.current;
    const dst = touchOverIndexRef.current;
    if (src !== null && dst !== null && src !== dst) {
      onReorderTasks(selectedDay, src, dst);
    }
    touchStartIndexRef.current = null;
    touchOverIndexRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(selectedDay, title, category, note);
    setTitle('');
    setNote('');
    setShowAddForm(false);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !title.trim()) return;
    onUpdateTask(editingTask.id, { title, category, note: note.trim() || undefined });
    setEditingTask(null);
    setTitle('');
    setNote('');
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setCategory(task.category);
    setNote(task.note || '');
  };

  const handleCopySubmit = () => {
    if (copyTargets.length > 0) {
      onCopyTasksToDays(selectedDay, copyTargets);
      setShowCopyModal(false);
      setCopyTargets([]);
    }
  };

  const toggleCopyTarget = (day: DayOfWeek) => {
    if (copyTargets.includes(day)) {
      setCopyTargets(copyTargets.filter((d) => d !== day));
    } else {
      setCopyTargets([...copyTargets, day]);
    }
  };

  return (
    <div className="space-y-4 pb-28">
      {/* iOS Segmented Day Control */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 shadow-ios">
        {DAYS_ORDER.map((day) => {
          const isSelected = day === selectedDay;
          const count = tasks.filter((t) => t.dayOfWeek === day).length;

          return (
            <button
              key={day}
              onClick={() => {
                setSelectedDay(day);
                setShowAddForm(false);
                setEditingTask(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-0.5 active:scale-95 ${
                isSelected
                  ? 'bg-ios-blue text-white shadow-ios font-bold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>{DAY_LABELS[day].short}</span>
              <span className={`text-[10px] ${isSelected ? 'text-white/90 font-bold' : 'text-slate-400'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Action Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            {DAY_LABELS[selectedDay].full} の設定
          </h2>
          <p className="text-xs text-slate-500">
            毎週{DAY_LABELS[selectedDay].short}曜日に繰り返し行うタスク
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {dayTasks.length > 0 && (
            <button
              onClick={() => {
                setCopyTargets(DAYS_ORDER.filter((d) => d !== selectedDay));
                setShowCopyModal(true);
              }}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-ios-blue transition-all active:scale-95 shadow-sm"
              title="他曜日にコピー"
            >
              <Copy className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setTitle('');
              setNote('');
              setCategory('anytime');
              setShowAddForm(true);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-ios-blue text-white font-bold text-xs shadow-ios active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            新規登録
          </button>
        </div>
      </div>

      {/* Task List */}
      {dayTasks.length > 0 ? (
        <div className="space-y-2.5">
          <p className="text-[11px] text-slate-500 flex items-center gap-1 px-1">
            <GripVertical className="w-3.5 h-3.5 text-slate-400" />
            <span>アイコンをドラッグして順序を変更できます</span>
          </p>

          {dayTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={openEditModal}
              onDelete={onDeleteTask}
              isReadOnly={true}
              isDraggable={true}
              isDragging={draggedIndex === index}
              isDragOver={dragOverIndex === index && draggedIndex !== index}
              containerProps={{
                'data-task-index': index,
                draggable: true,
                onDragStart: (e) => handleDragStart(index, e),
                onDragOver: (e) => handleDragOver(index, e),
                onDrop: (e) => handleDrop(index, e),
                onDragEnd: handleDragEnd,
              }}
              dragHandleProps={{
                onTouchStart: () => handleTouchStart(index),
                onTouchMove: handleTouchMove,
                onTouchEnd: handleTouchEnd,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-dashed border-slate-300 rounded-2xl flex flex-col items-center gap-3 shadow-sm">
          <Layers className="w-8 h-8 text-slate-400" />
          <p className="text-sm font-semibold text-slate-700">
            {DAY_LABELS[selectedDay].short}曜日のルーティンは未登録です
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="text-xs font-bold px-4 py-2 rounded-xl bg-ios-blue text-white shadow-ios active:scale-95"
          >
            ルーティンを追加する
          </button>
        </div>
      )}

      {/* Add Sheet */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-2 mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-ios-blue" />
                {DAY_LABELS[selectedDay].short}曜日に新規追加
              </h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  タスク名
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例: メールチェック、ジムで筋トレ"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  時間帯・カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                >
                  <option value="morning">朝 (Morning)</option>
                  <option value="afternoon">昼 (Afternoon)</option>
                  <option value="evening">夜 (Evening)</option>
                  <option value="anytime">いつでも (Anytime)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  メモ (任意)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="メモや補足情報"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white resize-none transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-bold shadow-ios active:scale-95 disabled:opacity-40"
                >
                  登録する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Sheet */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-2 mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-ios-blue" />
                タスク編集
              </h3>
              <button
                onClick={() => setEditingTask(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  タスク名
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  時間帯・カテゴリ
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white transition-colors"
                >
                  <option value="morning">朝 (Morning)</option>
                  <option value="afternoon">昼 (Afternoon)</option>
                  <option value="evening">夜 (Evening)</option>
                  <option value="anytime">いつでも (Anytime)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  メモ
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-ios-blue focus:bg-white resize-none transition-colors"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-bold shadow-ios active:scale-95 disabled:opacity-40"
                >
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Copy Sheet */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end justify-center sm:items-center p-0 sm:p-4 animate-fade-in">
          <div className="bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden -mt-2 mb-2" />
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">
                {DAY_LABELS[selectedDay].short}曜日のタスクをコピー
              </h3>
              <button
                onClick={() => setShowCopyModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              コピー先の曜日を選択してください:
            </p>

            <div className="grid grid-cols-2 gap-2">
              {DAYS_ORDER.filter((d) => d !== selectedDay).map((day) => {
                const isChecked = copyTargets.includes(day);
                return (
                  <label
                    key={day}
                    onClick={() => toggleCopyTarget(day)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all active:scale-95 ${
                      isChecked
                        ? 'bg-blue-50 border-ios-blue text-ios-blue font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-ios-blue accent-ios-blue"
                    />
                    {DAY_LABELS[day].full}
                  </label>
                );
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={handleCopySubmit}
                disabled={copyTargets.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-ios-blue text-white text-xs font-bold shadow-ios active:scale-95 disabled:opacity-40"
              >
                {copyTargets.length} 曜日にコピー
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
