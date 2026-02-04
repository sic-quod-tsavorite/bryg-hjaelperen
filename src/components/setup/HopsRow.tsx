import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';

import type { SessionHop, HopType } from '../../types/session';
import { NumberInput } from '../common/NumberInput';
import { useResolvedTheme } from '../ThemeProvider';

interface HopsRowProps {
  hop: SessionHop;
  ibuContribution: number;
  onUpdate: (updates: Partial<SessionHop>) => void;
  onRemove: () => void;
}

const hopTypeLabels: Record<HopType, string> = {
  bitter: 'Bitter',
  aroma: 'Aroma',
  dryhopping: 'Tørhumle',
};

export function HopsRow({
  hop,
  ibuContribution,
  onUpdate,
  onRemove,
}: HopsRowProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <View className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-semibold text-text-primary dark:text-text-primary-dark">
          {hop.navn}
        </Text>
        <Pressable
          onPress={onRemove}
          className="h-8 w-8 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark"
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </Pressable>
      </View>

      {/* Hop type selector */}
      <View className="mt-3 flex-row gap-2">
        {(Object.keys(hopTypeLabels) as HopType[]).map((type) => (
          <Pressable
            key={type}
            onPress={() => onUpdate({ type })}
            className={`flex-1 rounded-lg py-2.5 ${
              hop.type === type
                ? isDark
                  ? 'bg-primary-light'
                  : 'bg-primary'
                : isDark
                  ? 'border border-border-dark bg-surface-dark'
                  : 'border border-border bg-surface'
            }`}
            style={hop.type === type ? { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 } : undefined}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                hop.type === type
                  ? isDark
                    ? 'text-background-dark'
                    : 'text-text-inverse'
                  : isDark
                    ? 'text-text-secondary-dark'
                    : 'text-text-secondary'
              }`}
            >
              {hopTypeLabels[type]}
            </Text>
          </Pressable>
        ))}
      </View>

      <View className="mt-4 flex-row items-end gap-3">
        <View className="flex-1">
          <NumberInput
            label="Mængde"
            value={hop.maengde}
            onChange={(v) => onUpdate({ maengde: v ?? 0 })}
            unit="g"
            placeholder="0"
            min={0}
          />
        </View>

        <View className="w-24">
          <NumberInput
            label="Alpha %"
            value={hop.alfaSyre}
            onChange={(v) => onUpdate({ alfaSyre: v ?? 0 })}
            placeholder="0"
            min={0}
            max={30}
            decimals={1}
          />
        </View>

        {hop.type !== 'dryhopping' && (
          <View className="w-24">
            <NumberInput
              label="Kog min"
              value={hop.kogeTid}
              onChange={(v) => onUpdate({ kogeTid: v ?? 0 })}
              placeholder="0"
              min={0}
              max={120}
            />
          </View>
        )}
      </View>

      {/* IBU contribution */}
      {ibuContribution > 0 && (
        <View className="mt-3 flex-row justify-end">
          <View className="rounded-lg bg-primary-subtle px-3 py-1.5 dark:bg-surface-dark">
            <Text className="text-sm font-semibold text-primary dark:text-primary-light">
              {ibuContribution.toFixed(1)} IBU
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
