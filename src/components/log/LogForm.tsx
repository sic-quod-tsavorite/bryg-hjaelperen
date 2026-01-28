import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';

import type { LogEntry, LogEntryType } from '../../types/session';
import { NumberInput } from '../common/NumberInput';
import { useResolvedTheme } from '../ThemeProvider';

const typeLabels: Record<LogEntryType, string> = {
  maeskning: 'Mæskning',
  kogning: 'Kogning',
  gaering: 'Gæring',
  torhumling: 'Tørhumling',
  flaskning: 'Flaskning',
  smagning: 'Smagning',
  andet: 'Andet',
};

interface LogFormProps {
  onSubmit: (entry: LogEntry) => void;
}

export function LogForm({ onSubmit }: LogFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [type, setType] = useState<LogEntryType>('gaering');
  const [titel, setTitel] = useState('');
  const [beskrivelse, setBeskrivelse] = useState('');
  const [temperatur, setTemperatur] = useState<number | null>(null);
  const [sg, setSg] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handleSubmit = () => {
    if (titel.trim().length === 0) return;

    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      dato: new Date().toISOString(),
      type,
      titel: titel.trim(),
      beskrivelse: beskrivelse.trim(),
      maalinger:
        temperatur !== null || sg !== null || ph !== null
          ? {
              ...(temperatur !== null && { temperatur }),
              ...(sg !== null && { sg }),
              ...(ph !== null && { ph }),
            }
          : undefined,
    };

    onSubmit(entry);

    // Reset form
    setTitel('');
    setBeskrivelse('');
    setTemperatur(null);
    setSg(null);
    setPh(null);
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Pressable
        onPress={() => setIsExpanded(true)}
        className="flex-row items-center justify-center rounded-xl border-2 border-dashed border-primary bg-primary-subtle py-5 dark:border-primary-light dark:bg-surface-dark"
      >
        <Ionicons
          name="add-circle-outline"
          size={24}
          color={isDark ? '#4ade80' : '#1a7f45'}
        />
        <Text className="ml-2 text-base font-semibold text-primary dark:text-primary-light">
          Tilføj logindlæg
        </Text>
      </Pressable>
    );
  }

  return (
    <View className="rounded-xl border border-border bg-surface-elevated p-5 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark">
      <Text className="mb-4 text-lg font-semibold text-text-primary dark:text-text-primary-dark">
        Nyt logindlæg
      </Text>

      {/* Type selector */}
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Type
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {(Object.keys(typeLabels) as LogEntryType[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => setType(t)}
              className={`rounded-full px-4 py-2 ${
                type === t
                  ? isDark
                    ? 'bg-primary-light shadow-sm'
                    : 'bg-primary shadow-sm'
                  : isDark
                    ? 'border border-border-dark bg-surface-dark'
                    : 'border border-border bg-surface'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  type === t
                    ? isDark
                      ? 'text-background-dark'
                      : 'text-text-inverse'
                    : isDark
                      ? 'text-text-secondary-dark'
                      : 'text-text-secondary'
                }`}
              >
                {typeLabels[t]}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Title */}
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Titel
      </Text>
      <TextInput
        className="mb-4 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
        value={titel}
        onChangeText={setTitel}
        placeholder="f.eks. SG måling dag 3"
        placeholderTextColor="#a3a3a3"
      />

      {/* Description */}
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Beskrivelse
      </Text>
      <TextInput
        className="mb-4 min-h-[80px] rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
        value={beskrivelse}
        onChangeText={setBeskrivelse}
        placeholder="Noter, observationer..."
        placeholderTextColor="#a3a3a3"
        multiline
        textAlignVertical="top"
      />

      {/* Optional measurements */}
      <Text className="mb-3 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Målinger (valgfrit)
      </Text>
      <View className="mb-4 flex-row gap-3">
        <View className="flex-1">
          <NumberInput
            label="Temp"
            value={temperatur}
            onChange={setTemperatur}
            unit="°C"
            placeholder="-"
            min={0}
            max={100}
          />
        </View>
        <View className="flex-1">
          <NumberInput
            label="SG"
            value={sg}
            onChange={setSg}
            placeholder="-"
            min={0.99}
            max={1.2}
            decimals={3}
          />
        </View>
        <View className="flex-1">
          <NumberInput
            label="pH"
            value={ph}
            onChange={setPh}
            placeholder="-"
            min={0}
            max={14}
            decimals={1}
          />
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => setIsExpanded(false)}
          className="flex-1 items-center rounded-xl border border-border bg-surface py-4 dark:border-border-dark dark:bg-surface-dark"
        >
          <Text className="font-semibold text-text-secondary dark:text-text-secondary-dark">
            Annuller
          </Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          disabled={titel.trim().length === 0}
          className={`flex-1 items-center rounded-xl py-4 shadow-sm ${
            titel.trim().length === 0
              ? 'bg-border dark:bg-border-dark'
              : isDark
                ? 'bg-primary-light'
                : 'bg-primary'
          }`}
        >
          <Text
            className={`font-semibold ${
              titel.trim().length === 0
                ? 'text-text-tertiary dark:text-text-tertiary-dark'
                : isDark
                  ? 'text-background-dark'
                  : 'text-text-inverse'
            }`}
          >
            Tilføj
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
