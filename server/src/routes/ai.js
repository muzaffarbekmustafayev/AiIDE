const express = require('express');
const router = express.Router();

// Coding-focused models from Google AI Studio
const MODELS = [
  {
    id: 'gemini-2.5-pro-preview-06-05',
    label: 'Gemini 2.5 Pro',
    description: 'Eng kuchli — murakkab kod, arxitektura',
    badge: 'Pro',
    color: 'blue',
    rpm: 150,
  },
  {
    id: 'gemini-2.5-flash-preview-05-20',
    label: 'Gemini 2.5 Flash',
    description: 'Tez va aqlli — kundalik kodlash',
    badge: 'Fast',
    color: 'cyan',
    rpm: 1000,
  },
  {
    id: 'gemini-2.5-flash-lite-preview-06-17',
    label: 'Gemini 2.5 Flash Lite',
    description: 'Eng tez — oddiy savol-javob',
    badge: 'Lite',
    color: 'emerald',
    rpm: 4000,
  },
  {
    id: 'gemini-3.1-pro-exp',
    label: 'Gemini 3.1 Pro',
    description: 'Yangi avlod — eng ilg'or kodlash',
    badge: 'New',
    color: 'violet',
    rpm: 25,
  },
  {
    id: 'gemini-3.1-flash-exp',
    label: 'Gemini 3.1 Flash',
    description: 'Yangi Flash — tez va kuchli',
    badge: 'New',
    color: 'violet',
    rpm: 4000,
  },
  {
    id: 'gemini-3-flash-preview',
    label: 'Gemini 3 Flash',
    description: 'Gemini 3 — yangi flash model',
    badge: 'Flash',
    color: 'amber',
    rpm: 1000,
  },
  {
    id: 'gemini-2.0-flash-001',
    label: 'Gemini 2 Flash',
    description: 'Barqaror — ishlab chiqarish uchun',
    badge: 'Stable',
    color: 'slate',
    rpm: 2000,
  },
];

// GET /api/ai/models
router.get('/models', (req, res) => {
  res.json(MODELS);
});

// POST /api/ai/chat  (Server-Sent Events streaming)
router.post('/chat', async (req, res) => {
  const { messages, model, apiKey, systemPrompt } = req.body;

  const key = apiKey || process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    return res.status(401).json({
      error: 'Google AI API kaliti topilmadi. Sozlamalar (⚙️) bo\u2019limidan API kalitingizni kiriting.'
    });
  }

  const modelId = model || 'gemini-2.5-flash-preview-05-20';

  try {
    const { GoogleGenAI } = require('@google/genai');
    const ai = new GoogleGenAI({ apiKey: key });

    // Build Gemini history
    const history = (messages || []).slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
    const lastMsg = messages[messages.length - 1];

    const sys = systemPrompt ||
      'Sen AiIDE dasturlash yordamchisisan. Uzbek va ingliz tillarida kodlash bo\u2019yicha yordam berasan. Kod bloklar uchun markdown ishlatasan. Aniq va foydali javob berasan.';

    // SSE response headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream = await ai.models.generateContentStream({
      model: modelId,
      config: { systemInstruction: sys },
      contents: [
        ...history,
        { role: 'user', parts: [{ text: lastMsg.content }] },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.text ?? '';
      if (text) {
        res.write('data: ' + JSON.stringify({ text }) + '\n\n');
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    console.error('[AI Route] xatolik:', err.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: err.message });
    }
    res.write('data: ' + JSON.stringify({ error: err.message }) + '\n\n');
    res.end();
  }
});

module.exports = router;
module.exports.MODELS = MODELS;
