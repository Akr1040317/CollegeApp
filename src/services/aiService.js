import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || 'demo-key',
  dangerouslyAllowBrowser: true
});

export class AIService {
  static async generateCollegeRecommendations(userProfile, preferences, existingColleges = []) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
      }
      
      const prompt = this.buildRecommendationPrompt(userProfile, preferences, existingColleges);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert college admissions counselor. Provide personalized college recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      return this.parseRecommendations(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating college recommendations:', error);
      throw new Error('Failed to generate college recommendations. Please check your API key.');
    }
  }

  static async generateEssayIdeas(prompt, essayType = 'common_app', userProfile = null) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert college essay coach. Help students brainstorm compelling essay topics."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.8
      });

      return this.parseEssayIdeas(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating essay ideas:', error);
      throw new Error('Failed to generate essay ideas. Please check your API key.');
    }
  }

  static async analyzeEssay(essay, prompt, essayType = 'common_app', userProfile = null) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert college essay reviewer. Provide constructive feedback."
          },
          {
            role: "user",
            content: `Essay Prompt: ${prompt}\n\nStudent Essay:\n${essay}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      });

      return this.parseEssayAnalysis(response.choices[0].message.content);
    } catch (error) {
      console.error('Error analyzing essay:', error);
      throw new Error('Failed to analyze essay. Please check your API key.');
    }
  }

  static async generateApplicationGuidance(userProfile, currentStep, specificQuestion = null) {
    try {
      if (!import.meta.env.VITE_OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.');
      }
      
      const prompt = this.buildGuidancePrompt(userProfile, currentStep, specificQuestion);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert college admissions counselor. Provide personalized guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating application guidance:', error);
      throw new Error('Failed to generate guidance. Please check your API key.');
    }
  }

  static buildRecommendationPrompt(userProfile, preferences, existingColleges) {
    return `Recommend colleges for this student based on their profile and preferences.`;
  }

  static buildGuidancePrompt(userProfile, currentStep, specificQuestion) {
    return `Provide guidance for: ${currentStep}. Question: ${specificQuestion || 'General guidance'}`;
  }

  static parseRecommendations(response) {
    return { schools: [] };
  }

  static parseEssayIdeas(response) {
    return { ideas: [], fullResponse: response };
  }

  static parseEssayAnalysis(response) {
    return {
      content: response,
      structure: response,
      writing: response,
      suggestions: response,
      assessment: response,
      strength: 5,
      fullResponse: response
    };
  }
}

export default AIService;
