import { View, Text } from 'react-native';

import { calculateABV, calculateAttenuation } from '../../utils/calculations';
import { NumberInput } from '../common/NumberInput';

interface FGInputProps {
  og: number | null;
  fg: number | null;
  onFGChange: (fg: number | null) => void;
}

export function FGInput({ og, fg, onFGChange }: FGInputProps) {
  const abv = og && fg ? calculateABV(og, fg) : null;
  const attenuation = og && fg ? calculateAttenuation(og, fg) : null;

  return (
    <View className="rounded-xl border border-border bg-surface-elevated p-5 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
        Slutværdier
      </Text>

      <View className="flex-row gap-4">
        {/* OG display (read-only from session) */}
        <View className="flex-1">
          <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            OG
          </Text>
          <View className="rounded-lg border border-border-subtle bg-surface px-4 py-3 dark:border-border-subtle-dark dark:bg-surface-dark">
            <Text className="text-text-secondary dark:text-text-secondary-dark">
              {og ? og.toFixed(3) : '-'}
            </Text>
          </View>
        </View>

        {/* FG input */}
        <View className="flex-1">
          <NumberInput
            label="FG (målt)"
            value={fg}
            onChange={onFGChange}
            placeholder="f.eks. 1.012"
            min={0.99}
            max={1.2}
            decimals={3}
          />
        </View>
      </View>

      {/* Calculated results */}
      {abv !== null && abv > 0 && (
        <View className="mt-5 flex-row justify-around rounded-xl bg-primary-subtle py-4 dark:bg-surface-dark">
          <View className="items-center">
            <Text className="text-3xl font-bold text-primary dark:text-primary-light">
              {abv.toFixed(1)}%
            </Text>
            <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-dark dark:text-primary-light">
              ABV
            </Text>
          </View>
          {attenuation !== null && (
            <View className="items-center">
              <Text className="text-3xl font-bold text-primary dark:text-primary-light">
                {attenuation}%
              </Text>
              <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-primary-dark dark:text-primary-light">
                Attenuation
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
