import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';

import type { SessionMalt, SessionHop } from '../../types/session';
import {
  calculateOG,
  calculateIBU,
  calculateEBC,
  ebcToColor,
  getColorDescription,
  getBitternessDescription,
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
  const bitternessDesc = getBitternessDescription(ibu, og);
  const [showBUGU, setShowBUGU] = useState(false);
  const [showEBC, setShowEBC] = useState(false);
  const gravityUnits = (og - 1) * 1000;
  const buguRatio = gravityUnits > 0 ? (ibu / gravityUnits).toFixed(2) : '0';

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

      {/* Color and bitterness descriptions */}
      {(ebc > 0 || ibu > 0) && (
        <View className="mt-4 flex-row gap-2">
          {ibu > 0 && (
            <Pressable
              className="flex-1 rounded-lg bg-primary-subtle py-2 dark:bg-surface-dark"
              onPress={() => setShowBUGU((prev) => !prev)}
            >
              <Text className="text-center text-sm font-medium text-primary-dark dark:text-primary-light">
                {showBUGU ? `${buguRatio} BU:GU` : bitternessDesc}
              </Text>
            </Pressable>
          )}
          {ebc > 0 && (
            <Pressable
              className="flex-1 rounded-lg bg-primary-subtle py-2 dark:bg-surface-dark"
              onPress={() => setShowEBC((prev) => !prev)}
            >
              <Text className="text-center text-sm font-medium text-primary-dark dark:text-primary-light">
                {showEBC ? `${ebc} EBC` : colorDesc}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
