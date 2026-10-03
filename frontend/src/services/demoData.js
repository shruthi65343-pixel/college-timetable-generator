// Demo Dataset for Smart College Timetable Generator

export const INITIAL_DEMO_DATA = {
  timeSlots: [
    { id: 'ts-1', day: 'Monday', time: '09:00 - 10:00', period: 1 },
    { id: 'ts-2', day: 'Monday', time: '10:00 - 11:00', period: 2 },
    { id: 'ts-3', day: 'Monday', time: '11:00 - 12:00', period: 3 },
    { id: 'ts-4', day: 'Monday', time: '12:00 - 13:00', period: 4 },
    { id: 'ts-5', day: 'Monday', time: '14:00 - 15:00', period: 5 },
    { id: 'ts-6', day: 'Monday', time: '15:00 - 16:00', period: 6 },
    
    { id: 'ts-7', day: 'Tuesday', time: '09:00 - 10:00', period: 1 },
    { id: 'ts-8', day: 'Tuesday', time: '10:00 - 11:00', period: 2 },
    { id: 'ts-9', day: 'Tuesday', time: '11:00 - 12:00', period: 3 },
    { id: 'ts-10', day: 'Tuesday', time: '12:00 - 13:00', period: 4 },
    { id: 'ts-11', day: 'Tuesday', time: '14:00 - 15:00', period: 5 },
    { id: 'ts-12', day: 'Tuesday', time: '15:00 - 16:00', period: 6 },

    { id: 'ts-13', day: 'Wednesday', time: '09:00 - 10:00', period: 1 },
    { id: 'ts-14', day: 'Wednesday', time: '10:00 - 11:00', period: 2 },
    { id: 'ts-15', day: 'Wednesday', time: '11:00 - 12:00', period: 3 },
    { id: 'ts-16', day: 'Wednesday', time: '12:00 - 13:00', period: 4 },
    { id: 'ts-17', day: 'Wednesday', time: '14:00 - 15:00', period: 5 },
    { id: 'ts-18', day: 'Wednesday', time: '15:00 - 16:00', period: 6 },

    { id: 'ts-19', day: 'Thursday', time: '09:00 - 10:00', period: 1 },
    { id: 'ts-20', day: 'Thursday', time: '10:00 - 11:00', period: 2 },
    { id: 'ts-21', day: 'Thursday', time: '11:00 - 12:00', period: 3 },
    { id: 'ts-22', day: 'Thursday', time: '12:00 - 13:00', period: 4 },
    { id: 'ts-23', day: 'Thursday', time: '14:00 - 15:00', period: 5 },
    { id: 'ts-24', day: 'Thursday', time: '15:00 - 16:00', period: 6 },

    { id: 'ts-25', day: 'Friday', time: '09:00 - 10:00', period: 1 },
    { id: 'ts-26', day: 'Friday', time: '10:00 - 11:00', period: 2 },
    { id: 'ts-27', day: 'Friday', time: '11:00 - 12:00', period: 3 },
    { id: 'ts-28', day: 'Friday', time: '12:00 - 13:00', period: 4 },
    { id: 'ts-29', day: 'Friday', time: '14:00 - 15:00', period: 5 },
    { id: 'ts-30', day: 'Friday', time: '15:00 - 16:00', period: 6 },
  ],

  batches: [
    { id: 'b-1', name: 'CSE-A', code: 'CSE-A', studentCount: 60, department: 'Computer Science' },
    { id: 'b-2', name: 'CSE-B', code: 'CSE-B', studentCount: 55, department: 'Computer Science' },
    { id: 'b-3', name: 'CSE-C', code: 'CSE-C', studentCount: 58, department: 'Computer Science' },
    { id: 'b-4', name: 'ECE-A', code: 'ECE-A', studentCount: 50, department: 'Electronics' },
  ],

  faculty: [
    { id: 'f-1', name: 'Dr. Ravi', code: 'DR-RAVI', department: 'Computer Science', maxSessionsPerDay: 3, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'f-2', name: 'Prof. Anitha', code: 'PROF-ANITHA', department: 'Computer Science', maxSessionsPerDay: 4, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'f-3', name: 'Dr. Kumar', code: 'DR-KUMAR', department: 'Computer Science', maxSessionsPerDay: 3, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'f-4', name: 'Prof. Sneha', code: 'PROF-SNEHA', department: 'Computer Science', maxSessionsPerDay: 3, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'f-5', name: 'Dr. Meera', code: 'DR-MEERA', department: 'Electronics', maxSessionsPerDay: 3, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
    { id: 'f-6', name: 'Prof. Rajesh', code: 'PROF-RAJESH', department: 'Mathematics', maxSessionsPerDay: 4, preferredDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
  ],

  rooms: [
    { id: 'r-1', code: 'R101', name: 'Lecture Hall 101', capacity: 70, type: 'Lecture Hall' },
    { id: 'r-2', code: 'R102', name: 'Lecture Hall 102', capacity: 65, type: 'Lecture Hall' },
    { id: 'r-3', code: 'R103', name: 'Seminar Room 103', capacity: 60, type: 'Lecture Hall' },
    { id: 'r-4', code: 'Lab-1', name: 'Computer Lab 1', capacity: 60, type: 'Laboratory' },
    { id: 'r-5', code: 'Lab-2', name: 'Electronics Lab', capacity: 55, type: 'Laboratory' },
  ],

  subjects: [
    { id: 's-1', code: 'CS201', name: 'Data Structures', sessionsPerWeek: 4, facultyId: 'f-1', batchId: 'b-1', requiredRoomType: 'Lecture Hall', color: '#3b82f6' },
    { id: 's-2', code: 'CS202', name: 'DBMS', sessionsPerWeek: 3, facultyId: 'f-2', batchId: 'b-1', requiredRoomType: 'Lecture Hall', color: '#10b981' },
    { id: 's-3', code: 'CS301', name: 'Artificial Intelligence', sessionsPerWeek: 3, facultyId: 'f-3', batchId: 'b-1', requiredRoomType: 'Lecture Hall', color: '#8b5cf6' },
    { id: 's-4', code: 'CS102', name: 'Python Programming', sessionsPerWeek: 3, facultyId: 'f-4', batchId: 'b-1', requiredRoomType: 'Laboratory', color: '#f59e0b' },
    
    { id: 's-5', code: 'CS201', name: 'Data Structures', sessionsPerWeek: 4, facultyId: 'f-1', batchId: 'b-2', requiredRoomType: 'Lecture Hall', color: '#3b82f6' },
    { id: 's-6', code: 'CS202', name: 'DBMS', sessionsPerWeek: 3, facultyId: 'f-2', batchId: 'b-2', requiredRoomType: 'Lecture Hall', color: '#10b981' },
    { id: 's-7', code: 'CS204', name: 'Operating Systems', sessionsPerWeek: 3, facultyId: 'f-3', batchId: 'b-2', requiredRoomType: 'Lecture Hall', color: '#ec4899' },
    { id: 's-8', code: 'CS205', name: 'Computer Networks', sessionsPerWeek: 3, facultyId: 'f-4', batchId: 'b-2', requiredRoomType: 'Laboratory', color: '#06b6d4' },

    { id: 's-9', code: 'CS201', name: 'Data Structures', sessionsPerWeek: 3, facultyId: 'f-1', batchId: 'b-3', requiredRoomType: 'Lecture Hall', color: '#3b82f6' },
    { id: 's-10', code: 'MA201', name: 'Discrete Mathematics', sessionsPerWeek: 3, facultyId: 'f-6', batchId: 'b-3', requiredRoomType: 'Lecture Hall', color: '#6366f1' },
    { id: 's-11', code: 'CS204', name: 'Operating Systems', sessionsPerWeek: 3, facultyId: 'f-3', batchId: 'b-3', requiredRoomType: 'Lecture Hall', color: '#ec4899' },

    { id: 's-12', code: 'EC201', name: 'Digital Electronics', sessionsPerWeek: 4, facultyId: 'f-5', batchId: 'b-4', requiredRoomType: 'Laboratory', color: '#14b8a6' },
    { id: 's-13', code: 'MA201', name: 'Discrete Mathematics', sessionsPerWeek: 3, facultyId: 'f-6', batchId: 'b-4', requiredRoomType: 'Lecture Hall', color: '#6366f1' }
  ]
};
