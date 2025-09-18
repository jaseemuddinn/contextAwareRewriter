// Main rewriter component that orchestrates the text rewriting interface
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useApp } from '../context/AppContext';
import aiService from '../services/aiService';
import TextInput from './TextInput';
import TextOutput from './TextOutput';
import ModeSelector from './ModeSelector';
import ContextPanel from './ContextPanel';

export default function TextRewriter() {
    const { state, actions } = useApp();
    const { data: session } = useSession();
    const [rewriteResponse, setRewriteResponse] = useState(null);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [loadingProgress, setLoadingProgress] = useState(0);

    const {
        currentText,
        rewrittenText,
        selectedMode,
        context,
        isLoading,
        error,
        preferences
    } = state;

    const handleRewrite = async () => {
        if (!currentText.trim()) {
            actions.setError('Please enter some text to rewrite');
            return;
        }

        try {
            actions.setLoading(true);
            actions.setError(null);
            setLoadingProgress(0);
            setLoadingMessage('Preparing your text...');

            // Initialize AI service with current preferences
            aiService.initialize(preferences.aiConfig);

            setLoadingProgress(20);
            setLoadingMessage('Analyzing content...');

            const request = {
                text: currentText,
                mode: selectedMode,
                context: context,
                preserveStructure: false
            };

            setLoadingProgress(40);
            setLoadingMessage('Connecting to AI service...');

            const response = await aiService.rewriteText(request);

            setLoadingProgress(80);
            setLoadingMessage('Processing results...');

            actions.setRewrittenText(response.rewrittenText);
            setRewriteResponse(response);

            // Add to local history
            actions.addToHistory({
                originalText: currentText,
                rewrittenText: response.rewrittenText,
                mode: selectedMode,
                context: context
            });

            setLoadingProgress(90);
            setLoadingMessage('Saving to history...');

            // Save to database if user is authenticated
            if (session) {
                try {
                    await fetch('/api/history', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            originalText: currentText,
                            rewrittenText: response.rewrittenText,
                            mode: selectedMode,
                            context: context,
                            metadata: {
                                wordCount: {
                                    original: currentText.split(/\s+/).length,
                                    rewritten: response.rewrittenText.split(/\s+/).length
                                },
                                confidence: response.confidence,
                                processingTime: response.processingTime,
                                source: response.source
                            }
                        }),
                    });
                } catch (error) {
                    console.error('Failed to save to database:', error);
                    // Don't show error to user as this is not critical
                }
            }

        } catch (error) {
            console.error('Rewrite error:', error);
            actions.setError('Failed to rewrite text. Please try again.');
        } finally {
            setLoadingProgress(100);
            setLoadingMessage('Complete!');
            actions.setLoading(false);
            // Reset loading states after a brief delay
            setTimeout(() => {
                setLoadingProgress(0);
                setLoadingMessage('');
            }, 500);
        }
    };

    const handleClearAll = () => {
        actions.setCurrentText('');
        actions.setRewrittenText('');
        setRewriteResponse(null);
        actions.setError(null);
    };

    const canRewrite = currentText.trim().length > 0 && !isLoading;
    const hasApiKey = preferences.aiConfig?.apiKey && preferences.aiConfig.apiKey.trim() !== '';

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]">
            {/* Modern Hero Section */}
            <div className="relative py-12 px-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm"></div>
                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-block mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg font-semibold">
                            AI-Powered
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                        Context-Aware Text Rewriter
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Transform your text with intelligent AI-powered rewriting tools that understand context and meaning
                    </p>
                </div>
            </div>

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-6 pb-12 space-y-6">
                {/* API Key Warning */}
                {!hasApiKey && (
                    <div className="glass-card bg-gradient-to-r from-yellow-50/80 to-amber-50/80 dark:from-yellow-900/40 dark:to-amber-900/40 border border-yellow-200/60 dark:border-yellow-700/60 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-yellow-800 dark:text-yellow-200 font-semibold">
                                    Akash Chat API Key Required
                                </h3>
                                <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                                    Please configure your Akash Chat API key in{' '}
                                    <a href="/settings" className="underline hover:no-underline font-medium">Settings</a> to use the text rewriter.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error display */}
                {error && (
                    <div className="glass-card bg-gradient-to-r from-red-50/80 to-rose-50/80 dark:from-red-900/40 dark:to-rose-900/40 border border-red-200/60 dark:border-red-700/60 rounded-2xl p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-red-800 dark:text-red-200 font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                    <div className="glass-card bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/40 dark:to-indigo-900/40 border border-blue-200/60 dark:border-blue-700/60 rounded-2xl p-8 backdrop-blur-xl">
                        <div className="flex flex-col items-center justify-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-200 border-t-blue-600 dark:border-blue-700 dark:border-t-blue-400"></div>
                                <span className="text-blue-800 dark:text-blue-200 font-semibold text-lg">
                                    {loadingMessage || 'Processing your text...'}
                                </span>
                            </div>
                            {loadingProgress > 0 && (
                                <div className="w-full max-w-md">
                                    <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400 mb-2">
                                        <span>Progress</span>
                                        <span className="font-semibold">{loadingProgress}%</span>
                                    </div>
                                    <div className="w-full bg-blue-200/50 dark:bg-blue-800/50 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${loadingProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Interface Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Mode Selector Card */}
                        <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                            <ModeSelector
                                selectedMode={selectedMode}
                                onModeChange={actions.setSelectedMode}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Context Panel Card */}
                        <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                            <ContextPanel
                                context={context}
                                onContextChange={actions.setContext}
                                disabled={isLoading}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleClearAll}
                                className="w-full py-3 px-6 rounded-2xl font-medium text-gray-700 dark:text-gray-300 bg-white/70 dark:bg-gray-700/70 border border-gray-200/60 dark:border-gray-600/60 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 backdrop-blur-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-6">
                        <TextInput
                            value={currentText}
                            onChange={actions.setCurrentText}
                            disabled={isLoading}
                        />
                        <button
                                onClick={handleRewrite}
                                disabled={!canRewrite}
                                className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform ${canRewrite
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl active:scale-95'
                                        : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                                    }`}
                            >
                                {isLoading ? (
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            <span>Rewriting...</span>
                                        </div>
                                        {loadingProgress > 0 && (
                                            <div className="w-full bg-blue-400/30 rounded-full h-1.5">
                                                <div
                                                    className="h-full bg-white rounded-full transition-all duration-500"
                                                    style={{ width: `${loadingProgress}%` }}
                                                ></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Rewrite Text
                                    </div>
                                )}
                            </button>

                        <TextOutput
                            rewrittenText={rewrittenText}
                            originalText={currentText}
                            changes={rewriteResponse?.changes || []}
                            showComparison={!!rewriteResponse}
                            isLoading={isLoading}
                        />
                        {/* Response metadata */}
                    {rewriteResponse && !isLoading && (
                        <div className="lg:col-span-4">
                            <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-6 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analysis Results</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-1">
                                            {Math.round(rewriteResponse.confidence * 100)}%
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Confidence</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-1">
                                            {rewriteResponse.changes.length}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Changes</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-1 capitalize">
                                            {rewriteResponse.mode}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Mode</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-1">
                                            {(rewriteResponse.processingTime / 1000).toFixed(1)}s
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                        
                    </div>

                    
                </div>
            </div>
        </div>
    );
}
