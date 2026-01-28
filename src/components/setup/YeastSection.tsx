import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import yeastsData from '../../data/yeasts.json';
import type { PredefinedYeast } from '../../types/ingredients';
import type { SessionYeast, YeastType } from '../../types/session';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { NumberInput } from '../common/NumberInput';
import { SectionHeader } from '../common/SectionHeader';
import { useResolvedTheme } from '../ThemeProvider';

const predefinedYeasts: PredefinedYeast[] = yeastsData as PredefinedYeast[];

interface YeastSectionProps {
  yeasts: SessionYeast[];
  onAdd: (yeast: SessionYeast) => void;
  onUpdate: (id: string, updates: Partial<SessionYeast>) => void;
  onRemove: (id: string) => void;
}

const yeastTypeLabels: Record<YeastType, string> = {
  overgaeret: 'Overgæret (Ale)',
  undergaeret: 'Undergæret (Lager)',
};

const getAttenuationDescription = (attenuering: number): string => {
  if (attenuering >= 85) return 'meget tør';
  if (attenuering >= 80) return 'tør';
  if (attenuering >= 75) return 'medium';
  if (attenuering >= 70) return 'let sødme';
  return 'sød';
};

export function YeastSection({
  yeasts,
  onAdd,
  onUpdate,
  onRemove,
}: YeastSectionProps) {
  const [searchText, setSearchText] = useState('');
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handleSelect = (item: PredefinedYeast) => {
    const newYeast: SessionYeast = {
      id: Math.random().toString(36).substring(2, 11),
      yeastId: item.id,
      navn: item.navn,
      type: item.type,
      pakker: 1,
      temperatur: Math.round((item.tempMin + item.tempMax) / 2),
    };
    onAdd(newYeast);
    setSearchText('');
  };

  const handleAddCustom = () => {
    if (searchText.trim().length === 0) return;

    const newYeast: SessionYeast = {
      id: Math.random().toString(36).substring(2, 11),
      yeastId: null,
      navn: searchText.trim(),
      type: 'overgaeret',
      pakker: 1,
    };
    onAdd(newYeast);
    setSearchText('');
  };

  return (
    <View className="relative z-0">
      <SectionHeader title="Gær" icon="nutrition-outline" />

      {/* Yeast list */}
      {(yeasts ?? []).map((yeast) => {
        const predefined = predefinedYeasts.find((y) => y.id === yeast.yeastId);

        return (
          <View
            key={yeast.id}
            className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
                  {yeast.navn}
                </Text>
                {predefined && (
                  <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
                    {predefined.producent} · {predefined.tempMin}-
                    {predefined.tempMax}°C · {predefined.attenuering}% att. (
                    {getAttenuationDescription(predefined.attenuering)})
                  </Text>
                )}
              </View>
              <Pressable
                onPress={() => onRemove(yeast.id)}
                className="h-8 w-8 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark"
              >
                <Ionicons name="trash-outline" size={16} color="#dc2626" />
              </Pressable>
            </View>

            {/* Yeast type selector */}
            <Text className="mb-2 mt-3 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
              Gærtype
            </Text>
            <View className="mb-4 flex-row gap-2">
              {(Object.keys(yeastTypeLabels) as YeastType[]).map((type) => (
                <Pressable
                  key={type}
                  onPress={() => onUpdate(yeast.id, { type })}
                  className={`flex-1 rounded-lg py-3 ${
                    yeast.type === type
                      ? isDark
                        ? 'bg-primary-light shadow-sm'
                        : 'bg-primary shadow-sm'
                      : isDark
                        ? 'border border-border-dark bg-surface-dark'
                        : 'border border-border bg-surface'
                  }`}
                >
                  <Text
                    className={`text-center text-sm font-semibold ${
                      yeast.type === type
                        ? isDark
                          ? 'text-background-dark'
                          : 'text-text-inverse'
                        : isDark
                          ? 'text-text-secondary-dark'
                          : 'text-text-secondary'
                    }`}
                  >
                    {yeastTypeLabels[type]}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-row items-end gap-3">
              <View className="flex-1">
                <NumberInput
                  label="Antal pakker"
                  value={yeast.pakker}
                  onChange={(v) => onUpdate(yeast.id, { pakker: v ?? 1 })}
                  placeholder="1"
                  min={1}
                  max={10}
                />
              </View>

              <View className="flex-1">
                <NumberInput
                  label="Gæringstemperatur"
                  value={yeast.temperatur ?? null}
                  onChange={(v) =>
                    onUpdate(yeast.id, { temperatur: v ?? undefined })
                  }
                  unit="°C"
                  placeholder="f.eks. 18"
                  min={0}
                  max={40}
                />
              </View>
            </View>
          </View>
        );
      })}

      {/* Add yeast autocomplete */}
      <AutocompleteInput
        label="Tilføj gær"
        value={searchText}
        onChange={setSearchText}
        onSelect={handleSelect}
        items={predefinedYeasts}
        placeholder="Søg efter gær..."
        renderItem={(item) => (
          <View pointerEvents="none">
            <View className="flex-row">
              <Text className="flex-1 text-text-primary dark:text-text-primary-dark">
                {item.navn}
              </Text>
              <Text className="text-xs text-text-secondary dark:text-text-secondary-dark">
                {item.producent}
              </Text>
            </View>
            <Text className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {item.tempMin}-{item.tempMax}°C · {item.attenuering}% att. (
              {getAttenuationDescription(item.attenuering)})
            </Text>
          </View>
        )}
      />

      {/* Add custom yeast button */}
      {searchText.trim().length > 0 &&
        !predefinedYeasts.some(
          (y) => y.navn.toLowerCase() === searchText.toLowerCase()
        ) && (
          <Pressable
            onPress={handleAddCustom}
            className="mt-3 flex-row items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary-subtle py-4 dark:border-primary-light dark:bg-surface-dark"
          >
            <Ionicons
              name="add-circle-outline"
              size={20}
              color={isDark ? '#4ade80' : '#1a7f45'}
            />
            <Text className="ml-2 font-medium text-primary dark:text-primary-light">
              Tilføj &quot;{searchText}&quot; som ny gær
            </Text>
          </Pressable>
        )}
    </View>
  );
}
