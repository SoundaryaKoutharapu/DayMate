# 🌱 DayMate — Your Private Daily Habit Coach

DayMate is a private, AI-powered daily habit coach designed to help people build consistent routines without feeling overwhelmed.

It was built for a friend who struggles with staying consistent with habits such as waking up on time, exercising, yoga, skincare, hair care, and maintaining healthy daily routines.

Unlike cloud-based AI assistants, DayMate uses a **local open-weight AI model through Ollama**, allowing the AI coaching experience to run locally on the user's computer.

---

## ✨ Features

### 📋 Daily Habit Tracking

Track important daily habits with a simple checklist.

* Wake up on time
* Drink hot water
* Morning yoga
* Exercise for 45 min
* Eat a balanced meal
* Skincare
* Hair care

### 📊 Daily Progress

DayMate automatically calculates your daily progress and displays:

* Completed habits
* Total habits
* Completion percentage
* Visual progress bar

### 😊 Mood Tracking

Select how you're feeling:

* 🙂 Good
* 😐 Okay
* 😴 Tired
* 😞 Low

The selected mood is stored locally and shared with the AI coach as context.

### 📅 Weekly Consistency

DayMate keeps track of daily habit completion and displays your progress across the last seven days.

This helps users focus on **consistency rather than perfection**.

### 🤖 Local AI Habit Coach

DayMate includes an AI coach powered by **Qwen3**, running locally through **Ollama**.

You can tell DayMate things such as:

> "I woke up late and missed yoga."

> "I'm feeling tired today."

> "I didn't complete my exercise."

The AI receives the current habit progress and mood as context and provides practical suggestions for adjusting the rest of the day.

### 🔒 Privacy First

DayMate is designed around local-first usage.

* No login required
* No API key required
* No cloud database
* Habit data is stored using browser `localStorage`
* AI inference runs locally through Ollama
* Internet is not required for the AI after the model has been downloaded

---

## 🧠 How It Works

```text
                    DayMate
                       │
                       ▼
              ┌─────────────────┐
              │   React + Vite  │
              │   User Interface│
              └────────┬────────┘
                       │
                       │ Habit + Mood Context
                       ▼
              ┌─────────────────┐
              │ Node.js +       │
              │ Express Backend │
              └────────┬────────┘
                       │
                       │ Local API
                       ▼
              ┌─────────────────┐
              │     Ollama      │
              │  Local Runtime  │
              └────────┬────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   Qwen3 1.7B    │
              │  Open-weight AI │
              └─────────────────┘

        Browser localStorage
        └── Habits
        └── Mood
        └── Weekly progress
        └── Chat history
```

---

## 🛠️ Tech Stack

| Technology | Purpose                         |
| ---------- | ------------------------------- |
| React      | Frontend UI                     |
| Vite       | Frontend development/build tool |
| JavaScript | Application logic               |
| CSS        | UI styling                      |
