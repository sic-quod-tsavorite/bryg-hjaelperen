// Øltype (Beer style)
export type BeerStyle =
  | 'pilsner'
  | 'lager'
  | 'ale'
  | 'ipa'
  | 'stout'
  | 'porter'
  | 'wheat'
  | 'sour'
  | 'belgian'
  | 'other';

// Ingredienstyper (Ingredient types)
export interface Malt {
  id: string;
  navn: string; // name
  maengde: number; // amount in kg
  farve?: number; // color in EBC
}

export interface Humle {
  id: string;
  navn: string; // name
  maengde: number; // amount in grams
  alfaSyre?: number; // alpha acid %
  tilsaetTidspunkt: number; // addition time in minutes
  type: 'bitter' | 'aroma' | 'dryhopping';
}

export interface Gaer {
  id: string;
  navn: string; // name
  maengde?: number; // amount in grams
  type: 'toerret' | 'flydende'; // dry or liquid
}

export interface AndreIngrediens {
  id: string;
  navn: string;
  maengde: number;
  enhed: string; // unit
  tilsaetTidspunkt?: string; // when to add
}

// Brygtrin (Brewing steps)
export interface MaeskeTrin {
  id: string;
  temperatur: number; // temperature in °C
  varighed: number; // duration in minutes
  beskrivelse?: string; // description
}

// Log entry for brewing progress
export interface LogIndlaeg {
  id: string;
  dato: string; // ISO date string
  type: 'maeskning' | 'kogning' | 'gaering' | 'tapning' | 'note';
  titel: string;
  beskrivelse: string;
  maalinger?: {
    temperatur?: number;
    sg?: number; // specific gravity
    ph?: number;
  };
}

// Main recipe type
export interface Opskrift {
  id: string;
  navn: string; // recipe name
  stil: BeerStyle;
  beskrivelse?: string;

  // Target values
  batchStorrelse: number; // batch size in liters
  forventetOG: number; // expected original gravity
  forventetFG: number; // expected final gravity
  forventetABV: number; // expected alcohol %
  forventetIBU: number; // expected bitterness
  forventetFarve: number; // expected color in EBC

  // Ingredients
  malte: Malt[];
  humler: Humle[];
  gaer: Gaer[];
  andreIngredienser: AndreIngrediens[];

  // Process
  maeskeskema: MaeskeTrin[];
  kogetid: number; // boil time in minutes

  // Notes and logs
  noter?: string;
  log: LogIndlaeg[];

  // Metadata
  oprettetDato: string; // created date
  sidstRettet: string; // last modified
  status: 'kladde' | 'aktiv' | 'faerdig'; // draft, active, finished
}

// App state
export interface AppState {
  opskrifter: Opskrift[];
  aktivOpskriftId: string | null;
}
