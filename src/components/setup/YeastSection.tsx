import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';

import yeastsData from '../../data/yeasts.json';
import type { PredefinedYeast } from '../../types/ingredients';
import type { SessionYeast } from '../../types/session';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { SectionHeader } from '../common/SectionHeader';
import { useResolvedTheme } from '../ThemeProvider';

import { YeastRow } from './YeastRow';

const predefinedYeasts: PredefinedYeast[] = yeastsData as PredefinedYeast[];

interface YeastSectionProps {
  yeasts: SessionYeast[];
  onAdd: (yeast: SessionYeast) => void;
  onUpdate: (id: string, updates: Partial<SessionYeast>) => void;
  onRemove: (id: string) => void;
}

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
  const sectionRef = useRef<View>(null);
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
    <View ref={sectionRef} className="relative z-0">
      <SectionHeader title="Gær" icon="nutrition-outline" />

      {/* Add yeast autocomplete */}
      <AutocompleteInput
        label="Tilføj gær"
        value={searchText}
        onChange={setSearchText}
        onSelect={handleSelect}
        items={predefinedYeasts}
        placeholder="Søg efter gær..."
        sectionRef={sectionRef}
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

      {/* Yeast list */}
      <View className="mt-4">
        {(yeasts ?? []).map((yeast) => {
          const yeastInfo = yeast.yeastId
            ? predefinedYeasts.find((y) => y.id === yeast.yeastId)
            : null;

          return (
            <YeastRow
              key={yeast.id}
              yeast={yeast}
              onUpdate={(updates) => onUpdate(yeast.id, updates)}
              onRemove={() => onRemove(yeast.id)}
              onShowInfo={
                yeastInfo
                  ? () => {
                      router.push({
                        pathname: '/modal/ingredient-info',
                        params: { id: yeastInfo.id, type: 'yeast' },
                      });
                    }
                  : undefined
              }
            />
          );
        })}
      </View>
    </View>
  );
}
