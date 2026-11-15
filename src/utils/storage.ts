import { Page } from '../types';
import { INITIAL_PAGES } from './defaultData';

const STORAGE_KEY = 'notion_clone_pages_v2';
const ACTIVE_PAGE_KEY = 'notion_clone_active_page_v2';

export function loadPages(): Page[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      savePages(INITIAL_PAGES);
      return INITIAL_PAGES;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PAGES;
  } catch (e) {
    console.error('Failed to load pages from storage', e);
    return INITIAL_PAGES;
  }
}

export function savePages(pages: Page[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch (e) {
    console.error('Failed to save pages to storage', e);
  }
}

export function loadActivePageId(pages: Page[]): string {
  try {
    const saved = localStorage.getItem(ACTIVE_PAGE_KEY);
    if (saved && pages.some((p) => p.id === saved && !p.isTrash)) {
      return saved;
    }
    const firstNonTrash = pages.find((p) => !p.isTrash);
    return firstNonTrash ? firstNonTrash.id : pages[0]?.id || '';
  } catch {
    return pages[0]?.id || '';
  }
}

export function saveActivePageId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_PAGE_KEY, id);
  } catch (e) {
    console.error('Failed to save active page id', e);
  }
}
