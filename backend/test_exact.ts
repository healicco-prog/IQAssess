import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("No API Key");
    return;
  }
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 120000
    }
  });

  const promptText = `
You are an expert assessment generator. Create an assessment based on the following configurations:
Institution Name: Akash Institute of Medical Science and Research Centre
Course / Programme: MBBS Phase II
Subject Name: Pharmacology
Topic / Theme: Pharmacokinetics
Target Grade Level: Undergraduate
Bloom's Taxonomy Level: Remembering (Level 1)
Specific Focus / Guidelines: Focus on plausible distractors and common misconceptions.
Target Learning Outcomes: e.g. Explain the flow of electrons through photosystem II and I.
Marks: 2
Count: 5
Options Per Question: 4
Question Type: Multiple Choice (Single Correct)
Any other specific condition: Give me a simple Case Based Scenario with each case having 2 Sub question MCQs, each carrying 1 mark each. The options in the answers should be of 1 or 2 words
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            institutionName: { type: Type.STRING },
            departmentName: { type: Type.STRING },
            subjectTitle: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionText: { type: Type.STRING },
                  label: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        key: { type: Type.STRING },
                        text: { type: Type.STRING },
                        isCorrect: { type: Type.BOOLEAN },
                        aiDistractorExplanation: { type: Type.STRING }
                      }
                    }
                  },
                  difficulty: { type: Type.STRING },
                  subQuestions: {
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
                              text: { type: Type.STRING },
                              isCorrect: { type: Type.BOOLEAN },
                              aiDistractorExplanation: { type: Type.STRING }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        temperature: 0.4
      }
    });
    console.log("Success:", response.text?.slice(0, 500));
  } catch (e: any) {
    console.error("Error:", e.message, e);
  }
}
run();
