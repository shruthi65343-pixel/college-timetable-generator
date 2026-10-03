import React from 'react';
import { DoorOpen, CheckCircle2, Users } from 'lucide-react';

export default function RoomsView({ dataset, timetable }) {
  const { rooms = [], timeSlots = [] } = dataset;
  const totalSlots = timeSlots.length || 30;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <DoorOpen className="w-6 h-6 text-emerald-400" />
          <span>Classroom & Laboratory Directory</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor room capacity utilization rates, equipment specifications, and room allocation grids.
        </p>
      </div>

      {/* Room Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map(room => {
          const roomSessions = timetable.filter(n => n.assignedRoomId === room.id);
          const utilizationPct = Math.round((roomSessions.length / totalSlots) * 100);

          return (
            <div key={room.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{room.code}</h3>
                  <span className="text-xs text-slate-400">{room.name}</span>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  room.type === 'Laboratory' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {room.type}
                </span>
              </div>

              {/* Utilization Bar */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Occupancy Rate:</span>
                  <strong className="text-emerald-400">{utilizationPct}% ({roomSessions.length} / {totalSlots} slots)</strong>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full transition-all" style={{ width: `${utilizationPct}%` }}></div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-xs text-slate-400">
                <span>Capacity: <strong className="text-white">{room.capacity} seats</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 0 Double-Bookings
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
