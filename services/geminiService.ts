import { GoogleGenAI, Type } from "@google/genai";
import type { Course, Review, LearningPathStep } from "../types";

// FIX: Aligned API key access with the coding guidelines by using process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

export const summarizeReviews = async (reviews: Review[]): Promise<string> => {
  const reviewsText = reviews.map(r => `- "${r.text}" (Rating: ${((r.rating.content + r.rating.instructor + r.rating.practicality) / 3).toFixed(1)}/5)`).join('\n');
  const prompt = `Here are user reviews for an online course. Summarize the overall sentiment, highlighting key pros and cons mentioned by the students. Present the summary in a few paragraphs. Do not start with "Here is a summary".

Reviews:
${reviewsText}

Summary:`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    return "Error: Could not generate summary.";
  }
};

export const getRecommendations = async (basedOnCourse: Course, allCourses: Course[]): Promise<string[]> => {
    const allCoursesInfo = allCourses
        .filter(c => c.id !== basedOnCourse.id)
        .map(c => `id: ${c.id}, title: ${c.title}, subject: ${c.subject}, description: ${c.description}`)
        .join('\n');

    const prompt = `Based on the following course:
Title: ${basedOnCourse.title}
Subject: ${basedOnCourse.subject}
Description: ${basedOnCourse.description}

Recommend 3 similar courses from the list below. Return a JSON array of the course IDs.

Available courses:
${allCoursesInfo}
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                        description: 'The ID of a recommended course.'
                    }
                }
            }
        });
        const jsonStr = response.text.trim();
        const recommendedIds = JSON.parse(jsonStr);
        return Array.isArray(recommendedIds) ? recommendedIds : [];
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return [];
    }
};


export const generateLearningPath = async (goal: string, experience: string, interests: string[]): Promise<LearningPathStep[]> => {
    const prompt = `Create a detailed, personalized learning path for a student with the following details:
- Main Goal: ${goal}
- Current Experience Level: ${experience}
- Key Interests: ${interests.join(', ')}

The learning path should be a step-by-step guide. For each step, provide:
1. A clear 'title' for the topic or concept.
2. A concise 'description' of what the student should learn in this step.
3. A 'rationale' explaining why this step is important for their main goal and how it relates to their interests.

The goal is to produce a logical, motivating, and highly relevant learning journey. Return a JSON array of these steps.
`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                 responseMimeType: "application/json",
                 responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { 
                                type: Type.STRING,
                                description: "The title of the learning step."
                            },
                            description: { 
                                type: Type.STRING,
                                description: "A summary of what to learn in this step."
                            },
                            rationale: { 
                                type: Type.STRING,
                                description: "The reason why this step is important for the user's goal."
                            }
                        },
                        required: ["title", "description", "rationale"]
                    }
                 }
            }
        });
        const jsonStr = response.text.trim();
        const path = JSON.parse(jsonStr);
        return Array.isArray(path) ? path : [];
    } catch (error) {
        console.error("Error generating learning path:", error);
        return [];
    }
};