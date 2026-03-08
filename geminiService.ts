import { GoogleGenAI, Type } from "@google/genai";
import { Message, AnalysisResult, UserProfile, InterviewFeedback, LessonType, VibeCheckResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MODEL_NAME = 'gemini-3-flash-preview';

export const generateChatResponse = async (
  history: Message[], 
  userMessage: string,
  persona: string,
  category: string,
  userProfile?: UserProfile
): Promise<string> => {
  try {
    const chatHistory = history.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const language = userProfile?.language || 'English';

    let systemInstruction = `You are a roleplay partner in 'Socibuild'. 
        Your Persona: ${persona}.
        
        User Profile: 
        ${userProfile ? `
          - Age/Gender: ${userProfile.age}, ${userProfile.gender}
          - Job: ${userProfile.occupation}
          - Interests: ${userProfile.interests}
          - Social Anxiety Areas: ${userProfile.socialAnxieties}
          - Language: ${language}
        ` : 'Unknown'}
        
        Goal: Engage the user in a realistic conversation to build social skills.
        IMPORTANT: Respond in ${language}. Adapt your tone and cultural references to be appropriate for a ${userProfile?.gender || 'person'} speaking ${language}.
        Adaptation: Be sensitive to their stated social anxieties. If they have anxiety about ${userProfile?.socialAnxieties}, be supportive but challenging in a safe way.
        Use metaphors related to their interests (${userProfile?.interests}) if appropriate.`;
    
    if (category === 'Interview') {
      systemInstruction += " You are a professional interviewer. Conduct a realistic interview. Ask follow-up questions based on the user's answers. Be professional but encouraging.";
    } else if (category === 'Listening') {
      systemInstruction += " You are telling a story. Periodically ask the user to recall details.";
    } else {
      systemInstruction += " Keep responses concise. React naturally.";
    }

    const chat = ai.chats.create({
      model: MODEL_NAME,
      history: chatHistory,
      config: { systemInstruction }
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "I'm listening...";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Connection glitch. Let's try that again.";
  }
};

export const analyzeConversation = async (lastUserMessage: string, language: string = 'English'): Promise<AnalysisResult> => {
  try {
    const prompt = `Analyze this social statement. Return JSON.
    Statement: "${lastUserMessage}"
    Language: ${language}
    
    JSON Schema:
    {
      confidenceScore: number (0-100),
      empathyScore: number (0-100),
      feedback: string (max 15 words, in ${language}),
      betterAlternative: string (optional, in ${language})
    }`;

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.NUMBER },
            empathyScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            betterAlternative: { type: Type.STRING }
          }
        }
      }
    });

    const text = result.text;
    if (!text) throw new Error("No data returned");
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    return { confidenceScore: 50, empathyScore: 50, feedback: "Keep practicing!", betterAlternative: "Try to be more direct." };
  }
};

export const generateDailyTip = async (userProfile?: UserProfile): Promise<string> => {
   try {
    const language = userProfile?.language || 'English';
    const prompt = userProfile 
      ? `Give me a one-sentence social tip for a ${userProfile.age} year old ${userProfile.gender} working in ${userProfile.occupation}.
         They are interested in: ${userProfile.interests}.
         They struggle with: ${userProfile.socialAnxieties}.
         Language: ${language}.
         Make the tip personalized and actionable, in ${language}.` 
      : "Give me a one-sentence insightful tip about social psychology.";
      
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return result.text || "Smile! It's the universal language.";
   } catch (e) {
     return "Active listening is the secret to charisma.";
   }
}

export const analyzeEmailDraft = async (draft: string, tone: string, language: string = 'English'): Promise<{critique: string, rewrite: string}> => {
  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze and rewrite this email/letter draft. 
      Target Tone: ${tone}.
      Language: ${language}.
      
      Return JSON with:
      - 'critique': Detailed feedback on clarity, tone, and professionalism. Highlight specific strengths and weaknesses (approx 50-70 words, in ${language}).
      - 'rewrite': The polished version of the text adhering strictly to the '${tone}' tone (in ${language}).
      
      Draft: "${draft}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            critique: { type: Type.STRING },
            rewrite: { type: Type.STRING }
          }
        }
      }
    });
    const text = result.text;
    if (!text) return { critique: "Analysis failed.", rewrite: draft };
    return JSON.parse(text);
  } catch (e) {
    return { critique: "Could not analyze text.", rewrite: "Error processing request." };
  }
}

