// Navigation component
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    return (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl">✨</div>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Context Rewriter
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link
                            href="/"
                            className={`text-sm font-medium transition-colors duration-200 ${pathname === '/'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Rewriter
                        </Link>

                        {session && (
                            <Link
                                href="/history"
                                className={`text-sm font-medium transition-colors duration-200 ${pathname === '/history'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                    }`}
                            >
                                History
                            </Link>
                        )}

                        <Link
                            href="/settings"
                            className={`text-sm font-medium transition-colors duration-200 ${pathname === '/settings'
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                                }`}
                        >
                            Settings
                        </Link>

                        {/* Auth Section */}
                        {status === 'loading' ? (
                            <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                        ) : session ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    {session.user?.image && (
                                        <img
                                            src={session.user.image}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {session.user?.name || session.user?.email}
                                    </span>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Dark mode toggle placeholder */}
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}