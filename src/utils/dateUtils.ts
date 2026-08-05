import { DayOfWeek, Category } from '../types';

export const DAYS_ORDER: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const DAY_LABELS: Record<DayOfWeek, { full: string; short: string; en: string }> = {
  mon: { full: '月曜日', short: '月', en: 'Monday' },
  tue: { full: '火曜日', short: '火', en: 'Tuesday' },
  wed: { full: '水曜日', short: '水', en: 'Wednesday' },
  thu: { full: '木曜日', short: '木', en: 'Thursday' },
  fri: { full: '金曜日', short: '金', en: 'Friday' },
  sat: { full: '土曜日', short: '土', en: 'Saturday' },
  sun: { full: '日曜日', short: '日', en: 'Sunday' },
};

export const CATEGORY_INFO: Record<Category, { label: string; icon: string; colorClass: string; bgClass: string }> = {
  morning: {
    label: '朝',
    icon: 'Sun',
    colorClass: 'text-amber-400 border-amber-500/30',
    bgClass: 'bg-amber-500/10 text-amber-300',
  },
  afternoon: {
    label: '昼',
    icon: 'SunMedium',
    colorClass: 'text-cyan-400 border-cyan-500/30',
    bgClass: 'bg-cyan-500/10 text-cyan-300',
  },
  evening: {
    label: '夜',
    icon: 'Moon',
    colorClass: 'text-purple-400 border-purple-500/30',
    bgClass: 'bg-purple-500/10 text-purple-300',
  },
  anytime: {
    label: 'いつでも',
    icon: 'Clock',
    colorClass: 'text-emerald-400 border-emerald-500/30',
    bgClass: 'bg-emerald-500/10 text-emerald-300',
  },
};

/**
 * Returns today's DayOfWeek string (e.g. 'mon', 'tue')
 */
export function getCurrentDayOfWeek(date: Date = new Date()): DayOfWeek {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ...
  const mapIndexToDay: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return mapIndexToDay[dayIndex];
}

/**
 * Returns formatted date YYYY-MM-DD
 */
export function getFormattedDateKey(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Format date for display, e.g. "2026年7月26日 (日)"
 */
export function getDisplayDateString(date: Date = new Date()): string {
  const dayOfWeek = getCurrentDayOfWeek(date);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${date.getFullYear()}年${month}月${day}日 (${DAY_LABELS[dayOfWeek].short})`;
}
