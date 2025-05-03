"use client"
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from "framer-motion";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from "recharts";
import Image from "next/image";

// Google Fonts import (Inter)
const fontLink = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap";

type Habit = {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  checked: boolean;
  type: 'binary' | 'numeric';
  goal?: number;
  current?: number;
  longestStreak: number;
  totalDaysCompleted: number;
};

type Notification = {
  id: string;
  type: 'achievement' | 'reminder' | 'streak' | 'milestone';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  read: boolean;
};

type NotificationSettings = {
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  achievements: boolean;
};

// Mock habits data
const initialHabits: Habit[] = [
  {
    id: "1",
    name: "Make bed",
    icon: "🛏️",
    color: "bg-yellow-500",
    streak: 4,
    checked: false,
    type: 'binary',
    longestStreak: 7,
    totalDaysCompleted: 15
  },
  {
    id: "2",
    name: "Meditate",
    icon: "🧘‍♂️",
    color: "bg-purple-500",
    streak: 2,
    checked: false,
    type: 'binary',
    longestStreak: 5,
    totalDaysCompleted: 12
  },
  {
    id: "3",
    name: "Water intake",
    icon: "💧",
    color: "bg-blue-500",
    streak: 6,
    checked: false,
    type: 'numeric',
    goal: 8,
    current: 0,
    longestStreak: 10,
    totalDaysCompleted: 20
  },
  {
    id: "4",
    name: "Sleep hours",
    icon: "😴",
    color: "bg-pink-500",
    streak: 3,
    checked: false,
    type: 'numeric',
    goal: 8,
    current: 0,
    longestStreak: 5,
    totalDaysCompleted: 8
  }
];

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "achievement",
    title: "7 Day Streak!",
    message: "You've maintained a 7-day streak! Keep it up!",
    icon: "🏆",
    timestamp: new Date(),
    read: false
  },
  {
    id: "2",
    type: "reminder",
    title: "Daily Check-in",
    message: "Don't forget to check your habits for today!",
    icon: "🔔",
    timestamp: new Date(),
    read: true
  }
];

// Mock notification settings
const initialNotificationSettings: NotificationSettings = {
  daily: true,
  weekly: true,
  monthly: true,
  achievements: true
};

// Mock leaderboard data
const leaderboardData = [
  {
    id: '1',
    name: 'Alex',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    score: 120,
    streak: 15,
    isCurrentUser: true,
  },
  {
    id: '2',
    name: 'Samira',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    score: 110,
    streak: 12,
    isCurrentUser: false,
  },
  {
    id: '3',
    name: 'Chris',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    score: 98,
    streak: 10,
    isCurrentUser: false,
  },
  {
    id: '4',
    name: 'Priya',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    score: 90,
    streak: 9,
    isCurrentUser: false,
  },
  {
    id: '5',
    name: 'Jordan',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    score: 85,
    streak: 8,
    isCurrentUser: false,
  },
];

// Mock data for Friend Challenges
const friendChallenges = [
  {
    id: 'c1',
    friend: 'Samira',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    habit: 'Meditate',
    status: 'pending', // 'pending', 'accepted', 'completed'
    days: 7,
    progress: 3,
  },
  {
    id: 'c2',
    friend: 'Chris',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    habit: 'Water intake',
    status: 'accepted',
    days: 5,
    progress: 5,
  },
  {
    id: 'c3',
    friend: 'Priya',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    habit: 'Sleep hours',
    status: 'completed',
    days: 10,
    progress: 10,
  },
];

// Mock data for Community Feed
const communityFeed = [
  {
    id: 'f1',
    user: 'Jordan',
    avatar: 'https://randomuser.me/api/portraits/men/77.jpg',
    action: 'completed a 30-day streak in Meditate!',
    time: '2m ago',
  },
  {
    id: 'f2',
    user: 'Samira',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    action: 'joined the Water intake challenge!',
    time: '10m ago',
  },
  {
    id: 'f3',
    user: 'Priya',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    action: 'invited you to a group habit: Read a book',
    time: '20m ago',
  },
  {
    id: 'f4',
    user: 'Alex',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    action: 'completed a friend challenge with Chris!',
    time: '1h ago',
  },
];

