/** Groq OpenAI-compatible chat API (env: see .env.example). */
export const GROQ_CHAT_COMPLETIONS_URL =
  import.meta.env.VITE_GROQ_API_URL ||
  'https://api.groq.com/openai/v1/chat/completions';

export const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || '';

export const groqConfig = {
  apiKey: groqApiKey,
  chatCompletionsUrl: GROQ_CHAT_COMPLETIONS_URL
};
