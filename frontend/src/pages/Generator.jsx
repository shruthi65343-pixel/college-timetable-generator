import React, { useState } from 'react';
import { 
  CalendarRange, 
  Plus, 
  Trash2, 
  Edit3, 
  RotateCcw, 
  Play, 
  BookOpen, 
  Users, 
  DoorOpen, 
  GraduationCap, 
  Clock, 
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function Generator({ dataset, setDataset, onGenerate, isGenerating, onLoadDemoData }) {
  const [activeTabSection, setActiveTabSection] = useState('SUBJECTS'); // 'SUBJECTS' | 'FACULTY' | 'BATCHES' | 'ROOMS' | 'SLOTS'
  const [heuristic, setHeuristic] = useState('DSATUR');

  // Modal State for adding new records
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({});

  // Helper delete functions
  const handleDeleteItem = (sectionKey, itemId) => {
    setDataset(prev => ({
      ...prev,
      [sectionKey]: prev[sectionKey].filter(item => item.id !== itemId)
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const id = `${activeTabSection.toLowerCase()}-${Date.now()}`;
    const sectionKey = activeTabSection === 'SUBJECTS' ? 'subjects' :
                       activeTabSection === 'FACULTY' ? 'faculty' :
                       activeTabSection === 'BATCHES' ? 'batches' :
                       activeTabSection === 'ROOMS' ? 'rooms' : 'timeSlots';

    setDataset(prev => ({
      ...prev,
      [sectionKey]: [...prev[sectionKey], { id, ...newItem }]
    }));

    setIsAddModalOpen(false);
    setNewItem({});
  };

  const facultyMap = new Map(dataset.faculty.map(f => [f.id, f]));
  const batchMap = new Map(dataset.batches.map(b => [b.id, b]));

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title & Top CTA Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarRange className="w-5 h-5 text-sky-400" />
            <h1 className="text-2xl font-bold text-white">Timetable Input & Constraint Generator</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure subjects, faculty availabilities, room capacities, and student batch requirements.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onLoadDemoData}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/25 transition active:scale-95 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-white ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Solving Algorithm...' : 'Generate Timetable'}</span>
          </button>
        </div>
      </div>

      {/* Heuristic Configuration Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <Sliders className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-white">Algorithm Heuristic:</span>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="radio"
              name="heuristic"
              value="DSATUR"
              checked={heuristic === 'DSATUR'}
              onChange={() => setHeuristic('DSATUR')}
              className="accent-sky-500"
            />
            <span className="text-slate-300 font-semibold">DSatur (Degree of Saturation - Recommended)</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer ml-4">
            <input
              type="radio"
              name="heuristic"
              value="LARGEST_DEGREE"
              checked={heuristic === 'LARGEST_DEGREE'}
              onChange={() => setHeuristic('LARGEST_DEGREE')}
              className="accent-sky-500"
            />
            <span className="text-slate-300">Largest Degree First</span>
          </label>
        </div>

        <span className="text-slate-400">
          Max Backtracking Depth: <strong className="text-sky-400 font-mono">500 Iterations</strong>
        </span>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'SUBJECTS', label: 'Subjects', icon: BookOpen, count: dataset.subjects.length },
          { id: 'FACULTY', label: 'Faculty', icon: Users, count: dataset.faculty.length },
          { id: 'BATCHES', label: 'Student Batches', icon: GraduationCap, count: dataset.batches.length },
          { id: 'ROOMS', label: 'Rooms', icon: DoorOpen, count: dataset.rooms.length },
          { id: 'SLOTS', label: 'Time Slots', icon: Clock, count: dataset.timeSlots.length },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTabSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabSection(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shrink-0 ${
                isActive
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label} ({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* Main Data Table View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Managing {activeTabSection}
          </h2>
          <button
            onClick={() => { setNewItem({}); setIsAddModalOpen(true); }}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add {activeTabSection.slice(0, -1)}</span>
          </button>
        </div>

        {/* Subjects Table */}
        {activeTabSection === 'SUBJECTS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Code</th>
                  <th className="p-3">Subject Name</th>
                  <th className="p-3">Sessions / Week</th>
                  <th className="p-3">Assigned Faculty</th>
                  <th className="p-3">Student Batch</th>
                  <th className="p-3">Room Requirement</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dataset.subjects.map(s => {
                  const fac = facultyMap.get(s.facultyId);
                  const batch = batchMap.get(s.batchId);
                  return (
                    <tr key={s.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3 font-mono font-bold text-sky-400">{s.code}</td>
                      <td className="p-3 font-bold text-white flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color || '#3b82f6' }}></span>
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3 font-mono text-slate-300">{s.sessionsPerWeek} hrs/wk</td>
                      <td className="p-3 text-slate-300">{fac ? fac.name : s.facultyId}</td>
                      <td className="p-3 text-slate-300 font-semibold">{batch ? batch.name : s.batchId}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.requiredRoomType === 'Laboratory' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {s.requiredRoomType || 'Lecture Hall'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteItem('subjects', s.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Faculty Table */}
        {activeTabSection === 'FACULTY' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Code</th>
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Max Sessions / Day</th>
                  <th className="p-3">Availability</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dataset.faculty.map(f => (
                  <tr key={f.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3 font-mono font-bold text-amber-400">{f.code}</td>
                    <td className="p-3 font-bold text-white">{f.name}</td>
                    <td className="p-3 text-slate-300">{f.department}</td>
                    <td className="p-3 font-mono text-slate-300">{f.maxSessionsPerDay} sessions/day</td>
                    <td className="p-3 text-slate-400 text-[11px]">{f.preferredDays?.join(', ') || 'Mon-Fri'}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteItem('faculty', f.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Batches Table */}
        {activeTabSection === 'BATCHES' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Batch Code</th>
                  <th className="p-3">Batch Name</th>
                  <th className="p-3">Student Count</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dataset.batches.map(b => (
                  <tr key={b.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3 font-mono font-bold text-sky-400">{b.code}</td>
                    <td className="p-3 font-bold text-white">{b.name}</td>
                    <td className="p-3 font-mono text-slate-300">{b.studentCount} students</td>
                    <td className="p-3 text-slate-300">{b.department}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteItem('batches', b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rooms Table */}
        {activeTabSection === 'ROOMS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Room Code</th>
                  <th className="p-3">Room Name</th>
                  <th className="p-3">Capacity</th>
                  <th className="p-3">Room Type</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dataset.rooms.map(r => (
                  <tr key={r.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3 font-mono font-bold text-emerald-400">{r.code}</td>
                    <td className="p-3 font-bold text-white">{r.name}</td>
                    <td className="p-3 font-mono text-slate-300">{r.capacity} seats</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.type === 'Laboratory' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteItem('rooms', r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Slots Table */}
        {activeTabSection === 'SLOTS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800">
                  <th className="p-3">Slot ID</th>
                  <th className="p-3">Day</th>
                  <th className="p-3">Time Period</th>
                  <th className="p-3">Period #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dataset.timeSlots.map(t => (
                  <tr key={t.id} className="hover:bg-slate-850/50 transition">
                    <td className="p-3 font-mono text-slate-500">{t.id}</td>
                    <td className="p-3 font-bold text-white">{t.day}</td>
                    <td className="p-3 font-mono text-emerald-400">{t.time}</td>
                    <td className="p-3 text-slate-400 font-mono">Period {t.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddItem} className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New {activeTabSection.slice(0, -1)}</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              {activeTabSection === 'SUBJECTS' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Subject Code</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. CS401"
                      onChange={e => setNewItem(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Subject Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Cloud Computing"
                      onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Weekly Sessions</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="6"
                      defaultValue="3"
                      onChange={e => setNewItem(prev => ({ ...prev, sessionsPerWeek: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Assign Faculty</label>
                    <select
                      required
                      onChange={e => setNewItem(prev => ({ ...prev, facultyId: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="">Select Faculty</option>
                      {dataset.faculty.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Assign Student Batch</label>
                    <select
                      required
                      onChange={e => setNewItem(prev => ({ ...prev, batchId: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    >
                      <option value="">Select Batch</option>
                      {dataset.batches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {activeTabSection === 'FACULTY' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Faculty Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Priya"
                      onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value, code: e.target.value.toUpperCase().replace(/\s+/g, '-') }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Department</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Computer Science"
                      onChange={e => setNewItem(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </>
              )}

              {activeTabSection === 'BATCHES' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Batch Code & Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. CSE-D"
                      onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value, code: e.target.value }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Student Count</label>
                    <input
                      required
                      type="number"
                      defaultValue="60"
                      onChange={e => setNewItem(prev => ({ ...prev, studentCount: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </>
              )}

              {activeTabSection === 'ROOMS' && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Room Code</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. R104"
                      onChange={e => setNewItem(prev => ({ ...prev, code: e.target.value, name: `Lecture Hall ${e.target.value}` }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Capacity</label>
                    <input
                      required
                      type="number"
                      defaultValue="65"
                      onChange={e => setNewItem(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-lg text-xs shadow-md shadow-sky-500/20"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
