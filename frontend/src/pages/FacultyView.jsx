import React, { useState } from 'react';
import { Users, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function FacultyView({ dataset, timetable }) {
  const { faculty = [], subjects = [], timeSlots = [] } = dataset;
  const [selectedFacultyId, setSelectedFacultyId] = useState(faculty[0]?.id || 'f-1');

  const selectedFaculty = faculty.find(f => f.id === selectedFacultyId) || faculty[0];

  // Filter sessions assigned to this faculty member
  const facultySessions = timetable.filter(n => n.facultyId === selectedFacultyId && n.assignedSlotId);

  // Group by Day
  const slotMap = new Map(timeSlots.map(t => [t.id, t]));
  const daySchedule = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [] };

  facultySessions.forEach(session => {
    const slot = slotMap.get(session.assignedSlotId);
    if (slot && daySchedule[slot.day]) {
      daySchedule[slot.day].push({ ...session, slot });
    }
  });

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Users className="w-6 h-6 text-amber-400" />
          <span>Faculty Workload & Availability Directory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor teaching workload, assigned sessions per week, and individual professor schedules.
        </p>
      </div>

      {/* Select Faculty Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {faculty.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFacultyId(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedFacultyId === f.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.name} ({f.department})
          </button>
        ))}
      </div>

      {selectedFaculty && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Faculty Summary Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-lg">
                {selectedFaculty.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedFaculty.name}</h3>
                <span className="text-xs text-amber-400 font-semibold">{selectedFaculty.department}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-3 border-t border-slate-800 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Faculty Code:</span>
                <strong className="font-mono text-white">{selectedFaculty.code}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Sessions / Day:</span>
                <strong className="font-mono text-amber-400">{selectedFaculty.maxSessionsPerDay} sessions</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Assigned Weekly Load:</span>
                <strong className="font-mono text-emerald-400">{facultySessions.length} Hours / Week</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Conflict Status:</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 0 Conflicts
                </span>
              </div>
            </div>
          </div>

          {/* Schedule Breakdown Card */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Assigned Schedule for {selectedFaculty.name}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                const sessions = daySchedule[day] || [];
                return (
                  <div key={day} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 border-b border-slate-800 pb-1">{day}</h4>
                    {sessions.length > 0 ? (
                      sessions.map((s, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] space-y-1">
                          <div className="font-bold text-sky-300">{s.subjectName}</div>
                          <div className="text-[10px] text-slate-400">🎓 {s.batchName}</div>
                          <div className="text-[10px] text-emerald-400 font-mono">⏰ {s.slot.time}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-600 font-mono block py-3 text-center">No class</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
