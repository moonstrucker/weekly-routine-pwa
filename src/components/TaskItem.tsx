import React, { useState } from 'react';
import { Check, Trash2, Edit2, Sun, SunMedium, Moon, Clock, GripVertical } from 'lucide-react';
import { Task, Category } from '../types';
import { playTaskCompleteSound, playTaskRestoreSound, unlockAudioContext } from '../utils/audioUtils';
import { triggerHapticFeedback } from '../utils/hapticsUtils';
import confetti from 'canvas-confetti';

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isReadOnly?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement> & Record<string, any>;
  containerProps?: React.HTMLAttributes<HTMLDivElement> & Record<string, any>;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isReadOnly = false,
  isDraggable = false,
  isDragging = false,
  isDragOver = false,
  dragHandleProps = {},
  containerProps = {},
}) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const getCategoryBadge = (category: Category) => {
    switch (category) {
      case 'morning':
        return { label: '朝', icon: <Sun className="w-3 h-3 text-amber-600" />, colorClass: 'bg-amber-50 text-amber-700 border-amber-200/80' };
      case 'afternoon':
        return { label: '昼', icon: <SunMedium className="w-3 h-3 text-sky-600" />, colorClass: 'bg-sky-50 text-sky-700 border-sky-200/80' };
      case 'evening':
        return { label: '夜', icon: <Moon className="w-3 h-3 text-purple-600" />, colorClass: 'bg-purple-50 text-purple-700 border-purple-200/80' };
      default:
        return { label: 'いつでも', icon: <Clock className="w-3 h-3 text-emerald-600" />, colorClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' };
    }
  };

  const badge = getCategoryBadge(task.category);

  const handleToggleWithAnimation = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-button') || (e.target as HTMLElement).closest('.drag-handle')) return;
    if (!onToggleComplete || isReadOnly || isDismissing) return;

    unlockAudioContext();

    if (!task.isCompleted) {
      // 完了時の消去アニメーション開始
      setIsDismissing(true);

      // サウンド・振動
      playTaskCompleteSound();
      triggerHapticFeedback(20);

      // 点击位置からの紙吹雪（Confetti）
      const clientX = e.clientX || window.innerWidth / 2;
      const clientY = e.clientY || window.innerHeight / 2;
      confetti({
        particleCount: 35,
        spread: 50,
        origin: {
          x: clientX / window.innerWidth,
          y: clientY / window.innerHeight,
        },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#EC4899'],
        ticks: 120,
        gravity: 1.2,
        scalar: 0.7,
      });

      // アニメーション完了後に状態更新（親のタスク完了関数呼び出し）
      setTimeout(() => {
        onToggleComplete(task.id);
        setIsDismissing(false);
      }, 400);
    } else {
      // 未完了へ戻す（復元）
      playTaskRestoreSound();
      triggerHapticFeedback(12);
      onToggleComplete(task.id);
    }
  };

  const getPanelStyle = (category: Category, isCompleted: boolean) => {
    if (isCompleted) {
      return 'bg-slate-100/70 border-slate-200/60 opacity-60';
    }
    switch (category) {
      case 'morning':
        return 'bg-[#FFFBEB] border-amber-200/80 hover:border-amber-400/60 hover:bg-[#FFF7ED] shadow-sm';
      case 'afternoon':
        return 'bg-[#F0F9FF] border-sky-200/80 hover:border-sky-400/60 hover:bg-[#E0F2FE] shadow-sm';
      case 'evening':
        return 'bg-[#F5F3FF] border-purple-200/80 hover:border-purple-400/60 hover:bg-[#EDE9FE] shadow-sm';
      default:
        return 'bg-[#F0FDF4] border-emerald-200/80 hover:border-emerald-400/60 hover:bg-[#DCFCE7] shadow-sm';
    }
  };

  const panelStyle = getPanelStyle(task.category, task.isCompleted);

  return (
    <div
      {...containerProps}
      onClick={handleToggleWithAnimation}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
        isDismissing
          ? 'animate-task-dismiss'
          : isDragging
          ? 'bg-blue-50/40 border-ios-blue/60 opacity-30 scale-[0.98] shadow-none'
          : isDragOver
          ? 'bg-blue-100/80 border-ios-blue ring-2 ring-ios-blue/40 shadow-ios scale-[1.01]'
          : task.isCompleted
          ? `${panelStyle} animate-task-restore`
          : panelStyle
      }`}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div
          {...dragHandleProps}
          className="drag-handle flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400 hover:text-ios-blue active:text-ios-blue transition-colors p-1 -ml-1 rounded-lg touch-none"
          title="ドラッグして順序を変更"
        >
          <GripVertical className="w-5 h-5" />
        </div>
      )}

      {/* iOS Circular Checkbox */}
      {onToggleComplete && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleToggleWithAnimation(e);
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            task.isCompleted || isDismissing
              ? 'bg-ios-green border-ios-green text-white shadow-ios-green animate-check-pop'
              : 'border-slate-300 hover:border-ios-blue group-hover:scale-105'
          }`}
          aria-label={task.isCompleted ? '未完了に戻す' : '完了にする'}
        >
          {(task.isCompleted || isDismissing) && <Check className="w-4 h-4 stroke-[3]" />}
        </button>
      )}

      {/* Task Info */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-semibold border ${badge.colorClass}`}
          >
            {badge.icon}
            {badge.label}
          </span>
        </div>

        <p
          className={`text-sm font-medium transition-all ${
            task.isCompleted || isDismissing
              ? 'line-through text-slate-400 font-normal'
              : 'text-slate-900'
          }`}
        >
          {task.title}
        </p>

        {task.note && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-sans">
            {task.note}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="action-button p-1.5 rounded-lg text-slate-400 hover:text-ios-blue hover:bg-slate-100 transition-colors"
              title="編集"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="action-button p-1.5 rounded-lg text-slate-400 hover:text-ios-red hover:bg-slate-100 transition-colors"
              title="削除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
