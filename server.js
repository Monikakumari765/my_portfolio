const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const buildPath = path.join(__dirname, "build");

const PROFILE_CONTEXT = `You are the portfolio assistant for Monika Kumari. Answer questions about her using only the resume information below. Do not invent experience, skills, project results, or links. If the resume does not contain the answer, clearly say what is unknown.
Always answer in clear, natural English. Keep names, URLs, and email addresses unchanged.
Answer the user's latest question directly and clearly. Use earlier messages only to understand follow-up references. Prefer a short, specific answer with relevant facts; avoid vague claims, repetition, and unnecessary filler. If the profile does not contain the answer, say so clearly instead of guessing. Ask one brief clarifying question only when required.

Profile:
- Second-year B.Tech student in Computer Science and Technology at SAGE University, Indore, India (August 2025–June 2029).
- Seeking a Software Engineering internship.
- Strong foundations in Data Structures and Algorithms, OOP, and DBMS.
- Has independently designed and shipped three full-stack and AI-driven projects.
- Solves LeetCode problems consistently; 50+ solved.

Skills:
- Programming: C++, Java, Python.
- Web: HTML, CSS, JavaScript.
- Database: SQL, MySQL.
- Tools: Git, GitHub, VS Code.
- Coursework: Data Structures, Algorithms, Machine Learning, Database Management, Data Visualization, Python Programming, Cloud Computing.

Projects:
- Personal Portfolio Website: built with HTML, CSS, and JavaScript to showcase skills, projects, certifications, and contact information.
- KrishiFleet: a farming machinery platform concept to help farmers find suitable agricultural machines, estimate job costs, and book equipment.
- Hyper-Personalized Learning Assistant: an AI/ML concept that adapts learning content to students' pace, knowledge gaps, and learning needs.

Certifications and job simulations:
- J.P. Morgan Quantitative Research Job Simulation.
- Cisco Networking Academy Introduction to Modern AI.
- Forage Job Simulation.

Contact:
- Email: monikakumari4687@gmail.com
- Phone: +91 9931124679
- LinkedIn: https://www.linkedin.com/in/monika-kumari-988420394/
- GitHub: https://github.com/Monikakumari765
- LeetCode: https://leetcode.com/u/Monikakumari765/`;

app.use(express.json({ limit: "64kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: { message: "The server's GEMINI_API_KEY environment variable is not configured." },
    });
  }

  const contents = req.body?.contents;
  if (
    !Array.isArray(contents) ||
    contents.length === 0 ||
    contents.length > 12 ||
    contents.some(
      (item) =>
        !["user", "model"].includes(item?.role) ||
        !Array.isArray(item.parts) ||
        item.parts.length !== 1 ||
        typeof item.parts[0]?.text !== "string" ||
        item.parts[0].text.length > 4000
    )
  ) {
    return res.status(400).json({
      error: { message: "The chat request is invalid or too long. Please shorten it and try again." },
    });
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        systemInstruction: {
          parts: [{ text: PROFILE_CONTEXT }],
        },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 512,
        },
        contents,
      },
      {
        params: { key: apiKey },
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      }
    );

    const candidate = response.data?.candidates?.[0];
    const text = candidate?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("\n");
    if (!text) {
      const finishReason = candidate?.finishReason;
      const blockReason = response.data?.promptFeedback?.blockReason;
      console.error("Gemini returned no text:", {
        finishReason,
        blockReason,
        candidateCount: response.data?.candidates?.length || 0,
      });

      let message = "Gemini could not generate a reply. Please rephrase your question and try again.";
      if (blockReason || finishReason === "SAFETY") {
        message = "Gemini blocked this question. Please rephrase it and try again.";
      } else if (finishReason === "MAX_TOKENS") {
        message = "Gemini stopped before producing a complete reply. Please try again.";
      } else if (finishReason === "RECITATION") {
        message = "Gemini could not provide that reply. Please ask in a different way.";
      }

      return res.status(502).json({
        error: { message },
      });
    }

    return res.json({ text });
  } catch (error) {
    const status = error.response?.status;
    const message =
      error.response?.data?.error?.message ||
      "Could not reach Gemini. Check the server connection and try again.";
    console.error("Gemini chatbot request failed:", { status, message });
    return res.status(status && status >= 400 && status < 500 ? status : 502).json({
      error: { message },
    });
  }
});

app.use(express.static(buildPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
