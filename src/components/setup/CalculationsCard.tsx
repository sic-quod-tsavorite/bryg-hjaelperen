import { View, Text } from 'react-native';

import type { SessionMalt, SessionHop } from '../../types/session';
import {
  calculateOG,
  calculateIBU,
  calculateEBC,
  ebcToColor,
  getColorDescription,
} from '../../utils/calculations';

interface CalculationsCardProps {
  malts: SessionMalt[];
  hops: SessionHop[];
  volumeLiter: number;
}

export function CalculationsCard({
  malts,
  hops,
  volumeLiter,
}: CalculationsCardProps) {
  const og = calculateOG(malts, volumeLiter);
  const ebc = calculateEBC(malts, volumeLiter);
  const ibu = calculateIBU(hops, volumeLiter, og);
  const colorHex = ebcToColor(ebc);
  const colorDesc = getColorDescription(ebc);

  return (
    <View className="mt-6 rounded-xl bg-surface-elevated p-5 shadow-md dark:bg-surface-elevated-dark">
      <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
        Beregnede værdier
      </Text>

      <View className="flex-row justify-between">
        {/* OG */}
        <View className="items-center">
          <Text className="text-3xl font-bold text-primary dark:text-primary-light">
            {og.toFixed(3)}
          </Text>
          <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
            OG
          </Text>
        </View>

        {/* IBU */}
        <View className="items-center">
          <Text className="text-3xl font-bold text-primary dark:text-primary-light">
            {ibu}
          </Text>
          <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
            IBU
          </Text>
        </View>

        {/* EBC with color swatch */}
        <View className="items-center">
          <View className="flex-row items-center">
            <Text className="text-3xl font-bold text-primary dark:text-primary-light">
              {ebc}
            </Text>
            <View
              className="ml-2 h-8 w-8 rounded-full border-2 border-border shadow-sm dark:border-border-dark"
              style={{ backgroundColor: colorHex }}
            />
          </View>
          <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-text-tertiary dark:text-text-tertiary-dark">
            EBC
          </Text>
        </View>
      </View>

      {/* Color description */}
      {ebc > 0 && (
        <View className="mt-4 rounded-lg bg-primary-subtle py-2 dark:bg-surface-dark">
          <Text className="text-center text-sm font-medium text-primary-dark dark:text-primary-light">
            {colorDesc}
          </Text>
        </View>
      )}
    </View>
  );
}
