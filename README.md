# Notion Mac Desktop App 🚀

A fast, offline-first Notion Desktop Clone for macOS built with **Electron**, **React**, **TypeScript**, and **Tailwind CSS**.

---

## ✨ Features

- **Mac Native Look & Feel:** Frameless window with macOS traffic lights (`titleBarStyle: 'hiddenInset'`), native drag regions, and custom Notion scrollbars.
- **Hierarchical Sidebar & Pages:**
  - Create root pages and nested sub-pages (`+` button).
  - Expand/collapse page hierarchy.
  - Favorites section (star/unstar pages).
  - Soft delete to Trash with one-click restore and permanent purge.
- **Block-Based Editor:**
  - Slash command menu (`/`) for inserting blocks.
  - Headings (H1, H2, H3), Bulleted lists, Numbered lists, To-do checkboxes, Code blocks with copy button, Quotes, Callout boxes, and Dividers.
  - Keyboard navigation (Enter to add block, Backspace on empty to delete or revert, arrow navigation).
- **Page Customization:**
  - Custom Cover Photos (banner image with change/remove).
  - Emoji Icon Picker (click any page icon to choose an emoji).
  - Large auto-expanding editable titles.
- **Instant Omnibox Search (`Cmd + K`):**
  - Search across all page titles and inner text content in real time.
- **Dark Mode Support:**
  - One-click toggle between Light and Dark mode with system preference auto-detection.
- **Local-First Auto-Save:**
  - Instant persistence to localStorage with sample starter pages.

---

## 🏃 How to Run

### Option 1: Launch Native macOS Desktop App
```bash
npm run app
```
*This compiles the bundle and immediately launches the standalone Electron desktop window on your Mac.*

### Option 2: Live Development Mode
```bash
npm run dev:electron
```
*Runs the Vite development server with Hot Module Replacement (HMR) and connects it directly to Electron.*

### Option 3: Run in Web Browser
```bash
npm run dev
```
*Open [http://localhost:5173](http://localhost:5173) in your web browser.*

---

## 📁 Project Structure

```text
├── electron/
│   ├── main.js         # Electron main process (macOS window config & lifecycle)
│   └── preload.js      # Secure IPC bridge
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx           # Page tree, favorites, trash, workspace switcher
│   │   ├── Navbar.tsx            # Breadcrumbs, dark mode, favorite star, actions
│   │   ├── Editor.tsx            # Document canvas, cover image, emoji picker
│   │   ├── BlockItem.tsx         # Individual block rendering & keyboard handlers
│   │   ├── SlashCommandMenu.tsx  # Floating '/' command popup
│   │   └── SearchModal.tsx       # 'Cmd + K' full-text search omnibox
│   ├── types/
│   │   └── index.ts              # Data contracts for Pages, Blocks, Commands
│   ├── utils/
│   │   ├── defaultData.ts        # Starter pages
│   │   └── storage.ts            # Persistence & auto-save manager
│   ├── App.tsx                   # Main state coordinator
│   ├── main.tsx                  # React entrypoint
│   └── index.css                 # Tailwind & macOS styling
├── package.json
├── tailwind.config.js
└── vite.config.ts
```
