import { Task, TimeFilter, DayActivity } from '../types';

/**
 * Formats seconds into HH:MM:SS format
 */
export function formatDuration(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Formats seconds into compact human-readable string e.g. "2h 45m" or "45m 12s"
 */
export function formatDurationCompact(totalSeconds: number): string {
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Formats date to YYYY-MM-DD
 */
export function formatDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Checks if a date string falls within a specific timeframe
 */
export function isTaskInTimeFilter(task: Task, filter: TimeFilter): boolean {
  if (filter === 'all') return true;

  const now = new Date();
  const taskDate = new Date(task.updated_at || task.created_at);

  // Set hours to 0 to compare dates
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filter === 'today') {
    return taskDate >= today;
  }

  if (filter === 'week') {
    const dayOfWeek = now.getDay(); // 0 = Sun, 1 = Mon...
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Mon as start
    return taskDate >= startOfWeek;
  }

  if (filter === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return taskDate >= startOfMonth;
  }

  if (filter === 'year') {
    const startOfYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    return taskDate >= startOfYear;
  }

  return true;
}

/**
 * Generates 365 days activity map for 1-year contribution heatmap
 */
export function generate365DaysActivity(tasks: Task[]): {
  days: DayActivity[];
  totalYearSeconds: number;
  totalYearTasks: number;
  totalYearCompleted: number;
  maxDailySeconds: number;
} {
  const activityMap: Record<string, { totalSeconds: number; taskCount: number; completedCount: number }> = {};
  
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 364); // 365 days total ending today

  // Populate empty days map
  let curr = new Date(startDate);
  while (curr <= today) {
    const key = formatDateKey(curr);
    activityMap[key] = { totalSeconds: 0, taskCount: 0, completedCount: 0 };
    curr.setDate(curr.getDate() + 1);
  }

  let totalYearSeconds = 0;
  let totalYearTasks = tasks.length;
  let totalYearCompleted = 0;
  let maxDailySeconds = 0;

  // Aggregate tasks into activityMap
  tasks.forEach((task) => {
    if (task.status === 'Completed') totalYearCompleted++;
    const dateKey = formatDateKey(new Date(task.created_at));
    
    if (activityMap[dateKey]) {
      activityMap[dateKey].totalSeconds += task.time_spent_seconds;
      activityMap[dateKey].taskCount += 1;
      if (task.status === 'Completed') {
        activityMap[dateKey].completedCount += 1;
      }
      if (activityMap[dateKey].totalSeconds > maxDailySeconds) {
        maxDailySeconds = activityMap[dateKey].totalSeconds;
      }
    }
    totalYearSeconds += task.time_spent_seconds;
  });

  const days: DayActivity[] = Object.keys(activityMap).map((date) => ({
    date,
    totalSeconds: activityMap[date].totalSeconds,
    taskCount: activityMap[date].taskCount,
    completedCount: activityMap[date].completedCount,
  }));

  return {
    days,
    totalYearSeconds,
    totalYearTasks,
    totalYearCompleted,
    maxDailySeconds: maxDailySeconds || 1,
  };
}

/**
 * Export tasks as CSV file download
 */
export function exportTasksToCSV(tasks: Task[]) {
  const headers = ['ID', 'Title', 'Category', 'Priority', 'Status', 'Time Spent (HH:MM:SS)', 'Seconds', 'Created At'];
  const rows = tasks.map(t => [
    t.id,
    `"${t.title.replace(/"/g, '""')}"`,
    t.category,
    t.priority,
    t.status,
    formatDuration(t.time_spent_seconds),
    t.time_spent_seconds,
    t.created_at
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `flowtrack_tasks_${formatDateKey(new Date())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
