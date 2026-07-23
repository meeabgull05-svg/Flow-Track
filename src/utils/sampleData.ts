import { Task, Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Product Development', color: 'bg-indigo-500 text-indigo-100 dark:bg-indigo-600' },
  { id: '2', name: 'UI/UX Design', color: 'bg-pink-500 text-pink-100 dark:bg-pink-600' },
  { id: '3', name: 'API & Backend', color: 'bg-blue-500 text-blue-100 dark:bg-blue-600' },
  { id: '4', name: 'Marketing & SEO', color: 'bg-emerald-500 text-emerald-100 dark:bg-emerald-600' },
  { id: '5', name: 'Client Support', color: 'bg-amber-500 text-amber-100 dark:bg-amber-600' },
  { id: '6', name: 'Operations', color: 'bg-purple-500 text-purple-100 dark:bg-purple-600' },
];

/**
 * Generates sample tasks spanning today back to 365 days ago
 */
export function generate1YearSampleTasks(): Task[] {
  const sampleTasks: Task[] = [];
  const categories = DEFAULT_CATEGORIES.map(c => c.name);
  const priorities = ['Low', 'Medium', 'High', 'Urgent'] as const;

  const taskTemplates = [
    { title: 'Build FlowTrack Dashboard UI', category: 'Product Development', priority: 'High', seconds: 14400 },
    { title: 'Design Figma Wireframes & Design System', category: 'UI/UX Design', priority: 'Medium', seconds: 9000 },
    { title: 'Implement Supabase Schema & Auth Rules', category: 'API & Backend', priority: 'Urgent', seconds: 7200 },
    { title: 'Write Landing Page Copy & Value Prop', category: 'Marketing & SEO', priority: 'Low', seconds: 3600 },
    { title: 'Resolve WebSocket Disconnect Issue in Production', category: 'API & Backend', priority: 'Urgent', seconds: 10800 },
    { title: 'Setup Stripe Subscription Webhooks', category: 'API & Backend', priority: 'High', seconds: 8100 },
    { title: 'Optimize Mobile Navigation & Touch Targets', category: 'UI/UX Design', priority: 'Medium', seconds: 5400 },
    { title: 'Conduct Weekly Product Planning & Sprint Retro', category: 'Operations', priority: 'Medium', seconds: 4500 },
    { title: 'Customer Onboarding Session & Demo Call', category: 'Client Support', priority: 'High', seconds: 3600 },
    { title: 'Refactor Tailwind CSS Config & Theme Tokens', category: 'Product Development', priority: 'Low', seconds: 2700 },
    { title: 'Audit Database Query Latency & Indexes', category: 'API & Backend', priority: 'High', seconds: 6300 },
    { title: 'Create Product Demo Video & Social Teaser', category: 'Marketing & SEO', priority: 'Medium', seconds: 12600 },
    { title: 'Setup CI/CD Pipeline with GitHub Actions', category: 'Operations', priority: 'Medium', seconds: 5400 },
  ];

  const now = new Date();

  // 1. Create Today's tasks
  sampleTasks.push(
    {
      id: 'task-today-1',
      user_id: 'user_demo_flowtrack',
      title: 'Design FlowTrack 1-Year History Matrix',
      description: 'Create interactive 52-week activity heatmap and filter controls.',
      category: 'UI/UX Design',
      priority: 'High',
      status: 'In Progress',
      time_spent_seconds: 4820,
      estimated_seconds: 7200,
      created_at: new Date(now.getTime() - 4 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['Design', 'Analytics', 'SaaS'],
    },
    {
      id: 'task-today-2',
      user_id: 'user_demo_flowtrack',
      title: 'Refactor Live Timer Stopwatch Logic',
      description: 'Ensure accurate elapsed time calculation with background tab resilience.',
      category: 'Product Development',
      priority: 'Urgent',
      status: 'In Progress',
      time_spent_seconds: 2150,
      estimated_seconds: 3600,
      created_at: new Date(now.getTime() - 2 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      tags: ['React', 'Hooks', 'Stopwatch'],
    },
    {
      id: 'task-today-3',
      user_id: 'user_demo_flowtrack',
      title: 'Review Supabase Migration Scripts',
      description: 'Double-check RLS policies for user_id security isolation.',
      category: 'API & Backend',
      priority: 'Medium',
      status: 'Completed',
      time_spent_seconds: 3600,
      estimated_seconds: 3600,
      created_at: new Date(now.getTime() - 6 * 3600 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      tags: ['Supabase', 'SQL', 'Security'],
    }
  );

  // 2. Generate historical tasks back to 365 days ago
  let taskIdCounter = 10;
  for (let d = 1; d <= 365; d += Math.floor(Math.random() * 2) + 1) { // Skip some days for realistic gaps
    const taskDate = new Date(now);
    taskDate.setDate(now.getDate() - d);

    // Random 1 to 3 tasks per active day
    const dailyCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < dailyCount; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const variationSecs = template.seconds + Math.floor(Math.random() * 3600) - 1800;
      const actualSecs = Math.max(900, variationSecs);

      sampleTasks.push({
        id: `task-hist-${taskIdCounter++}`,
        user_id: 'user_demo_flowtrack',
        title: `${template.title} #${taskIdCounter}`,
        description: `Logged productivity session for ${template.category}.`,
        category: template.category,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: 'Completed',
        time_spent_seconds: actualSecs,
        estimated_seconds: actualSecs + 1800,
        created_at: taskDate.toISOString(),
        updated_at: taskDate.toISOString(),
        completed_at: taskDate.toISOString(),
        tags: [template.category.toLowerCase().replace(/\s+/g, '-')],
      });
    }
  }

  return sampleTasks;
}
