import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { BeerStyle } from '../types/ingredients';
import type {
  BrewingSession,
  SessionMalt,
  SessionHop,
  SessionMisc,
  SessionYeast,
  LogEntry,
} from '../types/session';
import { calculateOG, calculateIBU, calculateEBC } from '../utils/calculations';

// Helper to reorder array based on provided IDs
const reorderArray = <T extends { id: string }>(
  array: T[],
  orderedIds: string[]
): T[] => {
  const idToItem = new Map(array.map((item) => [item.id, item]));
  return orderedIds
    .map((id) => idToItem.get(id))
    .filter((item): item is T => item !== undefined);
};

const SESSION_STORAGE_KEY = 'bryg-current-session';

const genererID = () => Math.random().toString(36).substring(2, 11);

const createEmptySession = (): BrewingSession => {
  const nu = new Date().toISOString();
  return {
    id: genererID(),
    oprettetDato: nu,
    sidstRettet: nu,
    stil: null,
    volumeLiter: 20, // Default batch size
    malts: [],
    hops: [],
    misc: [],
    yeasts: [],
    beregnetOG: null,
    beregnetIBU: null,
    beregnetEBC: null,
    navn: '',
    beskrivelse: '',
    faktiskOG: null,
    faktiskFG: null,
    fotos: [],
    logIndlaeg: [],
    status: 'kladde',
  };
};

interface SessionStore {
  session: BrewingSession;

  // Session management
  resetSession: () => void;
  updateSession: (updates: Partial<BrewingSession>) => void;

  // Style & Volume
  setStil: (stil: BeerStyle | null) => void;
  setVolume: (liters: number) => void;

  // Malts
  addMalt: (malt: SessionMalt) => void;
  updateMalt: (id: string, updates: Partial<SessionMalt>) => void;
  removeMalt: (id: string) => void;

  // Hops
  addHop: (hop: SessionHop) => void;
  updateHop: (id: string, updates: Partial<SessionHop>) => void;
  removeHop: (id: string) => void;

  // Misc
  addMisc: (misc: SessionMisc) => void;
  updateMisc: (id: string, updates: Partial<SessionMisc>) => void;
  removeMisc: (id: string) => void;

  // Yeasts
  addYeast: (yeast: SessionYeast) => void;
  updateYeast: (id: string, updates: Partial<SessionYeast>) => void;
  removeYeast: (id: string) => void;

  // Log
  setNavn: (navn: string) => void;
  setBeskrivelse: (beskrivelse: string) => void;
  setFaktiskOG: (og: number | null) => void;
  setFaktiskFG: (fg: number | null) => void;
  addPhoto: (uri: string) => void;
  removePhoto: (uri: string) => void;
  addLogEntry: (entry: LogEntry) => void;
  updateLogEntry: (id: string, updates: Partial<LogEntry>) => void;
  removeLogEntry: (id: string) => void;
  reorderLogEntries: (orderedIds: string[]) => void;

  // Calculations
  recalculate: () => void;
}

