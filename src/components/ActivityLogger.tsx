import React, { useState } from 'react';
import { Activity, ActivityCategory, ActivityUnit, ActivityLog } from '../types';
import { 
  Plus, 
  Flame, 
  Clock, 
  Trash2, 
  ChevronRight, 
  CheckCircle, 
  Layers, 
  PlusCircle, 
  PlusSquare,
  HelpCircle
} from 'lucide-react';

interface ActivityLoggerProps {
  activities: Activity[];
  logs: ActivityLog[];
  onAddActivity: (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => void;
  onLogSession: (activityId: string, amount: number, note: string, date: string) => void;
  onDeleteActivity: (id: string) => void;
}

export default function ActivityLogger({
  activities,
  logs,
  onAddActivity,
  onLogSession,
  onDeleteActivity
}: ActivityLoggerProps) {
  // Creating activities variables
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('Study Sessions');
  const [newUnit, setNewUnit] = useState<ActivityUnit>('Minutes');
  const [newGoal, setNewGoal] = useState<number>(45);

  // Logging variables
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');
  const [logAmount, setLogAmount] = useState<number>(30);
  const [logNote, setLogNote] = useState('');
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newGoal <= 0) return;
    onAddActivity({
      title: newTitle,
      category: newCategory,
      unit: newUnit,
      dailyGoal: newGoal
    });
    setNewTitle('');
    setNewGoal(45);
    setShowCreateForm(false);
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId || logAmount <= 0) return;
    onLogSession(selectedActivityId, logAmount, logNote, logDate);
    
    // Clear log form state
    setLogNote('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  const selectedActivityObj = activities.find(a => a.id === selectedActivityId);

  return (
    <div className="space-y-6" id="activity-logger-module-widget">
      {/* 1. Quick log Effort Widget Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm tracking-tight mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-emerald-600" />
          <span>Record a Learning Study Session</span>
        </h3>

        <form onSubmit={handleLogSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Select Active Activity</label>
              <select
                required
                value={selectedActivityId}
                onChange={(e) => {
                  const actId = e.target.value;
                  setSelectedActivityId(actId);
                  const act = activities.find(a => a.id === actId);
                  if (act) {
                    setLogAmount(act.dailyGoal);
                  }
                }}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-1 focus:ring-emerald-500 text-slate-700"
              >
                <option value="">-- Choose what to log --</option>
                {activities.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Completed Effort {selectedActivityObj ? `(${selectedActivityObj.unit})` : 'Amount'}
              </label>
              <div className="flex gap-2">
                <input
                  required
                  type="number"
                  min={1}
                  value={logAmount}
                  onChange={(e) => setLogAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-1 focus:ring-emerald-500 text-slate-700"
                />
                <span className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-mono px-3 py-2 rounded-lg flex items-center">
                  {selectedActivityObj?.unit || 'Units'}
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Accomplished Lessons / Study Notes</label>
                  <input
                    type="text"
                    value={logNote}
                    onChange={(e) => setLogNote(e.target.value)}
                    placeholder="e.g. Read chapters 3 and 4, solved 10 arithmetic tasks"
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-1 focus:ring-emerald-500 text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Logging Date</label>
                  <input
                    required
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-slate-50 focus:ring-1 focus:ring-emerald-500 text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-1.5">
            <div>
              {successMsg && (
                <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Log saved successfully! Streak secure.</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={!selectedActivityId}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Record Log Entry
            </button>
          </div>
        </form>
      </div>

      {/* 2. Habit targets & tracking creator */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>Created Learning Habits ({activities.length})</span>
            </h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Your bespoke plans that require steady consistency</p>
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{showCreateForm ? 'Close plan' : 'Plan new habit'}</span>
          </button>
        </div>

        {/* Form to create activity */}
        {showCreateForm && (
          <form onSubmit={handleCreateActivity} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Activity Name / Target</label>
                <input
                  required
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Study SAT Algebra, Learn Arabic"
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Habit Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ActivityCategory)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white text-slate-700"
                >
                  <option value="Reading">Reading</option>
                  <option value="Exam Preparation">Exam Preparation</option>
                  <option value="Course Progress">Course Progress</option>
                  <option value="Study Sessions">Study Sessions</option>
                  <option value="Skill Learning">Skill Learning</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Unit</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as ActivityUnit)}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white text-slate-700"
                >
                  <option value="Minutes">Minutes</option>
                  <option value="Hours">Hours</option>
                  <option value="Pages">Pages</option>
                  <option value="Chapters">Chapters</option>
                  <option value="Lessons">Lessons</option>
                  <option value="Problems">Problems</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Daily Commitment Goal</label>
                <input
                  required
                  type="number"
                  min={1}
                  value={newGoal}
                  onChange={(e) => setNewGoal(Math.max(1, Number(e.target.value)))}
                  className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-1">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="py-1.5 px-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
              >
                Create Target
              </button>
            </div>
          </form>
        )}

        {/* Existing plans list */}
        <div className="space-y-2.5">
          {activities.length === 0 ? (
            <div className="border border-dashed border-slate-200 rounded-xl py-6 text-center text-slate-400 text-xs">
              No daily programs created. Create one from the button above!
            </div>
          ) : (
            activities.map((act) => {
              // Count how many logs exist matching this activity
              const matchingLogs = logs.filter(l => l.activityId === act.id);
              const totalLoggedAmount = matchingLogs.reduce((sum, log) => sum + log.amount, 0);

              return (
                <div key={act.id} className="border border-slate-200 hover:border-slate-300 transition-all rounded-xl p-3 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></span>
                    <div>
                      <h4 className="font-semibold text-slate-850 text-xs">{act.title}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Category: <strong className="text-slate-500">{act.category}</strong> • Target: <strong className="text-slate-500">{act.dailyGoal} {act.unit}/day</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block font-bold">Logged cumulative:</span>
                      <span className="text-xs font-mono font-extrabold text-slate-800">{totalLoggedAmount} {act.unit}</span>
                    </div>

                    <button
                      onClick={() => onDeleteActivity(act.id)}
                      className="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      title="Remove Target"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
