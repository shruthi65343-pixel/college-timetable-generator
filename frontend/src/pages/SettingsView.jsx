import React, { useState } from 'react';
import { Sliders, Server, Cpu, CheckCircle2 } from 'lucide-react';

export default function SettingsView({ useBackend, setUseBackend }) {
  const [maxBacktrack, setMaxBacktrack] = useState(500);

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Sliders className="w-6 h-6 text-sky-400" />
          <span>System & Algorithm Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure solver execution parameters, heuristic priorities, and backend service connection.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
          1. Engine Service Mode
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setUseBackend(false)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              !useBackend ? 'bg-sky-500/10 border-sky-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Cpu className="w-5 h-5 text-sky-400" />
              <span className="font-bold text-sm">In-Browser JS Engine (Instant)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runs Graph Coloring & Backtracking directly in client browser. Zero network latency, works offline out-of-the-box.
            </p>
          </div>

          <div 
            onClick={() => setUseBackend(true)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              useBackend ? 'bg-sky-500/10 border-sky-500 text-white shadow-md' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <Server className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-sm">Python FastAPI Backend (http://localhost:8000)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Delegates solver calculations to the Python FastAPI microservice (`backend/main.py`).
            </p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 pt-4">
          2. Solver Parameters
        </h3>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Max Backtracking Limit ({maxBacktrack} Stack Frames)
            </label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={maxBacktrack}
              onChange={e => setMaxBacktrack(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500">
              Higher depth allows solving denser graph constraints before declaring infeasibility.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
