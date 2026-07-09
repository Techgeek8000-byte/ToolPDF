'use client';

const STORAGE_KEY = 'toolpdf-tool-usage';
const RECENT_KEY = 'toolpdf-recent-tools';

interface DailyRecord {
  date: string;
  count: number;
}

interface ToolUsageStore {
  [toolId: string]: DailyRecord;
}

interface RecentTool {
  id: string;
  name: string;
  timestamp: number;
}

function getToday(): string {
  return new Date().toDateString();
}

function getStore(): ToolUsageStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: ToolUsageStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function getRecentTools(): RecentTool[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentTools(tools: RecentTool[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(RECENT_KEY, JSON.stringify(tools));
}

/**
 * Increment usage count for a specific PDF tool.
 * Call this when a PDF operation completes successfully.
 */
export function incrementUsage(toolId: string, toolName: string): number {
  const store = getStore();
  const today = getToday();
  const existing = store[toolId];

  if (existing && existing.date === today) {
    existing.count += 1;
  } else {
    store[toolId] = { date: today, count: 1 };
  }

  saveStore(store);

  // Track recently used tools
  const recent = getRecentTools();
  const filtered = recent.filter((t) => t.id !== toolId);
  filtered.unshift({ id: toolId, name: toolName, timestamp: Date.now() });
  // Keep only last 5
  saveRecentTools(filtered.slice(0, 5));

  return store[toolId].count;
}

/**
 * Get total PDFs processed today across all tools.
 */
export function getTodayTotal(): number {
  const store = getStore();
  const today = getToday();
  let total = 0;
  for (const key of Object.keys(store)) {
    if (store[key].date === today) {
      total += store[key].count;
    }
  }
  return total;
}

/**
 * Get usage count for a specific tool today.
 */
export function getToolUsageToday(toolId: string): number {
  const store = getStore();
  const today = getToday();
  const record = store[toolId];
  if (record && record.date === today) return record.count;
  return 0;
}

/**
 * Get the list of recently used tools (last 5).
 */
export function getRecentToolsList(): RecentTool[] {
  return getRecentTools();
}

/**
 * Clear all usage data.
 */
export function clearUsage(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(RECENT_KEY);
}
