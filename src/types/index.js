// Type definitions for the AI-powered text rewriting system
// Using JSDoc comments for documentation in JavaScript

/**
 * @typedef {Object} RewritingMode
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} icon
 * @property {string} prompt
 */

/**
 * @typedef {Object} ContextSettings
 * @property {'professional' | 'academic' | 'casual' | 'general'} audience
 * @property {'email' | 'essay' | 'report' | 'social' | 'creative' | 'other'} purpose
 * @property {'formal' | 'casual' | 'friendly' | 'authoritative' | 'neutral'} tone
 * @property {'simple' | 'moderate' | 'complex'} complexity
 * @property {'shorter' | 'same' | 'longer'} length
 */

/**
 * @typedef {Object} RewriteRequest
 * @property {string} text
 * @property {string} mode
 * @property {ContextSettings} context
 * @property {boolean} [preserveStructure]
 * @property {string} [customInstructions]
 */

/**
 * @typedef {Object} RewriteResponse
 * @property {string} originalText
 * @property {string} rewrittenText
 * @property {string} mode
 * @property {TextChange[]} changes
 * @property {number} confidence
 * @property {number} processingTime
 * @property {string} source
 */

/**
 * @typedef {Object} TextChange
 * @property {string} type
 * @property {string} original
 * @property {string} replacement
 * @property {string} reason
 */

/**
 * @typedef {Object} AIServiceConfig
 * @property {string} apiKey
 * @property {string} model
 * @property {number} temperature
 * @property {number} maxTokens
 * @property {string} baseUrl
 */

/**
 * @typedef {Object} UserPreferences
 * @property {AIServiceConfig} aiConfig
 * @property {ContextSettings} defaultContext
 * @property {string} theme
 * @property {string} language
 * @property {boolean} autoSave
 * @property {boolean} showWordCount
 */

/**
 * @typedef {Object} RewriteHistory
 * @property {string} id
 * @property {string} originalText
 * @property {string} rewrittenText
 * @property {string} mode
 * @property {ContextSettings} context
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} AppState
 * @property {string} currentText
 * @property {string} rewrittenText
 * @property {string} selectedMode
 * @property {ContextSettings} context
 * @property {boolean} isLoading
 * @property {string|null} error
 * @property {UserPreferences} preferences
 * @property {RewriteHistory[]} history
 */

// Export empty object to maintain module structure
export { };