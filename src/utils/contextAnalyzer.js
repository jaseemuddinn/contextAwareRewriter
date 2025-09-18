// Context analysis utilities for detecting writing style, tone, and complexity
// This module analyzes text to provide intelligent context suggestions

export class ContextAnalyzer {
    constructor() {
        this.vocabularyComplexity = {
            simple: ['good', 'bad', 'big', 'small', 'nice', 'easy', 'hard', 'fast', 'slow'],
            moderate: ['excellent', 'problematic', 'substantial', 'minimal', 'pleasant', 'straightforward', 'challenging', 'rapid', 'gradual'],
            complex: ['exemplary', 'multifaceted', 'comprehensive', 'infinitesimal', 'serendipitous', 'paradigmatic', 'intricate', 'expeditious', 'methodical']
        };

        this.formalIndicators = ['therefore', 'furthermore', 'consequently', 'nevertheless', 'moreover', 'however', 'thus', 'accordingly'];
        this.casualIndicators = ["that's", "it's", "don't", "can't", "won't", "you're", "we're", "they're", 'yeah', 'okay', 'cool'];
        this.academicIndicators = ['research', 'study', 'analysis', 'methodology', 'hypothesis', 'findings', 'conclusion', 'literature', 'evidence'];
        this.technicalIndicators = ['implementation', 'configuration', 'architecture', 'algorithm', 'framework', 'protocol', 'optimization', 'deployment'];
    }

    // Main analysis function
    analyzeText(text) {
        if (!text || typeof text !== 'string') {
            return this.getDefaultAnalysis();
        }

        const cleanText = text.toLowerCase().trim();
        const words = cleanText.split(/\s+/);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);

