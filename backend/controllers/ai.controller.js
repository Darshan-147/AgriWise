import axios from "axios";
import asyncHandler from "../Utils/asyncHandler.js";
import ApiError from "../Utils/ApiError.js";
import config from "../Config/app.config.js";

const normalizeText = (value) => String(value ?? "").trim();

export const chatWithAgriAdvisor = asyncHandler(async (req, res) => {
  if (!config.geminiApiKey) {
    throw new ApiError(
      503,
      "GEMINI_API_KEY is not configured. Create one in Google AI Studio and add it to backend/.env."
    );
  }

  const prompt = normalizeText(req.body.prompt);
  const userInput = normalizeText(req.body.userInput);
  const model = normalizeText(req.body.model) || config.geminiModel;

  if (!prompt || !userInput) {
    throw new ApiError(400, "prompt and userInput are required.");
  }

  const geminiResponse = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    {
      contents: [
        {
          parts: [
            {
              text: `${prompt}\n\nUser input: ${userInput}`,
            },
          ],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE",
        },
      ],
      generationConfig: {
        temperature: 0.2,
        topP: 0.7,
        maxOutputTokens: 800,
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": config.geminiApiKey,
      },
      timeout: 20000,
    }
  );

  const text =
    geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "I'm unable to provide information right now. Please try again.";

  res.status(200).json({
    status: "success",
    text,
    model,
  });
});
