// Text output component with comparison and copy features
'use client';

import { useState, useCallback, useRef } from 'react';

export default function TextOutput({
    originalText,
    rewrittenText,
    isLoading = false,
    changes = [],
    className = "",
    showComparison = false
}) {
    const [copied, setCopied] = useState(false);
    const [showDiff, setShowDiff] = useState(false);
    const outputRef = useRef(null);

    const copyToClipboard = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(rewrittenText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy text:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = rewrittenText;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [rewrittenText]);

    const downloadText = useCallback(() => {
        const blob = new Blob([rewrittenText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rewritten-text-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [rewrittenText]);

    if (isLoading) {
        return (
            <div className={`flex flex-col ${className}`}>
                <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 min-h-[200px] backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
                                    Rewriting your text...
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    AI is analyzing and improving your content
                                </div>
                            </div>
                            <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!rewrittenText) {
        return (
            <div className={`flex flex-col ${className}`}>
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[200px]">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            <div className="text-4xl mb-2">✨</div>
                            <div className="text-sm">Your rewritten text will appear here</div>
                            <div className="text-xs mt-1">Enter some text and click rewrite to get started</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Rewritten Text
                    </h3>
                    {changes.length > 0 && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full">
                            {changes.length} changes
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {showComparison && (
                        <button
                            onClick={() => setShowDiff(!showDiff)}
                            className={`text-xs px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-medium ${showDiff
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-600'
                                : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-sm hover:shadow-md'
                                }`}
                        >
                            {showDiff ? 'Hide' : 'Show'} Changes
                        </button>
                    )}

                    <button
                        onClick={copyToClipboard}
                        className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40
                                 text-green-700 dark:text-green-300 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-800/50 dark:hover:to-emerald-800/50
                                 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md"
                        title="Copy to clipboard"
                    >
                        {copied ? (
                            <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Copied!
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                Copy
                            </>
                        )}
                    </button>

                    <button
                        onClick={downloadText}
                        className="text-xs px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40
                                 text-purple-700 dark:text-purple-300 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50
                                 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md"
                        title="Download as text file"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                    </button>
                </div>
            </div>

            {/* Output content */}
            <div className="relative">
                {showDiff && showComparison ? (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Original text */}
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="text-xs text-red-600 dark:text-red-400 mb-2 font-medium">Original</div>
                            <div className="text-sm font-mono leading-relaxed text-red-800 dark:text-red-200">
                                {originalText}
                            </div>
                        </div>

                        {/* Rewritten text */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="text-xs text-green-600 dark:text-green-400 mb-2 font-medium">Rewritten</div>
                            <div className="text-sm font-mono leading-relaxed text-green-800 dark:text-green-200">
                                {rewrittenText}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 min-h-[200px]">
                        <div
                            ref={outputRef}
                            className="text-sm font-mono leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-wrap"
                        >
                            {rewrittenText}
                        </div>
                    </div>
                )}
            </div>

            {/* Statistics */}
            <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                    <span>{rewrittenText.trim().split(/\s+/).length} words</span>
                    <span>{rewrittenText.length} characters</span>
                </div>

                {originalText && (
                    <div className="flex gap-4">
                        <span>
                            {rewrittenText.length > originalText.length ? '+' : ''}
                            {rewrittenText.length - originalText.length} chars
                        </span>
                        <span>
                            {rewrittenText.trim().split(/\s+/).length > originalText.trim().split(/\s+/).length ? '+' : ''}
                            {rewrittenText.trim().split(/\s+/).length - originalText.trim().split(/\s+/).length} words
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}