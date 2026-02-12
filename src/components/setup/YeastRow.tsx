import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';

import type { SessionYeast, YeastType } from '../../types/session';
import { InfoButton } from '../common/InfoButton';
import { NumberInput } from '../common/NumberInput';
import { useResolvedTheme } from '../ThemeProvider';

interface YeastRowProps {
  yeast: SessionYeast;
  onUpdate: (updates: Partial<SessionYeast>) => void;
  onRemove: () => void;
  onShowInfo?: () => void;
}

const yeastTypeLabels: Record<YeastType, string> = {
  overgaeret: 'Overgæret (Ale)',
  undergaeret: 'Undergæret (Lager)',
};

export function YeastRow({
  yeast,
  onUpdate,
  onRemove,
  onShowInfo,
}: YeastRowProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <View className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
            {yeast.navn}
          </Text>
          {onShowInfo && <InfoButton onPress={onShowInfo} />}
        </View>
        <Pressable
          onPress={onRemove}
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
            onPress={() => onUpdate({ type })}
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
            onChange={(v) => onUpdate({ pakker: v ?? 1 })}
            placeholder="1"
            min={1}
            max={10}
          />
        </View>

        <View className="flex-1">
          <NumberInput
            label="Gæringstemperatur"
            value={yeast.temperatur ?? null}
            onChange={(v) => onUpdate({ temperatur: v ?? undefined })}
            unit="°C"
            placeholder="f.eks. 18"
            min={0}
            max={40}
          />
        </View>
      </View>
    </View>
  );
}
