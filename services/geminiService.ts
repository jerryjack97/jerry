import { GoogleGenAI } from "@google/genai";

// Helper para ler variáveis de ambiente de forma segura (Vite ou Process)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  return '';
};

// Tenta ler API_KEY ou VITE_GEMINI_API_KEY
const apiKey = getEnv('API_KEY') || getEnv('VITE_GEMINI_API_KEY');

if (!apiKey) {
  console.warn("Gemini API Key is missing. AI features will not work.");
}

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy_key_to_prevent_crash' });

export const generateEventDescription = async (title: string, details: string): Promise<string> => {
  if (!apiKey) return "Configuração de IA pendente. Adicione a API Key.";

  try {
    const prompt = `
      Atue como um especialista em marketing de eventos culturais.
      Escreva uma descrição atraente, curta e emocionante (máximo 3 parágrafos) para um evento chamado "${title}".
      Detalhes adicionais: ${details}.
      O tom deve ser convidativo e culturalmente relevante para o público de Angola.
      Não use formatação markdown, apenas texto simples.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Descrição não disponível no momento.";
  } catch (error) {
    console.error("Erro ao gerar descrição com Gemini:", error);
    return "Não foi possível gerar a descrição automaticamente. Por favor, insira manualmente.";
  }
};

export const suggestEventTags = async (description: string): Promise<string[]> => {
  if (!apiKey) return ['Cultura', 'Eventos'];

  try {
      // Using JSON schema for structured output
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Gere 5 tags curtas (uma palavra cada) baseadas nesta descrição de evento: ${description}`,
      });
      
      const text = response.text || "";
      // Simple split if not using JSON schema for simplicity in this helper
      return text.split(',').map(tag => tag.trim());
  } catch (error) {
      return ['Cultura', 'Lazer'];
  }
}