const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export type AIProvider = 'openrouter' | 'groq';

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  systemPrompt?: string;
  provider?: AIProvider;
}

export const AI_MODELS = {
  groq: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B (Versatile)', description: 'Fast, high-quality reasoning' },
    { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B (Instant)', description: 'Extreme speed for simple tasks' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: 'Large context window' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Google-optimized fine-tune' },
  ],
  openrouter: [
    { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Free)', description: 'Newest Google multimodal' },
    { id: 'meta-llama/llama-3.1-405b-instruct:free', name: 'Llama 3.1 405B (Free)', description: 'Massive knowledge base' },
    { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', description: 'Reliable and efficient' },
    { id: 'qwen/qwen-2-7b-instruct:free', name: 'Qwen 2 7B (Free)', description: 'Strong technical reasoning' },
  ]
};

export const ai = {
  get isConfigured() {
    return !!(OPENROUTER_API_KEY || GROQ_API_KEY);
  },

  get availableProviders(): AIProvider[] {
    const providers: AIProvider[] = [];
    if (GROQ_API_KEY) providers.push('groq');
    if (OPENROUTER_API_KEY) providers.push('openrouter');
    return providers;
  },

  get defaultProvider(): AIProvider {
    if (GROQ_API_KEY) return 'groq';
    if (OPENROUTER_API_KEY) return 'openrouter';
    throw new Error("No AI API Keys configured.");
  },

  /**
   * Generic completion with smart failover
   */
  async complete(prompt: string, options: CompletionOptions = {}) {
    return this.chat([{ role: 'user', content: prompt }], options);
  },

  /**
   * Multi-turn chat with multi-provider failover
   */
  async chat(messages: Message[], options: CompletionOptions = {}) {
    if (!this.isConfigured) {
      throw new Error("AI API Key not found. Please set VITE_OPENROUTER_API_KEY or VITE_GROQ_API_KEY.");
    }

    const currentProvider = options.provider || this.defaultProvider;
    const fallbackProvider = currentProvider === 'groq' ? 'openrouter' : 'groq';

    try {
      return await this.executeChat(currentProvider, messages, options);
    } catch (error) {
      console.warn(`AI Provider ${currentProvider} failed, attempting fallback to ${fallbackProvider}`, error);
      
      // Only fallback if the secondary key exists
      const hasSecondary = fallbackProvider === 'groq' ? !!GROQ_API_KEY : !!OPENROUTER_API_KEY;
      if (hasSecondary) {
        return await this.executeChat(fallbackProvider, messages, options);
      }
      
      throw error;
    }
  },

  async executeChat(provider: AIProvider, messages: Message[], options: CompletionOptions = {}) {
    const url = provider === 'groq' 
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://openrouter.ai/api/v1/chat/completions';
    
    const key = provider === 'groq' ? GROQ_API_KEY : OPENROUTER_API_KEY;
    
    // Auto-select best model for provider if not specified
    const model = options.model || (provider === 'groq' ? AI_MODELS.groq[0].id : AI_MODELS.openrouter[0].id);

    const fullMessages = options.systemPrompt 
      ? [{ role: 'system', content: options.systemPrompt }, ...messages]
      : messages;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': 'https://bloc-nine.vercel.app',
        'X-Title': 'Bloc Builder'
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `AI Request failed for ${provider}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  },

  /**
   * Specialized methods
   */
  async draftProposalScope(title: string, context?: string) {
    const prompt = `Draft a professional project scope for a proposal titled "${title}". ${context ? `Context: ${context}` : ''} Return only the scope content in clear, professional Markdown.`;
    return this.complete(prompt, {
      systemPrompt: "You are an expert at writing business proposals for software projects."
    });
  },

  async suggestLineItems(title: string, scope: string) {
    const prompt = `Based on the project title "${title}" and scope: "${scope}", suggest 3-5 professional line items for a proposal. Format as a JSON array: [{"name": "string", "description": "string", "unit_price": number}].`;
    const response = await this.complete(prompt, {
      systemPrompt: "You are a pricing specialist for independent developers. Return ONLY the raw JSON array."
    });
    
    try {
      const jsonStr = response.match(/\[.*\]/s)?.[0] || response;
      return JSON.parse(jsonStr);
    } catch (e) {
      return [];
    }
  },

  async generateWeeklySummary(data: { sessions: any[], logs: any[] }) {
    const prompt = `Summarize the following developer activity from the last 7 days into a "Weekly Ship Report". Highight key achievements, total time spent, and suggest 2-3 focus areas for next week.
    
    Sessions: ${JSON.stringify(data.sessions.map(s => ({ title: s.title, duration: s.duration_mins })))}
    Ship Logs: ${JSON.stringify(data.logs.map(l => ({ description: l.description, date: l.date })))}
    
    Provide the response in clean, structured Markdown.`;
    
    return this.complete(prompt, {
      systemPrompt: "You are a productivity coach for high-performance builders."
    });
  }
};
