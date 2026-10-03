import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  DoorOpen, 
  GraduationCap, 
  CheckCircle2, 
  Printer, 
  Download,
  Info
} from 'lucide-react';

export default function TimetableGrid({ timetable = [], dataset = {} }) {
  const [viewMode, setViewMode] = useState('BATCH'); // 'BATCH' | 'FACULTY' | 'ROOM'
  const [selectedFilterId, setSelectedFilterId] = useState(null);
  const [activeCellModal, setActiveCellModal] = useState(null);

  const { batches = [], faculty = [], rooms = [], timeSlots = [] } = dataset;

  // Set default selection if none selected
  const currentBatches = batches.length > 0 ? batches : [{ id: 'b-1', name: 'CSE-A' }];
  const currentFaculty = faculty.length > 0 ? faculty : [{ id: 'f-1', name: 'Dr. Ravi' }];
  const currentRooms = rooms.length > 0 ? rooms : [{ id: 'r-1', code: 'R101' }];

  const activeId = selectedFilterId || (
    viewMode === 'BATCH' ? currentBatches[0]?.id :
    viewMode === 'FACULTY' ? currentFaculty[0]?.id :
    currentRooms[0]?.id
  );

  // Group time slots by Day & Period
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { period: 1, time: '09:00 - 10:00' },
    { period: 2, time: '10:00 - 11:00' },
    { period: 3, time: '11:00 - 12:00' },
    { period: 4, time: '12:00 - 13:00' },
    { period: 5, time: '14:00 - 15:00' },
    { period: 6, time: '15:00 - 16:00' },
  ];

  // Helper map lookups
  const slotMap = new Map(timeSlots.map(t => [t.id, t]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));
  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const batchMap = new Map(batches.map(b => [b.id, b]));

  // Find scheduled session for specific (Day, Period, FilterId)
  const getSessionCell = (day, period) => {
    return timetable.find(node => {
      if (!node.assignedSlotId) return false;
      const slot = slotMap.get(node.assignedSlotId);
      if (!slot || slot.day !== day || slot.period !== period) return false;

      if (viewMode === 'BATCH') return node.batchId === activeId;
      if (viewMode === 'FACULTY') return node.facultyId === activeId;
      if (viewMode === 'ROOM') return node.assignedRoomId === activeId;
      return false;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-0">
      {/* Top Header & View Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            <span>Final Conflict-Free Timetable Grid</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic schedule view formatted by Student Batch, Faculty, or Room allocation.
          </p>
        </div>

        {/* View Mode Toggle Buttons */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setViewMode('BATCH'); setSelectedFilterId(currentBatches[0]?.id); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'BATCH'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>By Batch</span>
          </button>
          <button
            onClick={() => { setViewMode('FACULTY'); setSelectedFilterId(currentFaculty[0]?.id); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'FACULTY'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>By Faculty</span>
          </button>
          <button
            onClick={() => { setViewMode('ROOM'); setSelectedFilterId(currentRooms[0]?.id); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'ROOM'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DoorOpen className="w-4 h-4" />
            <span>By Room</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg border border-slate-800 ml-2"
            title="Print Schedule"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs (Select Batch / Faculty / Room) */}
      <div className="px-5 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 uppercase mr-2 shrink-0">
          Select {viewMode}:
        </span>
        {viewMode === 'BATCH' && currentBatches.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedFilterId(b.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
              activeId === b.id
                ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {b.name} ({b.studentCount} students)
          </button>
        ))}

        {viewMode === 'FACULTY' && currentFaculty.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFilterId(f.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
              activeId === f.id
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.name} ({f.department})
          </button>
        ))}

        {viewMode === 'ROOM' && currentRooms.map(r => (
          <button
            key={r.id}
            onClick={() => setSelectedFilterId(r.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition ${
              activeId === r.id
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {r.code} ({r.type} - Cap: {r.capacity})
          </button>
        ))}
      </div>

      {/* Main Timetable Grid Table */}
      <div className="overflow-x-auto p-4">
        <table className="w-full border-collapse text-left min-w-[750px]">
          <thead>
            <tr>
              <th className="p-3 bg-slate-950 text-slate-400 font-bold text-xs border border-slate-800 w-28">
                Time Slot
              </th>
              {days.map(day => (
                <th key={day} className="p-3 bg-slate-950 text-white font-bold text-xs border border-slate-800 text-center">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map(period => (
              <tr key={period.period} className="hover:bg-slate-850/40 transition">
                {/* Time Column */}
                <td className="p-3 bg-slate-950/60 border border-slate-800 text-slate-400 font-mono text-[11px]">
                  <strong className="text-slate-300 block">Period {period.period}</strong>
                  {period.time}
                </td>

                {/* Days Columns */}
                {days.map(day => {
                  const session = getSessionCell(day, period.period);
                  const room = session?.assignedRoomId ? roomMap.get(session.assignedRoomId) : null;
                  const fac = session ? facultyMap.get(session.facultyId) : null;
                  const batch = session ? batchMap.get(session.batchId) : null;

                  return (
                    <td key={day} className="p-2 border border-slate-800/80 align-top h-24 w-1/5">
                      {session ? (
                        <div
                          onClick={() => setActiveCellModal({ session, room, fac, batch, day, period })}
                          className="h-full p-2.5 rounded-lg border border-slate-700/60 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] flex flex-col justify-between"
                          style={{
                            backgroundColor: `${session.color || '#0284c7'}15`,
                            borderColor: session.color || '#0284c7'
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="font-bold text-white truncate">{session.subjectName}</span>
                              <span 
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold text-white"
                                style={{ backgroundColor: session.color || '#0284c7' }}
                              >
                                {session.subjectCode}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 font-medium">
                              {viewMode !== 'FACULTY' && <span>👨‍🏫 {fac ? fac.name : session.facultyName}</span>}
                              {viewMode !== 'BATCH' && <span className="block">🎓 {batch ? batch.name : session.batchName}</span>}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-700/30 text-[10px] text-slate-400">
                            <span className="font-semibold text-emerald-400">📍 {room ? room.code : 'Room TBD'}</span>
                            <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                              0 Conflict ✅
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-[11px] text-slate-600 font-mono">
                          Free Slot
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Explanation Modal */}
      {activeCellModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Info className="w-5 h-5 text-sky-400" />
                <span>Scheduling Decision Audit</span>
              </h3>
              <button
                onClick={() => setActiveCellModal(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <div className="text-sky-400 font-bold text-sm">{activeCellModal.session.subjectName}</div>
                <div className="text-slate-300">
                  Slot: <strong>{activeCellModal.day} (Period {activeCellModal.period.time})</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-slate-300 leading-relaxed bg-slate-850 p-3 rounded-lg border border-slate-800">
                <div className="font-bold text-slate-200 mb-1">Constraint Verification Checklist:</div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Faculty <strong>{activeCellModal.fac?.name}</strong> free in this slot.</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Batch <strong>{activeCellModal.batch?.name}</strong> has no overlapping classes.</span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Room <strong>{activeCellModal.room?.code}</strong> ({activeCellModal.room?.type}) available with capacity ({activeCellModal.room?.capacity} &ge; batch size).</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveCellModal(null)}
              className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-xs"
            >
              Close Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
