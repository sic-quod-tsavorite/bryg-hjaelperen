import type { BeerStyle, MiscTilsaetning } from './ingredients';

// Session ingredient types - include additional user-entered data

export interface SessionMalt {
  id: string;
  maltId: string | null; // Reference to predefined malt, null if custom
  navn: string;
  maengde: number; // In grams
  ebc: number;
}

export type HopType = 'bitter' | 'aroma' | 'dryhopping';

export interface SessionHop {
  id: string;
  hopId: string | null; // Reference to predefined hop, null if custom
  navn: string;
  maengde: number; // In grams
  alfaSyre: number; // Percentage
  kogeTid: number; // Boil time in minutes (0 for flameout/whirlpool)
  type: HopType;
}

export interface SessionMisc {
  id: string;
  miscId: string | null; // Reference to predefined misc, null if custom
  navn: string;
  maengde: number;
  enhed: string;
  tilsaetning: MiscTilsaetning;
  tidspunkt?: number; // Minutes for boil additions
}

export type YeastType = 'overgaeret' | 'undergaeret'; // Top-fermenting / Bottom-fermenting

export interface SessionYeast {
  id: string;
  yeastId: string | null; // Reference to predefined yeast, null if custom
  navn: string;
  type: YeastType;
  pakker: number; // Number of packages/pitches
  temperatur?: number; // Fermentation temperature in Celsius
}

export type LogEntryType =
  | 'maeskning'
  | 'kogning'
  | 'gaering'
  | 'torhumling'
  | 'flaskning'
  | 'smagning'
  | 'andet';

export interface LogEntry {
  id: string;
  dato: string; // ISO date string
  type: LogEntryType;
  titel: string;
  beskrivelse: string;
  maalinger?: {
    temperatur?: number;
    sg?: number;
    ph?: number;
  };
  order?: number; // Optional ordering field, defaults to timestamp-based
  visDato?: boolean; // Whether date was explicitly selected by user
  visTid?: boolean; // Whether time was explicitly selected by user
}

export interface BrewingSession {
  id: string;
  oprettetDato: string;
  sidstRettet: string;

  // Setup tab data
  stil: BeerStyle | null;
  volumeLiter: number; // Batch volume in liters
  malts: SessionMalt[];
  hops: SessionHop[];
  misc: SessionMisc[];
  yeasts: SessionYeast[];

  // Calculated values (stored for display, recalculated on changes)
  beregnetOG: number | null;
  beregnetIBU: number | null;
  beregnetEBC: number | null;

  // Log tab data
  navn: string;
  beskrivelse: string;
  faktiskOG: number | null; // Actual measured OG
  faktiskFG: number | null; // Actual measured FG
  fotos: string[]; // Array of image URIs
  logIndlaeg: LogEntry[];

  // Status
  status: 'kladde' | 'aktiv' | 'faerdig';
}

// Helper type for session store actions
export type SessionUpdater = (session: BrewingSession) => BrewingSession;
