import type { SessionMalt, SessionHop } from '../types/session';

// Brewing calculation constants
const MALT_EXTRACT_POTENTIAL = 0.00038; // Approximate SG points per gram per liter for average malt
const MASH_EFFICIENCY = 0.72; // 72% default mash efficiency

/**
 * Calculate Original Gravity from malts and volume
 * Uses a simplified extract potential formula
 */
export function calculateOG(
  malts: SessionMalt[],
  volumeLiter: number,
  efficiency: number = MASH_EFFICIENCY
): number {
  if (volumeLiter <= 0 || malts.length === 0) {
    return 1.0;
  }

  // Total extract points from all malts
  const totalExtract = malts.reduce((sum, malt) => {
    return sum + malt.maengde * MALT_EXTRACT_POTENTIAL * efficiency;
  }, 0);

  // OG = 1 + (extract points / volume)
  const og = 1 + totalExtract / volumeLiter;

  return Math.round(og * 1000) / 1000; // Round to 3 decimal places
}

/**
 * Calculate percentage of each malt in the grain bill
 */
export function calculateMaltPercentages(
  malts: SessionMalt[]
): Map<string, number> {
  const percentages = new Map<string, number>();

  const totalWeight = malts.reduce((sum, malt) => sum + malt.maengde, 0);

  if (totalWeight === 0) {
    return percentages;
  }

  malts.forEach((malt) => {
    const percentage = (malt.maengde / totalWeight) * 100;
    percentages.set(malt.id, Math.round(percentage * 10) / 10);
  });

  return percentages;
}

/**
 * Calculate Malt Color Units (MCU)
 * MCU = (weight_lbs × color_lovibond) / volume_gallons
 * We convert from metric: grams/EBC/liters
 */
export function calculateMCU(
  malts: SessionMalt[],
  volumeLiter: number
): number {
  if (volumeLiter <= 0) {
    return 0;
  }

  // Convert liters to gallons
  const volumeGallons = volumeLiter * 0.264172;

  const mcu = malts.reduce((sum, malt) => {
    // Convert grams to pounds
    const weightLbs = malt.maengde * 0.00220462;
    // Convert EBC to Lovibond: Lovibond ≈ (EBC + 0.76) / 1.3546
    const lovibond = (malt.ebc + 0.76) / 1.3546;

    return sum + (weightLbs * lovibond) / volumeGallons;
  }, 0);

  return Math.round(mcu * 10) / 10;
}

/**
 * Calculate beer color in EBC using Morey equation
 * SRM = 1.4922 × MCU^0.6859
 * EBC = SRM × 1.97
 */
export function calculateEBC(
  malts: SessionMalt[],
  volumeLiter: number
): number {
  const mcu = calculateMCU(malts, volumeLiter);

  if (mcu === 0) {
    return 0;
  }

  // Morey equation for SRM
  const srm = 1.4922 * Math.pow(mcu, 0.6859);
  // Convert to EBC
  const ebc = srm * 1.97;

  return Math.round(ebc);
}

/**
 * Calculate IBU contribution for a single hop addition using Tinseth formula
 *
 * IBU = (mg/L alpha acids) × utilization
 * Utilization depends on boil time and wort gravity
 */
export function calculateHopIBUContribution(
  hop: SessionHop,
  volumeLiter: number,
  boilGravity: number
): number {
  if (volumeLiter <= 0 || hop.maengde <= 0) {
    return 0;
  }

  // Dry hopping and late additions contribute minimal IBU
  if (hop.type === 'dryhopping') {
    return 0;
  }

  // Alpha acid in decimal form
  const alphaDecimal = hop.alfaSyre / 100;

  // Bigness factor (accounts for gravity)
  const bignessFactor = 1.65 * Math.pow(0.000125, boilGravity - 1);

  // Boil time factor
  const boilTimeFactor = (1 - Math.exp(-0.04 * hop.kogeTid)) / 4.15;

  // Utilization
  const utilization = bignessFactor * boilTimeFactor;

  // IBU = (alpha acids mg/L) × utilization
  // mg/L = (grams × 1000) / liters × alpha%
  const mgPerL = (hop.maengde * 1000 * alphaDecimal) / volumeLiter;
  const ibu = mgPerL * utilization;

  return Math.round(ibu * 10) / 10;
}

/**
 * Calculate total IBU from all hop additions
 */
export function calculateIBU(
  hops: SessionHop[],
  volumeLiter: number,
  og: number
): number {
  // Use a slightly lower gravity for boil (pre-boil gravity)
  // Assuming ~10% volume reduction during boil
  const boilGravity = 1 + (og - 1) * 0.9;

  const totalIBU = hops.reduce((sum, hop) => {
    return sum + calculateHopIBUContribution(hop, volumeLiter, boilGravity);
  }, 0);

  return Math.round(totalIBU);
}

