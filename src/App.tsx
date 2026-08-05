import { useState } from 'react';
import { useRoutines } from './hooks/useRoutines';
import { IPhoneStatusBar } from './components/IPhoneStatusBar';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TodayView } from './components/TodayView';
import { RoutineManager } from './components/RoutineManager';
import { SettingsView } from './components/SettingsView';
import { ViewTab, DayOfWeek } from './types';
import { getCurrentDayOfWeek } from './utils/dateUtils';
import { Loader2 } from 'lucide-react';

export function App() {
  const {
    tasks,
    isLoaded,
    lastOpenedDate,
    toggleTaskCompletion,
    addTask,
    updateTask,
    deleteTask,
    copyTasksToDays,
    resetToDefaults,
    exportJSON,
    importJSON,
  } = useRoutines();

  const [activeTab, setActiveTab] = useState<ViewTab>('today');
  const [routineManagerInitialDay, setRoutineManagerInitialDay] = useState<DayOfWeek>('mon');

  const todayDay = getCurrentDayOfWeek();
  const todayTasks = tasks.filter((t) => t.dayOfWeek === todayDay);
  const todayUncompletedCount = todayTasks.filter((t) => !t.isCompleted).length;

  const handleNavigateToRoutineSetup = (selectedDay?: DayOfWeek) => {
    if (selectedDay) {
      setRoutineManagerInitialDay(selectedDay);
    }
    setActiveTab('routine');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-3 font-sans">
        <Loader2 className="w-8 h-8 text-ios-blue animate-spin" />
        <p className="text-xs font-semibold text-slate-400">RoutineFlow を読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-ios-blue/30 font-sans">
      {/* iPhone Status Bar with Dynamic Island */}
      <IPhoneStatusBar />

      {/* Top Header */}
      <Header todayTasks={todayTasks} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 animate-fade-in">
        {activeTab === 'today' && (
          <TodayView
            tasks={tasks}
            onToggleComplete={toggleTaskCompletion}
            onNavigateToRoutineSetup={handleNavigateToRoutineSetup}
            onQuickAddTask={(day, title, cat) => addTask(day, title, cat)}
          />
        )}

        {activeTab === 'routine' && (
          <RoutineManager
            tasks={tasks}
            initialDay={routineManagerInitialDay}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onCopyTasksToDays={copyTasksToDays}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            tasks={tasks}
            lastOpenedDate={lastOpenedDate}
            onResetToDefaults={resetToDefaults}
            onExportJSON={exportJSON}
            onImportJSON={importJSON}
          />
        )}
      </main>

      {/* Fixed Bottom iOS Navigation Tab Bar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        todayUncompletedCount={todayUncompletedCount}
      />
    </div>
  );
}

export default App;
