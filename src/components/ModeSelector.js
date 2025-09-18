// Mode selector component for different rewriting styles
'use client';

import { REWRITING_MODES } from '../utils/constants';

export default function ModeSelector({ selectedMode, onModeChange, disabled = false }) {
    // Safety check
    if (!selectedMode || !onModeChange) {
        return (
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Rewriting Mode
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Loading modes...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Rewriting Mode
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                {REWRITING_MODES.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => onModeChange(mode.id)}
                        disabled={disabled}
                        className={`
              text-left p-4 rounded-2xl transition-all duration-300 transform
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105 active:scale-95'}
              ${selectedMode === mode.id
                                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/50 dark:border-blue-500/50 shadow-lg backdrop-blur-sm'
                                : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-600/50 border border-gray-200/60 dark:border-gray-600/60 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-600/60 dark:hover:to-gray-500/60 shadow-sm hover:shadow-md'
                            }
            `}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-lg flex-shrink-0 mt-0.5">{mode.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className={`font-medium text-sm ${selectedMode === mode.id
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-gray-900 dark:text-gray-100'
                                    }`}>
                                    {mode.name}
                                </div>
                                <div className={`text-xs mt-1 ${selectedMode === mode.id
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                    {mode.description}
                                </div>
                            </div>

                            {selectedMode === mode.id && (
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Quick mode description */}
            {selectedMode && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                        <strong>Selected:</strong> {REWRITING_MODES.find(m => m.id === selectedMode)?.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {REWRITING_MODES.find(m => m.id === selectedMode)?.description}
                    </div>
                </div>
            )}

            {/* Mode usage tips */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="text-xs text-blue-800 dark:text-blue-200 font-medium mb-1">
                    💡 Quick Tips
                </div>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Formal: Best for business emails and reports</li>
                    <li>• Casual: Perfect for social media and friendly messages</li>
                    <li>• Technical: Ideal for documentation and specifications</li>
                    <li>• Creative: Great for marketing and storytelling</li>
                </ul>
            </div>
        </div>
    );
}