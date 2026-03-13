import { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';

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
  faktiskOG: number | null;
  onOGChange: (og: number | null) => void;
}

export function CalculationsCard({
  malts,
  hops,
  volumeLiter,
  faktiskOG,
  onOGChange,
}: CalculationsCardProps) {
  const calculatedOG = calculateOG(malts, volumeLiter);
  const displayOG = faktiskOG ?? calculatedOG;
  const isOverridden = faktiskOG !== null;
  const ebc = calculateEBC(malts, volumeLiter);
  const ibu = calculateIBU(hops, volumeLiter, displayOG);
  const colorHex = ebcToColor(ebc);
  const colorDesc = getColorDescription(ebc);
  const bitternessDesc = getBitternessDescription(ibu, displayOG);
  const [showBUGU, setShowBUGU] = useState(false);
  const [showEBC, setShowEBC] = useState(false);
  const gravityUnits = (displayOG - 1) * 1000;
  const buguRatio = gravityUnits > 0 ? (ibu / gravityUnits).toFixed(2) : '0';

  const [ogText, setOgText] = useState(() => {
    return faktiskOG !== null ? faktiskOG.toFixed(3) : calculatedOG.toFixed(3);
  });
  const [isFocused, setIsFocused] = useState(false);

  // Sync local text from store when not focused
  useEffect(() => {
    if (!isFocused) {
      setOgText(
        faktiskOG !== null ? faktiskOG.toFixed(3) : calculatedOG.toFixed(3)
      );
    }
  }, [faktiskOG, isFocused, calculatedOG]);

  const handleOGChange = (text: string) => {
    if (text === '') {
      setOgText('');
      onOGChange(null);
      return;
    }

    const cleanText = text.replace(',', '.');

    if (!/^\d*\.?\d*$/.test(cleanText)) {
      return;
    }

    setOgText(cleanText);

    const num = parseFloat(cleanText);

    if (isNaN(num)) {
      return;
    }

    if (num < 1 || num > 1.2) return;

    onOGChange(num);
  };

  return (
    <View className="mt-6 rounded-xl bg-surface-elevated p-5 shadow-md dark:bg-surface-elevated-dark">
      <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark">
        Beregnede værdier
      </Text>

      <View className="flex-row justify-between">
        {/* OG - Editable */}
        <View className="items-center">
          <TextInput
            className={`text-3xl font-bold ${
              isOverridden
                ? 'text-warning'
                : 'text-primary dark:text-primary-light'
            }`}
            style={{
              textAlign: 'center',
              minWidth: 80,
              padding: 0,
              margin: 0,
              includeFontPadding: false,
              textAlignVertical: 'center',
            }}
            value={ogText}
            onChangeText={handleOGChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={calculatedOG.toFixed(3)}
            placeholderTextColor={isOverridden ? '#d97706' : '#1a7f45'}
            keyboardType="decimal-pad"
            inputMode="decimal"
          />
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
