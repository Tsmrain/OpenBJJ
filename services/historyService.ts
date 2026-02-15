import { openDB, DBSchema } from 'idb';
import { AnalysisResult } from "../types";

const DB_NAME = 'openbjj-db';
const STORE_NAME = 'analysis-store';

interface OpenBJJDB extends DBSchema {
  [STORE_NAME]: {
    key: string;
    value: AnalysisResult;
    indexes: { 'by-date': number };
  };
}

// Inicializar la base de datos
const dbPromise = openDB<OpenBJJDB>(DB_NAME, 1, {
  upgrade(db) {
    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    store.createIndex('by-date', 'timestamp');
  },
});

/**
 * Guarda el análisis usando IndexedDB.
 */
export const saveAnalysisToHistory = async (analysis: AnalysisResult) => {
  const timestamp = Date.now();
  const id = `local-${timestamp}`;
  const newItem = { ...analysis, timestamp, id };

  try {
    const db = await dbPromise;
    await db.put(STORE_NAME, newItem);
    console.log("Análisis guardado en IndexedDB:", id);
    return id;
  } catch (e) {
    console.error("Error guardando en IndexedDB", e);
    return null;
  }
};

/**
 * Obtiene el historial completo ordenado por fecha descendente.
 */
export const getAnalysisHistory = async (): Promise<AnalysisResult[]> => {
  try {
    const db = await dbPromise;
    const allItems = await db.getAllFromIndex(STORE_NAME, 'by-date');
    // IndexedDB devuelve en orden ascendente (más viejo primero), invertimos para mostrar lo más reciente.
    return allItems.reverse();
  } catch (e) {
    console.error("Error leyendo IndexedDB", e);
    return [];
  }
};

/**
 * Elimina un análisis específico del historial por su ID.
 */
export const deleteAnalysisFromHistory = async (id: string) => {
  try {
    const db = await dbPromise;
    await db.delete(STORE_NAME, id);
    return true;
  } catch (e) {
    console.error("Error eliminando de IndexedDB", e);
    return false;
  }
};