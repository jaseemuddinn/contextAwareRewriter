// Context configuration panel for fine-tuning rewriting parameters
'use client';

import { CONTEXT_OPTIONS } from '../utils/constants';

export default function ContextPanel({ context, onContextChange, disabled = false }) {
    const handleChange = (key, value) => {
        onContextChange({ [key]: value });
    };

    // Safety check to ensure context exists
    if (!context) {
        return (
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Context Settings
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Loading context settings...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Context Settings
            </h3>

            {/* Audience */}
            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Audience
                </label>
                <select
                    value={context.audience}
                    onChange={(e) => handleChange('audience', e.target.value)}
                    disabled={disabled}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {CONTEXT_OPTIONS.audience.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Purpose */}
            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Purpose
                </label>
                <select
                    value={context.purpose}
                    onChange={(e) => handleChange('purpose', e.target.value)}
                    disabled={disabled}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {CONTEXT_OPTIONS.purpose.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tone */}
            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Tone
                </label>
                <select
                    value={context.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                    disabled={disabled}
                    className="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {CONTEXT_OPTIONS.tone.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Complexity */}
            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Complexity Level
                </label>
                <div className="grid grid-cols-3 gap-1">
                    {CONTEXT_OPTIONS.complexity.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleChange('complexity', option.value)}
                            disabled={disabled}
                            className={`
                px-3 py-2 text-xs rounded-xl font-medium transition-all duration-300 transform
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}
                ${context.complexity === option.value
                                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm hover:shadow-md'
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Length */}
            <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                    Output Length
                </label>
                <div className="grid grid-cols-3 gap-1">
                    {CONTEXT_OPTIONS.length.map(option => (
                        <button
                            key={option.value}
                            onClick={() => handleChange('length', option.value)}
                            disabled={disabled}
                            className={`
                px-3 py-2 text-xs rounded-xl font-medium transition-all duration-300 transform
                ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}
                ${context.length === option.value
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm hover:shadow-md'
                                }
              `}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Context summary */}
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-2">
                    Current Context
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                    <div>📊 <strong>Audience:</strong> {CONTEXT_OPTIONS.audience.find(a => a.value === context.audience)?.label}</div>
                    <div>🎯 <strong>Purpose:</strong> {CONTEXT_OPTIONS.purpose.find(p => p.value === context.purpose)?.label}</div>
                    <div>🎭 <strong>Tone:</strong> {CONTEXT_OPTIONS.tone.find(t => t.value === context.tone)?.label}</div>
                    <div>⚡ <strong>Complexity:</strong> {CONTEXT_OPTIONS.complexity.find(c => c.value === context.complexity)?.label}</div>
                    <div>📏 <strong>Length:</strong> {CONTEXT_OPTIONS.length.find(l => l.value === context.length)?.label}</div>
                </div>
            </div>

            {/* Context tips */}
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="text-xs text-amber-800 dark:text-amber-200 font-medium mb-1">
                    ✨ Context Matters
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300">
                    Better context settings lead to more accurate and appropriate rewriting results.
                </div>
            </div>
        </div>
    );
}