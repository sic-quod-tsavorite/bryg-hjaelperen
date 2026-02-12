import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { View, Text, Pressable } from 'react-native';

import maltsData from '../../data/malts.json';
import type { PredefinedMalt } from '../../types/ingredients';
import type { SessionMalt } from '../../types/session';
import { calculateMaltPercentages } from '../../utils/calculations';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { SectionHeader } from '../common/SectionHeader';
import { useResolvedTheme } from '../ThemeProvider';

import { MaltRow } from './MaltRow';

const predefinedMalts: PredefinedMalt[] = maltsData as PredefinedMalt[];

interface MaltSectionProps {
  malts: SessionMalt[];
  onAdd: (malt: SessionMalt) => void;
  onUpdate: (id: string, updates: Partial<SessionMalt>) => void;
  onRemove: (id: string) => void;
}

export function MaltSection({
  malts,
  onAdd,
  onUpdate,
  onRemove,
}: MaltSectionProps) {
  const [searchText, setSearchText] = useState('');
  const sectionRef = useRef<View>(null);
  const percentages = calculateMaltPercentages(malts);
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handleSelect = (item: PredefinedMalt) => {
    const newMalt: SessionMalt = {
      id: Math.random().toString(36).substring(2, 11),
      maltId: item.id,
      navn: item.navn,
      maengde: 0,
      ebc: item.ebc,
    };
    onAdd(newMalt);
    setSearchText('');
  };

  const handleAddCustom = () => {
    if (searchText.trim().length === 0) return;

    const newMalt: SessionMalt = {
      id: Math.random().toString(36).substring(2, 11),
      maltId: null,
      navn: searchText.trim(),
      maengde: 0,
      ebc: 0,
    };
    onAdd(newMalt);
    setSearchText('');
  };

  const totalWeight = malts.reduce((sum, m) => sum + m.maengde, 0);

  return (
    <View ref={sectionRef} className="relative z-30">
      <SectionHeader title="Malt" icon="layers-outline" />

      {/* Add malt autocomplete */}
      <AutocompleteInput
        label="Tilføj malt"
        value={searchText}
        onChange={setSearchText}
        onSelect={handleSelect}
        items={predefinedMalts}
        placeholder="Søg efter malt..."
        sectionRef={sectionRef}
        renderItem={(item) => (
          <View className="flex-row" pointerEvents="none">
            <Text className="flex-1 text-text-primary dark:text-text-primary-dark">
              {item.navn}
            </Text>
            <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {item.ebc} EBC
            </Text>
          </View>
        )}
      />

      {/* Add custom malt button */}
      {searchText.trim().length > 0 &&
        !predefinedMalts.some(
          (m) => m.navn.toLowerCase() === searchText.toLowerCase()
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
              Tilføj &quot;{searchText}&quot; som ny malt
            </Text>
          </Pressable>
        )}

      {/* Malt list */}
      <View className="mt-4">
        {malts.map((malt) => {
          const maltInfo = malt.maltId
            ? predefinedMalts.find((m) => m.id === malt.maltId)
            : null;
          return (
            <MaltRow
              key={malt.id}
              malt={malt}
              percentage={percentages.get(malt.id) ?? 0}
              onUpdate={(updates) => onUpdate(malt.id, updates)}
              onRemove={() => onRemove(malt.id)}
              onShowInfo={
                maltInfo
                  ? () => {
                      router.push({
                        pathname: '/modal/ingredient-info',
                        params: { id: maltInfo.id, type: 'malt' },
                      });
                    }
                  : undefined
              }
            />
          );
        })}
      </View>

      {/* Total weight display */}
      {totalWeight > 0 && (
        <View className="mt-4 flex-row justify-end">
          <View className="rounded-lg bg-surface-elevated px-4 py-2 dark:bg-surface-elevated-dark">
            <Text className="font-semibold text-text-primary dark:text-text-primary-dark">
              Total: {(totalWeight / 1000).toFixed(2)} kg
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
