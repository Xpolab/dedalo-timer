import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Plus, Trash2, CheckCircle2, Circle, Sparkles, X, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

type TimerMode = 'pomodoro' | 'short' | 'long'

interface Task {
  id: string
  text: string
  completed: boolean
}

const MODES: Record<TimerMode, { label: string; duration: number; color: string }> = {
  pomodoro: { label: 'Pomodoro', duration: 25 * 60, color: 'var(--pomodoro-color)' },
  short: { label: 'Short Break', duration: 5 * 60, color: 'var(--short-break-color)' },
  long: { label: 'Long Break', duration: 15 * 60, color: 'var(--long-break-color)' },
}

function App() {
  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration)
  const [isActive, setIsActive] = useState(false)
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('dedalo-tasks')
    return savedTasks ? JSON.parse(savedTasks) : []
  })
  const [newTaskInput, setNewTaskInput] = useState('')
  const [showModal, setShowModal] = useState(false)

  // Timer Logic
  useEffect(() => {
    let interval: number | undefined
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      setIsActive(false)
      // Notification sound or visual alert could go here
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3')
      audio.play().catch(() => console.log("Audio play blocked"))
      setShowModal(true)
    }
    return () => clearInterval(interval)
  }, [isActive, timeLeft])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = useCallback(() => {
    setIsActive(false)
    setTimeLeft(MODES[mode].duration)
  }, [mode])

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode)
    setIsActive(false)
    setTimeLeft(MODES[newMode].duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Task Logic
  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newTaskInput.trim()) return
    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskInput.trim(),
      completed: false,
    }
    setTasks([...tasks, newTask])
    setNewTaskInput('')
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  // Persistence Logic
  useEffect(() => {
    localStorage.setItem('dedalo-tasks', JSON.stringify(tasks))
  }, [tasks])

  return (
    <div className="app-container">
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="brand-title">Dédalo</h1>
        <p className="brand-subtitle">Gestión del tiempo y Productividad</p>
      </motion.header>

      <motion.div
        className="timer-section glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mode-selector">
          {(Object.keys(MODES) as TimerMode[]).map((m) => (
            <button
              key={m}
              className={`mode-btn ${mode === m ? 'active' : ''}`}
              onClick={() => switchMode(m)}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>

        <div className="futuristic-timer-container">
          <svg width="240" height="240" viewBox="0 0 100 100" className="timer-svg">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="4"
              opacity="0.2"
            />

            {/* Main Progress Circle */}
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="url(#timer-gradient)"
              strokeWidth="6"
              strokeDasharray="283"
              animate={{ strokeDashoffset: 283 - (283 * (timeLeft / MODES[mode].duration)) }}
              transition={{ duration: 1, ease: "linear" }}
              strokeLinecap="round"
              filter="url(#glow)"
            />

            {/* Halo / Trail Effect */}
            <motion.circle
              cx="50" cy="50" r="45"
              fill="none"
              stroke="#818cf8"
              strokeWidth="12"
              strokeDasharray="283"
              animate={{
                strokeDashoffset: (283 - (283 * (timeLeft / MODES[mode].duration))) + 10,
                opacity: isActive ? [0.1, 0.3, 0.1] : 0.1
              }}
              transition={{
                strokeDashoffset: { duration: 1, ease: "linear" },
                opacity: { duration: 2, repeat: Infinity }
              }}
              strokeDashoffset={283 - (283 * (timeLeft / MODES[mode].duration))}
              strokeLinecap="round"
              opacity="0.3"
              filter="blur(8px)"
            />

            {/* Particle head of the trail */}
            <motion.circle
              cx={50 + 45 * Math.cos((timeLeft / MODES[mode].duration) * 2 * Math.PI - Math.PI / 2)}
              cy={50 + 45 * Math.sin((timeLeft / MODES[mode].duration) * 2 * Math.PI - Math.PI / 2)}
              r="3"
              fill="white"
              filter="url(#glow)"
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </div>

        <motion.div
          key={timeLeft}
          className="timer-display"
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {formatTime(timeLeft)}
        </motion.div>

        <div className="timer-controls">
          <button className="secondary-control-btn" onClick={resetTimer}>
            <RotateCcw size={24} />
          </button>

          <button className="main-control-btn" onClick={toggleTimer}>
            {isActive ? <Pause size={32} /> : <Play size={32} />}
          </button>

          <div style={{ width: 24 }} /> {/* Spacer */}
        </div>
      </motion.div>

      <motion.div
        className="tasks-section glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="section-header">
          <h2 className="section-title">Focus Tasks</h2>
          <span className="text-muted">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
        </div>

        <form className="task-input-container" onSubmit={addTask}>
          <input
            type="text"
            className="task-input"
            placeholder="What are you working on?"
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
          />
          <button type="submit" className="add-task-btn">
            <Plus size={20} />
          </button>
        </form>

        <ul className="task-list">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`task-item ${task.completed ? 'completed' : ''}`}
              >
                <button className="check-btn" onClick={() => toggleTask(task.id)}>
                  {task.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <span className="task-text">{task.text}</span>
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay">
            <motion.div
              className={`modal-content ${mode !== 'pomodoro' ? 'break' : ''}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <div className="modal-header">
                <button className="modal-header-btn" onClick={() => setShowModal(false)}>
                  <ArrowLeft size={20} />
                </button>
                <span className="modal-title" style={{ fontSize: '1.1rem', marginBottom: 0 }}>
                  {mode === 'pomodoro' ? 'Status: Done' : 'Status: Break'}
                </span>
                <button className="modal-header-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="modal-icon-container">
                  <Sparkles size={32} />
                </div>
                <h2 className="modal-title">
                  {mode === 'pomodoro' ? '¡Sesión Finalizada!' : '¡Descanso Terminado!'}
                </h2>
                <p className="modal-message">
                  {mode === 'pomodoro'
                    ? '¡Lo lograste! Tómate un respiro, te lo has ganado.'
                    : '¡Excelente descanso! ¿Listo para volver a la acción?'}
                </p>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  SAVE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
