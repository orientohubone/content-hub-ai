
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERRO: GEMINI_API_KEY não encontrada no .env");
    return;
  }

  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await (ai as any).models.list();
    console.log("Modelos disponíveis:");
    response.models.forEach((m: any) => console.log(`- ${m.name}`));
  } catch (error) {
    console.error("Erro ao listar modelos:", error);
  }
}

listModels();
