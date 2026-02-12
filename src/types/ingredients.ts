// Predefined ingredient types from JSON data files

export type MaltType = 'base' | 'crystal' | 'roasted' | 'specialty' | 'smoked';

export interface PredefinedMalt {
  id: string;
  navn: string;
  ebc: number;
  // Extended info for ingredient detail page
  type?: MaltType;
  beskrivelse?: string;
  smag?: string;
  oeltyper?: string[];
  brugstips?: string;
  diastatiskKraft?: string;
  udvinding?: string;
}

export interface PredefinedHop {
  id: string;
  navn: string;
  alfaSyre: number;
  // Extended info for ingredient detail page
  type?: string;
  beskrivelse?: string;
  aroma?: string;
  oeltyper?: string[];
  alfaSyreRange?: number[]; // [min, max] typical range for this hop
}

export type MiscKategori =
  | 'klaring'
  | 'sukker'
  | 'krydderi'
  | 'gæring'
  | 'modning';
export type MiscTilsaetning = 'kog' | 'eftergaering' | 'maeskning';

export type YeastType = 'overgaeret' | 'undergaeret';

export interface PredefinedYeast {
  id: string;
  navn: string;
  producent: string;
  type: YeastType;
  tempMin: number;
  tempMax: number;
  attenuering: number; // Typical attenuation percentage
  // Extended info for ingredient detail page
  beskrivelse?: string;
  smagsprofil?: string;
  esterprofil?: string;
  flokkulering?: 'lav' | 'medium' | 'høj';
  gaeringsHastighed?: 'hurtig' | 'medium' | 'langsom';
  alkoholTolerance?: string;
  oprindelse?: string;
  pitchingRate?: string;
  rehydrering?: string;
  oeltyper?: string[];
  alternativer?: string[];
  noter?: string;
}

export interface MiscBrugMetode {
  titel: string;
  beskrivelse: string;
}

export interface PredefinedMisc {
  id: string;
  navn: string;
  kategori: MiscKategori;
  standardMaengde: number;
  enhed: string;
  tilsaetning: MiscTilsaetning;
  tidspunkt?: number; // Minutes before end of boil (for 'kog' items)
  beskrivelse: string;
  // Extended info for ingredient detail page
  brug?: MiscBrugMetode[]; // Different ways to use this ingredient
  oeltyper?: string[]; // Ideal beer types
  fordele?: string[]; // Key benefits
}

// Beer style definitions
export type BeerStyle =
  | 'pilsner'
  | 'lager'
  | 'pale-ale'
  | 'ipa'
  | 'neipa'
  | 'stout'
  | 'porter'
  | 'wheat'
  | 'witbier'
  | 'saison'
  | 'belgian'
  | 'brown-ale'
  | 'red-ale'
  | 'barleywine'
  | 'sour'
  | 'other';

export interface BeerStyleInfo {
  id: BeerStyle;
  navn: string;
  beskrivelse: string;
  typiskOG: [number, number]; // Min/max range
  typiskFG: [number, number];
  typiskIBU: [number, number];
  typiskEBC: [number, number];
}

