import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Pressable, ScrollView } from 'react-native';

import { useResolvedTheme } from '../../src/components/ThemeProvider';
import hopsData from '../../src/data/hops.json';
import maltsData from '../../src/data/malts.json';
import miscData from '../../src/data/misc.json';
import yeastsData from '../../src/data/yeasts.json';
import type {
  PredefinedHop,
  PredefinedMalt,
  PredefinedMisc,
  PredefinedYeast,
} from '../../src/types/ingredients';

const predefinedMisc: PredefinedMisc[] = miscData as PredefinedMisc[];
const predefinedHops: PredefinedHop[] = hopsData as PredefinedHop[];
const predefinedMalts: PredefinedMalt[] = maltsData as PredefinedMalt[];
const predefinedYeasts: PredefinedYeast[] = yeastsData as PredefinedYeast[];

const kategoriLabels: Record<string, string> = {
  klaring: 'Klaring',
  sukker: 'Sukker',
  krydderi: 'Krydderi',
  gaering: 'Gæring',
  modning: 'Modning',
};

const hopTypeLabels: Record<string, string> = {
  aroma: 'Aroma',
  bittering: 'Bittering',
  'dual-purpose': 'Bittering & Aroma',
};

const maltTypeLabels: Record<string, string> = {
  base: 'Basismalt',
  crystal: 'Karamelmalt',
  roasted: 'Ristet malt',
  specialty: 'Specialmalt',
  smoked: 'Røget malt',
};

const yeastTypeLabels: Record<string, string> = {
  overgaeret: 'Overgæret (Ale)',
  undergaeret: 'Undergæret (Lager)',
};

const flokkuleringLabels: Record<string, string> = {
  lav: 'Lav',
  medium: 'Medium',
  høj: 'Høj',
};

const gaeringsHastighedLabels: Record<string, string> = {
  hurtig: 'Hurtig',
  medium: 'Medium',
  langsom: 'Langsom',
};

