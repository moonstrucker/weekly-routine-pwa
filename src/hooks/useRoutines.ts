import { useState, useEffect, useCallback } from 'react';
import { Task, DayOfWeek, Category } from '../types';
import { getCurrentDayOfWeek, getFormattedDateKey } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

const STORAGE_KEY_TASKS = 'routine_flow_tasks_v1';
const STORAGE_KEY_LAST_DATE = 'routine_flow_last_opened_date';

// Initial default preset tasks to give new users immediate value
const DEFAULT_TASKS: Omit<Task, 'id' | 'isCompleted'>[] = [
  // Everyday routines
  { title: 'コップ1杯の水を飲む', category: 'morning', dayOfWeek: 'mon', note: '起床後すぐに水分補給' },
  { title: '朝のストレッチ (5分)', category: 'morning', dayOfWeek: 'mon' },
  { title: '今日の優先タスクを3つ決める', category: 'morning', dayOfWeek: 'mon' },
  { title: '読書・学習 (20分)', category: 'evening', dayOfWeek: 'mon' },

  { title: 'コップ1杯の水を飲む', category: 'morning', dayOfWeek: 'tue' },
  { title: '朝のストレッチ (5分)', category: 'morning', dayOfWeek: 'tue' },
  { title: 'ウォーキングまたは軽い運動', category: 'afternoon', dayOfWeek: 'tue' },
  { title: '日記・振り返りを書く', category: 'evening', dayOfWeek: 'tue' },

  { title: 'コップ1杯の水を飲む', category: 'morning', dayOfWeek: 'wed' },
  { title: 'デスクまわりの片付け', category: 'afternoon', dayOfWeek: 'wed' },
  { title: '読書・学習 (20分)', category: 'evening', dayOfWeek: 'wed' },

  { title: 'コップ1杯の水を飲む', category: 'morning', dayOfWeek: 'thu' },
  { title: '朝のストレッチ (5分)', category: 'morning', dayOfWeek: 'thu' },
  { title: '有酸素運動 / 筋トレ', category: 'afternoon', dayOfWeek: 'thu' },

  { title: 'コップ1杯の水を飲む', category: 'morning', dayOfWeek: 'fri' },
  { title: '今週の成果を振り返る', category: 'afternoon', dayOfWeek: 'fri' },
  { title: '自分へのプチご褒美', category: 'evening', dayOfWeek: 'fri' },

  { title: 'ゆっくり朝食をとる', category: 'morning', dayOfWeek: 'sat' },
  { title: '部屋の掃除・換気', category: 'morning', dayOfWeek: 'sat' },
  { title: '趣味・リフレッシュタイム', category: 'afternoon', dayOfWeek: 'sat' },

  { title: '翌週の予定・ルーティン確認', category: 'evening', dayOfWeek: 'sun', note: 'スムーズな月曜スタートのために' },
  { title: '早めの就寝 (23時まで)', category: 'evening', dayOfWeek: 'sun' },
];

