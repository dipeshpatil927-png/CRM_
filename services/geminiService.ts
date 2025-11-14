import { GoogleGenAI } from "@google/genai";

export const summarizeLeadNotes = async (notes: string): Promise<string> => {
  // Assume API_KEY is set in the environment
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
    return Promise.resolve("API key not configured. Please check your environment variables.");
  }

  // Initialize the client only when the function is called and the key exists.
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  if (!notes || notes.trim().length === 0) {
    return Promise.resolve("No notes available to summarize.");
  }
  
  try {
    const prompt = `You are a helpful sales assistant. Summarize the following notes about a sales lead into 3 concise bullet points. Focus on the lead's main interests, pain points, and the required next actions.
    
    Notes:
    ---
    ${notes}
    ---
    
    Summary:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error summarizing notes with Gemini API:", error);
    return "Could not generate summary. There might be an issue with the AI service.";
  }
};