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

## 🚀 Getting Started

DayMate currently runs as a **local-first application**. The AI coach uses Ollama and the Qwen3 1.7B model locally, so no AI API key or cloud AI service is required.

### Prerequisites

Before running DayMate, install:

* [Node.js](https://nodejs.org/)
* [Ollama](https://ollama.com/)
* Git

You can verify Node.js and npm:

```bash
node --version
npm --version
```

Verify Ollama:

```bash
ollama --version
```

---

### 1. Clone the repository

```bash
git clone https://github.com/SoundaryaKoutharapu/DayMate.git
```

Move into the project:

```bash
cd DayMate
```

---

### 2. Install the AI model

Download the Qwen3 1.7B model using Ollama:

```bash
ollama pull qwen3:1.7b
```

Verify that the model is installed:

```bash
ollama list
```

You should see:

```text
qwen3:1.7b
```

Ollama runs the model locally on your computer.

---

### 3. Install frontend dependencies

Open a terminal in the project folder and run:

```bash
cd frontend
npm install
```

---

### 4. Install backend dependencies

Open a **second terminal** and run:

```bash
cd DayMate/backend
npm install
```

If your terminal is already inside the DayMate folder, use:

```bash
cd backend
npm install
```

---

### 5. Start the backend

In the backend terminal:

```bash
node server.js
```

You should see:

```text
DayMate backend running on http://localhost:3001
```

The backend connects to the locally running Ollama service.

---

### 6. Start the frontend

Open another terminal:

```bash
cd DayMate/frontend
npm run dev
```

Or, if you're already inside the DayMate folder:

```bash
cd frontend
npm run dev
```

Vite will display a local address similar to:

```text
http://localhost:5173
```

Open that address in your browser.

---

### 7. Use DayMate

Once the application is open:

1. Check off your completed habits.
2. Select your current mood.
3. View your daily progress.
4. Check your weekly consistency.
5. Open **DayMate Coach**.
6. Tell the AI what happened during your day.

For example:

```text
I woke up late and missed yoga.
I'm feeling tired. What should I do?
```

DayMate sends your message together with your current habit and mood context to the local Qwen3 model.

---

### 🔒 Running Completely Locally

The basic architecture is:

```text
Browser
   ↓
React + Vite
   ↓
Node.js + Express
```



