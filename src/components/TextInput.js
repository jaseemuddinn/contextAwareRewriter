// Text input component with enhanced features
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export default function TextInput({
    value,
    onChange,
    placeholder = "Enter your text here...",
    className = "",
    disabled = false,
    onPaste = null,
    minHeight = "200px"
}) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const textareaRef = useRef(null);

    // Update counters when value changes
    useEffect(() => {
        const words = value.trim() ? value.trim().split(/\s+/).length : 0;
        const chars = value.length;
        setWordCount(words);
        setCharCount(chars);
    }, [value]);

    const handleChange = useCallback((e) => {
        onChange(e.target.value);
    }, [onChange]);

    const handlePaste = useCallback((e) => {
        if (onPaste) {
            const pastedText = e.clipboardData.getData('text');
            onPaste(pastedText);
        }
    }, [onPaste]);

    const handleKeyDown = useCallback((e) => {
        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.max(
                textareaRef.current.scrollHeight,
                parseInt(minHeight)
            ) + 'px';
        }
    }, [minHeight]);

    const clearText = useCallback(() => {
        onChange('');
        textareaRef.current?.focus();
    }, [onChange]);

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={handleChange}
                    onPaste={handlePaste}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    className={`
            w-full p-4 border border-gray-300 rounded-lg resize-none
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200 font-mono text-sm leading-relaxed
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            dark:bg-gray-800 dark:border-gray-600 dark:text-white
            dark:placeholder-gray-400 dark:focus:ring-blue-400
          `}
                    style={{ minHeight }}
                    rows={1}
                />

                {value && !disabled && (
                    <button
                        onClick={clearText}
                        className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 
                                 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500
                                 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
                                 transition-all duration-300 transform hover:scale-110 active:scale-95
                                 flex items-center justify-center shadow-sm hover:shadow-md backdrop-blur-sm"
                        title="Clear text"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Word and character count */}
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex gap-4">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                </div>

                {/* Reading time estimate */}
                <div className="text-xs">
                    ~{Math.ceil(wordCount / 200)} min read
                </div>
            </div>

            {/* Progress indicator for long texts */}
            {charCount > 1000 && (
                <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                        <div
                            className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((charCount / 5000) * 100, 100)}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {charCount > 5000 ? 'Very long text' : 'Long text'}
                    </div>
                </div>
            )}
        </div>
    );
}