// Graph Coloring, Greedy & Backtracking Scheduling Engine

export function generateTimetable(inputData, config = {}) {
  const startTime = performance.now();
  const {
    heuristic = 'DSATUR', // 'DSATUR' | 'LARGEST_DEGREE'
    maxBacktracks = 500,
    allowSameDayMultipleSessions = false
  } = config;

  const { subjects, faculty, rooms, batches, timeSlots } = inputData;

  // Maps for quick lookups
  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const roomMap = new Map(rooms.map(r => [r.id, r]));
  const batchMap = new Map(batches.map(b => [b.id, b]));
  const subjectMap = new Map(subjects.map(s => [s.id, s]));
  const slotMap = new Map(timeSlots.map(t => [t.id, t]));

  // Step 1: Expand subjects into individual session nodes
  const nodes = [];
  let nodeIdCounter = 1;

  subjects.forEach(subject => {
    const batch = batchMap.get(subject.batchId);
    const fac = facultyMap.get(subject.facultyId);
    for (let sIdx = 1; sIdx <= subject.sessionsPerWeek; sIdx++) {
      nodes.push({
        id: `node-${nodeIdCounter++}`,
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        batchId: subject.batchId,
        batchName: batch ? batch.name : subject.batchId,
        facultyId: subject.facultyId,
        facultyName: fac ? fac.name : subject.facultyId,
        requiredRoomType: subject.requiredRoomType || 'Lecture Hall',
        color: subject.color || '#3b82f6',
        sessionIndex: sIdx,
        assignedSlotId: null,
        assignedRoomId: null,
        degree: 0,
        adjacentIds: new Set(),
      });
    }
  });

  // Step 2: Build Conflict Graph (Edges represent hard constraints)
  const edges = [];
  const edgeSet = new Set();

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const u = nodes[i];
      const v = nodes[j];

      let hasConflict = false;
      let conflictReason = '';
      let conflictType = '';

      if (u.facultyId === v.facultyId) {
        hasConflict = true;
        conflictType = 'Faculty';
        conflictReason = `Shared Faculty (${u.facultyName})`;
      } else if (u.batchId === v.batchId) {
        hasConflict = true;
        conflictType = 'Batch';
        conflictReason = `Shared Student Batch (${u.batchName})`;
      }

      if (hasConflict) {
        u.adjacentIds.add(v.id);
        v.adjacentIds.add(u.id);

        const edgeKey = `${u.id}---${v.id}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            id: edgeKey,
            source: u.id,
            target: v.id,
            type: conflictType,
            reason: conflictReason,
          });
        }
      }
    }
  }

  // Set node static degrees
  nodes.forEach(n => {
    n.degree = n.adjacentIds.size;
  });

  // Graph state helper
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Trace steps recorder for interactive step-by-step playback
  const traceSteps = [];
  let backtrackCount = 0;
  let stepCounter = 0;

  function recordTrace(type, payload) {
    stepCounter++;
    traceSteps.push({
      step: stepCounter,
      type, // 'SELECT_NODE' | 'TRY_ASSIGNMENT' | 'CONSTRAINT_FAIL' | 'SUCCESS_ASSIGNMENT' | 'BACKTRACK' | 'COMPLETE'
      timestamp: Date.now(),
      ...payload
    });
  }

  recordTrace('START', {
    message: `Initialized Conflict Graph with ${nodes.length} nodes and ${edges.length} edges.`,
    totalNodes: nodes.length,
    totalEdges: edges.length,
    heuristic
  });

  // Helper to compute saturation degree of an unassigned node
  function getSaturationDegree(node) {
    const neighborColors = new Set();
    node.adjacentIds.forEach(adjId => {
      const adjNode = nodeMap.get(adjId);
      if (adjNode.assignedSlotId) {
        neighborColors.add(adjNode.assignedSlotId);
      }
    });
    return neighborColors.size;
  }

  // Select next unassigned node based on active Heuristic
  function getNextNode(unassignedList) {
    if (unassignedList.length === 0) return null;

    if (heuristic === 'DSATUR') {
      return unassignedList.slice().sort((a, b) => {
        const satA = getSaturationDegree(a);
        const satB = getSaturationDegree(b);
        if (satA !== satB) return satB - satA; // Max saturation first
        return b.degree - a.degree; // Max degree tie-breaker
      })[0];
    } else {
      // LARGEST_DEGREE
      return unassignedList.slice().sort((a, b) => b.degree - a.degree)[0];
    }
  }

  // Backtracking solver
  function solve(assignedMap, currentUnassigned) {
    if (currentUnassigned.length === 0) {
      return true; // All sessions successfully scheduled!
    }

    if (backtrackCount > maxBacktracks) {
      recordTrace('MAX_BACKTRACKS_EXCEEDED', {
        message: `Exceeded maximum backtrack limit of ${maxBacktracks}`
      });
      return false;
    }

    const currentNode = getNextNode(currentUnassigned);
    const nodeIndex = currentUnassigned.indexOf(currentNode);
    const nextUnassigned = [...currentUnassigned.slice(0, nodeIndex), ...currentUnassigned.slice(nodeIndex + 1)];

    recordTrace('SELECT_NODE', {
      nodeId: currentNode.id,
      subjectName: currentNode.subjectName,
      batchName: currentNode.batchName,
      facultyName: currentNode.facultyName,
      degree: currentNode.degree,
      saturation: getSaturationDegree(currentNode),
      remainingCount: nextUnassigned.length,
      explanation: `Selected ${currentNode.subjectName} (${currentNode.batchName}) with static degree ${currentNode.degree} & saturation ${getSaturationDegree(currentNode)}`
    });

    // Try candidate time slots
    for (const slot of timeSlots) {
      // Check hard constraints for Faculty and Batch in this slot
      let slotConflictReason = null;

      // Check neighboring nodes for slot collision
      for (const adjId of currentNode.adjacentIds) {
        const adjNode = nodeMap.get(adjId);
        if (adjNode.assignedSlotId === slot.id) {
          if (adjNode.facultyId === currentNode.facultyId) {
            slotConflictReason = `Faculty ${currentNode.facultyName} is already teaching ${adjNode.subjectName} in slot ${slot.day} ${slot.time}`;
            break;
          }
          if (adjNode.batchId === currentNode.batchId) {
            slotConflictReason = `Batch ${currentNode.batchName} already has class ${adjNode.subjectName} in slot ${slot.day} ${slot.time}`;
            break;
          }
        }
      }

      // Check same day multiple session constraint if restricted
      if (!slotConflictReason && !allowSameDayMultipleSessions) {
        for (const [aId, aNode] of nodeMap.entries()) {
          if (aNode.assignedSlotId && aNode.batchId === currentNode.batchId && aNode.subjectId === currentNode.subjectId && aId !== currentNode.id) {
            const assignedSlot = slotMap.get(aNode.assignedSlotId);
            if (assignedSlot && assignedSlot.day === slot.day) {
              slotConflictReason = `Batch ${currentNode.batchName} already has a ${currentNode.subjectName} session on ${slot.day}`;
              break;
            }
          }
        }
      }

      if (slotConflictReason) {
        recordTrace('CONSTRAINT_FAIL', {
          nodeId: currentNode.id,
          slotId: slot.id,
          slotText: `${slot.day} ${slot.time}`,
          reason: slotConflictReason
        });
        continue;
      }

      // Find suitable room for this slot
      const suitableRooms = rooms.filter(r => {
        const batch = batchMap.get(currentNode.batchId);
        const capacityOk = !batch || r.capacity >= (batch.studentCount || 0);
        const typeOk = !currentNode.requiredRoomType || r.type === currentNode.requiredRoomType || r.type === 'Lecture Hall';
        return capacityOk && typeOk;
      });

      let selectedRoom = null;
      for (const room of suitableRooms) {
        // Is room occupied in this slot by any other node?
        let roomOccupied = false;
        for (const [_, aNode] of nodeMap.entries()) {
          if (aNode.assignedSlotId === slot.id && aNode.assignedRoomId === room.id) {
            roomOccupied = true;
            break;
          }
        }
        if (!roomOccupied) {
          selectedRoom = room;
          break;
        }
      }

      if (!selectedRoom) {
        recordTrace('CONSTRAINT_FAIL', {
          nodeId: currentNode.id,
          slotId: slot.id,
          slotText: `${slot.day} ${slot.time}`,
          reason: `No available ${currentNode.requiredRoomType} with capacity for batch ${currentNode.batchName} during ${slot.day} ${slot.time}`
        });
        continue;
      }

      // Valid slot and room found! Make assignment.
      currentNode.assignedSlotId = slot.id;
      currentNode.assignedRoomId = selectedRoom.id;

      recordTrace('SUCCESS_ASSIGNMENT', {
        nodeId: currentNode.id,
        subjectName: currentNode.subjectName,
        batchName: currentNode.batchName,
        facultyName: currentNode.facultyName,
        slotId: slot.id,
        slotText: `${slot.day} ${slot.time}`,
        roomId: selectedRoom.id,
        roomCode: selectedRoom.code,
        explanation: `Assigned ${currentNode.subjectName} to ${slot.day} ${slot.time} in ${selectedRoom.code} (${selectedRoom.type})`
      });

      // Recurse
      const success = solve(assignedMap, nextUnassigned);
      if (success) {
        return true;
      }

      // Backtrack if branch failed
      backtrackCount++;
      recordTrace('BACKTRACK', {
        nodeId: currentNode.id,
        subjectName: currentNode.subjectName,
        slotId: slot.id,
        slotText: `${slot.day} ${slot.time}`,
        backtrackCount,
        explanation: `Deadlock in downstream branch! Backtracking step #${backtrackCount}: Unassigned ${currentNode.subjectName} from ${slot.day} ${slot.time}`
      });

      currentNode.assignedSlotId = null;
      currentNode.assignedRoomId = null;
    }

    return false; // No valid slot worked for currentNode
  }

  // Execute solver
  const isComplete = solve(new Map(), [...nodes]);

  const endTime = performance.now();
  const executionTimeMs = Math.round(endTime - startTime);

  // Calculate distinct colors used (Chromatic Number)
  const usedSlots = new Set(nodes.filter(n => n.assignedSlotId).map(n => n.assignedSlotId));

  // Compute live conflicts stats for validation
  let facultyConflicts = 0;
  let roomConflicts = 0;
  let batchConflicts = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const u = nodes[i];
      const v = nodes[j];
      if (u.assignedSlotId && v.assignedSlotId && u.assignedSlotId === v.assignedSlotId) {
        if (u.facultyId === v.facultyId) facultyConflicts++;
        if (u.batchId === v.batchId) batchConflicts++;
        if (u.assignedRoomId && v.assignedRoomId && u.assignedRoomId === v.assignedRoomId) roomConflicts++;
      }
    }
  }

  recordTrace('COMPLETE', {
    isComplete,
    totalScheduled: nodes.filter(n => n.assignedSlotId).length,
    totalRequired: nodes.length,
    chromaticNumber: usedSlots.size,
    backtrackCount,
    executionTimeMs
  });

  return {
    success: isComplete,
    timetable: nodes,
    conflictGraph: {
      nodes: nodes.map(n => ({
        id: n.id,
        label: `${n.batchName}: ${n.subjectCode}`,
        subjectName: n.subjectName,
        facultyName: n.facultyName,
        batchName: n.batchName,
        degree: n.degree,
        assignedSlotId: n.assignedSlotId,
        assignedRoomId: n.assignedRoomId,
        color: n.color
      })),
      edges
    },
    traceSteps,
    stats: {
      totalSessions: nodes.length,
      scheduledSessions: nodes.filter(n => n.assignedSlotId).length,
      chromaticNumber: usedSlots.size,
      facultyConflicts,
      roomConflicts,
      batchConflicts,
      backtrackCount,
      executionTimeMs,
      satisfactionRate: Math.round((nodes.filter(n => n.assignedSlotId).length / nodes.length) * 100)
    }
  };
}
