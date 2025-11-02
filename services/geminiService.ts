import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, NutritionalInfo, AnalysisResult, HealthCondition } from "../types";

// NOTE: Hardcoded API key as per user request to make it "inbuilt"
// and to resolve environment issues where process.env.API_KEY was not available.
const API_KEY = "AIzaSyBs37d1YHkEQHJQljFgp1-2U5reNHsgnnk";

const nutritionalInfoSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING, description: "The name of the food item." },
    calories: { type: Type.NUMBER, description: "Estimated calories in kcal." },
    protein: { type: Type.NUMBER, description: "Estimated protein in grams." },
    sugar: { type: Type.NUMBER, description: "Estimated sugar in grams." },
    fat: { type: Type.NUMBER, description: "Estimated fat in grams." },
    fiber: { type: Type.NUMBER, description: "Estimated fiber in grams." },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of main ingredients."
    },
  },
  required: ["foodName", "calories", "protein", "sugar", "fat", "fiber", "ingredients"]
};

export const analyzeFoodFromImage = async (base64Image: string, mimeType: string): Promise<NutritionalInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType,
    },
  };

  const textPart = {
    text: "Identify the food in this image. Provide its estimated nutritional information (calories, protein, sugar, fat, fiber) and list the main ingredients. If you cannot identify a food, provide a best guess but indicate uncertainty in the foodName, like 'Possibly a vegetable stir-fry'."
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionalInfoSchema,
      },
    });

    const jsonText = response.text.trim();
    const nutritionalInfo: NutritionalInfo = JSON.parse(jsonText);
    return nutritionalInfo;
  } catch (error) {
    console.error("Gemini API call failed in analyzeFoodFromImage:", error);
    throw error;
  }
};

export const analyzeFoodFromQR = async (qrData: string): Promise<NutritionalInfo> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `A QR code was scanned for a food product, and it contained this data: "${qrData}". Assume this corresponds to a popular packaged food item. Generate a plausible nutritional label for it. If the data looks like a URL, interpret what kind of product it might be. If it's just an ID, invent a common product (e.g., a granola bar, a soda, or a bag of chips).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionalInfoSchema,
      },
    });
    const jsonText = response.text.trim();
    const nutritionalInfo: NutritionalInfo = JSON.parse(jsonText);
    return nutritionalInfo;
  } catch (error) {
    console.error("Gemini API call failed in analyzeFoodFromQR:", error);
    throw error;
  }
};

export const getHealthRecommendation = async (nutritionalInfo: NutritionalInfo, userProfile: UserProfile): Promise<Omit<AnalysisResult, 'nutritionalInfo'>> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  let profileDescription = "a generic user";
  if (userProfile.healthCondition !== HealthCondition.NONE) {
    profileDescription = `a user who is a ${userProfile.healthCondition}`;
  }
  if (userProfile.age) {
    profileDescription += ` and is ${userProfile.age} years old`;
  }
  if (userProfile.allergies.length > 0) {
    profileDescription += ` with allergies to ${userProfile.allergies.join(", ")}.`;
  }

  const prompt = `
    Analyze the following nutritional information for ${profileDescription}:
    - Food: ${nutritionalInfo.foodName}
    - Calories: ${nutritionalInfo.calories} kcal
    - Protein: ${nutritionalInfo.protein}g
    - Sugar: ${nutritionalInfo.sugar}g
    - Fat: ${nutritionalInfo.fat}g
    - Fiber: ${nutritionalInfo.fiber}g
    - Ingredients: ${nutritionalInfo.ingredients.join(", ")}

    Based on this data and the user profile, provide:
    1. A boolean value 'isHealthy' for this specific user.
    2. A concise 'healthRecommendation' (2-3 sentences max) explaining why it is or isn't healthy for them.
       For example: "High sugar content detected. This is not suitable for a diabetic user." or "Excellent source of protein, which is great for a gym-goer's muscle recovery."
       If the user has allergies, check if any ingredients are allergens and mention it.
  `;
  
  const recommendationSchema = {
    type: Type.OBJECT,
    properties: {
      isHealthy: { type: Type.BOOLEAN },
      healthRecommendation: { type: Type.STRING }
    },
    required: ["isHealthy", "healthRecommendation"]
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recommendationSchema
      }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini API call failed in getHealthRecommendation:", error);
    throw error;
  }
};