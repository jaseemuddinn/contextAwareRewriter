// AI Service for handling text rewriting requests
// Compatible with Akash Chat API (OpenAI format) - Real API only

class AIService {
    constructor() {
        this.config = {
            apiKey: '',
            model: 'Meta-Llama-3-1-8B-Instruct-FP8',
            baseUrl: 'https://chatapi.akash.network/api/v1',
            maxTokens: 2000,
            temperature: 0.7
        };
    }

    // Initialize the service with user configuration
    initialize(config) {
        this.config = { ...this.config, ...config };
    }

    // Main rewriting function
    async rewriteText(request) {
        // Check if API key is configured
        if (!this.config.apiKey || this.config.apiKey.trim() === '') {
            throw new Error('Akash Chat API key is required. Please configure it in Settings.');
        }

        try {
            return await this.callBackendAPI(request);
        } catch (error) {
            console.error('AI Rewrite Error:', error);
            throw new Error(`Failed to rewrite text: ${error.message}`);
        }
    }

    // Call our backend API that proxies to Akash Chat API
    async callBackendAPI(request) {
        const { text, mode, context } = request;
        const startTime = Date.now();

        const response = await fetch('/api/ai/rewrite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                mode,
                context,
                apiKey: this.config.apiKey,
                model: this.config.model,
                baseUrl: this.config.baseUrl,
                maxTokens: this.config.maxTokens,
                temperature: this.config.temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `API request failed: ${response.status}`);
        }

        const data = await response.json();
        const endTime = Date.now();

        // Return the complete response from backend API
        return {
            ...data, // Include all properties from backend (originalText, rewrittenText, mode, changes, confidence, processingTime, source, usage)
            responseTime: endTime - startTime // Add our own timing for the full request
        };
    }

    // Generate prompt based on context and mode
    generatePrompt(request) {
        const { text, mode, context, customInstructions } = request;

        const basePrompt = `Rewrite the following text in a ${mode} style:`;

        const contextPrompt = `
Context Guidelines:
- Audience: ${context.audience}
- Purpose: ${context.purpose}
- Tone: ${context.tone}
- Complexity: ${context.complexity}
- Length: Make it ${context.length} than the original
`;

        const modeInstructions = this.getModeInstructions(mode);

        const customPrompt = customInstructions ? `\nAdditional instructions: ${customInstructions}` : '';

        return `${basePrompt}${contextPrompt}${modeInstructions}${customPrompt}

Original text:
"${text}"

Please provide only the rewritten text without any explanations or additional formatting.`;
    }

    // Get mode-specific instructions
    getModeInstructions(mode) {
        const instructions = {
            formal: '\n- Use professional language and proper grammar\n- Avoid contractions and casual expressions\n- Structure sentences clearly and concisely',
            casual: '\n- Use conversational tone and natural language\n- Include contractions where appropriate\n- Make it sound friendly and approachable',
            technical: '\n- Use precise technical terminology\n- Maintain accuracy and clarity\n- Structure information logically',
            creative: '\n- Use vivid and engaging language\n- Include metaphors and interesting word choices\n- Make it more expressive and compelling',
            academic: '\n- Use scholarly language and proper citations style\n- Maintain objectivity and formal structure\n- Include appropriate academic vocabulary',
            concise: '\n- Remove unnecessary words and phrases\n- Maintain all key information\n- Focus on clarity and brevity',
            elaborate: '\n- Add relevant details and explanations\n- Expand on key points\n- Provide more comprehensive coverage'
        };

        return instructions[mode] || '';
    }

    // Detect changes between original and rewritten text
    detectChanges(original, rewritten) {
        const changes = [];

        if (original !== rewritten) {
            changes.push({
                type: 'modification',
                originalSpan: [0, original.length],
                newSpan: [0, rewritten.length],
                reason: 'Text rewritten according to selected mode and context'
            });
        }

        return changes;
    }

    // Update configuration
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }

    // Check if service is ready
    isReady() {
        return this.config.apiKey && this.config.apiKey.trim() !== '';
    }
}

// Export singleton instance
const aiService = new AIService();
export default aiService;