export default function IngredientInfoModal() {
  const { id, type } = useLocalSearchParams<{ id: string; type?: string }>();
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const isHop = type === 'hop';
  const isMalt = type === 'malt';
  const isYeast = type === 'yeast';
  const miscIngredient =
    !isHop && !isMalt && !isYeast
      ? predefinedMisc.find((m) => m.id === id)
      : null;
  const hopIngredient = isHop ? predefinedHops.find((h) => h.id === id) : null;
  const maltIngredient = isMalt
    ? predefinedMalts.find((m) => m.id === id)
    : null;
  const yeastIngredient = isYeast
    ? predefinedYeasts.find((y) => y.id === id)
    : null;
  const ingredient =
    miscIngredient || hopIngredient || maltIngredient || yeastIngredient;

  if (!ingredient) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4 dark:bg-background-dark">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark">
          <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
        </View>
        <Text className="mt-4 text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Ingrediens ikke fundet
        </Text>
        <Pressable
          onPress={() => router.back()}
          className={`mt-6 rounded-xl px-8 py-4 shadow-sm ${isDark ? 'bg-primary-light' : 'bg-primary'}`}
        >
          <Text
            className={`font-semibold ${isDark ? 'text-background-dark' : 'text-text-inverse'}`}
          >
            Tilbage
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="flex-1 text-h1 font-semibold text-text-primary dark:text-text-primary-dark">
            {ingredient.navn}
          </Text>
          {isHop ? (
            <View className="ml-3 rounded-full bg-primary-subtle px-4 py-1.5 dark:bg-surface-dark">
              <Text className="text-sm font-semibold text-primary-dark dark:text-primary-light">
                {
                  hopTypeLabels[
                    (ingredient as PredefinedHop).type || 'dual-purpose'
                  ]
                }
              </Text>
            </View>
          ) : isMalt ? (
            <View className="ml-3 rounded-full bg-primary-subtle px-4 py-1.5 dark:bg-surface-dark">
              <Text className="text-sm font-semibold text-primary-dark dark:text-primary-light">
                {maltTypeLabels[(ingredient as PredefinedMalt).type || 'base']}
              </Text>
            </View>
          ) : isYeast ? (
            <View className="ml-3 rounded-full bg-primary-subtle px-4 py-1.5 dark:bg-surface-dark">
              <Text className="text-sm font-semibold text-primary-dark dark:text-primary-light">
                {yeastTypeLabels[(ingredient as PredefinedYeast).type]}
              </Text>
            </View>
          ) : (
            <View className="ml-3 rounded-full bg-primary-subtle px-4 py-1.5 dark:bg-surface-dark">
              <Text className="text-sm font-semibold text-primary-dark dark:text-primary-light">
                {kategoriLabels[(ingredient as PredefinedMisc).kategori]}
              </Text>
            </View>
          )}
        </View>

        {/* Description */}
        {(isHop
          ? (ingredient as PredefinedHop).beskrivelse
          : isMalt
            ? (ingredient as PredefinedMalt).beskrivelse
            : isYeast
              ? (ingredient as PredefinedYeast).beskrivelse
              : (ingredient as PredefinedMisc).beskrivelse) && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Beskrivelse
            </Text>
            <Text className="leading-6 text-text-secondary dark:text-text-secondary-dark">
              {isHop
                ? (ingredient as PredefinedHop).beskrivelse
                : isMalt
                  ? (ingredient as PredefinedMalt).beskrivelse
                  : isYeast
                    ? (ingredient as PredefinedYeast).beskrivelse
                    : (ingredient as PredefinedMisc).beskrivelse}
            </Text>
          </View>
        )}

        {/* Alpha acids for hops */}
        {isHop && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Alpha-syre
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedHop).alfaSyreRange
                ? `${(ingredient as PredefinedHop).alfaSyreRange![0]}-${(ingredient as PredefinedHop).alfaSyreRange![1]}% AA`
                : `${(ingredient as PredefinedHop).alfaSyre}% AA`}
            </Text>
          </View>
        )}

        {/* Aroma profile for hops */}
        {isHop && (ingredient as PredefinedHop).aroma && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Aromaprofil
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedHop).aroma}
            </Text>
          </View>
        )}

        {/* Flavor profile for malts */}
        {isMalt && (ingredient as PredefinedMalt).smag && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Smagsprofil
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedMalt).smag}
            </Text>
          </View>
        )}

        {/* Usage tips for malts */}
        {isMalt && (ingredient as PredefinedMalt).brugstips && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Brugstips
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedMalt).brugstips}
            </Text>
          </View>
        )}

        {/* Diastatic power for malts */}
        {isMalt && (ingredient as PredefinedMalt).diastatiskKraft && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Diastatisk kraft
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedMalt).diastatiskKraft}
            </Text>
          </View>
        )}

        {/* Extract yield for malts */}
        {isMalt && (ingredient as PredefinedMalt).udvinding && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Typisk udvinding
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedMalt).udvinding}
            </Text>
          </View>
        )}

        {/* Flavor profile for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).smagsprofil && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Smagsprofil
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).smagsprofil}
            </Text>
          </View>
        )}

        {/* Ester profile for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).esterprofil && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Esterprofil
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).esterprofil}
            </Text>
          </View>
        )}

        {/* Temperature range for yeasts */}
        {isYeast && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Gæringstemperatur
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).tempMin}-
              {(ingredient as PredefinedYeast).tempMax}°C
            </Text>
          </View>
        )}

        {/* Attenuation for yeasts */}
        {isYeast && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Attenuering
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).attenuering}% -{' '}
              {((ingredient as PredefinedYeast).attenuering || 0) >= 85
                ? 'meget tør'
                : ((ingredient as PredefinedYeast).attenuering || 0) >= 80
                  ? 'tør'
                  : ((ingredient as PredefinedYeast).attenuering || 0) >= 75
                    ? 'medium'
                    : ((ingredient as PredefinedYeast).attenuering || 0) >= 70
                      ? 'let sødme'
                      : 'sød'}{' '}
              finish
            </Text>
          </View>
        )}

        {/* Flocculation for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).flokkulering && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Flokkulering
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {
                flokkuleringLabels[
                  (ingredient as PredefinedYeast).flokkulering!
                ]
              }
            </Text>
          </View>
        )}

        {/* Fermentation speed for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).gaeringsHastighed && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Gæringshastighed
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {
                gaeringsHastighedLabels[
                  (ingredient as PredefinedYeast).gaeringsHastighed!
                ]
              }
            </Text>
          </View>
        )}

        {/* Alcohol tolerance for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).alkoholTolerance && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Alkoholtolerance
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).alkoholTolerance}
            </Text>
          </View>
        )}

        {/* Origin for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).oprindelse && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Oprindelse
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).oprindelse}
            </Text>
          </View>
        )}

        {/* Pitching rate for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).pitchingRate && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Anbefalet pitching rate
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).pitchingRate}
            </Text>
          </View>
        )}

        {/* Rehydration for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).rehydrering && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Rehydrering
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).rehydrering}
            </Text>
          </View>
        )}

        {/* Notes for yeasts */}
        {isYeast && (ingredient as PredefinedYeast).noter && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-2 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Brugstips
            </Text>
            <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
              {(ingredient as PredefinedYeast).noter}
            </Text>
          </View>
        )}

        {/* Alternatives for yeasts */}
        {isYeast &&
          (ingredient as PredefinedYeast).alternativer &&
          (ingredient as PredefinedYeast).alternativer!.length > 0 && (
            <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
              <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
                Alternativer
              </Text>
              <View className="gap-3">
                {(ingredient as PredefinedYeast).alternativer!.map(
                  (alt, index) => (
                    <View key={index} className="flex-row">
                      <Ionicons
                        name="swap-horizontal-outline"
                        size={18}
                        color={isDark ? '#4ade80' : '#1a7f45'}
                        style={{ marginRight: 12, marginTop: 2 }}
                      />
                      <Text className="flex-1 leading-5 text-text-secondary dark:text-text-secondary-dark">
                        {alt}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

        {/* Usage methods (misc only) */}
        {!isHop &&
          !isMalt &&
          !isYeast &&
          (ingredient as PredefinedMisc).brug &&
          (ingredient as PredefinedMisc).brug!.length > 0 && (
            <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
              <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
                Måder at bruge {ingredient.navn.toLowerCase()} på
              </Text>
              <View className="gap-4">
                {(ingredient as PredefinedMisc).brug!.map((metode, index) => (
                  <View key={index} className="flex-row">
                    <View className="mr-3 mt-1 h-6 w-6 items-center justify-center rounded-full bg-primary-subtle dark:bg-surface-dark">
                      <Text className="text-xs font-semibold text-primary-dark dark:text-primary-light">
                        {index + 1}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="mb-1 font-medium text-text-primary dark:text-text-primary-dark">
                        {metode.titel}
                      </Text>
                      <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
                        {metode.beskrivelse}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Ideal beer types */}
        {((isHop && (ingredient as PredefinedHop).oeltyper) ||
          (isMalt && (ingredient as PredefinedMalt).oeltyper) ||
          (isYeast && (ingredient as PredefinedYeast).oeltyper) ||
          (!isHop &&
            !isMalt &&
            !isYeast &&
            (ingredient as PredefinedMisc).oeltyper)) &&
          (isHop
            ? (ingredient as PredefinedHop).oeltyper!
            : isMalt
              ? (ingredient as PredefinedMalt).oeltyper!
              : isYeast
                ? (ingredient as PredefinedYeast).oeltyper!
                : (ingredient as PredefinedMisc).oeltyper!
          ).length > 0 && (
            <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
              <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
                Ideelle øltyper
              </Text>
              <View className="gap-3">
                {(isHop
                  ? (ingredient as PredefinedHop).oeltyper!
                  : isMalt
                    ? (ingredient as PredefinedMalt).oeltyper!
                    : isYeast
                      ? (ingredient as PredefinedYeast).oeltyper!
                      : (ingredient as PredefinedMisc).oeltyper!
                ).map((type, index) => (
                  <View key={index} className="flex-row">
                    <Ionicons
                      name="beer-outline"
                      size={18}
                      color={isDark ? '#4ade80' : '#1a7f45'}
                      style={{ marginRight: 12, marginTop: 2 }}
                    />
                    <Text className="flex-1 leading-5 text-text-secondary dark:text-text-secondary-dark">
                      {type}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

        {/* Benefits (misc only) */}
        {!isHop &&
          !isMalt &&
          !isYeast &&
          (ingredient as PredefinedMisc).fordele &&
          (ingredient as PredefinedMisc).fordele!.length > 0 && (
            <View className="rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
              <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
                Vigtige fordele
              </Text>
              <View className="gap-3">
                {(ingredient as PredefinedMisc).fordele!.map(
                  (fordel, index) => (
                    <View key={index} className="flex-row">
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={isDark ? '#4ade80' : '#1a7f45'}
                        style={{ marginRight: 12, marginTop: 2 }}
                      />
                      <Text className="flex-1 leading-5 text-text-secondary dark:text-text-secondary-dark">
                        {fordel}
                      </Text>
                    </View>
                  )
                )}
              </View>
            </View>
          )}

        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          className={`mt-6 items-center rounded-xl py-5 shadow-sm ${isDark ? 'bg-primary-light' : 'bg-primary'}`}
        >
          <Text
            className={`text-base font-semibold ${isDark ? 'text-background-dark' : 'text-text-inverse'}`}
          >
            Luk
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
