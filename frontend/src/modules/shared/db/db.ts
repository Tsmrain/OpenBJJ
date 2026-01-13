import Dexie, { Table } from 'dexie';

// Interfaces for Type Safety
export interface UserProfile {
  id?: number;
  warriorName: string;
  createdAt: Date;
}

export interface Progress {
  id?: number;
  techniqueId: string;
  status: 'locked' | 'learning' | 'mastered';
  lastPracticed: Date;
}

export interface Analysis {
  id?: number;
  createdAt: Date;
  videoBlob: Blob;
  thumbnailBlob?: Blob;
  feedback?: string;
  status: 'pending' | 'analyzed' | 'error';
}

class DigitalDojoDB extends Dexie {
  profile!: Table<UserProfile>;
  progress!: Table<Progress>;
  analyses!: Table<Analysis>;

  constructor() {
    super('DigitalDojoDB');
    // Version 1
    (this as any).version(1).stores({
      profile: '++id, warriorName',
      progress: '++id, techniqueId, status, lastPracticed'
    });

    // Version 2: Add analyses table
    (this as any).version(2).stores({
      analyses: '++id, createdAt, status'
    });
  }
}

export const db = new DigitalDojoDB();