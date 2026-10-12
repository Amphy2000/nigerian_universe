import { lazy, Suspense } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { BottomNav, Sidebar } from '@/components/Navigation';
import { HomePage } from '@/pages/HomePage';
const ExplorePage = lazy(() => import('@/pages/ExplorePage').then((m) => ({ default: m.ExplorePage })));
import { FootballPage } from '@/pages/FootballPage';
import { GamesPage } from '@/pages/GamesPage';
import { CourtPage } from '@/pages/CourtPage';
import { CasePage } from '@/pages/CasePage';
import { SubmitPage } from '@/pages/SubmitPage';
import { TrendingPage } from '@/pages/TrendingPage';
import { ActivityPage } from '@/pages/ActivityPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ArchivePage } from '@/pages/ArchivePage';

function AppContent() {
  const { page, currentCase } = useApp();

  // Explore page is fullscreen 3D — no sidebar/nav
  if (page === 'explore') {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-ink-950 flex items-center justify-center"><div className="text-ink-400 text-sm">Loading world...</div></div>}>
        <ExplorePage />
      </Suspense>
    );
  }

  if (currentCase) {
    return (
      <div className="min-h-screen noise-bg">
        <div className="md:flex">
          <Sidebar />
          <main className="flex-1 min-w-0 px-4 sm:px-6 py-4 max-w-3xl mx-auto w-full">
            <CasePage />
          </main>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen noise-bg">
      <div className="md:flex">
        <Sidebar />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-4 max-w-3xl mx-auto w-full">
          {page === 'home' && <HomePage />}
          {page === 'football' && <FootballPage />}
          {page === 'games' && <GamesPage />}
          {page === 'court' && <CourtPage />}
          {page === 'trending' && <TrendingPage />}
          {page === 'submit' && <SubmitPage />}
          {page === 'activity' && <ActivityPage />}
          {page === 'profile' && <ProfilePage />}
          {page === 'archive' && <ArchivePage />}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

import { SimLifeProvider } from '@/sim/SimLifeContext';

function App() {
  return (
    <AppProvider>
      <SimLifeProvider>
        <AppContent />
      </SimLifeProvider>
    </AppProvider>
  );
}

export default App;
