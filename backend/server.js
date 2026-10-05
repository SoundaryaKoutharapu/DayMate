const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "DayMate backend is running 🌱",
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const habitContext = context
      ? `
DayMate user context:
- Today's progress: ${context.completedCount}/${context.totalHabits}
- Completed habits: ${
          context.completedHabits?.join(", ") ||
          "None"
        }
- Remaining habits: ${
          context.remainingHabits?.join(", ") ||
          "None"
        }
- Current mood: ${context.mood || "Not selected"}
`
      : "";

    console.log("Sending message to local Qwen3...");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 5 * 60 * 1000);

    const ollamaResponse = await fetch(
      "http://localhost:11434/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "qwen3:1.7b",
          messages: [
            {
              role: "system",
              content:
                "You are DayMate, a private daily habit coach. " +
                "Help users build realistic routines and stay consistent. " +
                "Use the user's DayMate context when provided so your response is personalized. " +
                "Be supportive, practical, and concise. " +
                "Do not give medical advice or extreme weight-loss advice." +
                habitContext,
            },
            {
              role: "user",
              content: message,
            },
          ],
          stream: false,
          think: false,
        }),
      }
    );

    clearTimeout(timeout);

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama returned status ${ollamaResponse.status}`
      );
    }

    const data = await ollamaResponse.json();

    console.log("Qwen3 response received.");

    res.json({
      reply: data.message.content,
    });
  } catch (error) {
    console.error("Ollama error:", error);

    res.status(500).json({
      error:
        "Could not connect to the local AI model",
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `DayMate backend running on http://localhost:${PORT}`
  );
});