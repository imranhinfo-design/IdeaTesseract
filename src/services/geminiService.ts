import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getMaskedApiKey(): string {
  try {
    let apiKey = (process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    while ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    }
    if (!apiKey || apiKey === "undefined" || apiKey === "null") return "Not Set";
    if (apiKey.length < 8) return "Too Short";
    return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
  } catch {
    return "Error retrieving key";
  }
}

function getAI() {
  if (!aiInstance) {
    // Try both process.env (Vite define) and import.meta.env (Vite standard)
    let apiKey = (process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "").trim();
    
    // Recursively remove quotes if they were accidentally included/nested in the env var
    while ((apiKey.startsWith('"') && apiKey.endsWith('"')) || (apiKey.startsWith("'") && apiKey.endsWith("'"))) {
      apiKey = apiKey.substring(1, apiKey.length - 1).trim();
    }

    if (!apiKey || apiKey === "undefined" || apiKey === "null" || apiKey === "YOUR_API_KEY") {
      throw new Error("GEMINI_API_KEY is not set or is a placeholder. Please provide a valid Google Gemini API key in your environment variables.");
    }

    // Basic validation: Google API keys usually start with 'AIza'
    if (!apiKey.startsWith("AIza")) {
      console.warn("The provided GEMINI_API_KEY does not start with 'AIza'. It might be invalid.");
    } else {
      console.log(`API Key detected (Safe Debug): ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`);
    }

    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export interface BusinessPlanStep {
  title: string;
  description: string;
  icon: string;
  imageKeyword: string;
}

export interface ProblemSolution {
  problem: string;
  solution: string;
}

export interface BusinessPlan {
  suggestedNames: string[];
  summary: string;
  brandingStartupAdvice: string;
  steps: BusinessPlanStep[];
  problemsAndSolutions: ProblemSolution[];
  industryReferences: string[];
  governmentHelp: string[];
}

export async function generateStepDeepDive(idea: string, country: string, stepTitle: string, stepDescription: string, language: string = "English"): Promise<string> {
  const prompt = `You are an expert business consultant. The user is building a business around the idea: "${idea}" in ${country}.
  
  They need a highly detailed, actionable deep dive into the following specific step of their business plan:
  Step Title: "${stepTitle}"
  Step Overview: "${stepDescription}"
  
  Please provide a comprehensive guide, including:
  1. Detailed Action Plan (step-by-step tasks)
  2. Required Resources & Tools
  3. Estimated Timeline & Costs (if applicable)
  4. Common Pitfalls & How to Avoid Them
  5. Key Performance Indicators (KPIs) to measure success for this step.
  
  CRITICAL: The entire response MUST be written in ${language}.
  
  Format the response in clean, professional Markdown.`;
  
    const ai = getAI();
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
        });
        return response.text || "No detailed information could be generated at this time.";
      } catch (error: any) {
        attempts++;
        const isRetryable = error.message?.includes("503") || error.message?.includes("high demand") || error.message?.includes("UNAVAILABLE");
        const isRateLimit = error.message?.includes("429") || error.message?.includes("Quota exceeded") || error.message?.includes("RESOURCE_EXHAUSTED");
        
        if (isRateLimit) {
          throw new Error("RATE_LIMIT_EXCEEDED: You've reached the Gemini API free tier limit (20 requests per day). Please wait a few minutes or try again later today.");
        }
        
        if (isRetryable && attempts < maxAttempts) {
          console.warn(`Gemini API high demand (503). Retrying attempt ${attempts}...`);
          await new Promise(resolve => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
          continue;
        }
        throw error;
      }
    }
    return "No detailed information could be generated at this time.";
}

