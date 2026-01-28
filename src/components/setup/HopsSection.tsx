import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import hopsData from '../../data/hops.json';
import type { PredefinedHop } from '../../types/ingredients';
import type { SessionHop, SessionMalt } from '../../types/session';
import {
  calculateHopIBUContribution,
  calculateOG,
} from '../../utils/calculations';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { SectionHeader } from '../common/SectionHeader';
import { useResolvedTheme } from '../ThemeProvider';

import { HopsRow } from './HopsRow';

const predefinedHops: PredefinedHop[] = hopsData;

interface HopsSectionProps {
  hops: SessionHop[];
  malts: SessionMalt[];
  volumeLiter: number;
  onAdd: (hop: SessionHop) => void;
  onUpdate: (id: string, updates: Partial<SessionHop>) => void;
  onRemove: (id: string) => void;
}

export function HopsSection({
  hops,
  malts,
  volumeLiter,
  onAdd,
  onUpdate,
  onRemove,
}: HopsSectionProps) {
  const [searchText, setSearchText] = useState('');
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const og = calculateOG(malts, volumeLiter);
  const boilGravity = 1 + (og - 1) * 0.9;

  const handleSelect = (item: PredefinedHop) => {
    const newHop: SessionHop = {
      id: Math.random().toString(36).substring(2, 11),
      hopId: item.id,
      navn: item.navn,
      maengde: 0,
      alfaSyre: item.alfaSyre,
      kogeTid: 60,
      type: 'bitter',
    };
    onAdd(newHop);
    setSearchText('');
  };

  const handleAddCustom = () => {
    if (searchText.trim().length === 0) return;

    const newHop: SessionHop = {
      id: Math.random().toString(36).substring(2, 11),
      hopId: null,
      navn: searchText.trim(),
      maengde: 0,
      alfaSyre: 0,
      kogeTid: 60,
      type: 'bitter',
    };
    onAdd(newHop);
    setSearchText('');
  };

  return (
    <View className="relative z-20">
      <SectionHeader title="Humle" icon="leaf-outline" />

      {/* Hops list */}
      {hops.map((hop) => (
        <HopsRow
          key={hop.id}
          hop={hop}
          ibuContribution={calculateHopIBUContribution(
            hop,
            volumeLiter,
            boilGravity
          )}
          onUpdate={(updates) => onUpdate(hop.id, updates)}
          onRemove={() => onRemove(hop.id)}
        />
      ))}

      {/* Add hops autocomplete */}
      <AutocompleteInput
        label="Tilføj humle"
        value={searchText}
        onChange={setSearchText}
        onSelect={handleSelect}
        items={predefinedHops}
        placeholder="Søg efter humle..."
        renderItem={(item) => (
          <View className="flex-row" pointerEvents="none">
            <Text className="flex-1 text-text-primary dark:text-text-primary-dark">
              {item.navn}
            </Text>
            <Text className="text-sm text-text-secondary dark:text-text-secondary-dark">
              {item.alfaSyre}% AA
            </Text>
          </View>
        )}
      />

      {/* Add custom hop button */}
      {searchText.trim().length > 0 &&
        !predefinedHops.some(
          (h) => h.navn.toLowerCase() === searchText.toLowerCase()
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
              Tilføj &quot;{searchText}&quot; som ny humle
            </Text>
          </Pressable>
        )}
    </View>
  );
}