export function useRoutines() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastOpenedDate, setLastOpenedDate] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize and check date on mount & visibility change
  const checkAndInitData = useCallback(() => {
    const todayKey = getFormattedDateKey();
    const storedLastDate = localStorage.getItem(STORAGE_KEY_LAST_DATE) || '';
    const storedTasksRaw = localStorage.getItem(STORAGE_KEY_TASKS);

    let loadedTasks: Task[] = [];

    if (storedTasksRaw) {
      try {
        loadedTasks = JSON.parse(storedTasksRaw);
      } catch (e) {
        console.error('Failed to parse stored tasks', e);
      }
    }

    // First time setup with defaults
    if (!storedTasksRaw || loadedTasks.length === 0) {
      loadedTasks = DEFAULT_TASKS.map((t, idx) => ({
        ...t,
        id: `default-${idx}-${Date.now()}`,
        isCompleted: false,
      }));
    }

    // Check if date changed (e.g., next day)
    if (storedLastDate !== todayKey) {
      console.log(`[Date Rollover Detected] Resetting task completion status from ${storedLastDate} to ${todayKey}`);
      // Reset all completion flags for a fresh new day!
      loadedTasks = loadedTasks.map((task) => ({
        ...task,
        isCompleted: false,
        completedAt: undefined,
      }));

      localStorage.setItem(STORAGE_KEY_LAST_DATE, todayKey);
    }

    setTasks(loadedTasks);
    setLastOpenedDate(todayKey);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(loadedTasks));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    checkAndInitData();

    // Check when user returns to app / tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndInitData();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => window.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [checkAndInitData]);

  // Persist tasks helper
  const saveTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(updatedTasks));
  }, []);

  // One-click toggle completion status
  const toggleTaskCompletion = useCallback(
    (taskId: string) => {
      const todayDay = getCurrentDayOfWeek();

      const updated = tasks.map((task) => {
        if (task.id === taskId) {
          const nextCompleted = !task.isCompleted;
          return {
            ...task,
            isCompleted: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return task;
      });

      saveTasks(updated);

      // Check if all today's tasks are completed to trigger confetti!
      const todayTasks = updated.filter((t) => t.dayOfWeek === todayDay);
      if (todayTasks.length > 0 && todayTasks.every((t) => t.isCompleted)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#06B6D4', '#10B981', '#F59E0B', '#8B5CF6'],
        });
      }
    },
    [tasks, saveTasks]
  );

  // Add task
  const addTask = useCallback(
    (dayOfWeek: DayOfWeek, title: string, category: Category = 'anytime', note?: string) => {
      if (!title.trim()) return;

      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: title.trim(),
        category,
        dayOfWeek,
        isCompleted: false,
        note: note?.trim() || undefined,
      };

      saveTasks([...tasks, newTask]);
    },
    [tasks, saveTasks]
  );

  // Edit task
  const updateTask = useCallback(
    (taskId: string, updates: Partial<Omit<Task, 'id'>>) => {
      const updated = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates };
        }
        return task;
      });
      saveTasks(updated);
    },
    [tasks, saveTasks]
  );

  // Delete task
  const deleteTask = useCallback(
    (taskId: string) => {
      saveTasks(tasks.filter((t) => t.id !== taskId));
    },
    [tasks, saveTasks]
  );

  // Copy tasks from one day to target days
  const copyTasksToDays = useCallback(
    (fromDay: DayOfWeek, targetDays: DayOfWeek[]) => {
      const sourceTasks = tasks.filter((t) => t.dayOfWeek === fromDay);
      if (sourceTasks.length === 0 || targetDays.length === 0) return;

      const newCopiedTasks: Task[] = [];

      targetDays.forEach((day) => {
        sourceTasks.forEach((st) => {
          newCopiedTasks.push({
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            title: st.title,
            category: st.category,
            dayOfWeek: day,
            isCompleted: false,
            note: st.note,
          });
        });
      });

      saveTasks([...tasks, ...newCopiedTasks]);
    },
    [tasks, saveTasks]
  );

  // Reset to default presets
  const resetToDefaults = useCallback(() => {
    const defaultInit = DEFAULT_TASKS.map((t, idx) => ({
      ...t,
      id: `default-${idx}-${Date.now()}`,
      isCompleted: false,
    }));
    saveTasks(defaultInit);
  }, [saveTasks]);

  // Export JSON
  const exportJSON = useCallback(() => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine_flow_backup_${getFormattedDateKey()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  // Import JSON
  const importJSON = useCallback(
    (jsonString: string) => {
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) {
          saveTasks(parsed);
          return true;
        }
      } catch (e) {
        console.error('Failed to import JSON', e);
      }
      return false;
    },
    [saveTasks]
  );

  // Reorder tasks for a specific day
  const reorderTasks = useCallback(
    (dayOfWeek: DayOfWeek, sourceIndex: number, destinationIndex: number) => {
      const dayTasks = tasks.filter((t) => t.dayOfWeek === dayOfWeek);
      if (
        sourceIndex < 0 ||
        sourceIndex >= dayTasks.length ||
        destinationIndex < 0 ||
        destinationIndex >= dayTasks.length ||
        sourceIndex === destinationIndex
      ) {
        return;
      }

      const reorderedDayTasks = Array.from(dayTasks);
      const [movedTask] = reorderedDayTasks.splice(sourceIndex, 1);
      reorderedDayTasks.splice(destinationIndex, 0, movedTask);

      let dayTaskPointer = 0;
      const newTasks = tasks.map((task) => {
        if (task.dayOfWeek === dayOfWeek) {
          const replacement = reorderedDayTasks[dayTaskPointer];
          dayTaskPointer++;
          return replacement;
        }
        return task;
      });

      saveTasks(newTasks);
    },
    [tasks, saveTasks]
  );

  return {
    tasks,
    isLoaded,
    lastOpenedDate,
    toggleTaskCompletion,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    copyTasksToDays,
    resetToDefaults,
    exportJSON,
    importJSON,
  };
}
