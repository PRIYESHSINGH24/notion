import { Page } from '../types';

export const INITIAL_PAGES: Page[] = [
  {
    id: 'welcome-page',
    title: 'Getting Started with Notion',
    icon: '👋',
    coverImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    parentId: null,
    isFavorite: true,
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 3600000,
    blocks: [
      {
        type: 'heading',
        props: { level: 1 },
        content: 'Welcome to your Notion workspace!',
      },
      {
        type: 'paragraph',
        content: 'This is a real block-based editor powered by ProseMirror and TipTap. Select text to see the floating toolbar, or drag any block using the 6-dot handle on the left.',
      },
      {
        type: 'heading',
        props: { level: 2 },
        content: 'Interactive Checklist',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Type "/" anywhere on a line to open the Slash command menu',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Select any text to reveal the floating formatting toolbar (Bold, Italic, Color, Code)',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Hover on the left of any block to drag & drop or reorder it',
      },
      {
        type: 'checkListItem',
        props: { checked: false },
        content: 'Press Tab to indent a block, or Shift + Tab to outdent',
      },
      {
        type: 'checkListItem',
        props: { checked: false },
        content: 'Create a sub-page from the left sidebar using the "+" icon',
      },
      {
        type: 'heading',
        props: { level: 2 },
        content: 'Table / Database View',
      },
      {
        type: 'table',
        content: {
          type: 'tableContent',
          rows: [
            { cells: ['Feature', 'Status', 'Performance'] },
            { cells: ['ProseMirror Block Engine', 'Active', 'Native 60 FPS'] },
            { cells: ['Offline Storage', 'Enabled', '100% Local (0ms latency)'] },
            { cells: ['Floating Formatting Toolbar', 'Active', 'Rich Formatting'] },
          ],
        },
      },
      {
        type: 'heading',
        props: { level: 2 },
        content: 'Code Snippet',
      },
      {
        type: 'codeBlock',
        props: { language: 'javascript' },
        content: '// Pure native performance\nconst app = new NotionApp({\n  engine: "ProseMirror",\n  offline: true,\n  theme: "macOS"\n});',
      },
      {
        type: 'quote',
        content: 'Simplicity is prerequisite for reliability. — Edsger W. Dijkstra',
      },
      {
        type: 'divider',
      },
    ],
  },
  {
    id: 'roadmap-page',
    title: 'Product Roadmap 2026',
    icon: '🚀',
    coverImage: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
    parentId: null,
    isFavorite: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 7200000,
    blocks: [
      {
        type: 'heading',
        props: { level: 1 },
        content: 'Q1 - Strategic Roadmap',
      },
      {
        type: 'paragraph',
        content: 'Key deliverables and architectural goals for the desktop release:',
      },
      {
        type: 'bulletListItem',
        content: 'ProseMirror WYSIWYG block-based document model',
      },
      {
        type: 'bulletListItem',
        content: 'Offline local persistence with zero network requests',
      },
      {
        type: 'bulletListItem',
        content: 'Command + K instant omnibox search across all workspace pages',
      },
      {
        type: 'bulletListItem',
        content: 'Seamless macOS frameless window with native traffic lights',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Build pipeline and TypeScript verification',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Electron Mac bundle runtime validation',
      },
    ],
  },
  {
    id: 'meeting-notes-page',
    title: 'Weekly Standup Notes',
    icon: '📝',
    coverImage: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    parentId: null,
    isFavorite: false,
    createdAt: Date.now() - 43200000,
    updatedAt: Date.now() - 1800000,
    blocks: [
      {
        type: 'heading',
        props: { level: 2 },
        content: 'Agenda & Discussion Points',
      },
      {
        type: 'numberedListItem',
        content: 'Review Mac desktop frameless window and traffic light positioning',
      },
      {
        type: 'numberedListItem',
        content: 'Verify block drag-and-drop and floating toolbar styling',
      },
      {
        type: 'numberedListItem',
        content: 'Test full workspace JSON export and Markdown download',
      },
      {
        type: 'heading',
        props: { level: 3 },
        content: 'Action Items',
      },
      {
        type: 'checkListItem',
        props: { checked: true },
        content: 'Profile memory footprint on macOS',
      },
      {
        type: 'checkListItem',
        props: { checked: false },
        content: 'Verify dark mode contrast ratio',
      },
    ],
  },
];
