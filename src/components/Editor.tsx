import React, { useState } from 'react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import { Image, Trash2, Calendar, Tag, Clock } from 'lucide-react';
import { Page } from '../types';

interface EditorProps {
  page: Page;
  darkMode: boolean;
  onUpdatePage: (updatedPage: Page) => void;
}

const OFFLINE_COVERS = [
  { name: 'Cosmic Indigo', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Warm Sunset', value: 'linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)' },
  { name: 'Forest Emerald', value: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: 'Midnight Ocean', value: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' },
  { name: 'Northern Aurora', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: 'Warm Amber', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
  { name: 'Deep Crimson', value: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' },
  { name: 'Minimal Slate', value: 'linear-gradient(135deg, #3a3d40 0%, #181719 100%)' },
];

const EMOJI_LIST = ['📄', '👋', '🚀', '📝', '💡', '🔥', '🎯', '⚡️', '✨', '📚', '🛠️', '💻', '🎨', '🌟', '📌', '☕️', '📈', '🧩'];

export const Editor: React.FC<EditorProps> = ({ page, darkMode, onUpdatePage }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  // Initialize the real BlockNote ProseMirror/TipTap editor
  const editor = useCreateBlockNote({
    initialContent: page.blocks && page.blocks.length > 0 ? (page.blocks as any) : undefined,
  });

  // Listen to block updates and auto-save
  React.useEffect(() => {
    if (!editor) return;
    const unsubscribe = editor.onChange(() => {
      onUpdatePage({
        ...page,
        blocks: editor.document as any,
        updatedAt: Date.now(),
      });
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [editor, page, onUpdatePage]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePage({
      ...page,
      title: e.target.value,
      updatedAt: Date.now(),
    });
  };

  const handleSelectCover = (coverValue: string) => {
    onUpdatePage({ ...page, coverImage: coverValue, updatedAt: Date.now() });
    setShowCoverPicker(false);
  };

  const handleAddDefaultCover = () => {
    const randomCover = OFFLINE_COVERS[Math.floor(Math.random() * OFFLINE_COVERS.length)].value;
    onUpdatePage({ ...page, coverImage: randomCover, updatedAt: Date.now() });
  };

  const handleRemoveCover = () => {
    onUpdatePage({ ...page, coverImage: undefined, updatedAt: Date.now() });
    setShowCoverPicker(false);
  };

  return (
    <div className="flex-1 h-screen overflow-y-auto bg-white dark:bg-notion-darkBg">
      {/* Cover Image Banner */}
      {page.coverImage && (
        <div className="group relative w-full h-44 sm:h-56 overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-inner">
          {page.coverImage.startsWith('linear-gradient') ? (
            <div
              style={{ background: page.coverImage }}
              className="w-full h-full transition-all duration-300"
            />
          ) : (
            <img
              src={page.coverImage}
              alt="Page cover"
              className="w-full h-full object-cover"
            />
          )}

          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-3 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md rounded-md px-2.5 py-1 text-xs text-white shadow-lg">
            <button
              onClick={() => setShowCoverPicker(!showCoverPicker)}
              className="hover:underline flex items-center gap-1 font-medium"
            >
              <Image className="w-3.5 h-3.5" />
              Change cover
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={handleRemoveCover}
              className="hover:text-red-300 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
          </div>

          {/* Cover Palette Dropdown */}
          {showCoverPicker && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCoverPicker(false)}
              />
              <div className="absolute right-4 bottom-12 z-50 p-3 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl w-64 animate-in fade-in zoom-in-95 duration-100">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Select Gradient Cover
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {OFFLINE_COVERS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectCover(c.value)}
                      title={c.name}
                      style={{ background: c.value }}
                      className="w-12 h-10 rounded-md shadow-sm border border-black/10 dark:border-white/10 hover:scale-105 active:scale-95 transition-transform"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Page Document Canvas */}
      <div className="max-w-4xl mx-auto px-8 sm:px-16 pt-8 pb-32">
        {/* Cover / Icon Action Header */}
        <div className="group relative mb-4">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 mb-2 text-xs text-gray-400">
            {!page.coverImage && (
              <button
                onClick={handleAddDefaultCover}
                className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200 px-1.5 py-0.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Image className="w-3.5 h-3.5" />
                Add cover
              </button>
            )}
          </div>

          {/* Page Emoji Icon */}
          <div className="relative inline-block mb-3">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-5xl sm:text-6xl hover:bg-black/5 dark:hover:bg-white/5 rounded-xl p-1 transition-transform active:scale-95 select-none"
              title="Change icon"
            >
              {page.icon || '📄'}
            </button>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowEmojiPicker(false)}
                />
                <div className="absolute top-full left-0 mt-2 p-2.5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 grid grid-cols-6 gap-1.5 w-60 animate-in fade-in zoom-in-95 duration-100">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onUpdatePage({ ...page, icon: emoji, updatedAt: Date.now() });
                        setShowEmojiPicker(false);
                      }}
                      className="text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Page Title */}
          <input
            type="text"
            value={page.title}
            onChange={handleTitleChange}
            placeholder="Untitled"
            className="w-full text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 bg-transparent border-0 outline-none p-0 focus:ring-0 leading-tight placeholder-gray-300 dark:placeholder-gray-600 mb-4"
          />

          {/* Notion Page Properties Bar */}
          <div className="border-b border-gray-100 dark:border-gray-800/80 pb-4 mb-6 space-y-2 text-xs">
            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 w-28">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated</span>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {new Date(page.updatedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center gap-6 text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5 w-28">
                <Tag className="w-3.5 h-3.5" />
                <span>Status</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium text-[11px]">
                In Progress
              </span>
            </div>
          </div>
        </div>

        {/* Real Notion-Style BlockNote Editor */}
        <div className="notion-blocknote-wrapper -ml-14">
          <BlockNoteView
            editor={editor}
            theme={darkMode ? 'dark' : 'light'}
          />
        </div>
      </div>
    </div>
  );
};
