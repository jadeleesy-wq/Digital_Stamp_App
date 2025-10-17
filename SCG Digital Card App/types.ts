// Fix: Import `ReactNode` type to resolve missing React namespace.
import type { ReactNode } from 'react';

export interface User {
  name: string;
  team: string;
}

export interface Participant extends User {
  stamps: number;
}

export interface Booth {
  id: number;
  name: string;
  secretCode: string;
  description: string;
  // Fix: Use imported `ReactNode` type directly.
  icon: ReactNode;
}

// Fix: Centralize AIStudio type definition and global window augmentation to prevent declaration conflicts.
export interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
