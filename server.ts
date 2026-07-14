import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini AI (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!apiKey });
});

// Gemini AI Endpoints
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { prompt, persona = "assistant", context = "" } = req.body;
    if (!ai) {
      return res.status(500).json({ error: "Gemini API key not configured on server." });
    }

    let systemInstruction = "You are Galaxy ERP AI Assistant, an advanced multi-tenant school and college enterprise assistant. Provide direct, natural, human-friendly answers without raw markdown headers (like ###) or heavy asterisk bolding (like **). Write clean, beautifully formatted paragraphs.";
    if (persona === "principal") {
      systemInstruction = "You are Galaxy ERP AI Principal Advisor. Provide strategic institutional insights, enrollment analysis, deficit alerts, and faculty performance optimization suggestions. Provide direct, natural, human-friendly answers without raw markdown headers (like ###) or heavy asterisk bolding (like **).";
    } else if (persona === "teacher") {
      systemInstruction = "You are Galaxy ERP AI Teacher Assistant. Help with engaging lesson plans, classroom management strategies, and differentiated learning methodologies. Provide direct, natural, human-friendly answers without raw markdown headers (like ###) or heavy asterisk bolding (like **).";
    } else if (persona === "tutor") {
      systemInstruction = "You are Galaxy ERP AI Student Tutor. Provide friendly, clear, Socratic guidance to students on STEM, Humanities, and competitive exams. Provide direct, natural, human-friendly answers without raw markdown headers (like ###) or heavy asterisk bolding (like **).";
    } else if (persona === "parent") {
      systemInstruction = "You are Galaxy ERP AI Parent Assistant. Answer parent queries regarding fee dues, bus tracking, attendance reports, and academic progress with warmth and clarity. Provide direct, natural, human-friendly answers without raw markdown headers (like ###) or heavy asterisk bolding (like **).";
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        { role: "user", parts: [{ text: `${systemInstruction}\n\nContext:\n${context}\n\nUser Query:\n${prompt}` }] }
      ]
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
});

app.post("/api/ai/lesson-plan", async (req, res) => {
  try {
    const { subject, grade, topic } = req.body;
    if (!ai) return res.status(500).json({ error: "AI not configured" });

    const prompt = `Create a comprehensive lesson plan for Subject: ${subject}, Grade/Level: ${grade}, Topic: '${topic}'. Include learning objectives, interactive activity, 5 quiz questions, and homework assignment in clean structured JSON format or Markdown.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    res.json({ result: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/timetable", async (req, res) => {
  try {
    const { institutionName, classes, teachers, workingDays } = req.body;
    if (!ai) return res.status(500).json({ error: "AI not configured" });

    const prompt = `Generate an optimized conflict-free weekly timetable for ${institutionName}. Working days: ${workingDays || 5}. Classes: ${JSON.stringify(classes)}. Teachers: ${JSON.stringify(teachers)}. Provide a well-structured matrix schedule.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    res.json({ result: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/question-paper", async (req, res) => {
  try {
    const { subject, grade, difficulty, totalMarks, topics } = req.body;
    if (!ai) return res.status(500).json({ error: "AI not configured" });

    const prompt = `Generate a professional exam question paper for ${subject} (${grade}), Difficulty: ${difficulty}, Total Marks: ${totalMarks}, Topics: ${topics}. Include Section A (MCQs), Section B (Short Answer), Section C (Long Answer) with marks distribution.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    res.json({ result: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/ai/report-card", async (req, res) => {
  try {
    const { studentName, grades, attendance, behaviorNotes } = req.body;
    if (!ai) return res.status(500).json({ error: "AI not configured" });

    const prompt = `Write a constructive, encouraging, and detailed AI Performance Summary and Growth Recommendation for student ${studentName}. Grades: ${JSON.stringify(grades)}, Attendance: ${attendance}%, Behavior/Remarks: ${behaviorNotes}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    res.json({ result: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Galaxy ERP Server running on http://localhost:${PORT}`);
  });
}

startServer();
