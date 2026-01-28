import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import miscData from '../../data/misc.json';
import type { PredefinedMisc } from '../../types/ingredients';
import type { SessionMisc } from '../../types/session';
import { AutocompleteInput } from '../common/AutocompleteInput';
import { InfoButton } from '../common/InfoButton';
import { NumberInput } from '../common/NumberInput';
import { SectionHeader } from '../common/SectionHeader';
import { useResolvedTheme } from '../ThemeProvider';

const predefinedMisc: PredefinedMisc[] = miscData as PredefinedMisc[];

interface MiscSectionProps {
  misc: SessionMisc[];
  onAdd: (item: SessionMisc) => void;
  onUpdate: (id: string, updates: Partial<SessionMisc>) => void;
  onRemove: (id: string) => void;
}

export function MiscSection({
  misc,
  onAdd,
  onUpdate,
  onRemove,
}: MiscSectionProps) {
  const [searchText, setSearchText] = useState('');
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handleSelect = (item: PredefinedMisc) => {
    const newMisc: SessionMisc = {
      id: Math.random().toString(36).substring(2, 11),
      miscId: item.id,
      navn: item.navn,
      maengde: item.standardMaengde,
      enhed: item.enhed,
      tilsaetning: item.tilsaetning,
      tidspunkt: item.tidspunkt,
    };
    onAdd(newMisc);
    setSearchText('');
  };

  const handleShowInfo = (miscId: string) => {
    router.push({
      pathname: '/modal/ingredient-info',
      params: { id: miscId },
    });
  };

  const handleAddCustom = () => {
    if (searchText.trim().length === 0) return;

    const newMisc: SessionMisc = {
      id: Math.random().toString(36).substring(2, 11),
      miscId: null,
      navn: searchText.trim(),
      maengde: 0,
      enhed: 'g',
      tilsaetning: 'kog',
      tidspunkt: 0,
    };
    onAdd(newMisc);
    setSearchText('');
  };

  return (
    <View className="relative z-10">
      <SectionHeader title="Misc. Tilsætninger" icon="flask-outline" />

      {/* Misc list */}
      {misc.map((item) => {
        const predefined = predefinedMisc.find((m) => m.id === item.miscId);

        return (
          <View
            key={item.id}
            className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 flex-row items-center">
                <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
                  {item.navn}
                </Text>
                {predefined && (
                  <InfoButton onPress={() => handleShowInfo(predefined.id)} />
                )}
              </View>
              <Pressable
                onPress={() => onRemove(item.id)}
                className="h-8 w-8 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark"
              >
                <Ionicons name="trash-outline" size={16} color="#dc2626" />
              </Pressable>
            </View>

            <View className="mt-3 flex-row items-end gap-3">
              <View className="flex-1">
                <NumberInput
                  label="Mængde"
                  value={item.maengde}
                  onChange={(v) => onUpdate(item.id, { maengde: v ?? 0 })}
                  unit={item.enhed}
                  placeholder="0"
                  min={0}
                />
              </View>

              {item.tilsaetning === 'kog' && item.tidspunkt !== undefined && (
                <View className="w-28">
                  <NumberInput
                    label="Tidspunkt"
                    value={item.tidspunkt}
                    onChange={(v) => onUpdate(item.id, { tidspunkt: v ?? 0 })}
                    unit="min"
                    placeholder="0"
                    min={0}
                  />
                </View>
              )}
            </View>
          </View>
        );
      })}

      {/* Add misc autocomplete */}
      <AutocompleteInput
        label="Tilføj tilsætning"
        value={searchText}
        onChange={setSearchText}
        onSelect={handleSelect}
        items={predefinedMisc}
        placeholder="Søg efter tilsætninger..."
        renderItem={(item) => (
          <View className="flex-row" pointerEvents="none">
            <Text className="flex-1 text-text-primary dark:text-text-primary-dark">
              {item.navn}
            </Text>
            <Text className="text-xs text-text-secondary dark:text-text-secondary-dark">
              {item.kategori}
            </Text>
          </View>
        )}
      />

      {/* Add custom misc button */}
      {searchText.trim().length > 0 &&
        !predefinedMisc.some(
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
              Tilføj &quot;{searchText}&quot; som ny tilsætning
            </Text>
          </Pressable>
        )}
    </View>
  );
}
