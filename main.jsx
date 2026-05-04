import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  GraduationCap,
  Home,
  ListChecks,
  Target,
  BarChart3,
  CalendarDays,
  Brain,
  ArrowLeft,
  Sparkles,
  Clock,
  Plus,
  RotateCcw,
  Play,
  Pause,
  Flame,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Check,
  Save,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import './styles.css';

const defaultTasks = [
  { id: 1, title: 'COMP1682 Final Project', description: 'Complete implementation and screenshots', due: '20 April', days: 14, priority: 'high', color: 'orange', status: 'active', category: 'Coursework', progress: 40 },
  { id: 2, title: 'Database Coursework', description: 'Finish schema and test data', due: '22 April', days: 7, priority: 'medium', color: 'yellow', status: 'active', category: 'Database', progress: 25 },
  { id: 3, title: 'Literature Review', description: 'Improve Chapter 2 references', due: '18 April', days: 3, priority: 'high', color: 'red', status: 'active', category: 'Report', progress: 65 },
  { id: 4, title: 'Python Assignment', description: 'Complete coding tasks', due: '19 April', days: 5, priority: 'high', color: 'red', status: 'active', category: 'Programming', progress: 55 },
  { id: 5, title: 'Group Presentation', description: 'Prepare demo slides', due: '25 April', days: 10, priority: 'low', color: 'yellow', status: 'active', category: 'Presentation', progress: 15 },
  { id: 6, title: 'UML Design', description: 'Update diagrams for report', due: '16 April', days: 1, priority: 'medium', color: 'blue', status: 'active', category: 'Design', progress: 70 },
];

const weeklyData = [
  { day: 'Mon', hours: 1.4 },
  { day: 'Tue', hours: 2.0 },
  { day: 'Wed', hours: 1.0 },
  { day: 'Thu', hours: 2.5 },
  { day: 'Fri', hours: 0.5 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0.5 },
];

function App() {
  const [screen, setScreen] = useState('splash');
  const [tasks, setTasks] = useState(defaultTasks);
  const [user, setUser] = useState({ name: 'Student', email: 'yanchuk.vasyl@ukr.net' });

  function go(next) { setScreen(next); }
  function login(email) {
    setUser({ name: 'Student', email: email || 'student@test.com' });
    setScreen('home');
  }
  function addTask(task) {
    setTasks([{ id: Date.now(), ...task }, ...tasks]);
    setScreen('tasks');
  }
  function completeTask(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'completed', progress: 100, color: 'green' } : t));
  }
  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  const app = (
    <div className="phone-frame">
      {screen === 'splash' && <Splash onStart={() => go('login')} />}
      {screen === 'login' && <Login onLogin={login} />}
      {screen === 'home' && <Dashboard tasks={tasks} user={user} go={go} />}
      {screen === 'calendar' && <CalendarScreen go={go} tasks={tasks} />}
      {screen === 'planner' && <PlannerScreen go={go} tasks={tasks} />}
      {screen === 'tasks' && <TasksScreen tasks={tasks} go={go} completeTask={completeTask} deleteTask={deleteTask} />}
      {screen === 'addTask' && <AddTaskScreen go={go} onAdd={addTask} />}
      {screen === 'focus' && <FocusScreen />}
      {screen === 'analytics' && <AnalyticsScreen tasks={tasks} />}
      {['home', 'tasks', 'focus', 'analytics'].includes(screen) && <BottomNav active={screen} go={go} />}
    </div>
  );

  return <div className="app-bg"><div className="desktop-shell">{app}<DesktopInfo tasks={tasks} /></div></div>;
}

function Splash({ onStart }) {
  return (
    <div className="screen center-screen">
      <div className="logo-box"><GraduationCap size={42} /></div>
      <h1>SmartStudy</h1>
      <p>Intelligent Study Planning System</p>
      <button className="primary-btn splash-btn" onClick={onStart}>Get Started</button>
    </div>
  );
}

