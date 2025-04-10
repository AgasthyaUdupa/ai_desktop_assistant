import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3000;

const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error('API Key missing! Add it to your .env file.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    const result = await model.generateContent(question);
    const response = result.response.text();
    res.json({ reply: response });
  } catch (error) {
    console.error("Gemini API error:", error.message);
    res.status(500).json({ reply: "Error: Could not get a response from Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
