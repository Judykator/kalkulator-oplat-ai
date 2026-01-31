import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLegalContext = async (wps: number, caseType: string, calculatedFee: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Jako ekspert od polskiego prawa cywilnego, krótko wyjaśnij dlaczego opłata sądowa dla sprawy typu "${caseType}" przy wartości przedmiotu sporu ${wps} zł wynosi ${calculatedFee} zł. Wspomnij o istotnych terminach płatności lub możliwości zwolnienia z kosztów. Odpowiedz zwięźle w języku polskim w formacie Markdown.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Nie udało się pobrać dodatkowego wyjaśnienia od AI. Proszę skonsultować się z ustawą.";
  }
};