function Login({ onLogin }) {
  const [email, setEmail] = useState('yanchuk.vasyl@ukr.net');
  const [password, setPassword] = useState('password123');
  const [message, setMessage] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!email || !password) {
      setMessage('Please enter email and password');
      return;
    }
    onLogin(email);
  }

  return (
    <div className="screen center-screen login-screen">
      <div className="logo-box small"><GraduationCap size={30} /></div>
      <h1>SmartStudy</h1>
      <p>Sign in to your account</p>
      <form className="login-card" onSubmit={submit}>
        <label>Email Address</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {message && <p className="error-msg">{message}</p>}
        <button className="primary-btn" type="submit">Login</button>
        <button className="link-btn" type="button" onClick={() => onLogin(email)}>Don't have an account? Sign up</button>
      </form>
    </div>
  );
}

function Dashboard({ tasks, user, go }) {
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  return (
    <main className="screen scroll-screen with-nav">
      <HeaderCard title={`Hello, ${user.name} 👋`} subtitle="Ready to achieve your goals?" />
      <div className="row-title">
        <h2>Upcoming Tasks</h2>
        <button onClick={() => go('tasks')}>See All ({tasks.length})</button>
      </div>
      <div className="task-stack">
        {activeTasks.slice(0, 5).map((task) => <TaskSmall key={task.id} task={task} />)}
      </div>
      <StudyHoursCard />
      <AIInsightCard tasks={tasks} />
      <div className="quick-grid">
        <button className="quick-card" onClick={() => go('calendar')}><CalendarDays />Calendar</button>
        <button className="quick-card purple" onClick={() => go('planner')}><Brain />AI Planner</button>
      </div>
    </main>
  );
}

function HeaderCard({ title, subtitle }) {
  return <section className="blue-header"><h1>{title}</h1><p>{subtitle}</p></section>;
}

function TaskSmall({ task }) {
  return (
    <article className={`task-small ${task.color}`}>
      <div><h3>{task.title}</h3></div>
      <span><CalendarDays size={16} />{task.days} days</span>
    </article>
  );
}

function StudyHoursCard() {
  return (
    <section className="study-card">
      <div className="soft-icon"><Clock /></div>
      <div><p>Weekly Study Hours</p><h2>8.0h</h2></div>
    </section>
  );
}

function AIInsightCard({ tasks }) {
  const urgent = tasks.find(t => t.priority === 'high' && t.status !== 'completed');
  const msg = urgent ? `${urgent.title} is high priority. Study today to stay on track.` : 'Great progress. Continue with one more focused session.';
  return (
    <section className="ai-insight">
      <div className="soft-icon transparent"><Brain /></div>
      <div><h3>💡 AI Insight</h3><p>{msg}</p></div>
    </section>
  );
}

