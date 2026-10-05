import { useEffect, useState } from "react";
import "./App.css";

const defaultHabits = [
  { id: 1, name: "Wake up on time", completed: false },
  { id: 2, name: "Drink hot water", completed: false },
  { id: 3, name: "Morning yoga", completed: false },
  { id: 4, name: "Exercise for 45 min", completed: false },
  { id: 5, name: "Eat a balanced meal", completed: false },
  { id: 6, name: "Skincare", completed: false },
  { id: 7, name: "Hair care", completed: false },
];

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

function App() {
  const todayKey = getTodayKey();

  const [habits, setHabits] = useState(() => {
    const savedHabits = localStorage.getItem(
      `daymate-habits-${todayKey}`
    );

    return savedHabits
      ? JSON.parse(savedHabits)
      : defaultHabits;
  });

  const [mood, setMood] = useState(() => {
    return (
      localStorage.getItem(
        `daymate-mood-${todayKey}`
      ) || ""
    );
  });

  const [weeklyProgress, setWeeklyProgress] = useState(
    () => {
      const saved = localStorage.getItem(
        "daymate-weekly-progress"
      );

      return saved ? JSON.parse(saved) : {};
    }
  );

  const [showChat, setShowChat] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(
      "daymate-messages"
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      `daymate-habits-${todayKey}`,
      JSON.stringify(habits)
    );
  }, [habits, todayKey]);

  useEffect(() => {
    localStorage.setItem(
      `daymate-mood-${todayKey}`,
      mood
    );
  }, [mood, todayKey]);

  useEffect(() => {
    const completed = habits.filter(
      (habit) => habit.completed
    ).length;

    setWeeklyProgress((previous) => {
      const updated = {
        ...previous,
        [todayKey]: completed,
      };

      localStorage.setItem(
        "daymate-weekly-progress",
        JSON.stringify(updated)
      );

      return updated;
    });
  }, [habits, todayKey]);

  useEffect(() => {
    localStorage.setItem(
      "daymate-messages",
      JSON.stringify(messages)
    );
  }, [messages]);

  const toggleHabit = (id) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completed: !habit.completed,
            }
          : habit
      )
    );
  };

  const completedCount = habits.filter(
    (habit) => habit.completed
  ).length;

  const progress =
    habits.length === 0
      ? 0
      : Math.round(
          (completedCount / habits.length) * 100
        );

  const formatAIResponse = (text) => {
    return text
      .replace(
        /<think>[\s\S]*?<\/think>/gi,
        ""
      )
      .replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
      )
      .replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
      )
      .replace(/\n/g, "<br />");
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3001/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,

            context: {
              completedCount,
              totalHabits: habits.length,

              completedHabits: habits
                .filter(
                  (habit) => habit.completed
                )
                .map((habit) => habit.name),

              remainingHabits: habits
                .filter(
                  (habit) => !habit.completed
                )
                .map((habit) => habit.name),

              mood,
            },
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong"
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "I couldn't connect to the local AI right now. Please make sure Ollama and the DayMate backend are running.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(
        date.getDate() - i
      );

      const key = date
        .toISOString()
        .split("T")[0];

      days.push({
        key,

        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),

        completed:
          weeklyProgress[key] || 0,
      });
    }

    return days;
  };

  const week = getLastSevenDays();

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <h1>DayMate 🌱</h1>

          <p>
            Your private daily habit coach
          </p>
        </div>

        <div className="progress">
          {completedCount}/{habits.length}
        </div>
      </header>

      <main>
        <section className="welcome">
          <h2>Good morning 👋</h2>

          <p>
            Let's make today a little better,
            one habit at a time.
          </p>
        </section>

        <div className="dashboard">
          <section className="card habits-card">
            <div className="card-header">
              <div>
                <h2>Today's habits</h2>

                <p>
                  {completedCount} of{" "}
                  {habits.length} completed
                </p>
              </div>

              <div className="progress-circle">
                <span>{progress}%</span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                }}
              ></div>
            </div>

            <div className="habit-list">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`habit ${
                    habit.completed
                      ? "completed"
                      : ""
                  }`}
                  onClick={() =>
                    toggleHabit(habit.id)
                  }
                >
                  <span className="checkbox">
                    {habit.completed
                      ? "✓"
                      : ""}
                  </span>

                  <span>{habit.name}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="side-column">
            <section className="card focus-card">
              <span className="card-label">
                TODAY'S FOCUS
              </span>

              <h2>🎯 Start small</h2>

              <p>
                You don't have to complete
                everything perfectly. Just focus
                on your next habit.
              </p>
            </section>

            <section className="card mood-card">
              <h2>How are you feeling?</h2>

              <div className="moods">
                <button
                  className={
                    mood === "good"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setMood("good")
                  }
                >
                  🙂 Good
                </button>

                <button
                  className={
                    mood === "okay"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setMood("okay")
                  }
                >
                  😐 Okay
                </button>

                <button
                  className={
                    mood === "tired"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setMood("tired")
                  }
                >
                  😴 Tired
                </button>

                <button
                  className={
                    mood === "low"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setMood("low")
                  }
                >
                  😞 Low
                </button>
              </div>
            </section>

            {!showChat && (
              <section className="card coach">
                <h2>🤖 DayMate Coach</h2>

                <p>
                  Had a difficult morning? Tell
                  DayMate what happened and we'll
                  help you adjust your routine.
                </p>

                <button
                  className="coach-button"
                  onClick={() =>
                    setShowChat(true)
                  }
                >
                  Talk to DayMate
                </button>
              </section>
            )}
          </div>
        </div>

        <section className="card weekly-card">
          <div className="weekly-header">
            <div>
              <h2>Weekly consistency</h2>

              <p>
                Keep showing up, one day at a
                time.
              </p>
            </div>
          </div>

          <div className="week-list">
            {week.map((day) => {
              const percentage = Math.round(
                (day.completed /
                  habits.length) *
                  100
              );

              return (
                <div
                  className="day-progress"
                  key={day.key}
                >
                  <span className="day-label">
                    {day.label}
                  </span>

                  <div className="day-bar">
                    <div
                      className="day-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>
                  </div>

                  <span className="day-count">
                    {day.completed}/
                    {habits.length}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {showChat && (
          <section className="card chat-card">
            <div className="chat-header">
              <div>
                <h2>🤖 DayMate Coach</h2>

                <p>
                  Powered by your local Qwen3
                  model
                </p>
              </div>

              <button
                className="close-chat"
                onClick={() =>
                  setShowChat(false)
                }
              >
                ×
              </button>
            </div>

            <div className="chat-messages">
              {messages.length === 0 && (
                <div className="welcome-message">
                  <p>
                    Hi! I'm DayMate. Tell me what
                    happened today, and I'll help
                    you adjust your routine.
                  </p>
                </div>
              )}

              {messages.map(
                (chat, index) => (
                  <div
                    key={index}
                    className={`message ${
                      chat.role === "user"
                        ? "user-message"
                        : "ai-message"
                    }`}
                  >
                    {chat.role ===
                    "assistant" ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            formatAIResponse(
                              chat.content
                            ),
                        }}
                      />
                    ) : (
                      chat.content
                    )}
                  </div>
                )
              )}

              {loading && (
                <div className="message ai-message">
                  DayMate is thinking...
                </div>
              )}
            </div>

            <div className="chat-input-area">
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key ===
                    "Enter"
                  ) {
                    sendMessage();
                  }
                }}
                placeholder="Tell DayMate what happened..."
                disabled={loading}
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading ||
                  !message.trim()
                }
              >
                Send
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;