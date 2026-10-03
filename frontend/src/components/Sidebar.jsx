import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  GitCommit, 
  Activity, 
  Users, 
  DoorOpen, 
  GraduationCap, 
  Sliders 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generator', label: 'Timetable Generator', icon: CalendarRange },
    { id: 'graph', label: 'Conflict Graph', icon: GitCommit },
    { id: 'trace', label: 'Algorithm Trace', icon: Activity },
    { id: 'faculty', label: 'Faculty', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: DoorOpen },
    { id: 'batches', label: 'Student Batches', icon: GraduationCap },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="py-4 px-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sky-500/10 text-sky-400 border-l-4 border-sky-500 font-semibold pl-2.5 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/80 m-3 rounded-xl bg-slate-850/60 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span>Engine Status:</span>
          <span className="text-emerald-400 font-semibold flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Active
          </span>
        </div>
        <div className="text-[11px] text-slate-500 leading-relaxed">
          Graph Coloring (DSatur) + Greedy Slot Allocation + Backtracking
        </div>
      </div>
    </aside>
  );
}
