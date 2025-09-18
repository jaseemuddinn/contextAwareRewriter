import { NextResponse } from 'next/server';

export async function POST(request) {
    const startTime = Date.now();

    try {
        const { text, mode, context, apiKey, model, baseUrl, maxTokens, temperature } = await request.json();

        console.log('API Rewrite Request:', {
            text: text?.substring(0, 50) + '...',
            mode,
            apiKey: apiKey ? 'PRESENT' : 'MISSING',
            model,
            baseUrl,
            maxTokens,
            temperature
        });

        // Validate required fields
        if (!text || !apiKey) {
            return NextResponse.json({ error: 'Text and API key are required' }, { status: 400 });
        }

        // Ensure baseUrl is correct - always use the correct Akash Chat API URL
        const correctedBaseUrl = 'https://chatapi.akash.network/api/v1';

        console.log('Using baseUrl:', correctedBaseUrl, 'Original was:', baseUrl);

        // Generate the prompt based on mode and context
        const prompt = generatePrompt({ text, mode, context });

        // Make the API call to Akash Chat API
        const response = await fetch(`${correctedBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: maxTokens || 2000,
                temperature: temperature || 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Akash Chat API error:', response.status, errorData);
            return NextResponse.json({
                error: `API request failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
            }, { status: response.status });
        }

        const data = await response.json();

        // Extract the rewritten text
        const rewrittenText = data.choices?.[0]?.message?.content?.trim();

        if (!rewrittenText) {
            return NextResponse.json({ error: 'No response generated' }, { status: 500 });
        }

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        // Detect changes between original and rewritten text
        const changes = detectChanges(text, rewrittenText);

        return NextResponse.json({
            originalText: text,
            rewrittenText,
            mode: mode,
            changes: changes,
            confidence: 0.95, // High confidence for real API
            processingTime: processingTime,
            source: 'akash-chat-api',
            usage: data.usage
        });

    } catch (error) {
        console.error('Error in AI rewrite API:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}

function generatePrompt({ text, mode, context }) {
    const modeInstructions = {
        formal: "Rewrite the following text in a formal, professional tone. Use proper grammar, sophisticated vocabulary, and maintain a respectful, business-appropriate style.",
        casual: "Rewrite the following text in a casual, conversational tone. Use simple language, contractions, and a friendly, relaxed style as if talking to a friend.",
        creative: "Rewrite the following text in a creative, engaging manner. Use vivid language, interesting metaphors, and an imaginative approach while maintaining the core message.",
        concise: "Rewrite the following text to be more concise and direct. Remove unnecessary words, combine sentences where appropriate, and focus on clarity and brevity.",
        detailed: "Rewrite the following text with more detail and explanation. Expand on key points, add relevant examples, and provide comprehensive information while maintaining readability.",
        persuasive: "Rewrite the following text to be more persuasive and compelling. Use strong arguments, emotional appeals, and convincing language to influence the reader effectively.",
        academic: "Rewrite the following text in an academic style. Use scholarly language, proper citations format, objective tone, and formal structure appropriate for academic papers."
    };

    const contextInfo = context ? `

Context Information:
- Audience: ${context.audience}
- Purpose: ${context.purpose}  
- Tone: ${context.tone}
- Complexity: ${context.complexity}
- Length preference: ${context.length}` : '';

    return `${modeInstructions[mode] || modeInstructions.formal}${contextInfo}

Text to rewrite:
"${text}"

Rewritten text:`;
}

// Detect changes between original and rewritten text
function detectChanges(original, rewritten) {
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