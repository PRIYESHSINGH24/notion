import React, { useState, useRef } from 'react';
import {
  ChevronRight,
  Plus,
  Search,
  Settings,
  Trash2,
  FileText,
  Star,
  MoreHorizontal,
  Folder,
  RotateCcw,
  Sidebar as SidebarIcon,
  ChevronsLeft,
  Sparkles,
  Download,
  Upload,
  Database,
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  pages: Page[];
  activePageId: string;
  isOpen: boolean;
  onToggleSidebar: () => void;
  onSelectPage: (id: string) => void;
  onCreatePage: (parentId?: string | null) => void;
  onDeletePage: (id: string) => void;
  onRestorePage: (id: string) => void;
  onPermanentDeletePage: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenSearch: () => void;
  onExportBackup: () => void;
  onImportBackup: (pages: Page[]) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  pages,
  activePageId,
  isOpen,
  onToggleSidebar,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  onRestorePage,
  onPermanentDeletePage,
  onToggleFavorite,
  onOpenSearch,
  onExportBackup,
  onImportBackup,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({
    'welcome-page': true,
  });
  const [showTrash, setShowTrash] = useState(false);

  const toggleExpand = (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPages((prev) => ({
      ...prev,
      [pageId]: !prev[pageId],
    }));
  };

  const favoritePages = pages.filter((p) => p.isFavorite && !p.isTrash);
  const trashPages = pages.filter((p) => p.isTrash);
  const rootPages = pages.filter((p) => p.parentId === null && !p.isTrash);

  // Render recursive page tree
  const renderPageItem = (page: Page, level: number = 0) => {
    const childPages = pages.filter((p) => p.parentId === page.id && !p.isTrash);
    const hasChildren = childPages.length > 0;
    const isExpanded = !!expandedPages[page.id];
    const isActive = activePageId === page.id;

    return (
      <div key={page.id} className="select-none">
        <div
          onClick={() => onSelectPage(page.id)}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
          className={`group relative flex items-center justify-between pr-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
            isActive
              ? 'bg-black/[0.06] dark:bg-white/[0.08] font-medium text-gray-900 dark:text-gray-100'
              : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleExpand(page.id, e)}
                className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-transform text-gray-400"
              >
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            ) : (
              <span className="w-3.5" />
            )}
            <span className="text-sm flex-shrink-0">{page.icon || '📄'}</span>
            <span className="truncate">{page.title || 'Untitled'}</span>
          </div>

          {/* Hover Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreatePage(page.id);
                setExpandedPages((prev) => ({ ...prev, [page.id]: true }));
              }}
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              title="Add Sub-page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePage(page.id);
              }}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-400 hover:text-red-500"
              title="Delete Page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Child Pages Sub-tree */}
        {hasChildren && isExpanded && (
          <div className="flex flex-col">
            {childPages.map((child) => renderPageItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="w-60 flex-shrink-0 h-screen bg-[#f7f6f3] dark:bg-[#202020] border-r border-gray-200/80 dark:border-gray-800/80 flex flex-col justify-between select-none app-drag-region">
      {/* Top Section */}
      <div className="flex flex-col overflow-y-auto flex-1 app-no-drag">
        {/* macOS Traffic Lights Spacer */}
        <div className="h-10 w-full flex items-center justify-end px-3">
          <button
            onClick={onToggleSidebar}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="Collapse Sidebar"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Switcher */}
        <div className="px-3 pb-3">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                N
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                Personal Workspace
              </span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          </div>
        </div>

        {/* Quick Actions (Search, Settings & Backup, New Page) */}
        <div className="px-3 space-y-0.5 mb-3">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <span>Search</span>
            </div>
            <kbd className="text-[10px] font-mono text-gray-400">⌘K</kbd>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-gray-400" />
            <span>Settings & Backup</span>
          </button>

          <button
            onClick={() => onCreatePage(null)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-gray-400" />
            <span>New Page</span>
          </button>
        </div>

        {/* Favorites Section */}
        {favoritePages.length > 0 && (
          <div className="px-2 mb-3">
            <div className="px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Favorites
            </div>
            <div className="space-y-0.5">
              {favoritePages.map((page) => (
                <div
                  key={`fav-${page.id}`}
                  onClick={() => onSelectPage(page.id)}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                    activePageId === page.id
                      ? 'bg-black/[0.06] dark:bg-white/[0.08] font-medium text-gray-900 dark:text-gray-100'
                      : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span className="text-sm">{page.icon || '📄'}</span>
                  <span className="truncate">{page.title || 'Untitled'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pages Section */}
        <div className="px-2 mb-4">
          <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <span>Pages</span>
            <button
              onClick={() => onCreatePage(null)}
              className="p-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded"
              title="Add Page"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-0.5">
            {rootPages.map((page) => renderPageItem(page))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Trash Drawer */}
      <div className="p-3 border-t border-gray-200/80 dark:border-gray-800/80 app-no-drag">
        <button
          onClick={() => setShowTrash(!showTrash)}
          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
            showTrash
              ? 'bg-black/[0.06] dark:bg-white/[0.08] text-gray-900 dark:text-gray-100'
              : 'text-gray-500 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Trash</span>
          </div>
          {trashPages.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {trashPages.length}
            </span>
          )}
        </button>

        {/* Trash Drawer Popup */}
        {showTrash && (
          <div className="mt-2 p-2 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-xs max-h-48 overflow-y-auto">
            <div className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">
              Deleted Pages
            </div>
            {trashPages.length === 0 ? (
              <div className="text-center py-3 text-gray-400 text-xs">
                Trash is empty
              </div>
            ) : (
              <div className="space-y-1">
                {trashPages.map((page) => (
                  <div
                    key={page.id}
                    className="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <span className="truncate pr-2 text-gray-700 dark:text-gray-300">
                      {page.icon} {page.title || 'Untitled'}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => onRestorePage(page.id)}
                        className="p-1 hover:text-blue-500 text-gray-400"
                        title="Restore"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onPermanentDeletePage(page.id)}
                        className="p-1 hover:text-red-500 text-gray-400"
                        title="Delete Permanently"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings & Offline Backup Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-100">
          <div className="bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Settings & Offline Data
                </h3>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                <span>Storage Mode:</span>
                <span className="font-semibold">100% Offline (Local Machine)</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Data Backup & Migration
                </div>

                <button
                  onClick={() => {
                    onExportBackup();
                    setShowSettings(false);
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-blue-500" />
                    <span>Export Workspace Backup (.json)</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Save to disk</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium text-gray-800 dark:text-gray-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span>Restore / Import Backup (.json)</span>
                  </div>
                  <span className="text-[11px] text-gray-400">Load file</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const parsed = JSON.parse(event.target?.result as string);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          onImportBackup(parsed);
                          setShowSettings(false);
                        } else {
                          alert('Invalid backup file format');
                        }
                      } catch {
                        alert('Failed to parse JSON backup file');
                      }
                    };
                    reader.readAsText(file);
                  }}
                />
              </div>

              <div className="pt-2 text-[11px] text-gray-400">
                Total Pages: {pages.filter((p) => !p.isTrash).length} | In Trash: {pages.filter((p) => p.isTrash).length}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
