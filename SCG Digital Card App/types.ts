
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