// Helper to update timestamp and recalculate
const withUpdate = (
  session: BrewingSession,
  updates: Partial<BrewingSession>
): BrewingSession => {
  const updated = {
    ...session,
    ...updates,
    sidstRettet: new Date().toISOString(),
  };

  // Recalculate values
  updated.beregnetOG = calculateOG(updated.malts, updated.volumeLiter);
  updated.beregnetIBU = calculateIBU(
    updated.hops,
    updated.volumeLiter,
    updated.beregnetOG
  );
  updated.beregnetEBC = calculateEBC(updated.malts, updated.volumeLiter);

  return updated;
};

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      session: createEmptySession(),

      resetSession: () => {
        set({ session: createEmptySession() });
      },

      updateSession: (updates) => {
        set((state) => ({
          session: withUpdate(state.session, updates),
        }));
      },

      // Style & Volume
      setStil: (stil) => {
        set((state) => ({
          session: withUpdate(state.session, { stil }),
        }));
      },

      setVolume: (volumeLiter) => {
        set((state) => ({
          session: withUpdate(state.session, { volumeLiter }),
        }));
      },

      // Malts
      addMalt: (malt) => {
        set((state) => ({
          session: withUpdate(state.session, {
            malts: [...state.session.malts, malt],
          }),
        }));
      },

      updateMalt: (id, updates) => {
        set((state) => ({
          session: withUpdate(state.session, {
            malts: state.session.malts.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          }),
        }));
      },

      removeMalt: (id) => {
        set((state) => ({
          session: withUpdate(state.session, {
            malts: state.session.malts.filter((m) => m.id !== id),
          }),
        }));
      },

      // Hops
      addHop: (hop) => {
        set((state) => ({
          session: withUpdate(state.session, {
            hops: [...state.session.hops, hop],
          }),
        }));
      },

      updateHop: (id, updates) => {
        set((state) => ({
          session: withUpdate(state.session, {
            hops: state.session.hops.map((h) =>
              h.id === id ? { ...h, ...updates } : h
            ),
          }),
        }));
      },

      removeHop: (id) => {
        set((state) => ({
          session: withUpdate(state.session, {
            hops: state.session.hops.filter((h) => h.id !== id),
          }),
        }));
      },

      // Misc
      addMisc: (misc) => {
        set((state) => ({
          session: withUpdate(state.session, {
            misc: [...state.session.misc, misc],
          }),
        }));
      },

      updateMisc: (id, updates) => {
        set((state) => ({
          session: withUpdate(state.session, {
            misc: state.session.misc.map((m) =>
              m.id === id ? { ...m, ...updates } : m
            ),
          }),
        }));
      },

      removeMisc: (id) => {
        set((state) => ({
          session: withUpdate(state.session, {
            misc: state.session.misc.filter((m) => m.id !== id),
          }),
        }));
      },

      // Yeasts
      addYeast: (yeast) => {
        set((state) => ({
          session: withUpdate(state.session, {
            yeasts: [...state.session.yeasts, yeast],
          }),
        }));
      },

      updateYeast: (id, updates) => {
        set((state) => ({
          session: withUpdate(state.session, {
            yeasts: state.session.yeasts.map((y) =>
              y.id === id ? { ...y, ...updates } : y
            ),
          }),
        }));
      },

      removeYeast: (id) => {
        set((state) => ({
          session: withUpdate(state.session, {
            yeasts: state.session.yeasts.filter((y) => y.id !== id),
          }),
        }));
      },

      // Log tab
      setNavn: (navn) => {
        set((state) => ({
          session: withUpdate(state.session, { navn }),
        }));
      },

      setBeskrivelse: (beskrivelse) => {
        set((state) => ({
          session: withUpdate(state.session, { beskrivelse }),
        }));
      },

      setFaktiskOG: (faktiskOG) => {
        set((state) => ({
          session: withUpdate(state.session, { faktiskOG }),
        }));
      },

      setFaktiskFG: (faktiskFG) => {
        set((state) => ({
          session: withUpdate(state.session, { faktiskFG }),
        }));
      },

      addPhoto: (uri) => {
        set((state) => ({
          session: withUpdate(state.session, {
            fotos: [...state.session.fotos, uri],
          }),
        }));
      },

      removePhoto: (uri) => {
        set((state) => ({
          session: withUpdate(state.session, {
            fotos: state.session.fotos.filter((p) => p !== uri),
          }),
        }));
      },

      addLogEntry: (entry) => {
        set((state) => ({
          session: withUpdate(state.session, {
            logIndlaeg: [...state.session.logIndlaeg, entry],
          }),
        }));
      },

      updateLogEntry: (id: string, updates: Partial<LogEntry>) => {
        set((state) => ({
          session: withUpdate(state.session, {
            logIndlaeg: state.session.logIndlaeg.map((e) =>
              e.id === id ? { ...e, ...updates } : e
            ),
          }),
        }));
      },

      removeLogEntry: (id) => {
        set((state) => ({
          session: withUpdate(state.session, {
            logIndlaeg: state.session.logIndlaeg.filter((e) => e.id !== id),
          }),
        }));
      },

      reorderLogEntries: (orderedIds) => {
        set((state) => ({
          session: withUpdate(state.session, {
            logIndlaeg: reorderArray(state.session.logIndlaeg, orderedIds),
          }),
        }));
      },

      recalculate: () => {
        set((state) => ({
          session: withUpdate(state.session, {}),
        }));
      },
    }),
    {
      name: SESSION_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as {
          session: BrewingSession & {
            yeast?: (SessionYeast & { yeastId?: string | null }) | null;
          };
        };

        // Migration from version 0: convert yeast to yeasts array
        if (version === 0 && state.session) {
          const oldYeast = state.session.yeast;
          if (oldYeast && !state.session.yeasts) {
            // Ensure yeastId exists (null for old custom yeasts)
            const migratedYeast: SessionYeast = {
              ...oldYeast,
              yeastId: oldYeast.yeastId ?? null,
            };
            state.session.yeasts = [migratedYeast];
          } else if (!state.session.yeasts) {
            state.session.yeasts = [];
          }
          // Ensure all yeasts have yeastId
          state.session.yeasts = state.session.yeasts.map((y) => ({
            ...y,
            yeastId:
              (y as SessionYeast & { yeastId?: string | null }).yeastId ?? null,
          }));
          delete state.session.yeast;
        }

        return state as { session: BrewingSession };
      },
    }
  )
);
