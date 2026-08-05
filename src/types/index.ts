export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type Category = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Task {
  id: string;
  title: string;
  category: Category;
  dayOfWeek: DayOfWeek;
  isCompleted: boolean;
  completedAt?: string;
  note?: string;
}

export interface PresetRoutine {
  title: string;
  category: Category;
  dayOfWeek: DayOfWeek;
  note?: string;
}

export type ViewTab = 'today' | 'routine' | 'settings';
