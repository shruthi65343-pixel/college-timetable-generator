import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import GraphView from './pages/GraphView';
import TraceView from './pages/TraceView';
import FacultyView from './pages/FacultyView';
import RoomsView from './pages/RoomsView';
import BatchesView from './pages/BatchesView';
import SettingsView from './pages/SettingsView';

import { INITIAL_DEMO_DATA } from './services/demoData';
import { runScheduleGenerator } from './services/apiService';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataset, setDataset] = useState(INITIAL_DEMO_DATA);
  const [timetable, setTimetable] = useState([]);
  const [conflictGraph, setConflictGraph] = useState({ nodes: [], edges: [] });
  const [traceSteps, setTraceSteps] = useState([]);
  const [stats, setStats] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useBackend, setUseBackend] = useState(false);

  // Trigger initial timetable generation on mount
  useEffect(() => {
    handleGenerateTimetable(INITIAL_DEMO_DATA);
  }, []);

  const handleGenerateTimetable = async (activeDataset = dataset) => {
    setIsGenerating(true);
    try {
      const result = await runScheduleGenerator(activeDataset, { heuristic: 'DSATUR' }, useBackend);
      setTimetable(result.timetable || []);
      setConflictGraph(result.conflictGraph || { nodes: [], edges: [] });
      setTraceSteps(result.traceSteps || []);
      setStats(result.stats || null);
    } catch (err) {
      console.error('Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResetDemoData = () => {
    setDataset(INITIAL_DEMO_DATA);
    handleGenerateTimetable(INITIAL_DEMO_DATA);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onGenerate={() => handleGenerateTimetable()}
        isGenerating={isGenerating}
        stats={stats}
      />

      {/* Main Workspace */}
      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              dataset={dataset}
              onGenerate={() => handleGenerateTimetable()}
              onLoadDemoData={handleResetDemoData}
              stats={stats}
              timetable={timetable}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'generator' && (
            <Generator
              dataset={dataset}
              setDataset={setDataset}
              onGenerate={() => handleGenerateTimetable()}
              isGenerating={isGenerating}
              onLoadDemoData={handleResetDemoData}
            />
          )}

          {activeTab === 'graph' && (
            <GraphView conflictGraph={conflictGraph} timeSlots={dataset.timeSlots} />
          )}

          {activeTab === 'trace' && (
            <TraceView traceSteps={traceSteps} />
          )}

          {activeTab === 'faculty' && (
            <FacultyView dataset={dataset} timetable={timetable} />
          )}

          {activeTab === 'rooms' && (
            <RoomsView dataset={dataset} timetable={timetable} />
          )}

          {activeTab === 'batches' && (
            <BatchesView dataset={dataset} timetable={timetable} />
          )}

          {activeTab === 'settings' && (
            <SettingsView useBackend={useBackend} setUseBackend={setUseBackend} />
          )}
        </main>
      </div>
    </div>
  );
}
