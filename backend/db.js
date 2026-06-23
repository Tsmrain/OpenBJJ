import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.resolve('backend/data');

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readTable(tableName) {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    console.error(`Error reading table ${tableName}:`, err);
    return [];
  }
}

async function writeTable(tableName, data) {
  await ensureDir();
  const filePath = path.join(DATA_DIR, `${tableName}.json`);
  const tempPath = `${filePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tempPath, filePath);
}

export const DB = {
  // --- SOURCES ---
  sources: {
    getAll: async () => {
      return await readTable('sources');
    },
    getValidated: async () => {
      const all = await readTable('sources');
      return all.filter(s => s.validated);
    },
    save: async (source) => {
      const all = await readTable('sources');
      const idx = all.findIndex(s => s.id === source.id);
      if (idx !== -1) {
        all[idx] = source;
      } else {
        all.push(source);
      }
      await writeTable('sources', all);
      return source.id;
    },
    delete: async (id) => {
      const all = await readTable('sources');
      const filtered = all.filter(s => s.id !== id);
      await writeTable('sources', filtered);
      return true;
    }
  },

  // --- PROGRESS ---
  progress: {
    getAll: async () => {
      return await readTable('progress');
    },
    get: async (techniqueName) => {
      const all = await readTable('progress');
      return all.find(p => p.techniqueName === techniqueName);
    },
    save: async (progressItem) => {
      const all = await readTable('progress');
      const idx = all.findIndex(p => p.techniqueName === progressItem.techniqueName);
      if (idx !== -1) {
        all[idx] = progressItem;
      } else {
        all.push(progressItem);
      }
      await writeTable('progress', all);
      return progressItem.techniqueName;
    }
  },

  // --- LOGS ---
  logs: {
    getAll: async () => {
      return await readTable('logs');
    },
    add: async (log) => {
      const all = await readTable('logs');
      const id = `log-${Date.now()}`;
      const fullLog = {
        ...log,
        id,
        timestamp: Date.now()
      };
      all.push(fullLog);
      await writeTable('logs', all);
      return id;
    }
  },

  // --- HISTORY ---
  history: {
    getAll: async () => {
      return await readTable('history');
    },
    save: async (historyItem) => {
      const all = await readTable('history');
      const timestamp = Date.now();
      const id = historyItem.id || `local-${timestamp}`;
      const newItem = {
        ...historyItem,
        id,
        timestamp: historyItem.timestamp || timestamp
      };
      const idx = all.findIndex(h => h.id === id);
      if (idx !== -1) {
        all[idx] = newItem;
      } else {
        all.push(newItem);
      }
      await writeTable('history', all);
      return id;
    },
    delete: async (id) => {
      const all = await readTable('history');
      const filtered = all.filter(h => h.id !== id);
      await writeTable('history', filtered);
      return true;
    }
  },

  // --- CLEAR ALL TABLES ---
  clearAll: async () => {
    await writeTable('sources', []);
    await writeTable('progress', []);
    await writeTable('logs', []);
    await writeTable('history', []);
  }
};
