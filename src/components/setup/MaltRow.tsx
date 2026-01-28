import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';

import type { SessionMalt } from '../../types/session';
import { NumberInput } from '../common/NumberInput';

interface MaltRowProps {
  malt: SessionMalt;
  percentage: number;
  onUpdate: (updates: Partial<SessionMalt>) => void;
  onRemove: () => void;
}

export function MaltRow({
  malt,
  percentage,
  onUpdate,
  onRemove,
}: MaltRowProps) {
  return (
    <View className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-text-primary dark:text-text-primary-dark">
          {malt.navn}
        </Text>
        <Pressable
          onPress={onRemove}
          className="h-8 w-8 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark"
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </Pressable>
      </View>

      <View className="mt-3 flex-row items-end gap-3">
        <View className="flex-1">
          <NumberInput
            label="Mængde"
            value={malt.maengde}
            onChange={(v) => onUpdate({ maengde: v ?? 0 })}
            unit="g"
            placeholder="0"
            min={0}
          />
        </View>

        <View className="w-20">
          <NumberInput
            label="EBC"
            value={malt.ebc}
            onChange={(v) => onUpdate({ ebc: v ?? 0 })}
            placeholder="0"
            min={0}
          />
        </View>

        <View className="w-20 items-end pb-3">
          <View className="rounded-lg bg-primary-subtle px-3 py-2 dark:bg-surface-dark">
            <Text className="text-lg font-bold text-primary dark:text-primary-light">
              {percentage.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