// Mock data for Collaborative Habit Tracking
const groupHabits = [
  {
    id: 'g1',
    name: 'Read a book',
    members: [
      { name: 'Alex', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      { name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
      { name: 'Samira', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    ],
    progress: 80,
  },
  {
    id: 'g2',
    name: 'Morning Run',
    members: [
      { name: 'Chris', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
      { name: 'Jordan', avatar: 'https://randomuser.me/api/portraits/men/77.jpg' },
    ],
    progress: 60,
  },
];

function uuid() {
  return '_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Update ProgressRing component with enhanced visuals
const ProgressRing = ({ progress, color, size = 140, strokeWidth = 12, label }: { 
  progress: number; 
  color: string; 
  size?: number; 
  strokeWidth?: number;
  label: string;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  // Enhanced glow effects
  const glowStyles = {
    pink: "text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]",
    purple: "text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]",
    blue: "text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    green: "text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
  };

  return (
    <div className="relative flex flex-col items-center">
      <motion.svg
        width={size}
        height={size}
        className="transform -rotate-90"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background circle with gradient */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-800/50"
        />
        {/* Progress circle with enhanced glow */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={glowStyles[color as keyof typeof glowStyles]}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
        {/* Enhanced glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${glowStyles[color as keyof typeof glowStyles]} opacity-30 blur-lg`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <span className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(0,0,0,0.5)]">{progress}%</span>
          <span className="block text-sm text-gray-300 mt-1">{label}</span>
        </motion.div>
      </div>
    </div>
  );
};

// Add this component before the main HabitTracker component
const AnimatedLogo = () => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center mb-8"
    >
      <motion.svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        className="drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"
      >
        {/* Background Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Progress Ring */}
        <motion.circle
          cx="60"
          cy="60"
          r="40"
          fill="none"
          stroke="#ec4899"
          strokeWidth="4"
          strokeDasharray="251.2"
          strokeDashoffset="125.6"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />

        {/* Center Circle */}
        <motion.circle
          cx="60"
          cy="60"
          r="20"
          fill="url(#gradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />

        {/* Leaf 1 */}
        <motion.path
          d="M60 20 C80 20, 100 40, 100 60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        />

        {/* Leaf 2 */}
        <motion.path
          d="M60 20 C40 20, 20 40, 20 60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />

        {/* Leaf 3 */}
        <motion.path
          d="M60 100 C80 100, 100 80, 100 60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
        />

        {/* Leaf 4 */}
        <motion.path
          d="M60 100 C40 100, 20 80, 20 60"
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
        />

        {/* Sparkles */}
        <motion.g>
          {[0, 90, 180, 270].map((rotation, index) => (
            <motion.path
              key={index}
              d="M60 10 L65 15 L60 20 L55 15 Z"
              fill="#fcd34d"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 1.6 + index * 0.2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              transform={`rotate(${rotation} 60 60)`}
            />
          ))}
        </motion.g>

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </motion.svg>
    </motion.div>
  );
};

export default function HabitTracker() {
  // Inject Google Fonts dynamically (since we can't use _document.js)
  useEffect(() => {
    if (!document.getElementById("google-font-inter")) {
      const link = document.createElement("link");
      link.id = "google-font-inter";
      link.rel = "stylesheet";
      link.href = fontLink;
      document.head.appendChild(link);
    }
  }, []);

  // State for habits
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  // State for completed count
  const completedCount = habits.filter((h) => h.checked).length;
  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>("add");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [form, setForm] = useState({ name: "", icon: "", color: "bg-yellow-500" });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  // Analytics view state
  const [analyticsView, setAnalyticsView] = useState<'weekly' | 'monthly'>('weekly');
  // Footer modals state
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerModalContent, setFooterModalContent] = useState<'about' | 'privacy' | 'contact' | null>(null);
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("Alex");
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(initialNotificationSettings);
  // Reminders modal state
  const [remindersOpen, setRemindersOpen] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, time: "08:00", enabled: true, label: "Morning Check-in" },
    { id: 2, time: "12:00", enabled: false, label: "Midday Check-in" },
    { id: 3, time: "20:00", enabled: true, label: "Evening Check-in" }
  ]);
  const [showIntro, setShowIntro] = useState(true);
  const [showArrow, setShowArrow] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock weekly data for analytics
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const monthDays = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
  
  const weeklyData = weekDays.map((day) => ({
    day,
    completed: Math.floor(Math.random() * habits.length) + 1,
    total: habits.length,
  }));

  const monthlyData = monthDays.map((day) => ({
    day,
    completed: Math.floor(Math.random() * habits.length) + 1,
    total: habits.length,
  }));

  const analyticsData = analyticsView === 'weekly' ? weeklyData : monthlyData;
  const totalStreak = habits.reduce((acc, h) => acc + h.streak, 0);
  const completionRate = habits.length ? Math.round((habits.filter(h => h.checked).length / habits.length) * 100) : 0;

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for missed habits notification
  const [showMissedHabits, setShowMissedHabits] = useState(false);
  const [missedHabits, setMissedHabits] = useState<Habit[]>([]);

  // Check for missed habits
  useEffect(() => {
    const now = new Date();
    const lastCheck = new Date(localStorage.getItem('lastCheck') || now.toISOString());
    const hoursSinceLastCheck = (now.getTime() - lastCheck.getTime()) / (1000 * 60 * 60);

    if (hoursSinceLastCheck >= 24) {
      const missed = habits.filter(h => !h.checked) as Habit[];
      if (missed.length > 0) {
        setMissedHabits(missed);
        setShowMissedHabits(true);
      }
      localStorage.setItem('lastCheck', now.toISOString());
    }
  }, [habits]);

  // Update unread count when notifications change
  useEffect(() => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const handleNumericChange = (id: string, value: number) => {
    setHabits(prev => prev.map(h => 
      h.id === id ? { ...h, current: value, checked: value >= (h.goal || 0) } : h
    ));
  };

  const handleCheck = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          const newChecked = !habit.checked;
          const newStreak = newChecked ? habit.streak + 1 : Math.max(0, habit.streak - 1);
          const newLongestStreak = newStreak > habit.longestStreak ? newStreak : habit.longestStreak;
          const newTotalDays = newChecked ? habit.totalDaysCompleted + 1 : habit.totalDaysCompleted;
          
          return {
            ...habit,
            checked: newChecked,
            streak: newStreak,
            longestStreak: newLongestStreak,
            totalDaysCompleted: newTotalDays
          };
        }
        return habit;
      })
    );
  };

  // Open modal for add/edit
  const openAddModal = () => {
    setForm({ name: "", icon: "", color: "bg-yellow-500" });
    setModalMode("add");
    setEditingHabit(null);
    setModalOpen(true);
  };
  const openEditModal = (habit: Habit) => {
    setForm({ name: habit.name, icon: habit.icon, color: habit.color });
    setModalMode("edit");
    setEditingHabit(habit);
    setModalOpen(true);
  };
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      errors.name = "Habit name is required";
    }
    if (!form.icon.trim()) {
      errors.icon = "Please select an icon";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (modalMode === "add") {
      setHabits((prev) => [
        ...prev,
        {
          id: uuid(),
          name: form.name,
          icon: form.icon,
          color: form.color,
          streak: 0,
          checked: false,
          type: 'binary',
          longestStreak: 0,
          totalDaysCompleted: 0
        },
      ]);
    } else if (modalMode === "edit" && editingHabit) {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === editingHabit.id ? { ...h, name: form.name, icon: form.icon, color: form.color } : h
        )
      );
    }
    setModalOpen(false);
    setForm({ name: "", icon: "", color: "bg-yellow-500" });
    setFormErrors({});
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const openFooterModal = (content: 'about' | 'privacy' | 'contact') => {
    setFooterModalContent(content);
    setFooterModalOpen(true);
  };

  const closeFooterModal = () => {
    setFooterModalOpen(false);
    setFooterModalContent(null);
  };

  useEffect(() => {
    // Show arrow after intro animation
    const timer = setTimeout(() => {
      setShowArrow(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleArrowClick = () => {
    setShowIntro(false);
  };

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY]);

  // Scroll progress tracking
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-500/20 text-yellow-400';
      case 'streak': return 'bg-orange-500/20 text-orange-400';
      case 'reminder': return 'bg-blue-500/20 text-blue-400';
      case 'milestone': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Add state for modals and form data
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [friendChallengesState, setFriendChallengesState] = useState(friendChallenges);
  const [groupHabitsState, setGroupHabitsState] = useState(groupHabits);

  // Mock friends and habits for selection
  const friendsList = [
    { name: 'Samira', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Chris', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
    { name: 'Priya', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Jordan', avatar: 'https://randomuser.me/api/portraits/men/77.jpg' },
  ];
  const habitList = ['Meditate', 'Water intake', 'Sleep hours', 'Read a book', 'Morning Run'];

  const [challengeForm, setChallengeForm] = useState({ friend: '', habit: '', days: 7 });
  const [challengeFormError, setChallengeFormError] = useState('');
  const [groupForm, setGroupForm] = useState({ name: '', members: [] as string[] });
  const [groupFormError, setGroupFormError] = useState('');

  // State for Smart Streak Assistant
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantSuggestion, setAssistantSuggestion] = useState("");

  // Generate assistant suggestions based on habits and streaks
  useEffect(() => {
    const generateSuggestion = () => {
      const now = new Date();
      const hour = now.getHours();
      const completedHabits = habits.filter(h => h.checked).length;
      const totalHabits = habits.length;
      const completionRate = totalHabits ? (completedHabits / totalHabits) * 100 : 0;

      // Morning suggestions (5-11 AM)
      if (hour >= 5 && hour < 11) {
        if (completionRate < 30) {
          setAssistantMessage("Good morning! Let's start your day strong!");
          setAssistantSuggestion("Complete your morning habits to set a positive tone for the day.");
        } else if (completionRate >= 30 && completionRate < 70) {
          setAssistantMessage("You're making progress! Keep it up!");
          setAssistantSuggestion("Try to complete at least one more habit before noon.");
        }
      }
      // Afternoon suggestions (11 AM - 5 PM)
      else if (hour >= 11 && hour < 17) {
        if (completionRate < 50) {
          setAssistantMessage("Midday check-in! How are your habits going?");
          setAssistantSuggestion("Take a short break to complete some habits.");
        } else if (completionRate >= 50 && completionRate < 90) {
          setAssistantMessage("You're doing great! Almost there!");
          setAssistantSuggestion("Complete a few more habits to reach your daily goal.");
        }
      }
      // Evening suggestions (5 PM - 11 PM)
      else if (hour >= 17 && hour < 23) {
        if (completionRate < 70) {
          setAssistantMessage("Evening reminder! Don't forget your habits!");
          setAssistantSuggestion("Complete your remaining habits before bedtime.");
        } else if (completionRate >= 70 && completionRate < 100) {
          setAssistantMessage("Almost done! You're so close!");
          setAssistantSuggestion("Complete your last few habits to finish strong.");
        }
      }
      // Night suggestions (11 PM - 5 AM)
      else {
        if (completionRate < 100) {
          setAssistantMessage("It's getting late! Time to wrap up.");
          setAssistantSuggestion("Complete any remaining habits before calling it a day.");
        }
      }

      // Check for streaks
      const longestStreak = Math.max(...habits.map(h => h.streak));
      if (longestStreak >= 5) {
        setAssistantMessage(`Amazing! You're on a ${longestStreak}-day streak!`);
        setAssistantSuggestion("Keep up the momentum to reach your next milestone!");
      }

      // Check for missed habits
      const missedHabits = habits.filter(h => !h.checked);
      if (missedHabits.length > 0) {
        setAssistantMessage("Don't forget about these habits!");
        setAssistantSuggestion(`Complete your ${missedHabits.map(h => h.name).join(", ")} habits.`);
      }
    };

    generateSuggestion();
    const interval = setInterval(generateSuggestion, 1000 * 60 * 30); // Update every 30 minutes
    return () => clearInterval(interval);
  }, [habits]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white font-sans antialiased" style={{ fontFamily: 'Inter, sans-serif' }}>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
          >
            <AnimatedLogo />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Transform
                </span>
                <br />
                Your Daily
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  Habits
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Build better habits, one day at a time. Your journey to a better you starts here.
              </motion.p>
            </motion.div>

            {showArrow && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                onClick={handleArrowClick}
                className="absolute bottom-8 flex flex-col items-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 rounded-lg p-2"
                aria-label="Enter HabitFlow"
              >
                <span className="text-sm text-gray-400 mb-2 group-hover:text-pink-400 transition-colors duration-300">
                  Enter HabitFlow
                </span>
                <motion.div
                  animate={{
                    y: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-3xl text-pink-500 group-hover:text-pink-400 transition-colors duration-300"
                >
                  ↓
                </motion.div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!showIntro && (
        <>
          {/* Navbar with Progress Bar */}
          <nav className="w-full flex items-center justify-between px-6 py-4 bg-gray-950/80 backdrop-blur sticky top-0 z-20 shadow-lg">
            <div className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <span className="text-pink-500">●</span> HabitFlow
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex gap-8 text-sm font-semibold">
                <a href="#today" className="hover:text-pink-400 transition relative group">
                  Today
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                </a>
                <a href="#habits" className="hover:text-pink-400 transition relative group">
                  Habits
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                </a>
                <a href="#analytics" className="hover:text-pink-400 transition relative group">
                  Analytics
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
                </a>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4 relative">
              <button
                onClick={() => setSettingsOpen(true)}
                className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-pink-400 transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 rounded-lg px-3 py-1"
                aria-label="Open Settings"
              >
                <span>Settings</span>
              </button>
              {/* Notification Bell (moved here, not fixed) */}
              <motion.button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Show notifications"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>
              <Image 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="User avatar" 
                width={32}
                height={32}
                className="rounded-full border-2 border-pink-500 shadow hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                tabIndex={0}
              />
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-gray-400 hover:text-pink-400 transition focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 rounded-lg p-1"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500"
              style={{ width: progressWidth }}
            />
          </nav>

          {/* Main Content */}
          <main className="flex flex-col items-center justify-center flex-1 w-full px-4 py-12 md:py-20">
            {/* Hero / Landing Section */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-3xl text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                Build Better Habits, <span className="text-pink-500">Every Day</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                Track your daily routines, visualize your progress, and stay motivated with HabitFlow — your personal analytics & habit tracker.
              </p>
              <a 
                href="#today" 
                className="inline-block px-8 py-3 rounded-full bg-pink-600 hover:bg-pink-500 transition text-lg font-semibold shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                role="button"
              >
                Get Started
              </a>
            </motion.section>

            {/* Feature Highlights Section */}
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="w-full max-w-4xl mb-16"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-500/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500/0 before:via-pink-500/10 before:to-pink-500/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  tabIndex={0}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📊</div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">Track Habits</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Easily log and monitor your daily habits with our intuitive interface.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-500/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500/0 before:via-pink-500/10 before:to-pink-500/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  tabIndex={0}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📈</div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">View Analytics</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Get detailed insights into your progress with beautiful charts and statistics.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-500/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500/0 before:via-pink-500/10 before:to-pink-500/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  tabIndex={0}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🎯</div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">Set Goals</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Define and track your personal goals with customizable habit targets.</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-gray-800/80 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-pink-500/20 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-pink-500/0 before:via-pink-500/10 before:to-pink-500/0 before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000 before:ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                  tabIndex={0}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">💪</div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2 group-hover:text-pink-300 transition-colors duration-300">Stay Motivated</h3>
                    <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">Build streaks and celebrate your progress with our reward system.</p>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Today Section */}
            <section id="today" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Today&apos;s Habits</span>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-400">
                      <span className="font-bold text-pink-400">{completedCount}</span> / {habits.length} completed
                    </div>
                    <div className="text-sm text-gray-400">
                      Total Streak: <span className="font-bold text-pink-400">{totalStreak}</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-4">
                  {habits.map((habit) => (
                    <motion.li
                      key={habit.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex items-center justify-between bg-gray-900/80 rounded-xl px-4 py-3 shadow group hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xl w-9 h-9 flex items-center justify-center rounded-full ${habit.color} bg-opacity-80 group-hover:scale-110 transition-transform duration-300`}>
                          {habit.icon}
                        </span>
                        <div>
                          <span className="font-semibold text-lg group-hover:text-pink-400 transition-colors duration-300">{habit.name}</span>
                          {habit.type === 'numeric' && (
                            <div className="flex items-center gap-2 mt-1">
                              <input
                                type="range"
                                min="0"
                                max={habit.goal}
                                value={habit.current || 0}
                                onChange={(e) => handleNumericChange(habit.id, parseInt(e.target.value))}
                                className="w-32 accent-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                                aria-label={`${habit.name} progress`}
                              />
                              <span className="text-sm text-gray-400">
                                {habit.current || 0}/{habit.goal}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Streak:</span>
                          <span className="font-bold text-pink-400">{habit.streak}</span>
                          <span className="text-xs text-gray-400">(Best: {habit.longestStreak})</span>
                        </div>
                        {habit.type === 'binary' && (
                          <button
                            onClick={() => handleCheck(habit.id)}
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 ${
                              habit.checked
                                ? "bg-green-500 border-green-400 text-white shadow-lg"
                                : "bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700 hover:border-pink-400"
                            }`}
                            aria-label={habit.checked ? "Mark as incomplete" : "Mark as complete"}
                          >
                            {habit.checked ? (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-xl"
                              >
                                ✓
                              </motion.span>
                            ) : (
                              <span className="text-xl">–</span>
                            )}
                          </button>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </section>

            {/* Habits Dashboard Section */}
            <section id="habits" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">All Habits</span>
                  <button
                    onClick={openAddModal}
                    className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 transition text-sm font-semibold shadow-lg"
                  >
                    + Add Habit
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-900/80 rounded-xl p-4 shadow group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className={`text-xl w-9 h-9 flex items-center justify-center rounded-full ${habit.color} bg-opacity-80`}>{habit.icon}</span>
                          <span className="font-semibold text-lg">{habit.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(habit)}
                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-blue-500 border-blue-400 text-white hover:bg-blue-600 transition"
                            aria-label="Edit Habit"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(habit.id)}
                            className="w-6 h-6 rounded-full border-2 flex items-center justify-center bg-red-500 border-red-400 text-white hover:bg-red-600 transition"
                            aria-label="Delete Habit"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">Streak:</span>
                          <span className="font-bold text-pink-400">{habit.streak}</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-pink-500 transition-all duration-500"
                            style={{ width: `${(habit.streak / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Analytics Section */}
            <section id="analytics" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Analytics</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setAnalyticsView('weekly')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                        analyticsView === 'weekly' 
                          ? 'bg-pink-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      Weekly
                    </button>
                    <button 
                      onClick={() => setAnalyticsView('monthly')}
                      className={`px-3 py-1 rounded-full text-sm transition-colors duration-300 ${
                        analyticsView === 'monthly' 
                          ? 'bg-pink-600 text-white' 
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                
                {/* Enhanced Progress Rings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <ProgressRing 
                    progress={completionRate} 
                    color="pink" 
                    size={140}
                    strokeWidth={12}
                    label="Completion Rate" 
                  />
                  <ProgressRing 
                    progress={Math.min(100, (totalStreak / (habits.length * 30)) * 100)} 
                    color="purple" 
                    size={140}
                    strokeWidth={12}
                    label="Streak Progress" 
                  />
                  <ProgressRing 
                    progress={Math.min(100, (habits.filter(h => h.checked).length / habits.length) * 100)} 
                    color="blue" 
                    size={140}
                    strokeWidth={12}
                    label="Today's Progress" 
                  />
                  <ProgressRing 
                    progress={Math.min(100, (habits.reduce((acc, h) => acc + (h.longestStreak || 0), 0) / (habits.length * 30)) * 100)} 
                    color="green" 
                    size={140}
                    strokeWidth={12}
                    label="Best Streak" 
                  />
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-900/80 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-lg font-semibold text-pink-400 mb-1">Total Streak</span>
                    <span className="text-3xl font-bold">{totalStreak}</span>
                    <span className="text-xs text-gray-400">(Sum of all habit streaks)</span>
                  </div>
                  <div className="bg-gray-900/80 rounded-xl p-4 flex flex-col items-center">
                    <span className="text-lg font-semibold text-pink-400 mb-1">Completion Rate</span>
                    <span className="text-3xl font-bold">{completionRate}%</span>
                    <span className="text-xs text-gray-400">(Habits completed today)</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="w-full h-64 bg-gray-900/80 rounded-xl p-4 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#aaa" 
                        tick={{ fontSize: analyticsView === 'weekly' ? 12 : 10 }}
                      />
                      <YAxis stroke="#aaa" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#222', 
                          border: 'none', 
                          color: '#fff',
                          borderRadius: '8px',
                          padding: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar 
                        dataKey="completed" 
                        fill="#ec4899" 
                        name="Completed" 
                        radius={[6, 6, 0, 0]} 
                      />
                      <Bar 
                        dataKey="total" 
                        fill="#6366f1" 
                        name="Total" 
                        radius={[6, 6, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart for Trends */}
                <div className="w-full h-64 bg-gray-900/80 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis 
                        dataKey="day" 
                        stroke="#aaa" 
                        tick={{ fontSize: analyticsView === 'weekly' ? 12 : 10 }}
                      />
                      <YAxis stroke="#aaa" allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: '#222', 
                          border: 'none', 
                          color: '#fff',
                          borderRadius: '8px',
                          padding: '8px'
                        }} 
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#ec4899" 
                        strokeWidth={2}
                        dot={{ fill: '#ec4899', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Completion Trend"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </section>

            {/* Leaderboard Section */}
            <section id="leaderboard" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Leaderboard</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-gray-400 font-semibold">Rank</th>
                        <th className="px-4 py-2 text-gray-400 font-semibold">User</th>
                        <th className="px-4 py-2 text-gray-400 font-semibold">Score</th>
                        <th className="px-4 py-2 text-gray-400 font-semibold">Streak</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user, idx) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.07 }}
                          className={`rounded-xl transition-all duration-200 ${user.isCurrentUser ? 'bg-pink-500/10 border-l-4 border-pink-500' : 'hover:bg-gray-700/40'}`}
                        >
                          <td className="px-4 py-3 font-bold text-lg text-pink-400">{idx + 1}</td>
                          <td className="px-4 py-3 flex items-center gap-3">
                            <Image 
                              src={user.avatar} 
                              alt={user.name} 
                              width={36}
                              height={36}
                              className="rounded-full border-2 border-pink-400 shadow"
                            />
                            <span className="font-semibold text-white">{user.name}</span>
                            {user.isCurrentUser && (
                              <span className="ml-2 px-2 py-0.5 rounded-full bg-pink-500 text-xs text-white font-bold">You</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-semibold text-purple-400">{user.score}</td>
                          <td className="px-4 py-3 font-semibold text-green-400">🔥 {user.streak}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </section>

            {/* Friend Challenges Section */}
            <section id="friend-challenges" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Friend Challenges</span>
                  <button onClick={() => setChallengeModalOpen(true)} className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg transition">+ Challenge a Friend</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friendChallengesState.map((challenge, idx) => (
                    <motion.div
                      key={challenge.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className={`flex items-center gap-4 bg-gray-900/80 rounded-xl p-4 shadow group border-l-4 ${
                        challenge.status === 'pending' ? 'border-yellow-400' :
                        challenge.status === 'accepted' ? 'border-blue-400' :
                        'border-green-400'
                      }`}
                    >
                      <Image 
                        src={challenge.avatar} 
                        alt={challenge.friend} 
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-pink-400 shadow"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{challenge.friend}</div>
                        <div className="text-sm text-gray-400">{challenge.habit} • {challenge.days} days</div>
                        <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                          <div className={`h-full rounded-full ${challenge.status === 'completed' ? 'bg-green-400' : 'bg-pink-500'}`} style={{ width: `${(challenge.progress / challenge.days) * 100}%` }} />
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        challenge.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        challenge.status === 'accepted' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Challenge a Friend Modal */}
            <AnimatePresence>
              {challengeModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
                  onClick={() => setChallengeModalOpen(false)}
                >
                  <motion.form
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    onSubmit={e => {
                      e.preventDefault();
                      if (!challengeForm.friend || !challengeForm.habit || !challengeForm.days) {
                        setChallengeFormError('All fields are required.');
                        return;
                      }
                      const friendObj = friendsList.find(f => f.name === challengeForm.friend);
                      setFriendChallengesState(prev => [
                        ...prev,
                        {
                          id: 'c' + Date.now(),
                          friend: challengeForm.friend,
                          avatar: friendObj?.avatar || '',
                          habit: challengeForm.habit,
                          status: 'pending',
                          days: challengeForm.days,
                          progress: 0,
                        },
                      ]);
                      setChallengeModalOpen(false);
                      setChallengeForm({ friend: '', habit: '', days: 7 });
                      setChallengeFormError('');
                    }}
                    className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-pink-400">Challenge a Friend</h2>
                      <button type="button" onClick={() => setChallengeModalOpen(false)} className="text-gray-400 hover:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <label className="flex flex-col gap-1 text-sm">
                      Friend
                      <select
                        value={challengeForm.friend}
                        onChange={e => setChallengeForm(f => ({ ...f, friend: e.target.value }))}
                        className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                        required
                      >
                        <option value="">Select a friend</option>
                        {friendsList.map(f => (
                          <option key={f.name} value={f.name}>{f.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      Habit
                      <select
                        value={challengeForm.habit}
                        onChange={e => setChallengeForm(f => ({ ...f, habit: e.target.value }))}
                        className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                        required
                      >
                        <option value="">Select a habit</option>
                        {habitList.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      Days
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={challengeForm.days}
                        onChange={e => setChallengeForm(f => ({ ...f, days: parseInt(e.target.value) }))}
                        className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                        required
                      />
                    </label>
                    {challengeFormError && <span className="text-red-500 text-xs">{challengeFormError}</span>}
                    <div className="flex gap-4 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setChallengeModalOpen(false)}
                        className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg"
                      >
                        Start Challenge
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Community Feed Section */}
            <section id="community-feed" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Community Feed</span>
                </div>
                <div className="space-y-4">
                  {communityFeed.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.07 }}
                      className="flex items-center gap-4 bg-gray-900/80 rounded-xl p-4 shadow group hover:bg-pink-500/10 transition"
                    >
                      <Image 
                        src={item.avatar} 
                        alt={item.user} 
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-pink-400 shadow"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-white">{item.user}</span>
                        <span className="text-gray-300 ml-2">{item.action}</span>
                      </div>
                      <span className="text-xs text-gray-400">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Collaborative Habit Tracking Section */}
            <section id="group-habits" className="w-full max-w-2xl mb-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800/80 rounded-2xl p-6 shadow-lg mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-400">Collaborative Habits</span>
                  <button onClick={() => setGroupModalOpen(true)} className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg transition">+ Create Group Habit</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupHabitsState.map((group, idx) => (
                    <motion.div
                      key={group.id}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.08 }}
                      className="bg-gray-900/80 rounded-xl p-4 shadow group"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-white text-lg">{group.name}</span>
                        <div className="flex -space-x-2 ml-2">
                          {group.members.map((m, i) => (
                            <Image 
                              key={i}
                              src={m.avatar} 
                              alt={m.name} 
                              width={28}
                              height={28}
                              className="rounded-full border-2 border-pink-400 shadow"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
                        <div className="h-full rounded-full bg-purple-500" style={{ width: `${group.progress}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-2">Group Progress: {group.progress}%</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </section>

            {/* Create Group Habit Modal */}
            <AnimatePresence>
              {groupModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
                  onClick={() => setGroupModalOpen(false)}
                >
                  <motion.form
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={e => e.stopPropagation()}
                    onSubmit={e => {
                      e.preventDefault();
                      if (!groupForm.name || groupForm.members.length === 0) {
                        setGroupFormError('All fields are required.');
                        return;
                      }
                      setGroupHabitsState(prev => [
                        ...prev,
                        {
                          id: 'g' + Date.now(),
                          name: groupForm.name,
                          members: friendsList.filter(f => groupForm.members.includes(f.name)),
                          progress: 0,
                        },
                      ]);
                      setGroupModalOpen(false);
                      setGroupForm({ name: '', members: [] });
                      setGroupFormError('');
                    }}
                    className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md flex flex-col gap-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-bold text-pink-400">Create Group Habit</h2>
                      <button type="button" onClick={() => setGroupModalOpen(false)} className="text-gray-400 hover:text-pink-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <label className="flex flex-col gap-1 text-sm">
                      Group Habit Name
                      <input
                        value={groupForm.name}
                        onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))}
                        className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                        placeholder="e.g. Read a book"
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      Invite Friends
                      <div className="flex flex-wrap gap-2 mt-1">
                        {friendsList.map(f => (
                          <button
                            type="button"
                            key={f.name}
                            onClick={() => setGroupForm(form => ({
                              ...form,
                              members: form.members.includes(f.name)
                                ? form.members.filter(n => n !== f.name)
                                : [...form.members, f.name],
                            }))}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 transition text-sm font-semibold ${
                              groupForm.members.includes(f.name)
                                ? 'bg-pink-500 border-pink-500 text-white'
                                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                            }`}
                          >
                            <Image 
                              src={f.avatar} 
                              alt={f.name} 
                              width={28}
                              height={28}
                              className="rounded-full"
                            />
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </label>
                    {groupFormError && <span className="text-red-500 text-xs">{groupFormError}</span>}
                    <div className="flex gap-4 justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => setGroupModalOpen(false)}
                        className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg"
                      >
                        Create Group
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Footer */}
          <footer className="w-full py-8 px-4 text-center bg-gray-950/80 mt-16 border-t border-gray-800">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                  <span className="text-pink-500">●</span> HabitFlow
                </div>
                
                {/* Navigation Links */}
                <div className="flex gap-8 text-sm">
                  <button 
                    onClick={() => openFooterModal('about')}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 relative group"
                  >
                    About
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  <button 
                    onClick={() => openFooterModal('privacy')}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 relative group"
                  >
                    Privacy
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                  <button 
                    onClick={() => openFooterModal('contact')}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300 relative group"
                  >
                    Contact
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  </button>
                </div>

                {/* Social Icons */}
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110" aria-label="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors duration-300 transform hover:scale-110" aria-label="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Copyright */}
              <div className="text-sm text-gray-500 border-t border-gray-800 pt-6">
                <p>© {new Date().getFullYear()} HabitFlow. All rights reserved.</p>
                <p className="mt-2">Made with ❤️ for better habits</p>
              </div>
            </div>
          </footer>

          {/* Footer Modals */}
          {footerModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
              onClick={closeFooterModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-pink-400">
                    {footerModalContent === 'about' && 'About HabitFlow'}
                    {footerModalContent === 'privacy' && 'Privacy Policy'}
                    {footerModalContent === 'contact' && 'Contact Us'}
                  </h2>
                  <button
                    onClick={closeFooterModal}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                    aria-label="Close modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="prose prose-invert max-w-none">
                  {footerModalContent === 'about' && (
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        HabitFlow is a modern habit tracking application designed to help you build and maintain positive habits in your daily life.
                      </p>
                      <p className="text-gray-300">
                        Our mission is to make habit formation simple, enjoyable, and effective through beautiful design and powerful analytics.
                      </p>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">Features</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2">
                          <li>Track daily habits with ease</li>
                          <li>Visualize your progress with analytics</li>
                          <li>Set and achieve personal goals</li>
                          <li>Stay motivated with streaks and rewards</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {footerModalContent === 'privacy' && (
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
                      </p>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">Data Collection</h3>
                        <p className="text-gray-300">
                          We only collect the information you provide when creating and tracking habits. All data is stored securely and never shared with third parties.
                        </p>
                      </div>
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">Data Usage</h3>
                        <p className="text-gray-300">
                          Your data is used solely to provide and improve the HabitFlow service. We use analytics to help you understand your progress and maintain motivation.
                        </p>
                      </div>
                    </div>
                  )}

                  {footerModalContent === 'contact' && (
                    <div className="space-y-4">
                      <p className="text-gray-300">
                        We&apos;d love to hear from you! Whether you have questions, suggestions, or feedback, feel free to reach out.
                      </p>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">Get in Touch</h3>
                        <div className="space-y-2 text-gray-300">
                          <p>Email: support@habitflow.com</p>
                          <p>Twitter: @habitflow</p>
                          <p>GitHub: github.com/habitflow</p>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-pink-400 mb-2">Feedback</h3>
                        <p className="text-gray-300">
                          Your feedback helps us improve HabitFlow. Let us know what features you&apos;d like to see or how we can make the app better for you.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Modal for Add/Edit Habit */}
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
              onClick={() => setModalOpen(false)}
            >
              <motion.form
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                onSubmit={handleFormSubmit}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md flex flex-col gap-6"
              >
                <h2 className="text-xl font-bold text-pink-400 mb-2">{modalMode === "add" ? "Add New Habit" : "Edit Habit"}</h2>
                <label className="flex flex-col gap-1 text-sm">
                  Name
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    required
                    className={`rounded px-3 py-2 bg-gray-800 border ${
                      formErrors.name ? 'border-red-500' : 'border-gray-700'
                    } focus:border-pink-400 outline-none`}
                    placeholder="e.g. Read a book"
                  />
                  {formErrors.name && (
                    <span className="text-red-500 text-xs">{formErrors.name}</span>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Icon (emoji)
                  <input
                    name="icon"
                    value={form.icon}
                    onChange={handleFormChange}
                    required
                    className={`rounded px-3 py-2 bg-gray-800 border ${
                      formErrors.icon ? 'border-red-500' : 'border-gray-700'
                    } focus:border-pink-400 outline-none`}
                    placeholder="e.g. 📚"
                  />
                  {formErrors.icon && (
                    <span className="text-red-500 text-xs">{formErrors.icon}</span>
                  )}
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  Color
                  <select
                    name="color"
                    value={form.color}
                    onChange={handleFormChange}
                    className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                  >
                    <option value="bg-yellow-500">Yellow</option>
                    <option value="bg-purple-500">Purple</option>
                    <option value="bg-blue-500">Blue</option>
                    <option value="bg-pink-500">Pink</option>
                    <option value="bg-green-500">Green</option>
                    <option value="bg-red-500">Red</option>
                    <option value="bg-orange-500">Orange</option>
                  </select>
                </label>
                <div className="flex gap-4 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg"
                  >
                    {modalMode === "add" ? "Add" : "Save"}
                  </button>
                </div>
              </motion.form>
            </motion.div>
          )}

          {/* Settings Modal */}
          {settingsOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
              onClick={() => setSettingsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-pink-400">Settings</h2>
                  <button
                    onClick={() => setSettingsOpen(false)}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                    aria-label="Close settings"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-pink-400">Profile</h3>
                    <label className="flex flex-col gap-1 text-sm">
                      Display Name
                      <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="rounded px-3 py-2 bg-gray-800 border border-gray-700 focus:border-pink-400 outline-none"
                        placeholder="Your name"
                      />
                    </label>
                  </div>

                  {/* Theme Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-pink-400">Theme</h3>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={() => setDarkMode(!darkMode)}
                        className="accent-pink-500 w-4 h-4"
                      />
                      Dark Mode
                    </label>
                  </div>

                  {/* Notifications Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-pink-400">Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="checkbox"
                          checked={notificationSettings.daily}
                          onChange={() => setNotificationSettings(prev => ({ ...prev, daily: !prev.daily }))}
                          className="accent-pink-500 w-4 h-4"
                        />
                        Daily Reminders
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weekly}
                          onChange={() => setNotificationSettings(prev => ({ ...prev, weekly: !prev.weekly }))}
                          className="accent-pink-500 w-4 h-4"
                        />
                        Weekly Progress
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="checkbox"
                          checked={notificationSettings.monthly}
                          onChange={() => setNotificationSettings(prev => ({ ...prev, monthly: !prev.monthly }))}
                          className="accent-pink-500 w-4 h-4"
                        />
                        Monthly Summary
                      </div>
                      <div className="flex items-center justify-between">
                        <input
                          type="checkbox"
                          checked={notificationSettings.achievements}
                          onChange={() => setNotificationSettings(prev => ({ ...prev, achievements: !prev.achievements }))}
                          className="accent-pink-500 w-4 h-4"
                        />
                        Achievement Unlocks
                      </div>
                    </div>
                  </div>

                  {/* Reminders Button */}
                  <button
                    onClick={() => {
                      setSettingsOpen(false);
                      setRemindersOpen(true);
                    }}
                    className="w-full px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg transition-colors duration-300"
                  >
                    Manage Reminders
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Reminders Modal */}
          {remindersOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
              onClick={() => setRemindersOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-pink-400">Manage Reminders</h2>
                  <button
                    onClick={() => setRemindersOpen(false)}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-300"
                    aria-label="Close reminders"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between bg-gray-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={reminder.enabled}
                          onChange={() => setReminders(prev => 
                            prev.map(r => r.id === reminder.id ? { ...r, enabled: !r.enabled } : r)
                          )}
                          className="accent-pink-500 w-4 h-4"
                        />
                        <div>
                          <span className="text-gray-300">{reminder.label}</span>
                          <input
                            type="time"
                            value={reminder.time}
                            onChange={(e) => setReminders(prev => 
                              prev.map(r => r.id === reminder.id ? { ...r, time: e.target.value } : r)
                            )}
                            className="ml-2 bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => setReminders(prev => prev.filter(r => r.id !== reminder.id))}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-300"
                        aria-label="Delete reminder"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setReminders(prev => [...prev, { 
                      id: Date.now(), 
                      time: "08:00", 
                      enabled: true, 
                      label: "New Reminder" 
                    }])}
                    className="w-full px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-semibold shadow-lg transition-colors duration-300"
                  >
                    Add New Reminder
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Missed Habits Notification */}
          {showMissedHabits && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-gray-800/95 backdrop-blur rounded-xl p-4 shadow-xl border border-pink-500/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-pink-400">Missed Habits</h3>
                  <button
                    onClick={() => setShowMissedHabits(false)}
                    className="text-gray-400 hover:text-pink-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-2">
                  {missedHabits.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-2">
                      <span className="text-gray-300">{habit.name}</span>
                      <button
                        onClick={() => {
                          handleCheck(habit.id);
                          setMissedHabits(prev => prev.filter(h => h.id !== habit.id));
                          if (missedHabits.length === 1) setShowMissedHabits(false);
                        }}
                        className="px-3 py-1 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-sm"
                      >
                        Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-16 right-4 z-50 w-80 max-h-[80vh] overflow-y-auto bg-gray-800/95 backdrop-blur rounded-xl shadow-xl border border-gray-700/50"
              >
                <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-pink-400 hover:text-pink-300"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500"
                    aria-label="Close notifications panel"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="divide-y divide-gray-700/50">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 hover:bg-gray-700/50 transition-colors ${
                        !notification.read ? 'bg-gray-700/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${getNotificationColor(notification.type)}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{notification.title}</h4>
                            <span className="text-xs text-gray-400">
                              {new Date(notification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Streak Assistant */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: assistantOpen ? 0 : 100, opacity: assistantOpen ? 1 : 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div className="bg-gray-800/95 backdrop-blur rounded-xl p-4 shadow-xl border border-pink-500/20 max-w-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-pink-400">Smart Streak Assistant</h3>
                <button
                  onClick={() => setAssistantOpen(false)}
                  className="text-gray-400 hover:text-pink-400"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-gray-300">{assistantMessage}</p>
                <p className="text-pink-400 text-sm">{assistantSuggestion}</p>
              </div>
            </div>
          </motion.div>

          {/* Assistant Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setAssistantOpen(!assistantOpen)}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg"
            style={{ display: assistantOpen ? 'none' : 'flex' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-gray-900/95 backdrop-blur z-50 border-r border-gray-800/50"
              >
                <div className="p-4 space-y-4">
                  <div className="flex flex-col gap-2">
                    <a 
                      href="#today" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Today
                    </a>
                    <a 
                      href="#habits" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Habits
                    </a>
                    <a 
                      href="#analytics" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Analytics
                    </a>
                    <a 
                      href="#leaderboard" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Leaderboard
                    </a>
                    <a 
                      href="#friend-challenges" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Friend Challenges
                    </a>
                    <a 
                      href="#community-feed" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Community Feed
                    </a>
                    <a 
                      href="#group-habits" 
                      className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Group Habits
                    </a>
                  </div>
                  
                  <div className="border-t border-gray-800/50 pt-4">
                    <button
                      onClick={() => {
                        setSettingsOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors text-left"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setRemindersOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-pink-400 transition-colors text-left"
                    >
                      Reminders
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay for mobile menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
}
