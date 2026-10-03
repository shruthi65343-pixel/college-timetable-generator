import time
from typing import Dict, List, Any, Set

class Node:
    def __init__(self, node_id: str, subject_id: str, subject_code: str, subject_name: str, 
                 batch_id: str, batch_name: str, faculty_id: str, faculty_name: str,
                 required_room_type: str, color: str, session_index: int):
        self.id = node_id
        self.subject_id = subject_id
        self.subject_code = subject_code
        self.subject_name = subject_name
        self.batch_id = batch_id
        self.batch_name = batch_name
        self.faculty_id = faculty_id
        self.faculty_name = faculty_name
        self.required_room_type = required_room_type
        self.color = color
        self.session_index = session_index
        
        self.assigned_slot_id = None
        self.assigned_room_id = None
        self.adjacent_ids: Set[str] = set()

    @property
    def degree(self) -> int:
        return len(self.adjacent_ids)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "subjectId": self.subject_id,
            "subjectCode": self.subject_code,
            "subjectName": self.subject_name,
            "batchId": self.batch_id,
            "batchName": self.batch_name,
            "facultyId": self.faculty_id,
            "facultyName": self.faculty_name,
            "requiredRoomType": self.required_room_type,
            "color": self.color,
            "sessionIndex": self.session_index,
            "assignedSlotId": self.assigned_slot_id,
            "assignedRoomId": self.assigned_room_id,
            "degree": self.degree
        }

