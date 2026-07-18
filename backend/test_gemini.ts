import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API Key");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate a sample question",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING },
                        text: { type: Type.STRING }
                      }
                    }
                  },
                  subQuestions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        questionText: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.error("Error:", e.message, "\n", e);
  }
}
run();
