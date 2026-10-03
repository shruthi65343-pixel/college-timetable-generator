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
