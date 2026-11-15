import React, { useState, useEffect } from 'react';
import { Page } from './types';
import {
  loadPages,
  savePages,
  loadActivePageId,
  saveActivePageId,
} from './utils/storage';
import { downloadFile } from './utils/export';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Editor } from './components/Editor';
import { SearchModal } from './components/SearchModal';

export const App: React.FC = () => {
  const [pages, setPages] = useState<Page[]>(() => loadPages());
  const [activePageId, setActivePageId] = useState<string>(() =>
    loadActivePageId(pages)
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('notion_dark_mode') === 'true' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    );
  });

  // Sync dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('notion_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('notion_dark_mode', 'false');
    }
  }, [darkMode]);

  // Auto-save pages
  useEffect(() => {
    savePages(pages);
  }, [pages]);

  // Auto-save active page id
  useEffect(() => {
    saveActivePageId(activePageId);
  }, [activePageId]);

  // Global Keyboard Shortcuts (Cmd+K, Cmd+\)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activePage = pages.find((p) => p.id === activePageId && !p.isTrash) ||
    pages.find((p) => !p.isTrash) || null;

  // Build breadcrumb hierarchy
  const buildBreadcrumbs = (page: Page | null) => {
    if (!page) return [];
    const crumbs: { id: string; title: string; icon: string }[] = [];
    let curr: Page | undefined = page;
    while (curr) {
      crumbs.unshift({
        id: curr.id,
        title: curr.title || 'Untitled',
        icon: curr.icon || '📄',
      });
      curr = pages.find((p) => p.id === curr?.parentId);
    }
    return crumbs;
  };

  // Create new page
  const handleCreatePage = (parentId: string | null = null) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      title: '',
      icon: '📄',
      parentId,
      isFavorite: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: [
        {
          type: 'paragraph',
          content: '',
        },
      ],
    };

    setPages((prev) => [newPage, ...prev]);
    setActivePageId(newPage.id);
  };

  // Update page
  const handleUpdatePage = (updatedPage: Page) => {
    setPages((prev) =>
      prev.map((p) => (p.id === updatedPage.id ? updatedPage : p))
    );
  };

  // Move page to trash (soft delete)
  const handleDeletePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isTrash: true } : p))
    );
    if (activePageId === id) {
      const remaining = pages.filter((p) => p.id !== id && !p.isTrash);
      if (remaining.length > 0) {
        setActivePageId(remaining[0].id);
      }
    }
  };

  // Restore page from trash
  const handleRestorePage = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isTrash: false } : p))
    );
    setActivePageId(id);
  };

  // Permanently delete page
  const handlePermanentDeletePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
  };

  // Duplicate page
  const handleDuplicatePage = (id: string) => {
    const original = pages.find((p) => p.id === id);
    if (!original) return;

    const duplicated: Page = {
      ...original,
      id: `page-${Date.now()}`,
      title: `${original.title || 'Untitled'} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      blocks: original.blocks.map((b) => ({
        ...b,
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      })),
    };

    setPages((prev) => [duplicated, ...prev]);
    setActivePageId(duplicated.id);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Export full workspace backup
  const handleExportBackup = () => {
    const json = JSON.stringify(pages, null, 2);
    downloadFile(
      json,
      `notion-workspace-backup-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );
  };

  // Restore/import workspace backup
  const handleImportBackup = (imported: Page[]) => {
    setPages(imported);
    if (imported.length > 0) {
      setActivePageId(imported[0].id);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-notion-darkBg font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        pages={pages}
        activePageId={activePageId}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelectPage={setActivePageId}
        onCreatePage={handleCreatePage}
        onDeletePage={handleDeletePage}
        onRestorePage={handleRestorePage}
        onPermanentDeletePage={handlePermanentDeletePage}
        onToggleFavorite={handleToggleFavorite}
        onOpenSearch={() => setIsSearchOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar
          activePage={activePage}
          breadcrumbs={buildBreadcrumbs(activePage)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectPage={setActivePageId}
          onToggleFavorite={handleToggleFavorite}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
          onAddSubPage={(parentId) => handleCreatePage(parentId)}
          onOpenSearch={() => setIsSearchOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />

        {activePage ? (
          <Editor
            key={activePage.id}
            page={activePage}
            darkMode={darkMode}
            onUpdatePage={handleUpdatePage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
            <span className="text-4xl mb-3">📄</span>
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
              No page selected
            </h3>
            <p className="text-sm max-w-sm mb-4">
              Select a page from the sidebar or create a new one to begin writing.
            </p>
            <button
              onClick={() => handleCreatePage(null)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Create New Page
            </button>
          </div>
        )}
      </div>

      {/* Quick Search Omnibox Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        pages={pages}
        onClose={() => setIsSearchOpen(false)}
        onSelectPage={setActivePageId}
      />
    </div>
  );
};

export default App;
