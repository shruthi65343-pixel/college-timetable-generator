# SMART SCHEDULE — Smart College Timetable Generator

**Tagline**: *Conflict-Free Scheduling using Graph Coloring, Greedy Allocation & Backtracking*

An algorithm-driven college hackathon prototype built with **React**, **Vite**, **Tailwind CSS**, and **Python FastAPI**.

---

## 🚀 How to Run the Application

### Option 1: Standalone React Frontend (Recommended for instant setup)

1. Open a terminal inside the `frontend` folder:
   ```bash
   cd C:\Users\Shruthi\.gemini\antigravity\scratch\smart-college-timetable\frontend
   ```

2. Run the Vite development server:
   ```bash
   node node_modules/vite/bin/vite.js
   ```

3. Open your web browser at:
   ```
   http://localhost:3000
   ```

---

### Option 2: Python FastAPI Backend Service (Optional)

1. Open a terminal inside the `backend` folder:
   ```bash
   cd C:\Users\Shruthi\.gemini\antigravity\scratch\smart-college-timetable\backend
   ```

2. Install Python dependencies:
   ```bash
   py -m pip install fastapi uvicorn pydantic
   ```

3. Start the FastAPI server:
   ```bash
   py main.py
   ```

4. Toggle **Python FastAPI Backend** in the **Settings** page of the web application.

---

## 🌟 Key Features & Visualizations

1. **Dashboard Page**:
   - High-level metric cards for Student Batches, Subjects, Faculty, Rooms, and Time Slots.
   - Live **Conflict Monitors**: Faculty Conflicts (0), Room Conflicts (0), Student-Batch Conflicts (0).
   - Conceptual 7-step solver pipeline diagram.
   - Primary **"Generate Timetable"** & **"Load Demo Data"** actions.

2. **Timetable Generator Input Page**:
   - Interactive data management tables for Subjects, Faculty, Batches, Rooms, and Slots.
   - Add, edit, or delete records on the fly.
   - Heuristic ordering configuration: **DSatur (Degree of Saturation)** vs **Largest Degree First**.

3. **Conflict Graph View**:
   - Interactive SVG canvas representing session tasks as graph nodes and hard constraints as undirected edges.
   - Nodes colored by assigned time slot (Chromatic Number $K$).
   - Inspector Panel showing constraint edge reasons (Faculty overlap vs Batch overlap).

4. **Algorithm Trace Player**:
   - Step-by-step playback controls (Play, Pause, Step Forward, Step Back, Speed slider).
   - Live execution log detailing greedy picks, constraint failures, and **Backtrack Alert Stack Frames**.

5. **Multi-Perspective Timetable Grid**:
   - Grid view toggles: **By Student Batch**, **By Faculty Member**, **By Room Allocation**.
   - Color-coded cells with zero-conflict badges and printable layout.
   - # 🎓 Smart College Timetable Generator

### Conflict-Free Timetable Generation using Graph Coloring, Greedy & Backtracking

A smart, algorithm-driven college timetable generation system that creates conflict-free schedules for student batches while considering **faculty availability, room availability, subjects, and time slots**.

The project is designed as a hackathon prototype with an emphasis on **explainable scheduling** — the system not only generates a timetable but also shows why scheduling decisions were accepted, rejected, or changed.

---

## 🚀 Problem Statement

Creating a college timetable manually is a complex scheduling problem.

A timetable must coordinate:

- 👨‍🎓 Student batches
- 👩‍🏫 Faculty
- 🏫 Rooms
- 📚 Subjects
- 🕐 Available time slots

A scheduling decision can create multiple conflicts.

### Major conflicts

**Faculty Clash**  
A faculty member cannot teach two classes at the same time.

**Room Clash**  
A room cannot be assigned to two classes at the same time.

**Student-Batch Clash**  
A student batch cannot attend two subjects at the same time.

The goal is to automatically generate a valid timetable while satisfying these constraints.

---

## 💡 Our Solution

The **Smart College Timetable Generator** combines three algorithmic approaches:

```text
Input Data
    ↓
Conflict Graph
    ↓
Graph Coloring
    ↓
Greedy Assignment
    ↓
Constraint Checking
    ↓
Conflict?
   ↙   ↘
 YES    NO
  ↓      ↓
Backtrack  Accept
  ↓
Try Alternative Slot
  ↓
Final Timetable
