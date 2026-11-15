import React, { useState } from 'react';
import {
  Star,
  Search,
  MoreHorizontal,
  Share2,
  Moon,
  Sun,
  Trash2,
  Copy,
  Plus,
  Sidebar as SidebarIcon,
  Download,
} from 'lucide-react';
import { Page } from '../types';
import { pageToMarkdown, downloadFile } from '../utils/export';

interface NavbarProps {
  activePage: Page | null;
  breadcrumbs: { id: string; title: string; icon: string }[];
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSelectPage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeletePage: (id: string) => void;
  onDuplicatePage: (id: string) => void;
  onAddSubPage: (parentId: string) => void;
  onOpenSearch: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  breadcrumbs,
  isSidebarOpen,
  onToggleSidebar,
  onSelectPage,
  onToggleFavorite,
  onDeletePage,
  onDuplicatePage,
  onAddSubPage,
  onOpenSearch,
  darkMode,
  onToggleDarkMode,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  if (!activePage) return null;

  return (
    <header className="h-11 border-b border-gray-200/70 dark:border-gray-800/80 bg-white/80 dark:bg-notion-darkBg/80 backdrop-blur-md flex items-center justify-between px-3 select-none app-drag-region sticky top-0 z-30">
      {/* Left Breadcrumbs & Sidebar Toggle */}
      <div className="flex items-center gap-1.5 min-w-0 app-no-drag">
        {!isSidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="Open Sidebar"
          >
            <SidebarIcon className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 overflow-hidden">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.id}>
              {idx > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
              <button
                onClick={() => onSelectPage(crumb.id)}
                className={`flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 truncate transition-colors ${
                  idx === breadcrumbs.length - 1
                    ? 'font-medium text-gray-800 dark:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{crumb.icon}</span>
                <span className="truncate max-w-[140px]">{crumb.title || 'Untitled'}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-1 app-no-drag text-gray-500 dark:text-gray-400">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          title="Search (Cmd + K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-mono">⌘K</span>
        </button>

        <button
          onClick={onToggleDarkMode}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={() => onToggleFavorite(activePage.id)}
          className={`p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors ${
            activePage.isFavorite
              ? 'text-amber-500 fill-amber-500 hover:text-amber-600'
              : 'hover:text-gray-800 dark:hover:text-gray-200'
          }`}
          title={activePage.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Star className={`w-4 h-4 ${activePage.isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* More Actions Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMoreMenu(false)}
              />
              <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700/60 rounded-lg shadow-xl py-1 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    onAddSubPage(activePage.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Sub-page</span>
                </button>
                <button
                  onClick={() => {
                    onDuplicatePage(activePage.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate Page</span>
                </button>
                <button
                  onClick={() => {
                    const md = pageToMarkdown(activePage);
                    const filename = `${(activePage.title || 'untitled').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
                    downloadFile(md, filename, 'text/markdown');
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Export as Markdown (.md)</span>
                </button>
                <hr className="my-1 border-gray-100 dark:border-gray-800" />
                <button
                  onClick={() => {
                    onDeletePage(activePage.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Move to Trash</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
