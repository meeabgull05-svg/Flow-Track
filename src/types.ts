export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TimeFilter = 'today' | 'week' | 'month' | 'year' | 'all';

export interface TimeLog {
  id: string;
  start_time: string; // ISO string
  end_time?: string;   // ISO string
  duration_seconds: number;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  priority: Priority;
  status: TaskStatus;
  time_spent_seconds: number;
  estimated_seconds?: number;
  created_at: string; // ISO string
  updated_at: string; // ISO string
  completed_at?: string; // ISO string
  tags?: string[];
  is_timer_running?: boolean;
  timer_started_at?: string; // ISO string or timestamp
  time_logs?: TimeLog[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface DayActivity {
  date: string; // YYYY-MM-DD
  totalSeconds: number;
  taskCount: number;
  completedCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isSignedIn: boolean;
}
