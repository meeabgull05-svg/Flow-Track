export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TimeFilter = 'today' | 'week' | 'month' | 'year' | 'all';
export type MemberActiveStatus = 'Tracking' | 'Break' | 'Idle' | 'Offline';
export type AccountType = 'OrgAdmin' | 'TeamMember' | 'Individual';
export type OrgType = 'Company' | 'School/University' | 'Agency/Studio' | 'Enterprise';

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
  assigned_to_id?: string;
  assigned_to_name?: string;
  assigned_by_name?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string; // e.g., 'Lead Designer', 'Senior Teacher', 'Student'
  department: string;
  activeStatus: MemberActiveStatus;
  currentTaskTitle?: string;
  todayLoggedSeconds: number;
  weeklyLoggedSeconds: number;
  completedTasksCount: number;
  assignedTasksCount: number;
  joinedDate: string;
  orgRole: 'Admin' | 'Member' | 'Manager';
}

export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  logo: string;
  code: string;
  memberCount: number;
  adminName: string;
  adminEmail: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isSignedIn: boolean;
  accountType: AccountType;
  orgId?: string;
  orgName?: string;
  orgType?: OrgType;
  orgRole?: 'Admin' | 'Member' | 'Manager';
}

