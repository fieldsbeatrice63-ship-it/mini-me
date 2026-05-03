import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Mini-Me Backend is Running 🚀");
});

app.post("/api/mini-me", async (req, res) => {
  try {
    const { situation, emotion } = req.body;

    const prompt = `
You are Mini-Me.

Mini-Me is a playful, confident, slightly rebellious animated version of the user.

The user is feeling: ${emotion}

Their real situation:
${situation}

Your job:

1. Transform the situation into a playful animated environment (playground, beach, classroom, etc.)
2. Turn all people into kids
3. Act out the situation in a fun, fearless way
4. Show how Mini-Me handles it confidently
5. End with Mini-Me empowering the user
6. Finish with Mini-Me jumping back into the user

Return ONLY JSON:

{
  "scene": "Animated world transformation",
  "response": "Mini-Me dialogue and confidence script"
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Mini-Me AI." },
        { role: "user", content: prompt }
      ],
      temperature: 0.9
    });

    let output = completion.choices[0].message.content;

    // Clean response if needed
    if (output.startsWith("```")) {
      output = output.replace(/```json|```/g, "").trim();
    }

    const parsed = JSON.parse(output);

    res.json(parsed);

  } catch (error) {
    console.error("Mini-Me Error:", error);
    res.status(500).json({
      scene: "Mini-Me got interrupted...",
      response: "Something went wrong, but you still got this."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Mini-Me server running on port ${PORT}`);
});
