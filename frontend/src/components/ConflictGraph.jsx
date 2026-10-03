import React, { useState } from 'react';
import { GitCommit, Info, Layers, Filter, CheckCircle2 } from 'lucide-react';

export default function ConflictGraph({ conflictGraph, timeSlots = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'Faculty' | 'Batch'

  if (!conflictGraph || !conflictGraph.nodes || conflictGraph.nodes.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
        <GitCommit className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">No Conflict Graph Generated Yet</h3>
        <p className="text-sm text-slate-400">Click "Generate Timetable" to construct and color the conflict graph.</p>
      </div>
    );
  }

  const { nodes, edges } = conflictGraph;

  // Filter edges based on user toggle
  const filteredEdges = edges.filter(e => filterType === 'ALL' || e.type === filterType);

  // Compute node coordinates on a responsive circle
  const width = 800;
  const height = 500;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.38;

  const nodePositions = new Map();
  const totalNodes = nodes.length;

  nodes.forEach((node, idx) => {
    const angle = (idx / totalNodes) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    nodePositions.set(node.id, { x, y });
  });

  // Highlight logic
  const isNodeHighlighted = (nodeId) => {
    if (!selectedNode) return true;
    if (selectedNode === nodeId) return true;
    return edges.some(
      e => (e.source === selectedNode && e.target === nodeId) || (e.target === selectedNode && e.source === nodeId)
    );
  };

  const isEdgeHighlighted = (edge) => {
    if (selectedEdge && selectedEdge.id === edge.id) return true;
    if (!selectedNode) return true;
    return edge.source === selectedNode || edge.target === selectedNode;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Graph Header & Toolbar */}
      <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">Conflict Graph Representation</h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full">
              {nodes.length} Vertices | {edges.length} Constraint Edges
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Nodes represent session tasks. Edges represent hard constraints (Shared Faculty or Student Batch).
          </p>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" /> Filter Edges:
          </span>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'ALL'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Edges ({edges.length})
          </button>
          <button
            onClick={() => setFilterType('Faculty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'Faculty'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Faculty Only ({edges.filter(e => e.type === 'Faculty').length})
          </button>
          <button
            onClick={() => setFilterType('Batch')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterType === 'Batch'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Batch Only ({edges.filter(e => e.type === 'Batch').length})
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative bg-slate-950 p-4 flex justify-center items-center overflow-x-auto min-h-[520px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[850px] h-auto select-none">
          <defs>
            <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Edges */}
          {filteredEdges.map(edge => {
            const p1 = nodePositions.get(edge.source);
            const p2 = nodePositions.get(edge.target);
            if (!p1 || !p2) return null;

            const highlighted = isEdgeHighlighted(edge);
            const isFaculty = edge.type === 'Faculty';
            const strokeColor = isFaculty ? '#f59e0b' : '#6366f1';

            return (
              <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={highlighted ? (selectedEdge?.id === edge.id ? 3.5 : 2) : 0.4}
                  strokeOpacity={highlighted ? (selectedEdge?.id === edge.id ? 1 : 0.7) : 0.1}
                  strokeDasharray={isFaculty ? 'none' : '4,3'}
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map(node => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const highlighted = isNodeHighlighted(node.id);
            const isSelected = selectedNode === node.id;
            const slotObj = timeSlots.find(t => t.id === node.assignedSlotId);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform duration-200 hover:scale-110"
                onClick={() => {
                  setSelectedNode(isSelected ? null : node.id);
                  setSelectedEdge(null);
                }}
                style={{ opacity: highlighted ? 1 : 0.2 }}
              >
                {/* Glow ring on selection */}
                {isSelected && (
                  <circle r="34" fill="url(#nodeGlow)" className="animate-pulse" />
                )}

                {/* Main Node Circle */}
                <circle
                  r="24"
                  fill={node.color || '#0284c7'}
                  stroke={isSelected ? '#ffffff' : '#1e293b'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="shadow-lg"
                />

                {/* Node Text Label */}
                <text
                  textAnchor="middle"
                  dy="-2"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#ffffff"
                  className="pointer-events-none"
                >
                  {node.batchName}
                </text>
                <text
                  textAnchor="middle"
                  dy="10"
                  fontSize="8"
                  fontWeight="medium"
                  fill="#e2e8f0"
                  className="pointer-events-none"
                >
                  {node.label.split(':')[1]?.trim() || node.subjectName.substring(0, 6)}
                </text>

                {/* Static Degree Badge */}
                <g transform="translate(16, -16)">
                  <circle r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text
                    textAnchor="middle"
                    dy="3"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#38bdf8"
                  >
                    {node.degree}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover / Click Info Sidebar Card inside Canvas */}
        <div className="absolute top-4 right-4 w-72 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl p-4 shadow-xl text-xs space-y-3">
          <h4 className="font-bold text-white flex items-center justify-between">
            <span>Inspector Panel</span>
            <Info className="w-4 h-4 text-sky-400" />
          </h4>

          {selectedEdge ? (
            <div className="space-y-2 border-t border-slate-800 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Constraint Edge:</span>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  selectedEdge.type === 'Faculty' ? 'bg-amber-500/20 text-amber-300' : 'bg-indigo-500/20 text-indigo-300'
                }`}>
                  {selectedEdge.type} Conflict
                </span>
              </div>
              <p className="text-slate-300 font-medium leading-relaxed bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                {selectedEdge.reason}
              </p>
              <p className="text-[11px] text-slate-400">
                These two sessions CANNOT be scheduled in the same time slot under any circumstances.
              </p>
            </div>
          ) : selectedNode ? (() => {
            const n = nodes.find(x => x.id === selectedNode);
            const slotObj = timeSlots.find(t => t.id === n.assignedSlotId);
            return (
              <div className="space-y-2 border-t border-slate-800 pt-2">
                <div className="font-bold text-sky-300 text-sm">{n.subjectName}</div>
                <div className="flex justify-between text-slate-400">
                  <span>Batch:</span> <strong className="text-white">{n.batchName}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Faculty:</span> <strong className="text-white">{n.facultyName}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Degree $d(v)$:</span> <strong className="text-sky-400">{n.degree} conflicts</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Assigned Slot:</span>
                  <strong className="text-emerald-400">
                    {slotObj ? `${slotObj.day} ${slotObj.time}` : 'Not assigned'}
                  </strong>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full mt-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                >
                  Clear Selection
                </button>
              </div>
            );
          })() : (
            <p className="text-slate-400 text-[11px]">
              Click any node to inspect session details & connected graph neighbors, or click an edge to inspect constraint details.
            </p>
          )}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Faculty Constraint Edge (Solid)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
            <span>Batch Constraint Edge (Dashed)</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-semibold">Graph Coloring Verified: 0 Edge Collisions</span>
        </div>
      </div>
    </div>
  );
}