export async function generateBusinessPlan(idea: string, country: string, currency: string, language: string = "English"): Promise<BusinessPlan> {
  const prompt = `Provide a highly detailed, comprehensive business plan for the following idea: ${idea}. 
  Tailor the plan for the market in ${country} using ${currency} for financial estimates.
  
  CRITICAL: All text fields in the JSON response (suggestedNames, summary, brandingStartupAdvice, title, description, problem, solution, industryReferences, governmentHelp) MUST be written in ${language}.
  
  Return the plan in JSON format with:
  - suggestedNames: An array of 10 unique, catchy names for the business.
  - summary: A brief summary.
  - brandingStartupAdvice: Detailed advice on branding, how to start easily, and management.
  - steps: A comprehensive, exhaustive step-by-step plan (each step must have title, description, icon, imageKeyword).
  - problemsAndSolutions: A list of potential problems and their solutions.
  - industryReferences: A list of relevant industry references, websites, or reports for this idea in ${country}.
  - governmentHelp: A list of potential government grants, programs, or support for this industry in ${country}.
  
  For each step, provide a highly specific, descriptive 'imageKeyword' in English (e.g., "professional-market-research-presentation", "modern-product-packaging-design", "logistics-warehouse-management-system") that will be used to fetch a relevant, high-quality stock photo.
  
  Cover every possible subject that can help the business idea succeed.
  Keep the response structured and professional.`;
  
  const ai = getAI();
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              suggestedNames: { 
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              summary: { type: Type.STRING },
              brandingStartupAdvice: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    icon: { type: Type.STRING },
                    imageKeyword: { type: Type.STRING },
                  },
                  required: ["title", "description", "icon", "imageKeyword"],
                },
              },
              problemsAndSolutions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    problem: { type: Type.STRING },
                    solution: { type: Type.STRING },
                  },
                  required: ["problem", "solution"],
                },
              },
              industryReferences: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              governmentHelp: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
            },
            required: ["suggestedNames", "summary", "brandingStartupAdvice", "steps", "problemsAndSolutions", "industryReferences", "governmentHelp"],
          },
        },
      });
      return JSON.parse(response.text || '{"suggestedNames": [], "summary": "", "brandingStartupAdvice": "", "steps": [], "problemsAndSolutions": [], "industryReferences": [], "governmentHelp": []}');
    } catch (error: any) {
      attempts++;
      const isRetryable = error.message?.includes("503") || error.message?.includes("high demand") || error.message?.includes("UNAVAILABLE");
      const isRateLimit = error.message?.includes("429") || error.message?.includes("Quota exceeded") || error.message?.includes("RESOURCE_EXHAUSTED");
      
      if (isRateLimit) {
        throw new Error("RATE_LIMIT_EXCEEDED: You've reached the Gemini API free tier limit (20 requests per day). Please wait a few minutes or try again later today.");
      }

      if (isRetryable && attempts < maxAttempts) {
        console.warn(`Gemini API high demand (503). Retrying attempt ${attempts}...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  return JSON.parse('{"suggestedNames": [], "summary": "", "brandingStartupAdvice": "", "steps": [], "problemsAndSolutions": [], "industryReferences": [], "governmentHelp": []}');
}

export interface ScriptGenerationParams {
  industry: string;
  target: string;
  goal: string;
  type: string;
  tone: string;
  length: string;
  objectionLevel: string;
  researchMode: boolean;
}

export async function generateSalesScript(params: ScriptGenerationParams): Promise<string> {
  const { industry, target, goal, type, tone, length, objectionLevel, researchMode } = params;

  const prompt = `You are an elite sales psychologist and master of persuasion. 
  Generate a hyper-persuasive ${type} script for the following context:
  - Industry: ${industry}
  - Target Audience: ${target}
  - Primary Goal: ${goal}
  - Tone: ${tone}
  - Length: ${length}
  - Objection Handling Level: ${objectionLevel}

  ${researchMode ? "CRITICAL: Use your research tools to incorporate current 2026 trends, competitor strategies, and industry-specific data into this script." : ""}

  The script MUST follow this structure:
  1. Introduction & Hook (Use a Pattern Interrupt)
  2. Value Proposition (The "Why Now")
  3. Objection Handling (Specific "If they say X, say Y" scenarios based on the ${objectionLevel} level)
  4. Call to Action (Low-friction next steps)

  Use advanced sales psychology techniques like Labeling ("It seems like..."), Calibrated Questions ("How would it affect..."), and Pattern Interrupts.

  Format the entire response in professional Markdown.`;

  const ai = getAI();
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: researchMode ? [{ googleSearch: {} }] : undefined,
        },
      });
      return response.text || "Failed to generate script.";
    } catch (error: any) {
      attempts++;
      const isRetryable = error.message?.includes("503") || error.message?.includes("high demand") || error.message?.includes("UNAVAILABLE");
      const isRateLimit = error.message?.includes("429") || error.message?.includes("Quota exceeded") || error.message?.includes("RESOURCE_EXHAUSTED");
      
      if (isRateLimit) {
        throw new Error("RATE_LIMIT_EXCEEDED: You've reached the Gemini API free tier limit (20 requests per day). Please wait a few minutes or try again later today.");
      }

      if (isRetryable && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000 * attempts));
        continue;
      }
      throw error;
    }
  }
  return "Failed to generate script after multiple attempts.";
}
