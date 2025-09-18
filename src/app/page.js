'use client';

import TextRewriter from '../components/TextRewriter';
import Navigation from '../components/Navigation';
import { AppProvider } from '../context/AppContext';

export default function Home() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <TextRewriter />
      </div>
    </AppProvider>
  );
}
