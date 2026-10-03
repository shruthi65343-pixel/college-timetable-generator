import { generateTimetable } from './schedulerEngine';

const BACKEND_URL = 'http://localhost:8000/api';

export async function runScheduleGenerator(dataset, config = {}, useBackend = false) {
  if (useBackend) {
    try {
      const response = await fetch(`${BACKEND_URL}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataset, config })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn('Backend API connection failed, falling back to local JS engine:', err);
    }
  }

  // Fallback to local JS engine
  return generateTimetable(dataset, config);
}