export const analyzeBehaviorDescription = async (description: string, language: string = 'English'): Promise<string> => {
  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze the behavior described below. Explain the potential underlying emotions, social cues missed, or intentions based on psychology. 
      Language: ${language}. Respond in ${language}.
      Description: "${description}"`,
    });
    return result.text || "I couldn't analyze that behavior.";
  } catch (e) {
    return "Analysis failed.";
  }
}

export const generateLessonContent = async (lessonTitle: string, lessonType: LessonType, userProfile?: UserProfile): Promise<string> => {
  try {
    const language = userProfile?.language || 'English';
    const context = userProfile 
      ? `Target Audience: ${userProfile.age} year old ${userProfile.gender}, ${userProfile.occupation}.
         Learning Style: ${userProfile.learningStyle}.
         Specific Anxiety: ${userProfile.socialAnxieties}.
         Language: ${language}.`
      : "Target Audience: General Learner.";

    let prompt = `Create content for a lesson titled "${lessonTitle}". Type: ${lessonType}. ${context}. Write in ${language}.`;

    if (lessonType === 'Project') {
        prompt += ` Write a brief "Real World Mission" for the user. It should be a social experiment or task they can do IRL. Structure: Goal, Steps, Success Criteria.`;
    } else if (lessonType === 'Quiz') {
        prompt += ` Write a brief introduction to the topic before the quiz starts.`;
    } else {
        prompt += ` Write a short, engaging educational article (approx 150 words). Format with Markdown.`;
    }

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return result.text || "Content currently unavailable.";
  } catch (e) {
    return "Could not load lesson content.";
  }
}

export const generateQuizQuestion = async (lessonTitle: string, language: string = 'English'): Promise<{question: string, options: string[], correctIndex: number}> => {
  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Create one multiple choice question based on the topic "${lessonTitle}". Return JSON.
      Language: ${language}.
      Schema: { question: string (in ${language}), options: string[] (in ${language}), correctIndex: number }`,
      config: {
        responseMimeType: "application/json",
         responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctIndex: { type: Type.NUMBER }
          }
        }
      }
    });
    const text = result.text;
    if(!text) throw new Error("No quiz data");
    return JSON.parse(text);
  } catch (e) {
    return { question: "What represents confidence?", options: ["Slouching", "Eye Contact", "Mumbling"], correctIndex: 1 };
  }
}

export const generateInterviewQuestions = async (role: string, language: string = 'English'): Promise<string[]> => {
  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Generate 5 common and challenging interview questions for a ${role} position. Return them as a simple JSON array of strings. Language: ${language}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    const text = result.text;
    if(!text) return ["Tell me about yourself.", "What are your weaknesses?"];
    return JSON.parse(text);
  } catch(e) {
    return ["Tell me about yourself.", "Why do you want this job?", "Describe a challenge you overcame."];
  }
}

export const evaluateInterviewAnswer = async (question: string, answer: string, language: string = 'English'): Promise<InterviewFeedback> => {
  try {
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Evaluate this interview answer.
      Question: "${question}"
      Answer: "${answer}"
      Language: ${language}
      
      Return JSON:
      - score (0-10)
      - strengths (array of strings, in ${language})
      - improvements (array of strings, in ${language})
      - sampleAnswer (a better version of the answer, in ${language})`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             score: { type: Type.NUMBER },
             strengths: { type: Type.ARRAY, items: { type: Type.STRING }},
             improvements: { type: Type.ARRAY, items: { type: Type.STRING }},
             sampleAnswer: { type: Type.STRING }
           }
        }
      }
    });
    const text = result.text;
    if(!text) throw new Error("No feedback generated");
    return JSON.parse(text);
  } catch(e) {
    return {
       score: 5,
       strengths: ["Attempted to answer"],
       improvements: ["Be more specific", "Use the STAR method"],
       sampleAnswer: "I demonstrated leadership by..."
    };
  }
}

export const analyzeImageVibe = async (base64Image: string, language: string = 'English'): Promise<VibeCheckResult> => {
  try {
    // gemini-3-flash-preview handles images well for analysis
    const result = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: base64Image } },
          { text: `Analyze this image for 'social vibe'. What first impression does this person/outfit/scene give? Return JSON with 'vibe' (2-3 words), 'impression' (2 sentences), and 'tips' (3 bullet points to improve). Language: ${language}. Respond in ${language}.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
             vibe: { type: Type.STRING },
             impression: { type: Type.STRING },
             tips: { type: Type.ARRAY, items: { type: Type.STRING } }
           }
        }
      }
    });
    const text = result.text;
    if(!text) throw new Error("No vibe analysis");
    return JSON.parse(text);
  } catch(e) {
    console.error(e);
    return {
      vibe: "Analysis Unavailable",
      impression: "Could not process image.",
      tips: ["Ensure image is clear", "Try a different angle"]
    };
  }
}

export const generateScenarioReport = async (messages: Message[], scenarioTitle: string, language: string = 'English'): Promise<string> => {
  try {
    const conversationText = messages.map(m => `${m.role}: ${m.text}`).join('\n');
    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Analyze this complete roleplay conversation.
      Scenario: "${scenarioTitle}"
      Language: ${language}
      
      Conversation:
      ${conversationText}
      
      Provide a comprehensive report in Markdown format covering:
      1. **Overall Performance**: A summary of how the user handled the scenario.
      2. **Key Strengths**: What did they do well? (Bullet points)
      3. **Areas for Improvement**: Specific actionable advice. (Bullet points)
      4. **Communication Style**: Analysis of their tone, empathy, and clarity.
      5. **Final Grade**: A letter grade (A, B, C, etc.) with a brief explanation.
      
      Keep the tone constructive and encouraging. Write the report in ${language}.`,
    });
    return result.text || "Report generation failed.";
  } catch (e) {
    console.error("Report Generation Error:", e);
    return "Could not generate report at this time.";
  }
}