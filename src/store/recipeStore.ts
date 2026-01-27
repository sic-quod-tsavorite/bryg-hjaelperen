import { create } from 'zustand';

import {
  Opskrift,
  Malt,
  Humle,
  Gaer,
  AndreIngrediens,
  MaeskeTrin,
  LogIndlaeg,
} from '../types/recipe';

interface RecipeStore {
  opskrifter: Opskrift[];
  aktivOpskriftId: string | null;

  // Recipe CRUD
  tilfoejOpskrift: (
    opskrift: Omit<Opskrift, 'id' | 'oprettetDato' | 'sidstRettet'>
  ) => string;
  opdaterOpskrift: (id: string, opdatering: Partial<Opskrift>) => void;
  sletOpskrift: (id: string) => void;
  setAktivOpskrift: (id: string | null) => void;

  // Ingredient management
  tilfoejMalt: (opskriftId: string, malt: Omit<Malt, 'id'>) => void;
  fjernMalt: (opskriftId: string, maltId: string) => void;
  opdaterMalt: (
    opskriftId: string,
    maltId: string,
    opdatering: Partial<Malt>
  ) => void;

  tilfoejHumle: (opskriftId: string, humle: Omit<Humle, 'id'>) => void;
  fjernHumle: (opskriftId: string, humleId: string) => void;
  opdaterHumle: (
    opskriftId: string,
    humleId: string,
    opdatering: Partial<Humle>
  ) => void;

  tilfoejGaer: (opskriftId: string, gaer: Omit<Gaer, 'id'>) => void;
  fjernGaer: (opskriftId: string, gaerId: string) => void;

  tilfoejAndreIngrediens: (
    opskriftId: string,
    ingrediens: Omit<AndreIngrediens, 'id'>
  ) => void;
  fjernAndreIngrediens: (opskriftId: string, ingrediensId: string) => void;

  // Mash steps
  tilfoejMaeskeTrin: (opskriftId: string, trin: Omit<MaeskeTrin, 'id'>) => void;
  fjernMaeskeTrin: (opskriftId: string, trinId: string) => void;

  // Logging
  tilfoejLogIndlaeg: (
    opskriftId: string,
    indlaeg: Omit<LogIndlaeg, 'id' | 'dato'>
  ) => void;
  fjernLogIndlaeg: (opskriftId: string, indlaegId: string) => void;

  // Import/Export
  eksporterOpskrift: (id: string) => string;
  eksporterAlle: () => string;
  importerOpskrift: (json: string) => void;
  importerAlle: (json: string) => void;
}

const genererID = () => Math.random().toString(36).substring(2, 11);

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  opskrifter: [],
  aktivOpskriftId: null,

  tilfoejOpskrift: (opskrift) => {
    const id = genererID();
    const nu = new Date().toISOString();
    const nyOpskrift: Opskrift = {
      ...opskrift,
      id,
      oprettetDato: nu,
      sidstRettet: nu,
    };
    set((state) => ({
      opskrifter: [...state.opskrifter, nyOpskrift],
    }));
    return id;
  },

  opdaterOpskrift: (id, opdatering) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === id
          ? { ...o, ...opdatering, sidstRettet: new Date().toISOString() }
          : o
      ),
    }));
  },

  sletOpskrift: (id) => {
    set((state) => ({
      opskrifter: state.opskrifter.filter((o) => o.id !== id),
      aktivOpskriftId:
        state.aktivOpskriftId === id ? null : state.aktivOpskriftId,
    }));
  },

  setAktivOpskrift: (id) => {
    set({ aktivOpskriftId: id });
  },

  // Malt
  tilfoejMalt: (opskriftId, malt) => {
    const id = genererID();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              malte: [...o.malte, { ...malt, id }],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernMalt: (opskriftId, maltId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              malte: o.malte.filter((m) => m.id !== maltId),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  opdaterMalt: (opskriftId, maltId, opdatering) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              malte: o.malte.map((m) =>
                m.id === maltId ? { ...m, ...opdatering } : m
              ),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Humle
  tilfoejHumle: (opskriftId, humle) => {
    const id = genererID();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              humler: [...o.humler, { ...humle, id }],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernHumle: (opskriftId, humleId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              humler: o.humler.filter((h) => h.id !== humleId),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  opdaterHumle: (opskriftId, humleId, opdatering) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              humler: o.humler.map((h) =>
                h.id === humleId ? { ...h, ...opdatering } : h
              ),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Gær
  tilfoejGaer: (opskriftId, gaer) => {
    const id = genererID();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              gaer: [...o.gaer, { ...gaer, id }],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernGaer: (opskriftId, gaerId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              gaer: o.gaer.filter((g) => g.id !== gaerId),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Andre ingredienser
  tilfoejAndreIngrediens: (opskriftId, ingrediens) => {
    const id = genererID();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              andreIngredienser: [
                ...o.andreIngredienser,
                { ...ingrediens, id },
              ],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernAndreIngrediens: (opskriftId, ingrediensId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              andreIngredienser: o.andreIngredienser.filter(
                (i) => i.id !== ingrediensId
              ),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Mæsketrin
  tilfoejMaeskeTrin: (opskriftId, trin) => {
    const id = genererID();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              maeskeskema: [...o.maeskeskema, { ...trin, id }],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernMaeskeTrin: (opskriftId, trinId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              maeskeskema: o.maeskeskema.filter((t) => t.id !== trinId),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Log
  tilfoejLogIndlaeg: (opskriftId, indlaeg) => {
    const id = genererID();
    const dato = new Date().toISOString();
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              log: [...o.log, { ...indlaeg, id, dato }],
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  fjernLogIndlaeg: (opskriftId, indlaegId) => {
    set((state) => ({
      opskrifter: state.opskrifter.map((o) =>
        o.id === opskriftId
          ? {
              ...o,
              log: o.log.filter((l) => l.id !== indlaegId),
              sidstRettet: new Date().toISOString(),
            }
          : o
      ),
    }));
  },

  // Import/Export
  eksporterOpskrift: (id) => {
    const opskrift = get().opskrifter.find((o) => o.id === id);
    if (!opskrift) throw new Error('Opskrift ikke fundet');
    return JSON.stringify(opskrift, null, 2);
  },

  eksporterAlle: () => {
    return JSON.stringify(get().opskrifter, null, 2);
  },

  importerOpskrift: (json) => {
    const opskrift = JSON.parse(json) as Opskrift;
    // Generate new ID to avoid conflicts
    opskrift.id = genererID();
    opskrift.sidstRettet = new Date().toISOString();
    set((state) => ({
      opskrifter: [...state.opskrifter, opskrift],
    }));
  },

  importerAlle: (json) => {
    const opskrifter = JSON.parse(json) as Opskrift[];
    // Generate new IDs to avoid conflicts
    const nyeOpskrifter = opskrifter.map((o) => ({
      ...o,
      id: genererID(),
      sidstRettet: new Date().toISOString(),
    }));
    set((state) => ({
      opskrifter: [...state.opskrifter, ...nyeOpskrifter],
    }));
  },
}));
