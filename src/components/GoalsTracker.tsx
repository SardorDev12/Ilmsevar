import React, { useState } from 'react';
import { Goal, ActivityCategory } from '../types';
import { Target, PlusCircle, Trash2, Edit2, Check, Sparkles, TrendingUp } from 'lucide-react';

interface GoalsTrackerProps {
  goals: Goal[];
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
  onUpdateGoalProgress: (goalId: string, newValue: number) => void;
  onDeleteGoal: (goalId: string) => void;
}

export default function GoalsTracker({
  goals,
  onAddGoal,
  onUpdateGoalProgress,
  onDeleteGoal
}: GoalsTrackerProps) {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [targetVal, setTargetVal] = useState<number>(100);
  const [currentVal, setCurrentVal] = useState<number>(0);
  const [goalUnit, setGoalUnit] = useState('Score');
  const [goalCategory, setGoalCategory] = useState<ActivityCategory>('Exam Preparation');

  // Value updates
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [tempProgressVal, setTempProgressVal] = useState<number>(0);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || targetVal <= 0) return;
    onAddGoal({
      title: newTitle,
      targetValue: targetVal,
      currentValue: currentVal,
      unit: goalUnit,
      category: goalCategory
    });
    setNewTitle('');
    setTargetVal(100);
    setCurrentVal(0);
    setShowAddGoal(false);
  };

  const startEditing = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setTempProgressVal(goal.currentValue);
  };

  const saveEditedProgress = (goalId: string) => {
    onUpdateGoalProgress(goalId, tempProgressVal);
    setEditingGoalId(null);
  };

  const getProgressPercentage = (g: Goal) => {
    if (g.targetValue === 0) return 0;
    const progress = (g.currentValue / g.targetValue) * 100;
    return Math.min(100, Math.max(0, Math.round(progress)));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm" id="goals-progress-widget-container">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <span>Learning Milestones & Goals ({goals.length})</span>
          </h3>
          <p className="text-slate-400 text-[10px] mt-0.5">Define your high-level target ambitions and measure growth</p>
        </div>

        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{showAddGoal ? 'Close Form' : 'Add Goal'}</span>
        </button>
      </div>

      {/* Form definition to add Goal */}
      {showAddGoal && (
        <form onSubmit={handleCreateGoal} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Goal Milestone Title</label>
              <input
                required
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. TOEFL target of 110, Master TypeScript fundamentals"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Category Type</label>
              <select
                value={goalCategory}
                onChange={(e) => setGoalCategory(e.target.value as ActivityCategory)}
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
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Unit system (e.g., Score, % finished, Hours)</label>
              <input
                required
                type="text"
                value={goalUnit}
                onChange={(e) => setGoalUnit(e.target.value)}
                placeholder="Score, Pages, Lessons"
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Starting Progress Value</label>
              <input
                required
                type="number"
                step="any"
                min={0}
                value={currentVal}
                onChange={(e) => setCurrentVal(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Target End Value</label>
              <input
                required
                type="number"
                step="any"
                min={1}
                value={targetVal}
                onChange={(e) => setTargetVal(Number(e.target.value))}
                className="w-full text-xs p-2.5 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={() => setShowAddGoal(false)}
              className="py-1.5 px-3 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-1.5 px-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Set Milestone
            </button>
          </div>
        </form>
      )}

      {/* Grid listing goals */}
      <div className="space-y-4">
        {goals.map((g) => {
          const percent = getProgressPercentage(g);
          const isEditing = editingGoalId === g.id;

          return (
            <div key={g.id} className="border border-slate-200/80 rounded-xl p-4 hover:border-slate-300 transition-all bg-slate-50/20 shadow-2xs">
              <div className="flex justify-between items-start gap-3 mb-2.5">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 font-mono tracking-wide">{g.category}</span>
                  <h4 className="font-semibold text-slate-800 text-xs tracking-tight leading-tight mt-0.5">{g.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold font-mono text-emerald-750 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/50">
                    {percent}% Progress
                  </span>
                  <button
                    onClick={() => onDeleteGoal(g.id)}
                    className="text-slate-300 hover:text-red-500 p-0.5 rounded-sm transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Slider Track */}
              <div className="space-y-2">
                <div className="w-full bg-slate-150 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  {isEditing ? (
                    <div className="flex items-center gap-2 w-full mt-1.5 bg-white p-2 border border-slate-200 rounded-lg">
                      <span className="text-[10px]">Actual Value:</span>
                      <input
                        type="number"
                        step="any"
                        min={0}
                        max={g.targetValue}
                        value={tempProgressVal}
                        onChange={(e) => setTempProgressVal(Number(e.target.value))}
                        className="w-20 text-xs py-0.5 px-1.5 border border-slate-200 rounded-md bg-slate-50"
                      />
                      <button
                        onClick={() => saveEditedProgress(g.id)}
                        className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setEditingGoalId(null)}
                        className="text-[9px] text-slate-400 hover:text-slate-650 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <span>Current: <strong>{g.currentValue} {g.unit}</strong></span>
                        <span>•</span>
                        <span>Target: <strong>{g.targetValue} {g.unit}</strong></span>
                      </div>
                      
                      <button
                        onClick={() => startEditing(g)}
                        className="text-[10px] font-bold text-indigo-750 hover:text-indigo-850 flex items-center gap-0.5"
                      >
                        <Edit2 className="w-2.5 h-2.5" />
                        <span>Edit Progress</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-150 rounded-xl bg-slate-50/50">
            No milestones registered yet. Create one above to track long-term study!
          </div>
        )}
      </div>
    </div>
  );
}
