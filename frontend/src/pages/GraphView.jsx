import React from 'react';
import ConflictGraph from '../components/ConflictGraph';

export default function GraphView({ conflictGraph, timeSlots }) {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white">Graph-Based Conflict Representation</h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive visual conflict graph demonstrating chromatic coloring ($K$) and constraint edge connections.
        </p>
      </div>

      <ConflictGraph conflictGraph={conflictGraph} timeSlots={timeSlots} />
    </div>
  );
}