/**
 * Calculate ABV from Original Gravity and Final Gravity
 * Standard formula: ABV = (OG - FG) × 131.25
 */
export function calculateABV(og: number, fg: number): number {
  if (og <= 1 || fg <= 1 || fg >= og) {
    return 0;
  }

  const abv = (og - fg) * 131.25;
  return Math.round(abv * 10) / 10;
}

/**
 * Calculate apparent attenuation percentage
 * Shows how much of the sugars were fermented
 */
export function calculateAttenuation(og: number, fg: number): number {
  if (og <= 1 || fg <= 1) {
    return 0;
  }

  const ogPoints = (og - 1) * 1000;
  const fgPoints = (fg - 1) * 1000;

  if (ogPoints === 0) {
    return 0;
  }

  const attenuation = ((ogPoints - fgPoints) / ogPoints) * 100;
  return Math.round(attenuation);
}

/**
 * Estimate Final Gravity based on OG and expected attenuation
 * Typical attenuation ranges from 65-85%
 */
export function estimateFG(
  og: number,
  attenuationPercent: number = 75
): number {
  const ogPoints = (og - 1) * 1000;
  const fgPoints = ogPoints * (1 - attenuationPercent / 100);
  const fg = 1 + fgPoints / 1000;

  return Math.round(fg * 1000) / 1000;
}

/**
 * Convert gravity to Plato
 * Plato = (OG - 1) × 1000 / 4 (approximate)
 * More accurate: Plato = -668.962 + 1262.45×SG - 776.43×SG² + 182.94×SG³
 */
export function gravityToPlato(sg: number): number {
  if (sg <= 1) {
    return 0;
  }

  const plato =
    -668.962 +
    1262.45 * sg -
    776.43 * Math.pow(sg, 2) +
    182.94 * Math.pow(sg, 3);

  return Math.round(plato * 10) / 10;
}

/**
 * Convert Plato to gravity
 */
export function platoToGravity(plato: number): number {
  if (plato <= 0) {
    return 1.0;
  }

  // Simplified conversion: SG = 1 + (Plato / (258.6 - 0.88×Plato × 227.1))
  const sg = 1 + plato / (258.6 - 0.88 * plato + 227.1);

  return Math.round(sg * 1000) / 1000;
}

/**
 * Get perceived bitterness description in Danish based on BU:GU ratio
 * BU:GU = IBU / ((OG - 1) × 1000)
 */
export function getBitternessDescription(ibu: number, og: number): string {
  const gravityUnits = (og - 1) * 1000;
  if (ibu <= 0 || gravityUnits <= 0) return '';

  const ratio = ibu / gravityUnits;

  if (ratio < 0.3) return 'Meget maltrig';
  if (ratio < 0.5) return 'Maltbalanceret';
  if (ratio < 0.7) return 'Balanceret';
  if (ratio < 0.9) return 'Humlebalanceret';
  return 'Meget bitter';
}

/**
 * Get color description in Danish based on EBC value
 */
export function getColorDescription(ebc: number): string {
  if (ebc < 6) return 'Meget lys';
  if (ebc < 12) return 'Lysegul';
  if (ebc < 20) return 'Guld';
  if (ebc < 30) return 'Amber';
  if (ebc < 45) return 'Kobber';
  if (ebc < 75) return 'Mørkebrun';
  if (ebc < 120) return 'Meget mørk';
  return 'Sort';
}

/**
 * Get approximate CSS color for EBC value
 * For visual representation in the UI
 */
export function ebcToColor(ebc: number): string {
  // Clamp EBC to reasonable range
  const clampedEBC = Math.min(Math.max(ebc, 2), 80);

  // Map EBC to RGB values (simplified approximation)
  // Based on typical beer color charts
  const colors: Record<number, string> = {
    2: '#F8F4B4',
    4: '#F6F0A5',
    6: '#F5E98A',
    8: '#EDDC68',
    10: '#E5C84C',
    12: '#DAB03B',
    14: '#CF9930',
    16: '#C48527',
    18: '#B97422',
    20: '#AE641E',
    25: '#9B4E15',
    30: '#883C11',
    35: '#762D0D',
    40: '#65210A',
    45: '#551807',
    50: '#471105',
    60: '#370B03',
    70: '#2A0702',
    80: '#1F0401',
  };

  // Find closest EBC value in our color map
  const ebcValues = Object.keys(colors).map(Number);
  const closest = ebcValues.reduce((prev, curr) =>
    Math.abs(curr - clampedEBC) < Math.abs(prev - clampedEBC) ? curr : prev
  );

  return colors[closest];
}
