import axios from 'axios';

const invokeUrl = "https://integrate.api.nvidia.com/v1/chat/completions";
const stream = false;

const headers = {
  "Authorization": "Bearer YOUR_NEW_API_KEY", 
  "Accept": "application/json"
};

// 1. Define your Knowledge Base
const knowledgeBase = `
  MARKET DATA 2026:
  - 'Chamber and Hall' range: GH₵ 800 - GH₵ 2,500.
  - 'Self-contained' definition: Private bath and kitchen.
  - Legal: Follow Data Protection Act 2012 (Act 843). Never store PII (personal names/phones).
  - Safety: Always warn users to visit sites before paying.
`;

// 2. Define System Instructions
const systemPrompt = `
  You are an expert Real Estate Consultant AI for Ghana. 
  Your goal is to help users find apartments while ensuring safety and legal compliance.
  Always emphasize physical inspection before payment. 
  Use the provided knowledge base to answer questions.
`;

const userQuery = "I am looking for a chamber and hall self-contained in Spintex.";

const payload = {
  "model": "google/diffusiongemma-26b-a4b-it", // Ensure this is a supported chat model
  "messages": [
    { "role": "system", "content": systemPrompt },
    { "role": "user", "content": `Knowledge Base: ${knowledgeBase}\n\nUser Question: ${userQuery}` }
  ],
  "max_tokens": 4096,
  "temperature": 0.7,
  "top_p": 0.95,
  "stream": stream,
  "chat_template_kwargs": { "enable_thinking": true }
};

axios.post(invokeUrl, payload, { headers })
  .then(response => {
    console.log(response.data.choices[0].message.content);
  })
  .catch(error => {
    console.error(error.response?.data || error.message);
  });