        return {
            audience: this.detectAudience(cleanText, words),
            purpose: this.detectPurpose(cleanText, words),
            tone: this.detectTone(cleanText, words),
            complexity: this.detectComplexity(words, sentences),
            length: this.suggestLength(words.length),
            confidence: this.calculateConfidence(text),
            suggestions: this.generateSuggestions(cleanText, words, sentences)
        };
    }

    // Detect target audience based on content and style
    detectAudience(text, words) {
        const academicScore = this.academicIndicators.reduce((score, indicator) =>
            score + (text.includes(indicator) ? 1 : 0), 0
        );

        const technicalScore = this.technicalIndicators.reduce((score, indicator) =>
            score + (text.includes(indicator) ? 1 : 0), 0
        );

        const formalScore = this.formalIndicators.reduce((score, indicator) =>
            score + (text.includes(indicator) ? 1 : 0), 0
        );

        const casualScore = this.casualIndicators.reduce((score, indicator) =>
            score + (text.includes(indicator) ? 1 : 0), 0
        );

        if (academicScore > 2) return 'academic';
        if (technicalScore > 2) return 'professional';
        if (formalScore > casualScore) return 'professional';
        if (casualScore > 2) return 'casual';

        return 'general';
    }

    // Detect document purpose based on keywords and structure
    detectPurpose(text, words) {
        const purposeKeywords = {
            email: ['dear', 'sincerely', 'regards', 'thank you', 'follow up', 'meeting', 'schedule'],
            essay: ['introduction', 'conclusion', 'argument', 'thesis', 'evidence', 'paragraph'],
            report: ['summary', 'findings', 'recommendations', 'data', 'results', 'analysis'],
            social: ['awesome', 'amazing', 'check out', 'follow', 'like', 'share', 'tag'],
            creative: ['story', 'character', 'scene', 'imagine', 'once upon', 'narrative']
        };

        let maxScore = 0;
        let detectedPurpose = 'other';

        Object.entries(purposeKeywords).forEach(([purpose, keywords]) => {
            const score = keywords.reduce((acc, keyword) =>
                acc + (text.includes(keyword) ? 1 : 0), 0
            );

            if (score > maxScore) {
                maxScore = score;
                detectedPurpose = purpose;
            }
        });

        return detectedPurpose;
    }

    // Detect tone based on word choice and style
    detectTone(text, words) {
        const formalCount = this.formalIndicators.reduce((count, indicator) =>
            count + (text.includes(indicator) ? 1 : 0), 0
        );

        const casualCount = this.casualIndicators.reduce((count, indicator) =>
            count + (text.includes(indicator) ? 1 : 0), 0
        );

        // Check for contractions (casual indicator)
        const contractionCount = (text.match(/'[a-z]/g) || []).length;

        // Check for exclamation marks (friendly/enthusiastic)
        const exclamationCount = (text.match(/!/g) || []).length;

        if (formalCount > casualCount + contractionCount) return 'formal';
        if (exclamationCount > 2) return 'friendly';
        if (casualCount + contractionCount > formalCount) return 'casual';

        return 'neutral';
    }

    // Detect complexity level based on vocabulary and sentence structure
    detectComplexity(words, sentences) {
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);

        // Check vocabulary complexity
        const complexWords = words.filter(word =>
            this.vocabularyComplexity.complex.includes(word)
        ).length;

        const moderateWords = words.filter(word =>
            this.vocabularyComplexity.moderate.includes(word)
        ).length;

        const simpleWords = words.filter(word =>
            this.vocabularyComplexity.simple.includes(word)
        ).length;

        // Long sentences suggest complexity
        const longSentences = sentences.filter(s => s.split(/\s+/).length > 20).length;

        if (complexWords > 2 || avgWordsPerSentence > 25 || longSentences > 0) {
            return 'complex';
        }

        if (moderateWords > simpleWords && avgWordsPerSentence > 15) {
            return 'moderate';
        }

        return 'simple';
    }

    // Suggest appropriate length based on current text
    suggestLength(wordCount) {
        if (wordCount < 50) return 'longer';
        if (wordCount > 300) return 'shorter';
        return 'same';
    }

    // Calculate confidence in analysis
    calculateConfidence(text) {
        const wordCount = text.split(/\s+/).length;

        // More text = higher confidence in analysis
        if (wordCount < 10) return 0.3;
        if (wordCount < 50) return 0.6;
        if (wordCount < 100) return 0.8;
        return 0.9;
    }

    // Generate context suggestions
    generateSuggestions(text, words, sentences) {
        const suggestions = [];

        // Length suggestions
        if (words.length < 20) {
            suggestions.push({
                type: 'length',
                message: 'Consider adding more detail for better rewriting results',
                action: 'Add more context or examples'
            });
        }

        // Style suggestions
        const casualCount = this.casualIndicators.reduce((count, indicator) =>
            count + (text.includes(indicator) ? 1 : 0), 0
        );

        if (casualCount > 3) {
            suggestions.push({
                type: 'tone',
                message: 'Text appears casual - consider formal mode for professional use',
                action: 'Switch to formal mode'
            });
        }

        // Complexity suggestions
        const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
        if (avgWordsPerSentence > 30) {
            suggestions.push({
                type: 'complexity',
                message: 'Long sentences detected - consider simplifying for readability',
                action: 'Use concise mode'
            });
        }

        return suggestions;
    }

    // Default analysis for empty or invalid text
    getDefaultAnalysis() {
        return {
            audience: 'general',
            purpose: 'other',
            tone: 'neutral',
            complexity: 'moderate',
            length: 'same',
            confidence: 0,
            suggestions: []
        };
    }

    // Auto-configure context based on analysis
    autoConfigureContext(text) {
        const analysis = this.analyzeText(text);

        return {
            audience: analysis.audience,
            purpose: analysis.purpose,
            tone: analysis.tone,
            complexity: analysis.complexity,
            length: analysis.length
        };
    }

    // Get writing style recommendations
    getStyleRecommendations(analysis) {
        const recommendations = [];

        // Mode recommendations based on detected context
        if (analysis.audience === 'academic') {
            recommendations.push({
                mode: 'academic',
                reason: 'Academic audience detected',
                confidence: 0.8
            });
        } else if (analysis.audience === 'professional') {
            recommendations.push({
                mode: 'formal',
                reason: 'Professional context detected',
                confidence: 0.7
            });
        } else if (analysis.tone === 'casual') {
            recommendations.push({
                mode: 'casual',
                reason: 'Casual tone detected',
                confidence: 0.6
            });
        }

        // Technical content detection
        const technicalScore = this.technicalIndicators.reduce((score, indicator) =>
            score + (analysis.text?.toLowerCase().includes(indicator) ? 1 : 0), 0
        );

        if (technicalScore > 2) {
            recommendations.push({
                mode: 'technical',
                reason: 'Technical content detected',
                confidence: 0.8
            });
        }

        return recommendations.sort((a, b) => b.confidence - a.confidence);
    }
}

// Export singleton instance
export const contextAnalyzer = new ContextAnalyzer();
export default contextAnalyzer;