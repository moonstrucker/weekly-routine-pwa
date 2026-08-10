import React from 'react';
import { Check, Trash2, Edit2, Sun, SunMedium, Moon, Clock, GripVertical } from 'lucide-react';
import { Task, Category } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  isReadOnly?: boolean;
  isDraggable?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
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
  const getCategoryBadge = (category: Category) => {
    switch (category) {
      case 'morning':
        return { label: '朝', icon: <Sun className="w-3 h-3 text-ios-yellow" />, colorClass: 'bg-ios-yellow/15 text-ios-yellow border-ios-yellow/30' };
      case 'afternoon':
        return { label: '昼', icon: <SunMedium className="w-3 h-3 text-ios-cyan" />, colorClass: 'bg-ios-cyan/15 text-ios-cyan border-ios-cyan/30' };
      case 'evening':
        return { label: '夜', icon: <Moon className="w-3 h-3 text-ios-purple" />, colorClass: 'bg-ios-purple/15 text-ios-purple border-ios-purple/30' };
      default:
        return { label: 'いつでも', icon: <Clock className="w-3 h-3 text-ios-green" />, colorClass: 'bg-ios-green/15 text-ios-green border-ios-green/30' };
    }
  };

  const badge = getCategoryBadge(task.category);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-button') || (e.target as HTMLElement).closest('.drag-handle')) return;
    if (onToggleComplete && !isReadOnly) {
      onToggleComplete(task.id);
    }
  };

  return (
    <div
      {...containerProps}
      onClick={handleCardClick}
      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
        isDragging
          ? 'bg-ios-card/40 border-ios-blue/60 opacity-30 scale-[0.98] shadow-none'
          : isDragOver
          ? 'bg-ios-cardHover border-ios-blue ring-2 ring-ios-blue/40 shadow-ios-lg scale-[1.01]'
          : task.isCompleted
          ? 'bg-ios-card/40 border-white/5 opacity-55'
          : 'bg-ios-card border-white/10 hover:border-ios-blue/40 shadow-ios'
      }`}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div
          {...dragHandleProps}
          className="drag-handle flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-500 hover:text-ios-blue active:text-ios-blue transition-colors p-1 -ml-1 rounded-lg touch-none"
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
            onToggleComplete(task.id);
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
            task.isCompleted
              ? 'bg-ios-green border-ios-green text-black shadow-ios-green scale-105'
              : 'border-slate-500/80 hover:border-ios-blue group-hover:scale-105'
          }`}
          aria-label={task.isCompleted ? '未完了に戻す' : '完了にする'}
        >
          {task.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
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
            task.isCompleted ? 'line-through text-slate-400 font-normal' : 'text-white'
          }`}
        >
          {task.title}
        </p>

        {task.note && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed font-sans">
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
              className="action-button p-1.5 rounded-lg text-slate-400 hover:text-ios-blue hover:bg-ios-cardHover transition-colors"
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
              className="action-button p-1.5 rounded-lg text-slate-400 hover:text-ios-red hover:bg-ios-cardHover transition-colors"
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
