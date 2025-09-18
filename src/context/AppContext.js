// Application context for state management
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DEFAULT_CONTEXT, REWRITING_MODES } from '../utils/constants';

const AppContext = createContext();

const initialState = {
    currentText: '',
    rewrittenText: '',
    selectedMode: 'formal',
    context: DEFAULT_CONTEXT,
    isLoading: false,
    error: null,
    history: [],
    preferences: {
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
    }
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_CURRENT_TEXT':
            return {
                ...state,
                currentText: action.payload,
                error: null
            };

        case 'SET_REWRITTEN_TEXT':
            return {
                ...state,
                rewrittenText: action.payload
            };

        case 'SET_SELECTED_MODE':
            return {
                ...state,
                selectedMode: action.payload
            };

        case 'SET_CONTEXT':
            return {
                ...state,
                context: { ...state.context, ...action.payload }
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };

        case 'ADD_TO_HISTORY':
            const newHistoryItem = {
                id: Date.now().toString(),
                timestamp: new Date(),
                ...action.payload
            };
            return {
                ...state,
                history: [newHistoryItem, ...state.history.slice(0, 49)] // Keep last 50 items
            };

        case 'CLEAR_HISTORY':
            return {
                ...state,
                history: []
            };

        case 'SET_PREFERENCES':
            return {
                ...state,
                preferences: { ...state.preferences, ...action.payload }
            };

        case 'RESET_STATE':
            return {
                ...initialState,
                preferences: state.preferences // Keep preferences
            };

        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const { data: session, status } = useSession();
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Load preferences from database for authenticated users, fallback to localStorage
    useEffect(() => {
        const loadPreferences = async () => {
            let loadedPreferences = null;

            try {
                // If user is authenticated, try to load from database first
                if (session?.user?.email) {
                    try {
                        const response = await fetch('/api/user/preferences');
                        if (response.ok) {
                            const data = await response.json();
                            loadedPreferences = data.preferences;
                            console.log('Loaded preferences from database:', loadedPreferences);
                        }
                    } catch (error) {
                        console.warn('Failed to load preferences from database, falling back to localStorage:', error);
                    }
                }

                // If no database preferences, try localStorage
                if (!loadedPreferences) {
                    const savedPreferences = localStorage.getItem('contextRewriterPreferences');
                    if (savedPreferences) {
                        loadedPreferences = JSON.parse(savedPreferences);
                        console.log('Loaded preferences from localStorage:', loadedPreferences);
                    }
                }

                // Apply loaded preferences if any
                if (loadedPreferences) {
                    // Migrate old incorrect baseUrl to correct one
                    if (loadedPreferences.aiConfig?.baseUrl?.includes('api.akashchat.com')) {
                        loadedPreferences.aiConfig.baseUrl = 'https://chatapi.akash.network/api/v1';
                        console.log('Migrated old baseUrl to correct Akash Chat API URL');
                    }

                    dispatch({ type: 'SET_PREFERENCES', payload: loadedPreferences });
                    dispatch({ type: 'SET_SELECTED_MODE', payload: loadedPreferences.defaultMode || 'formal' });
                    dispatch({ type: 'SET_CONTEXT', payload: loadedPreferences.defaultContext || DEFAULT_CONTEXT });
                }
            } catch (error) {
                console.warn('Failed to load preferences:', error);
            }
        };

        // Only load preferences when session status is determined
        if (status !== 'loading') {
            loadPreferences();
        }
    }, [session?.user?.email, status]);

    // Save preferences to localStorage when they change
    useEffect(() => {
        try {
            localStorage.setItem('contextRewriterPreferences', JSON.stringify(state.preferences));
        } catch (error) {
            console.warn('Failed to save preferences to localStorage:', error);
        }
    }, [state.preferences]);

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem('contextRewriterHistory');
            if (savedHistory) {
                const history = JSON.parse(savedHistory);
                // Restore history but limit to recent items
                history.slice(0, 10).forEach(item => {
                    dispatch({ type: 'ADD_TO_HISTORY', payload: item });
                });
            }
        } catch (error) {
            console.warn('Failed to load history from localStorage:', error);
        }
    }, []);

    // Save history to localStorage when it changes (debounced)
    useEffect(() => {
        if (state.preferences.autoSave && state.history.length > 0) {
            const timeoutId = setTimeout(() => {
                try {
                    localStorage.setItem('contextRewriterHistory', JSON.stringify(state.history));
                } catch (error) {
                    console.warn('Failed to save history to localStorage:', error);
                }
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [state.history, state.preferences.autoSave]);

    const actions = {
        setCurrentText: (text) => dispatch({ type: 'SET_CURRENT_TEXT', payload: text }),
        setRewrittenText: (text) => dispatch({ type: 'SET_REWRITTEN_TEXT', payload: text }),
        setSelectedMode: (mode) => dispatch({ type: 'SET_SELECTED_MODE', payload: mode }),
        setContext: (context) => dispatch({ type: 'SET_CONTEXT', payload: context }),
        setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
        setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
        addToHistory: (item) => dispatch({ type: 'ADD_TO_HISTORY', payload: item }),
        clearHistory: () => dispatch({ type: 'CLEAR_HISTORY' }),
        setPreferences: (preferences) => dispatch({ type: 'SET_PREFERENCES', payload: preferences }),
        resetState: () => dispatch({ type: 'RESET_STATE' })
    };

    return (
        <AppContext.Provider value={{ state, actions }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

export default AppContext;