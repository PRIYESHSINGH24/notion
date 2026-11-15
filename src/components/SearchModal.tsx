import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, ArrowRight, CornerDownLeft, X } from 'lucide-react';
import { Page } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  pages: Page[];
  onClose: () => void;
  onSelectPage: (id: string) => void;
}

function extractBlockText(block: any): string {
  if (!block || !block.content) return '';
  if (typeof block.content === 'string') return block.content;
  if (Array.isArray(block.content)) {
    return block.content.map((c: any) => (typeof c === 'string' ? c : c.text || '')).join(' ');
  }
  return '';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  pages,
  onClose,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter pages and find matching snippets
  const results = pages
    .filter((p) => !p.isTrash)
    .map((page) => {
      const q = query.toLowerCase().trim();
      const titleMatch = page.title.toLowerCase().includes(q);
      const matchingBlock = (page.blocks || []).find((b) => {
        const text = extractBlockText(b);
        return text.toLowerCase().includes(q);
      });
      const snippet = matchingBlock ? extractBlockText(matchingBlock) : '';
      return {
        page,
        isMatch: q === '' ? true : titleMatch || !!matchingBlock,
        snippet,
      };
    })
    .filter((r) => r.isMatch)
    .slice(0, 10);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectPage(results[selectedIndex].page.id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelectPage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-sm animate-in fade-in duration-100">
      <div
        className="relative w-full max-w-xl mx-4 bg-white dark:bg-[#202020] border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages or text across workspace..."
            className="w-full bg-transparent border-0 outline-none text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-400">
              No matching pages found for "{query}"
            </div>
          ) : (
            results.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.page.id}
                  onClick={() => {
                    onSelectPage(item.page.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-start justify-between px-4 py-2.5 mx-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0 pr-2">
                    <span className="text-lg flex-shrink-0 mt-0.5">
                      {item.page.icon || '📄'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate leading-tight">
                        {item.page.title || 'Untitled'}
                      </span>
                      {item.snippet && (
                        <span className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                          {item.snippet}
                        </span>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CornerDownLeft className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-1" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-100 dark:border-gray-800/80 text-[11px] text-gray-400">
          <span>Navigate with <kbd className="font-mono">↑</kbd> <kbd className="font-mono">↓</kbd></span>
          <span>Open with <kbd className="font-mono">↵</kbd></span>
        </div>
      </div>
    </div>
  );
};
