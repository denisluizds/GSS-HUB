import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function askAI(prompt: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Você é o Assistente Inteligente da Matriz GSS LATAM. 
              Seu objetivo é ajudar agentes de aeroporto e call center a encontrar políticas e tratativas corretas.
              
              Contexto atual: ${context || "Nenhum contexto específico."}
              
              Pergunta do agente: ${prompt}
              
              Responda de forma profissional, concisa e focada nas políticas da LATAM. 
              Se não souber a resposta, oriente o agente a procurar seu supervisor ou consultar o manual oficial.`
            }
          ]
        }
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Desculpe, tive um problema ao processar sua solicitação. Por favor, tente novamente em instantes.";
  }
}