def solve_timetable(dataset: Dict[str, Any], config: Dict[str, Any] = None) -> Dict[str, Any]:
    start_time = time.time()
    if config is None:
        config = {}
        
    heuristic = config.get("heuristic", "DSATUR")
    max_backtracks = config.get("maxBacktracks", 500)
    
    subjects = dataset.get("subjects", [])
    faculty = dataset.get("faculty", [])
    rooms = dataset.get("rooms", [])
    batches = dataset.get("batches", [])
    time_slots = dataset.get("timeSlots", [])

    faculty_map = {f["id"]: f for f in faculty}
    batch_map = {b["id"]: b for b in batches}
    slot_map = {t["id"]: t for t in time_slots}

    # Step 1: Expand subjects into session nodes
    nodes: List[Node] = []
    node_id_counter = 1

    for subject in subjects:
        batch = batch_map.get(subject["batchId"])
        fac = faculty_map.get(subject["facultyId"])
        sessions_count = subject.get("sessionsPerWeek", 3)
        for s_idx in range(1, sessions_count + 1):
            nodes.append(Node(
                node_id=f"node-{node_id_counter}",
                subject_id=subject["id"],
                subject_code=subject.get("code", "SUB"),
                subject_name=subject.get("name", "Subject"),
                batch_id=subject["batchId"],
                batch_name=batch["name"] if batch else subject["batchId"],
                faculty_id=subject["facultyId"],
                faculty_name=fac["name"] if fac else subject["facultyId"],
                required_room_type=subject.get("requiredRoomType", "Lecture Hall"),
                color=subject.get("color", "#3b82f6"),
                session_index=s_idx
            ))
            node_id_counter += 1

    node_map = {n.id: n for n in nodes}

    # Step 2: Build Conflict Graph
    edges = []
    edge_set = set()

    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            u = nodes[i]
            v = nodes[j]

            has_conflict = False
            conflict_type = ""
            conflict_reason = ""

            if u.faculty_id == v.faculty_id:
                has_conflict = True
                conflict_type = "Faculty"
                conflict_reason = f"Shared Faculty ({u.faculty_name})"
            elif u.batch_id == v.batch_id:
                has_conflict = True
                conflict_type = "Batch"
                conflict_reason = f"Shared Student Batch ({u.batch_name})"

            if has_conflict:
                u.adjacent_ids.add(v.id)
                v.adjacent_ids.add(u.id)

                edge_key = f"{u.id}---{v.id}"
                if edge_key not in edge_set:
                    edge_set.add(edge_key)
                    edges.append({
                        "id": edge_key,
                        "source": u.id,
                        "target": v.id,
                        "type": conflict_type,
                        "reason": conflict_reason
                    })

    trace_steps = []
    backtrack_count = 0
    step_counter = 0

    def record_trace(event_type: str, payload: Dict[str, Any]):
        nonlocal step_counter
        step_counter += 1
        trace_steps.append({
            "step": step_counter,
            "type": event_type,
            **payload
        })

    record_trace("START", {
        "message": f"Python Engine initialized graph with {len(nodes)} nodes & {len(edges)} edges.",
        "heuristic": heuristic
    })

    def get_saturation(n: Node) -> int:
        colors = set()
        for adj_id in n.adjacent_ids:
            adj_n = node_map[adj_id]
            if adj_n.assigned_slot_id:
                colors.add(adj_n.assigned_slot_id)
        return len(colors)

    def get_next_node(unassigned: List[Node]) -> Node:
        if not unassigned:
            return None
        if heuristic == "DSATUR":
            return sorted(unassigned, key=lambda n: (get_saturation(n), n.degree), reverse=True)[0]
        else:
            return sorted(unassigned, key=lambda n: n.degree, reverse=True)[0]

    def solve(unassigned: List[Node]) -> bool:
        nonlocal backtrack_count
        if not unassigned:
            return True

        if backtrack_count > max_backtracks:
            return False

        curr_node = get_next_node(unassigned)
        next_unassigned = [n for n in unassigned if n.id != curr_node.id]

        record_trace("SELECT_NODE", {
            "nodeId": curr_node.id,
            "subjectName": curr_node.subjectName if hasattr(curr_node, 'subjectName') else curr_node.subject_name,
            "batchName": curr_node.batch_name,
            "facultyName": curr_node.faculty_name,
            "degree": curr_node.degree,
            "explanation": f"Python Solver selected {curr_node.subject_name} ({curr_node.batch_name}) with static degree {curr_node.degree}"
        })

        for slot in time_slots:
            slot_conflict = None

            # Neighbor check
            for adj_id in curr_node.adjacent_ids:
                adj_n = node_map[adj_id]
                if adj_n.assigned_slot_id == slot["id"]:
                    if adj_n.faculty_id == curr_node.faculty_id:
                        slot_conflict = f"Faculty {curr_node.faculty_name} busy"
                        break
                    if adj_n.batch_id == curr_node.batch_id:
                        slot_conflict = f"Batch {curr_node.batch_name} busy"
                        break

            if slot_conflict:
                record_trace("CONSTRAINT_FAIL", {
                    "nodeId": curr_node.id,
                    "slotId": slot["id"],
                    "slotText": f"{slot['day']} {slot['time']}",
                    "reason": slot_conflict
                })
                continue

            # Select suitable room
            suitable_rooms = [r for r in rooms if not curr_node.required_room_type or r.get("type") == curr_node.required_room_type or r.get("type") == "Lecture Hall"]
            selected_room = None

            for room in suitable_rooms:
                room_occupied = any(n.assigned_slot_id == slot["id"] and n.assigned_room_id == room["id"] for n in nodes)
                if not room_occupied:
                    selected_room = room
                    break

            if not selected_room:
                record_trace("CONSTRAINT_FAIL", {
                    "nodeId": curr_node.id,
                    "slotId": slot["id"],
                    "slotText": f"{slot['day']} {slot['time']}",
                    "reason": f"No available room capacity in slot {slot['day']} {slot['time']}"
                })
                continue

            # Make assignment
            curr_node.assigned_slot_id = slot["id"]
            curr_node.assigned_room_id = selected_room["id"]

            record_trace("SUCCESS_ASSIGNMENT", {
                "nodeId": curr_node.id,
                "subjectName": curr_node.subject_name,
                "batchName": curr_node.batch_name,
                "facultyName": curr_node.faculty_name,
                "slotId": slot["id"],
                "slotText": f"{slot['day']} {slot['time']}",
                "roomId": selected_room["id"],
                "roomCode": selected_room["code"],
                "explanation": f"Assigned {curr_node.subject_name} to {slot['day']} {slot['time']} in {selected_room['code']}"
            })

            if solve(next_unassigned):
                return True

            # Backtrack
            backtrack_count += 1
            record_trace("BACKTRACK", {
                "nodeId": curr_node.id,
                "subjectName": curr_node.subject_name,
                "slotId": slot["id"],
                "slotText": f"{slot['day']} {slot['time']}",
                "explanation": f"Python Solver Backtracking step #{backtrack_count}: Unassigned {curr_node.subject_name}"
            })

            curr_node.assigned_slot_id = None
            curr_node.assigned_room_id = None

        return False

    is_complete = solve(list(nodes))
    end_time = time.time()
    exec_ms = int((end_time - start_time) * 1000)

    used_slots = set(n.assigned_slot_id for n in nodes if n.assigned_slot_id)

    # Compute live conflicts
    faculty_conflicts = 0
    room_conflicts = 0
    batch_conflicts = 0

    for i in range(len(nodes)):
        for j in range(i + 1, len(nodes)):
            u = nodes[i]
            v = nodes[j]
            if u.assigned_slot_id and v.assigned_slot_id and u.assigned_slot_id == v.assigned_slot_id:
                if u.faculty_id == v.faculty_id: faculty_conflicts += 1
                if u.batch_id == v.batch_id: batch_conflicts += 1
                if u.assigned_room_id and v.assigned_room_id and u.assigned_room_id == v.assigned_room_id: room_conflicts += 1

    record_trace("COMPLETE", {
        "isComplete": is_complete,
        "totalScheduled": len(used_slots),
        "backtrackCount": backtrack_count,
        "executionTimeMs": exec_ms
    })

    return {
        "success": is_complete,
        "timetable": [n.to_dict() for n in nodes],
        "conflictGraph": {
            "nodes": [{
                "id": n.id,
                "label": f"{n.batch_name}: {n.subject_code}",
                "subjectName": n.subject_name,
                "facultyName": n.faculty_name,
                "batchName": n.batch_name,
                "degree": n.degree,
                "assignedSlotId": n.assigned_slot_id,
                "assignedRoomId": n.assigned_room_id,
                "color": n.color
            } for n in nodes],
            "edges": edges
        },
        "traceSteps": trace_steps,
        "stats": {
            "totalSessions": len(nodes),
            "scheduledSessions": len([n for n in nodes if n.assigned_slot_id]),
            "chromaticNumber": len(used_slots),
            "facultyConflicts": faculty_conflicts,
            "roomConflicts": room_conflicts,
            "batchConflicts": batch_conflicts,
            "backtrackCount": backtrack_count,
            "executionTimeMs": exec_ms,
            "satisfactionRate": 100 if len(nodes) > 0 and len([n for n in nodes if n.assigned_slot_id]) == len(nodes) else 0
        }
    }
