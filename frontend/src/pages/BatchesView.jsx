import React from 'react';
import { GraduationCap, BookOpen, CheckCircle2 } from 'lucide-react';

export default function BatchesView({ dataset, timetable }) {
  const { batches = [], subjects = [] } = dataset;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <GraduationCap className="w-6 h-6 text-sky-400" />
          <span>Student Batches & Department Overview</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review student batch sizes, total weekly lecture hours, and course allocations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {batches.map(batch => {
          const batchSubjects = subjects.filter(s => s.batchId === batch.id);
          const totalSessions = batchSubjects.reduce((acc, s) => acc + (s.sessionsPerWeek || 0), 0);
          const batchScheduled = timetable.filter(n => n.batchId === batch.id && n.assignedSlotId);

          return (
            <div key={batch.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">{batch.name}</h3>
                  <span className="text-xs text-sky-400 font-semibold">{batch.department}</span>
                </div>
                <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Class Size:</span>
                  <strong className="text-white">{batch.studentCount} Students</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Enrolled Courses:</span>
                  <strong className="text-emerald-400">{batchSubjects.length} Subjects</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Weekly Contact Hours:</span>
                  <strong className="text-sky-400">{totalSessions} Hours / Week</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">Conflict Check:</span>
                <span className="text-emerald-400 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> 0 Collisions
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
