import { View, Text } from 'react-native';

import { calculateABV, calculateAttenuation } from '../../utils/calculations';
import { NumberInput } from '../common/NumberInput';

interface FGInputProps {
  calculatedOG: number | null;
  faktiskOG: number | null;
  fg: number | null;
  onOGChange: (og: number | null) => void;
  onFGChange: (fg: number | null) => void;
}

export function FGInput({
  calculatedOG,
  faktiskOG,
  fg,
  onOGChange,
  onFGChange,
}: FGInputProps) {
  const displayOG = faktiskOG ?? calculatedOG;
  const abv = displayOG && fg ? calculateABV(displayOG, fg) : null;
  const attenuation =
    displayOG && fg ? calculateAttenuation(displayOG, fg) : null;
  const isOGOverridden = faktiskOG !== null;

  return (
    <View className="rounded-xl border border-border bg-surface-elevated p-5 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
        Slutværdier
      </Text>

      <View className="flex-row gap-4">
        {/* OG input */}
        <View className="flex-1">
          <NumberInput
            label="OG"
            value={faktiskOG}
            onChange={onOGChange}
            placeholder={calculatedOG?.toFixed(3) || ''}
            min={1}
            max={1.2}
            decimals={3}
            status={isOGOverridden ? 'warning' : 'default'}
          />
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