export const BEER_STYLES: BeerStyleInfo[] = [
  {
    id: 'pilsner',
    navn: 'Pilsner',
    beskrivelse: 'Lys, sprød og humlefrisk',
    typiskOG: [1.044, 1.052],
    typiskFG: [1.008, 1.014],
    typiskIBU: [25, 45],
    typiskEBC: [4, 10],
  },
  {
    id: 'lager',
    navn: 'Lager',
    beskrivelse: 'Klar, ren og let drikkelig',
    typiskOG: [1.04, 1.05],
    typiskFG: [1.006, 1.012],
    typiskIBU: [8, 25],
    typiskEBC: [4, 14],
  },
  {
    id: 'pale-ale',
    navn: 'Pale Ale',
    beskrivelse: 'Balanceret, maltrig og humlet',
    typiskOG: [1.044, 1.06],
    typiskFG: [1.008, 1.016],
    typiskIBU: [25, 50],
    typiskEBC: [10, 28],
  },
  {
    id: 'ipa',
    navn: 'IPA',
    beskrivelse: 'Humletung med citrus og harpiks',
    typiskOG: [1.056, 1.075],
    typiskFG: [1.008, 1.018],
    typiskIBU: [40, 70],
    typiskEBC: [12, 28],
  },
  {
    id: 'neipa',
    navn: 'NEIPA',
    beskrivelse: 'Uklar, saftig og tropisk',
    typiskOG: [1.06, 1.08],
    typiskFG: [1.012, 1.02],
    typiskIBU: [25, 50],
    typiskEBC: [8, 20],
  },
  {
    id: 'stout',
    navn: 'Stout',
    beskrivelse: 'Mørk, ristet og cremet',
    typiskOG: [1.036, 1.075],
    typiskFG: [1.008, 1.02],
    typiskIBU: [25, 50],
    typiskEBC: [60, 120],
  },
  {
    id: 'porter',
    navn: 'Porter',
    beskrivelse: 'Mørkebrun med chokolade og kaffe',
    typiskOG: [1.04, 1.065],
    typiskFG: [1.008, 1.016],
    typiskIBU: [18, 35],
    typiskEBC: [40, 70],
  },
  {
    id: 'wheat',
    navn: 'Hvedeøl',
    beskrivelse: 'Let og forfriskende med hvedekarakter',
    typiskOG: [1.044, 1.056],
    typiskFG: [1.008, 1.016],
    typiskIBU: [8, 20],
    typiskEBC: [6, 18],
  },
  {
    id: 'witbier',
    navn: 'Witbier',
    beskrivelse: 'Belgisk hvede med appelsin og koriander',
    typiskOG: [1.044, 1.052],
    typiskFG: [1.008, 1.012],
    typiskIBU: [10, 20],
    typiskEBC: [4, 10],
  },
  {
    id: 'saison',
    navn: 'Saison',
    beskrivelse: 'Krydret, frugtig og tør',
    typiskOG: [1.048, 1.065],
    typiskFG: [1.002, 1.01],
    typiskIBU: [20, 35],
    typiskEBC: [8, 28],
  },
  {
    id: 'belgian',
    navn: 'Belgisk Ale',
    beskrivelse: 'Kompleks med esterkarakter',
    typiskOG: [1.044, 1.08],
    typiskFG: [1.008, 1.016],
    typiskIBU: [15, 35],
    typiskEBC: [8, 40],
  },
  {
    id: 'brown-ale',
    navn: 'Brown Ale',
    beskrivelse: 'Nøddeagtig og karamellet',
    typiskOG: [1.04, 1.052],
    typiskFG: [1.008, 1.014],
    typiskIBU: [15, 30],
    typiskEBC: [30, 50],
  },
  {
    id: 'red-ale',
    navn: 'Red Ale',
    beskrivelse: 'Maltrig med karamel og let ristet',
    typiskOG: [1.044, 1.06],
    typiskFG: [1.01, 1.016],
    typiskIBU: [20, 40],
    typiskEBC: [20, 40],
  },
  {
    id: 'barleywine',
    navn: 'Barleywine',
    beskrivelse: 'Kraftig og kompleks med høj alkohol',
    typiskOG: [1.08, 1.12],
    typiskFG: [1.016, 1.03],
    typiskIBU: [35, 100],
    typiskEBC: [16, 60],
  },
  {
    id: 'sour',
    navn: 'Sur Øl',
    beskrivelse: 'Syrlig og kompleks',
    typiskOG: [1.03, 1.06],
    typiskFG: [1.002, 1.012],
    typiskIBU: [3, 15],
    typiskEBC: [6, 40],
  },
  {
    id: 'other',
    navn: 'Anden',
    beskrivelse: 'Egen stil eller eksperiment',
    typiskOG: [1.03, 1.12],
    typiskFG: [1.002, 1.03],
    typiskIBU: [0, 100],
    typiskEBC: [2, 1400],
  },
];
