export const GOOGLE_AI_STUDIO_MODELS = [
  // --- Asosiy Code/Text modellar ---
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    description: "Eng kuchli va murakkab dasturlash vazifalari uchun.",
    category: "Pro",
    contextLength: "2M"
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    provider: "google",
    description: "Tezkor va tejamkor model, ko'pchilik IDE vazifalari uchun mos.",
    category: "Flash",
    contextLength: "1M"
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    provider: "google",
    description: "Minimal kechikish, kichik skriptlar uchun.",
    category: "Flash",
    contextLength: "4M"
  },
  
  // --- Avvalgi versiyalar (3.0/3.5/3.8) ---
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "google",
    description: "Gemini 3 avlodi — yuqori aniqlik.",
    category: "Pro",
    contextLength: "2M"
  },
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "google",
    description: "Tezkor va uzun konteksga ega flash model.",
    category: "Flash",
    contextLength: "2M"
  },
  {
    id: "gemini-3.8-flash",
    name: "Gemini 3.8 Flash",
    provider: "google",
    description: "Eng so'nggi Flash model iteratsiyasi.",
    category: "Flash",
    contextLength: "2M"
  },
  
  // --- Maxsus / Boshqalar ---
  {
    id: "gemma-4-31b",
    name: "Gemma 4 31B",
    provider: "google",
    description: "Google'ning ochiq kodli arxitekturasi asosidagi lokal-simon model.",
    category: "Gemma",
    contextLength: "16K"
  }
];
