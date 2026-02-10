import { writable } from 'svelte/store';

export interface PaperSettings {
  size: 'A4'; // For now just A4
  width: number; // mm
  height: number; // mm
  margins: { top: number; right: number; bottom: number; left: number }; // mm
  gridEnabled: boolean;
  orientation: 'p' | 'l'; // 'p' = portrait, 'l' = landscape
}

export interface Standee {
  id: string;
  imageSrc: string; // Data URL or Blob URL
  originalWidth: number;
  originalHeight: number;
  height: number; // Desired height in mm
  imageMargin: number; // mm
  feetMargin: number; // mm
  quantity: number;
  tokenSettings?: {
    mode: 'numeric' | 'alphabetic';
    startValue: string; // "1" or "A"
  };
  rulerEnabled?: boolean;
  rulerOffset?: number; // mm from left edge of standee wrapper
  instances: StandeeInstance[];
}

export interface StandeeInstance {
  id: string;
  x: number; // mm from left
  y: number; // mm from top
  token?: Token;
}

export interface Token {
  enabled: boolean;
  text: string;
  size: 'small' | 'medium' | 'large';
  bgColor: string;
  textColor: string;
  position: { x: number; y: number }; // relative to standee center?
}

export interface UIState {
  activeTab: 'setup' | 'images' | 'controls' | 'export';
  selectedStandeeId: string | null;
  zoomLevel: number; // 1 = 100%
}

// Initial Settings
const initialPaperSettings: PaperSettings = {
  size: 'A4',
  width: 210,
  height: 297,
  margins: { top: 3, right: 3, bottom: 3, left: 3 },
  gridEnabled: true,
  orientation: 'p',
};

const initialUIState: UIState = {
  activeTab: 'setup',
  selectedStandeeId: null,
  zoomLevel: 1,
};

// Persistence Keys
const STORAGE_KEY_PAPER = 'standeeApp_paperSettings';
const STORAGE_KEY_STANDEES = 'standeeApp_standees';

// Load from Storage or use Initial
const storedPaper = localStorage.getItem(STORAGE_KEY_PAPER);
const storedStandees = localStorage.getItem(STORAGE_KEY_STANDEES);

const startPaperSettings: PaperSettings = storedPaper
  ? (() => {
      const parsed = JSON.parse(storedPaper);
      // Migration: ensure orientation is set if missing
      if (!parsed.orientation) {
        parsed.orientation = parsed.width > parsed.height ? 'l' : 'p';
      }
      return parsed;
    })()
  : initialPaperSettings;
const startStandees: Standee[] = storedStandees ? JSON.parse(storedStandees) : [];

export const paperSettings = writable<PaperSettings>(startPaperSettings);
export const standees = writable<Standee[]>(startStandees);
export const uiState = writable<UIState>(initialUIState);

// Subscribe to save changes
paperSettings.subscribe((val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PAPER, JSON.stringify(val));
  }
});

standees.subscribe((val) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_STANDEES, JSON.stringify(val));
  }
});
