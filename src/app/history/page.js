'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { REWRITING_MODES } from '../../utils/constants';

export default function History() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        mode: '',
        favorite: false,
        limit: 20,
        skip: 0,
    });
    const [selectedItems, setSelectedItems] = useState(new Set());

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
            return;
        }

        if (status === 'authenticated') {
            loadHistory();
            loadStats();
        }
    }, [status, filters]);

    const loadHistory = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.mode) params.append('mode', filters.mode);
            if (filters.favorite) params.append('favorite', 'true');
            params.append('limit', filters.limit.toString());
            params.append('skip', filters.skip.toString());

            const res = await fetch(`/api/history?${params}`);
            const data = await res.json();

            if (res.ok) {
                setHistory(filters.skip === 0 ? data.history : [...history, ...data.history]);
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const res = await fetch('/api/history/stats');
            const data = await res.json();

            if (res.ok) {
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const deleteSelectedItems = async () => {
        if (selectedItems.size === 0) return;

        if (!confirm(`Delete ${selectedItems.size} selected items?`)) return;

        try {
            const ids = Array.from(selectedItems).join(',');
            const res = await fetch(`/api/history?ids=${ids}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setHistory(history.filter(item => !selectedItems.has(item._id)));
                setSelectedItems(new Set());
                loadStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Failed to delete items:', error);
        }
    };

    const clearAllHistory = async () => {
        if (!confirm('Clear all history? This action cannot be undone.')) return;

        try {
            const res = await fetch('/api/history', {
                method: 'DELETE',
            });

            if (res.ok) {
                setHistory([]);
                setSelectedItems(new Set());
                loadStats(); // Refresh stats
            }
        } catch (error) {
            console.error('Failed to clear history:', error);
        }
    };

    const toggleSelectItem = (itemId) => {
        const newSelected = new Set(selectedItems);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        setSelectedItems(newSelected);
    };

    const selectAll = () => {
        if (selectedItems.size === history.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(history.map(item => item._id)));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getModeIcon = (mode) => {
        const modeData = REWRITING_MODES.find(m => m.id === mode);
        return modeData?.icon || '📝';
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[var(--gradient-start)] via-[var(--gradient-middle)] to-[var(--gradient-end)]">
                <Navigation />
                <div className="flex items-center justify-center py-20">
                    <div className="glass-card border border-white/20 dark:border-white/10 rounded-2xl p-8 backdrop-blur-xl bg-white/60 dark:bg-gray-800/60">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 dark:border-blue-800"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0"></div>
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                            </div>
                            <div className="text-center">
                                <div className="text-gray-700 dark:text-gray-300 font-medium text-lg">
                                    Loading your history...
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Fetching your previous rewrites
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />

            <div className="max-w-7xl mx-auto py-8 px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Rewrite History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        View and manage your text rewriting history
                    </p>
                </div>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Rewrites</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.overview.totalRewrites}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Words Processed</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.overview.totalWordsProcessed?.toLocaleString() || 0}
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Confidence</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {(stats.overview.averageConfidence * 100).toFixed(0)}%
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorites</h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {stats.overview.favoriteCount}
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters and Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filters.mode}
                                onChange={(e) => setFilters({ ...filters, mode: e.target.value, skip: 0 })}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                            >
                                <option value="">All Modes</option>
                                {REWRITING_MODES.map(mode => (
                                    <option key={mode.id} value={mode.id}>
                                        {mode.icon} {mode.name}
                                    </option>
                                ))}
                            </select>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={filters.favorite}
                                    onChange={(e) => setFilters({ ...filters, favorite: e.target.checked, skip: 0 })}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">Favorites only</span>
                            </label>
                        </div>

                        <div className="flex gap-2">
                            {selectedItems.size > 0 && (
                                <button
                                    onClick={deleteSelectedItems}
                                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
                                >
                                    Delete Selected ({selectedItems.size})
                                </button>
                            )}

                            <button
                                onClick={clearAllHistory}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                         hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    {history.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                No history yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Start rewriting text to see your history here
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.size === history.length && history.length > 0}
                                        onChange={selectAll}
                                        className="rounded"
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Select All ({history.length})
                                    </span>
                                </label>
                            </div>

                            {/* History Items */}
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {history.map((item) => (
                                    <div key={item._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.has(item._id)}
                                                onChange={() => toggleSelectItem(item._id)}
                                                className="mt-1 rounded"
                                            />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg">{getModeIcon(item.mode)}</span>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                                                        {item.mode}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(item.createdAt)}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                            Original
                                                        </h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                                            {item.originalText}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                                            Rewritten
                                                        </h4>
                                                        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                                                            {item.rewrittenText}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                                        <span>{item.metadata?.wordCount?.original || 0} → {item.metadata?.wordCount?.rewritten || 0} words</span>
                                                        <span>{item.metadata?.confidence ? Math.round(item.metadata.confidence * 100) : 0}% confidence</span>
                                                    </div>

                                                    <button
                                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        onClick={() => {
                                                            // TODO: Implement view details or copy functionality
                                                            navigator.clipboard.writeText(item.rewrittenText);
                                                        }}
                                                    >
                                                        Copy Result
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}