function CalendarScreen({ go, tasks }) {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [month, setMonth] = useState(3);
  const [year, setYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(15);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const blanks = Array.from({ length: firstDayOfWeek });
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  function previousMonth() {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDay(1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDay(1);
  }

  const selectedTasks = tasks.filter((_, index) => index % 3 === selectedDay % 3).slice(0, 3);

  return (
    <main className="screen scroll-screen">
      <TopBar title="Study Calendar" subtitle="Plan your study sessions" go={go} />
      <section className="calendar-card">
        <div className="calendar-head">
          <button className="calendar-arrow" onClick={previousMonth} aria-label="Previous month"><ChevronLeft /></button>
          <h3>{monthNames[month]} {year}</h3>
          <button className="calendar-arrow" onClick={nextMonth} aria-label="Next month"><ChevronRight /></button>
        </div>
        <div className="calendar-week">
          <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
        </div>
        <div className="calendar-grid">
          {blanks.map((_, index) => <span key={`blank-${index}`} className="empty-day" />)}
          {days.map(day => (
            <button
              key={day}
              className={day === selectedDay ? 'selected-day' : ''}
              onClick={() => setSelectedDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </section>
      <section className="plan-card">
        <h2>Tasks for Day {selectedDay}</h2>
        {selectedTasks.length > 0 ? selectedTasks.map((t, index) => (
          <PlanRow key={t.id} title={t.title} time={index === 0 ? '2h' : '1h'} />
        )) : <p className="empty-text">No tasks planned for this day.</p>}
      </section>
    </main>
  );
}

function PlannerScreen({ go, tasks }) {
  const [generated, setGenerated] = useState(false);
  return (
    <main className="screen scroll-screen">
      <TopBar title="AI Study Planner" subtitle="Smart scheduling" go={go} />
      <section className="planner-hero"><Sparkles /><h2>AI-Powered Planning</h2><p>Our AI analyses your tasks, deadlines, and study patterns to create an optimized study schedule tailored to your needs.</p></section>
      {!generated && <button className="green-btn" onClick={() => setGenerated(true)}><Sparkles size={18} />Generate Study Plan</button>}
      {generated && <StudyPlan tasks={tasks} onRegenerate={() => setGenerated(false)} />}
      <section className="warning-card"><p><strong>ℹ️ Smart Planning:</strong> The AI considers your current tasks, deadlines, priority levels, and available time to create an optimal study schedule.</p></section>
    </main>
  );
}

function StudyPlan({ tasks, onRegenerate }) {
  const planDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  return <section className="plan-card"><h2>Your Study Plan</h2>{planDays.map((d, i) => <PlanRow key={d} day={d} title={tasks[i % tasks.length]?.title || 'Study Session'} time={i === 1 ? '1h' : '2h'} />)}<button className="purple-btn" onClick={onRegenerate}><RotateCcw size={17} />Regenerate Plan</button></section>;
}

function PlanRow({ day, title, time }) {
  return <div className="plan-row"><div>{day && <strong>{day}</strong>}<p>{title}</p></div><span>{time}</span></div>;
}

function TasksScreen({ tasks, go, completeTask, deleteTask }) {
  return (
    <main className="screen scroll-screen with-nav">
      <HeaderCard title="My Tasks" subtitle="Manage your assignments" />
      <div className="task-page-list">
        {tasks.map(task => <TaskLarge key={task.id} task={task} completeTask={completeTask} deleteTask={deleteTask} />)}
      </div>
      <button className="green-btn sticky-action" onClick={() => go('addTask')}><Plus size={18} />Add New Task</button>
    </main>
  );
}

function TaskLarge({ task, completeTask, deleteTask }) {
  return <article className="task-large">
    <h3 className={task.status === 'completed' ? 'done' : ''}>{task.title}</h3>
    <p>Due: {task.due}</p>
    <span className={`badge ${task.priority}`}>{task.priority}</span>
    <div className="task-actions">
      <button className="mini-btn green-mini" onClick={() => completeTask(task.id)}><Check size={14} />Done</button>
      <button className="mini-btn red-mini" onClick={() => deleteTask(task.id)}><Trash2 size={14} />Delete</button>
    </div>
  </article>;
}

function AddTaskScreen({ go, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('30 April');
  const [priority, setPriority] = useState('medium');
  const [hours, setHours] = useState('2');
  function save() {
    const color = priority === 'high' ? 'red' : priority === 'medium' ? 'yellow' : 'green';
    onAdd({ title: title || 'New Study Task', description, due: deadline || '30 April', days: 12, priority, color, status: 'active', category: 'Study', progress: 0, estimated_hours: hours });
  }
  return (
    <main className="screen scroll-screen">
      <TopBar title="Add New Task" subtitle="Create a study task" go={go} />
      <form className="form-card" onSubmit={e => { e.preventDefault(); save(); }}>
        <label>Task Title</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title" />
        <label>Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter task description" />
        <label>Deadline</label><input value={deadline} onChange={e => setDeadline(e.target.value)} />
        <label>Priority Level</label><select value={priority} onChange={e => setPriority(e.target.value)}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
        <label>Estimated Hours</label><input value={hours} onChange={e => setHours(e.target.value)} placeholder="Enter estimated hours" />
        <button className="green-btn full" type="submit"><Save size={18} />Save Task</button>
      </form>
    </main>
  );
}

function FocusScreen() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, [running]);
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  const progress = ((25 * 60 - seconds) / (25 * 60)) * 100;
  return (
    <main className="screen scroll-screen with-nav">
      <HeaderCard title="Focus Mode" subtitle="Pomodoro Timer" />
      <section className="focus-card">
        <div className="timer-text">{minutes}:{secs}</div>
        <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="focus-actions">
          <button className={running ? 'orange-btn' : 'green-btn'} onClick={() => setRunning(!running)}>{running ? <Pause size={18} /> : <Play size={18} />}{running ? 'Pause' : 'Start'}</button>
          <button className="reset-btn" onClick={() => { setRunning(false); setSeconds(25 * 60); }}><RotateCcw size={18} />Reset</button>
        </div>
        <div className="current-task"><p>Current Task:</p><h3>COMP1682 Report</h3></div>
      </section>
      <section className="tip-card"><p>💡 <strong>Tip:</strong> The Pomodoro technique helps maintain focus. Take a 5-minute break after each 25-minute session.</p></section>
    </main>
  );
}

function AnalyticsScreen({ tasks }) {
  const completed = tasks.filter(t => t.status === 'completed').length;
  const active = tasks.length - completed;
  const percent = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  return (
    <main className="screen scroll-screen with-nav">
      <HeaderCard title="Study Analytics" subtitle="Track your progress" />
      <section className="chart-card"><h2>Weekly Study Hours</h2><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="hours" fill="#3b82f6" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></div></section>
      <div className="metric-grid"><MetricCard color="orange-grad" icon={<Flame />} title="Study Streak" value="6" label="Days" /><MetricCard color="green-grad" icon={<CheckCircle2 />} title="Completion" value={percent || 80} label="Percent" /></div>
      <section className="stats-list"><h2>Statistics</h2><StatRow label="Total Tasks" value={tasks.length} /><StatRow label="Completed" value={completed} color="green" /><StatRow label="In Progress" value={active} color="blue" /><StatRow label="Avg. Study Time/Day" value="1.2h" color="purple" /></section>
    </main>
  );
}

function MetricCard({ color, icon, title, value, label }) { return <section className={`metric-card ${color}`}>{icon}<span>{title}</span><h2>{value}</h2><p>{label}</p></section>; }
function StatRow({ label, value, color = '' }) { return <div className={`stat-row ${color}`}><span>{label}</span><strong>{value}</strong></div>; }

function TopBar({ title, subtitle, go }) {
  return <section className="topbar"><button onClick={() => go('home')}><ArrowLeft /></button><div><h1>{title}</h1><p>{subtitle}</p></div></section>;
}

function BottomNav({ active, go }) {
  const items = [
    ['home', Home, 'Home'],
    ['tasks', ListChecks, 'Tasks'],
    ['focus', Target, 'Focus'],
    ['analytics', BarChart3, 'Analytics'],
  ];
  return <nav className="bottom-nav">{items.map(([key, Icon, label]) => <button key={key} onClick={() => go(key)} className={active === key ? 'active' : ''}><Icon /><span>{label}</span></button>)}</nav>;
}

function DesktopInfo({ tasks }) {
  const active = tasks.filter(t => t.status !== 'completed').length;
  return <aside className="desktop-info">
    <h2>SmartStudy Demo</h2>
    <p>This responsive version works as a mobile app view and also looks clean on laptop screens.</p>
    <div className="desktop-card"><strong>{tasks.length}</strong><span>Total tasks</span></div>
    <div className="desktop-card"><strong>{active}</strong><span>Active tasks</span></div>
    <div className="desktop-card"><strong>78.5</strong><span>SUS usability score</span></div>
    <p className="hint">Use the phone screen to test all buttons: Tasks, Add Task, Focus timer, Calendar, AI Planner, and Analytics.</p>
  </aside>
}

createRoot(document.getElementById('root')).render(<App />);
