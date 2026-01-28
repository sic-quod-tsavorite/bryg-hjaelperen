import { Ionicons } from '@expo/vector-icons';
import { View, Text, Pressable } from 'react-native';

import type {
  LogEntry as LogEntryType,
  LogEntryType as LogType,
} from '../../types/session';
import { useResolvedTheme } from '../ThemeProvider';

const typeLabels: Record<LogType, string> = {
  maeskning: 'Mæskning',
  kogning: 'Kogning',
  gaering: 'Gæring',
  torhumling: 'Tørhumling',
  flaskning: 'Flaskning',
  smagning: 'Smagning',
  andet: 'Andet',
};

const typeIcons: Record<LogType, keyof typeof Ionicons.glyphMap> = {
  maeskning: 'thermometer-outline',
  kogning: 'flame-outline',
  gaering: 'water-outline',
  torhumling: 'leaf-outline',
  flaskning: 'wine-outline',
  smagning: 'restaurant-outline',
  andet: 'document-text-outline',
};

interface LogEntryProps {
  entry: LogEntryType;
  onRemove: () => void;
}

export function LogEntryDisplay({ entry, onRemove }: LogEntryProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const formattedDate = new Date(entry.dato).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View className="mb-3 rounded-xl border border-border bg-surface-elevated p-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 flex-row items-center">
          <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle dark:bg-surface-dark">
            <Ionicons
              name={typeIcons[entry.type]}
              size={22}
              color={isDark ? '#4ade80' : '#1a7f45'}
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-text-primary dark:text-text-primary-dark">
              {entry.titel}
            </Text>
            <Text className="mt-0.5 text-xs text-text-tertiary dark:text-text-tertiary-dark">
              {typeLabels[entry.type]} • {formattedDate}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onRemove}
          className="h-8 w-8 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark"
        >
          <Ionicons name="trash-outline" size={16} color="#dc2626" />
        </Pressable>
      </View>

      {entry.beskrivelse.length > 0 && (
        <Text className="mt-3 leading-5 text-text-secondary dark:text-text-secondary-dark">
          {entry.beskrivelse}
        </Text>
      )}

      {/* Measurements */}
      {entry.maalinger && (
        <View className="mt-3 flex-row gap-4">
          {entry.maalinger.temperatur !== undefined && (
            <View className="flex-row items-center rounded-lg bg-surface px-3 py-1.5 dark:bg-surface-dark">
              <Ionicons
                name="thermometer-outline"
                size={14}
                color={isDark ? '#4ade80' : '#1a7f45'}
              />
              <Text className="ml-1.5 text-sm font-medium text-text-primary dark:text-text-primary-dark">
                {entry.maalinger.temperatur}°C
              </Text>
            </View>
          )}
          {entry.maalinger.sg !== undefined && (
            <View className="flex-row items-center rounded-lg bg-surface px-3 py-1.5 dark:bg-surface-dark">
              <Ionicons
                name="analytics-outline"
                size={14}
                color={isDark ? '#4ade80' : '#1a7f45'}
              />
              <Text className="ml-1.5 text-sm font-medium text-text-primary dark:text-text-primary-dark">
                SG {entry.maalinger.sg.toFixed(3)}
              </Text>
            </View>
          )}
          {entry.maalinger.ph !== undefined && (
            <View className="flex-row items-center rounded-lg bg-surface px-3 py-1.5 dark:bg-surface-dark">
              <Ionicons
                name="flask-outline"
                size={14}
                color={isDark ? '#4ade80' : '#1a7f45'}
              />
              <Text className="ml-1.5 text-sm font-medium text-text-primary dark:text-text-primary-dark">
                pH {entry.maalinger.ph.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
