'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import { REWRITING_MODES, DEFAULT_CONTEXT } from '../../utils/constants';
import Navigation from '../../components/Navigation';
import { AppProvider } from '../../context/AppContext';
import Link from 'next/link';

function SettingsContent() {
    const { data: session } = useSession();
    const { state, actions } = useApp();
    const [tempPreferences, setTempPreferences] = useState(state.preferences);
    const [isEditing, setIsEditing] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Update tempPreferences when state.preferences changes (from database load)
    useEffect(() => {
        setTempPreferences(state.preferences);
    }, [state.preferences]);

    const handleSave = async () => {
        setIsSaving(true);

        try {
            // Save to local context first
            actions.setPreferences(tempPreferences);

            // If user is authenticated, also save to database
            if (session?.user?.email) {
                const response = await fetch('/api/user/preferences', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ preferences: tempPreferences }),
                });

                if (response.ok) {
                    toast.success('Settings saved successfully!');
                } else {
                    const error = await response.json();
                    toast.error(`Failed to save to database: ${error.error}`);
                    // Still show success for local save
                    toast.success('Settings saved locally');
                }
            } else {
                toast.success('Settings saved locally');
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setTempPreferences(state.preferences);
    };

    const handleReset = () => {
        const defaultPreferences = {
            defaultMode: 'formal',
            defaultContext: DEFAULT_CONTEXT,
            aiConfig: {
                apiKey: '',
                model: 'Meta-Llama-3-1-8B-Instruct-FP8',
                baseUrl: 'https://chatapi.akash.network/api/v1',
                maxTokens: 2000,
                temperature: 0.7
            },
            autoSave: true,
            enableRealtime: false,
            enableSuggestions: true
        };
        setTempPreferences(defaultPreferences);
    };

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all history? This action cannot be undone.')) {
            actions.clearHistory();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]">
            <Navigation />
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Modern Header */}
                    <div className="text-center mb-12">
                        <div className="inline-block mb-4">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-lg font-semibold">
                                Configuration
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-4">
                            Settings
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Configure your AI text rewriter preferences and API settings for optimal performance
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* AI Configuration Card */}
                        <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        AI Configuration
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">Connect your AI service for text rewriting</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Akash Chat API Key
                                    </label>
                                    <input
                                        type="password"
                                        value={tempPreferences.aiConfig.apiKey}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            aiConfig: { ...tempPreferences.aiConfig, apiKey: e.target.value }
                                        })}
                                        placeholder="Enter your Akash Chat API key (sk-...)..."
                                        className="w-full p-4 rounded-xl bg-white/70 dark:bg-gray-700/70 border border-gray-200/60 dark:border-gray-600/60
                                                 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                                                 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:bg-white dark:focus:bg-gray-700
                                                 transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                                        Leave empty to use demo mode with dummy data
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                            Model
                                        </label>
                                        <select
                                            value={tempPreferences.aiConfig.model}
                                            onChange={(e) => setTempPreferences({
                                                ...tempPreferences,
                                                aiConfig: { ...tempPreferences.aiConfig, model: e.target.value }
                                            })}
                                            disabled={!isEditing}
                                            className="w-full p-4 rounded-xl bg-white/70 dark:bg-gray-700/70 border border-gray-200/60 dark:border-gray-600/60
                                                     text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                                                     disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm shadow-sm hover:shadow-md"
                                        >
                                            <option value="DeepSeek-R1-Distill-Qwen-32B">DeepSeek R1 Distill Qwen 32B</option>
                                            <option value="DeepSeek-V3-1">DeepSeek V3.1</option>
                                            <option value="gpt-oss-120b">GPT OSS 120B</option>
                                            <option value="Meta-Llama-3-1-8B-Instruct-FP8">Meta Llama 3.1 8B Instruct FP8</option>
                                            <option value="Meta-Llama-3-3-70B-Instruct">Meta Llama 3.3 70B Instruct</option>
                                            <option value="Meta-Llama-4-Maverick-17B-128E-Instruct-FP8">Meta Llama 4 Maverick 17B Instruct FP8</option>
                                            <option value="Qwen3-235B-A22B-Instruct-2507-FP8">Qwen3 235B Instruct FP8</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Max Tokens
                                        </label>
                                        <input
                                            type="number"
                                            min="100"
                                            max="4000"
                                            value={tempPreferences.aiConfig.maxTokens}
                                            onChange={(e) => setTempPreferences({
                                                ...tempPreferences,
                                                aiConfig: { ...tempPreferences.aiConfig, maxTokens: parseInt(e.target.value) }
                                            })}
                                            disabled={!isEditing}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               disabled:bg-gray-100 dark:disabled:bg-gray-700"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Temperature ({tempPreferences.aiConfig.temperature})
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={tempPreferences.aiConfig.temperature}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            aiConfig: { ...tempPreferences.aiConfig, temperature: parseFloat(e.target.value) }
                                        })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        <span>More focused</span>
                                        <span>More creative</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Default Settings */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Default Settings
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Default Rewriting Mode
                                    </label>
                                    <select
                                        value={tempPreferences.defaultMode}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            defaultMode: e.target.value
                                        })}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             disabled:bg-gray-100 dark:disabled:bg-gray-700"
                                    >
                                        {REWRITING_MODES.map(mode => (
                                            <option key={mode.id} value={mode.id}>
                                                {mode.icon} {mode.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Default Audience
                                    </label>
                                    <select
                                        value={tempPreferences.defaultContext.audience}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            defaultContext: { ...tempPreferences.defaultContext, audience: e.target.value }
                                        })}
                                        disabled={!isEditing}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             disabled:bg-gray-100 dark:disabled:bg-gray-700"
                                    >
                                        <option value="professional">Professional</option>
                                        <option value="academic">Academic</option>
                                        <option value="casual">Casual</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Preferences
                            </h2>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={tempPreferences.autoSave}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            autoSave: e.target.checked
                                        })}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Auto-save history
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Automatically save rewrite history to local storage
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={tempPreferences.enableRealtime}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            enableRealtime: e.target.checked
                                        })}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Real-time rewriting (Coming Soon)
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Automatically rewrite text as you type
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={tempPreferences.enableSuggestions}
                                        onChange={(e) => setTempPreferences({
                                            ...tempPreferences,
                                            enableSuggestions: e.target.checked
                                        })}
                                        disabled={!isEditing}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Context suggestions
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            Show automatic context detection and suggestions
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Data Management */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Data Management
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Rewrite History
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {state.history.length} items saved locally
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearHistory}
                                        className="px-4 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 
                             rounded-lg transition-colors duration-200"
                                    >
                                        Clear History
                                    </button>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                    <div className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                                        🔒 Privacy Notice
                                    </div>
                                    <div className="text-xs text-blue-700 dark:text-blue-300">
                                        All data is stored locally on your device. Your text and API keys never leave your browser
                                        except when making requests to the AI service you've configured.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-between pt-6 border-t border-gray-200/60 dark:border-gray-600/60">
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                             disabled:from-gray-400 disabled:to-gray-500 text-white rounded-2xl font-semibold
                                             transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100
                                             shadow-lg hover:shadow-xl disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="relative">
                                                <div className="w-4 h-4 border-2 border-white/30 rounded-full"></div>
                                                <div className="w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin absolute top-0"></div>
                                            </div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 
                                             text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 
                                             dark:hover:from-gray-600 dark:hover:to-gray-500 rounded-2xl font-semibold
                                             transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                                >
                                    Cancel
                                </button>
                            </div>

                            <button
                                onClick={handleReset}
                                className="px-8 py-3 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40
                                         text-red-700 dark:text-red-300 hover:from-red-200 hover:to-rose-200 
                                         dark:hover:from-red-800/50 dark:hover:to-rose-800/50 rounded-2xl font-semibold
                                         transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                            >
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Settings() {
    return (
        <AppProvider>
            <SettingsContent />
        </AppProvider>
    );
}