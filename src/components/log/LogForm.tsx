import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';

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
  onUpdate?: (entry: LogEntry) => void;
  onCancelEdit?: () => void;
  entryToEdit?: LogEntry | null;
}

export function LogForm({
  onSubmit,
  onUpdate,
  onCancelEdit,
  entryToEdit,
}: LogFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [type, setType] = useState<LogEntryType>('maeskning');
  const [titel, setTitel] = useState('');
  const [beskrivelse, setBeskrivelse] = useState('');
  const [temperatur, setTemperatur] = useState<number | null>(null);
  const [sg, setSg] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const [dateString, setDateString] = useState<string>('');
  const [timeString, setTimeString] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  // Pre-fill form when entryToEdit changes
  useEffect(() => {
    if (entryToEdit) {
      setEditingEntryId(entryToEdit.id);
      setType(entryToEdit.type);
      setTitel(entryToEdit.titel);
      setBeskrivelse(entryToEdit.beskrivelse);
      setTemperatur(entryToEdit.maalinger?.temperatur ?? null);
      setSg(entryToEdit.maalinger?.sg ?? null);
      setPh(entryToEdit.maalinger?.ph ?? null);
      // Only pre-fill date/time if they were explicitly set when entry was created
      setDateString(entryToEdit.visDato ? entryToEdit.dato.split('T')[0] : '');
      setTimeString(
        entryToEdit.visTid
          ? (entryToEdit.dato.split('T')[1]?.slice(0, 5) ?? '')
          : ''
      );
      setIsExpanded(true);
    } else {
      setEditingEntryId(null);
      setType('maeskning');
      setTitel('');
      setBeskrivelse('');
      setTemperatur(null);
      setSg(null);
      setPh(null);
      setDateString('');
      setTimeString('');
    }
  }, [entryToEdit]);

  const handleSubmit = () => {
    if (titel.trim().length === 0) return;

    const baseEntry = {
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
      dato: (() => {
        if (dateString && timeString) {
          const [year, month, day] = dateString.split('-').map(Number);
          const [hours, minutes] = timeString.split(':').map(Number);
          const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
          return date.toISOString();
        } else if (dateString) {
          const [year, month, day] = dateString.split('-').map(Number);
          const date = new Date(year, month - 1, day, 0, 0, 0, 0);
          return date.toISOString();
        } else if (timeString) {
          const today = new Date();
          const [hours, minutes] = timeString.split(':').map(Number);
          today.setHours(hours, minutes, 0, 0);
          return today.toISOString();
        } else {
          return new Date().toISOString();
        }
      })(),
      visDato: dateString.length > 0,
      visTid: timeString.length > 0,
    };

    if (editingEntryId && onUpdate) {
      // Update existing entry
      onUpdate({ ...baseEntry, id: editingEntryId });
    } else {
      // Create new entry
      const entry: LogEntry = {
        ...baseEntry,
        id: Math.random().toString(36).substring(2, 11),
      };
      onSubmit(entry);
    }

    // Reset form
    setTitel('');
    setBeskrivelse('');
    setTemperatur(null);
    setSg(null);
    setPh(null);
    setDateString('');
    setTimeString('');
    setIsExpanded(false);
    setEditingEntryId(null);
    onCancelEdit?.();
  };

  if (!isExpanded) {
    return (
      <Pressable
        onPress={() => {
          setDateString('');
          setTimeString('');
          setIsExpanded(true);
        }}
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

  const isEditing = editingEntryId !== null;

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
                    ? 'bg-primary-light'
                    : 'bg-primary'
                  : isDark
                    ? 'border border-border-dark bg-surface-dark'
                    : 'border border-border bg-surface'
              }`}
              style={
                type === t
                  ? isDark
                    ? {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                  : undefined
              }
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

      {/* Optional measurements - only show for relevant types */}
      {(type === 'maeskning' ||
        type === 'kogning' ||
        type === 'gaering' ||
        type === 'smagning') && (
        <>
          <Text className="mb-3 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
            Målinger (valgfrit)
          </Text>
          <View className="mb-4 flex-row gap-3">
            {(type === 'maeskning' ||
              type === 'kogning' ||
              type === 'gaering') && (
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
            )}
            {(type === 'gaering' || type === 'smagning') && (
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
            )}
            {type === 'gaering' && (
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
            )}
          </View>
        </>
      )}

      {/* Date/Time selector - platform specific */}
      <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
        Dato og tid (valgfrit)
      </Text>
      <View className="mb-4 flex-row gap-2">
        {Platform.OS === 'web' ? (
          <>
            <View className="flex-1">
              <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                Dato
              </Text>
              <input
                type="date"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                onClick={(e) => {
                  e.currentTarget.focus();
                  if (typeof e.currentTarget.showPicker === 'function') {
                    e.currentTarget.showPicker();
                  }
                }}
                className="w-full cursor-pointer rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
                Tid
              </Text>
              <input
                type="time"
                value={timeString}
                onChange={(e) => setTimeString(e.target.value)}
                onClick={(e) => {
                  e.currentTarget.focus();
                  if (typeof e.currentTarget.showPicker === 'function') {
                    e.currentTarget.showPicker();
                  }
                }}
                className="w-full cursor-pointer rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
              />
            </View>
          </>
        ) : (
          <>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="flex-1 flex-row items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 py-3 dark:border-border-dark dark:bg-surface-elevated-dark"
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={isDark ? '#9ca3af' : '#525252'}
              />
              <Text className="ml-2 text-text-primary dark:text-text-primary-dark">
                {dateString
                  ? (() => {
                      const [year, month, day] = dateString
                        .split('-')
                        .map(Number);
                      const date = new Date(year, month - 1, day);
                      return date.toLocaleDateString('da-DK', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });
                    })()
                  : 'Vælg dato'}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowTimePicker(true)}
              className="flex-1 flex-row items-center justify-center rounded-lg border border-border bg-surface-elevated px-4 py-3 dark:border-border-dark dark:bg-surface-elevated-dark"
            >
              <Ionicons
                name="time-outline"
                size={20}
                color={isDark ? '#9ca3af' : '#525252'}
              />
              <Text className="ml-2 text-text-primary dark:text-text-primary-dark">
                {timeString
                  ? (() => {
                      const [hours, minutes] = timeString
                        .split(':')
                        .map(Number);
                      const date = new Date();
                      date.setHours(hours, minutes, 0, 0);
                      return date.toLocaleTimeString('da-DK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    })()
                  : 'Vælg tid'}
              </Text>
            </Pressable>
          </>
        )}
        {(dateString || timeString) && (
          <Pressable
            onPress={() => {
              setDateString('');
              setTimeString('');
            }}
            className="bg-error-subtle dark:bg-error-subtle-dark w-12 flex-row items-center justify-center self-end rounded-lg border border-error py-3 dark:border-error"
          >
            <Ionicons name="close-circle" size={20} color="#dc2626" />
          </Pressable>
        )}
      </View>

      {/* Native Date Picker Modal */}
      {Platform.OS !== 'web' && showDatePicker && (
        <DateTimePicker
          value={
            dateString
              ? (() => {
                  const [year, month, day] = dateString.split('-').map(Number);
                  return new Date(year, month - 1, day);
                })()
              : new Date()
          }
          mode="date"
          locale="da-DK"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowDatePicker(false);
            if (date) {
              const dateStr = date.toISOString().split('T')[0];
              setDateString(dateStr);
            }
          }}
        />
      )}

      {/* Native Time Picker Modal */}
      {Platform.OS !== 'web' && showTimePicker && (
        <DateTimePicker
          value={
            dateString && timeString
              ? (() => {
                  const [year, month, day] = dateString.split('-').map(Number);
                  const [hours, minutes] = timeString.split(':').map(Number);
                  const d = new Date(year, month - 1, day);
                  d.setHours(hours, minutes, 0, 0);
                  return d;
                })()
              : new Date()
          }
          mode="time"
          locale="da-DK"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, date) => {
            setShowTimePicker(false);
            if (date) {
              const timeStr = date.toTimeString().slice(0, 5);
              setTimeString(timeStr);
            }
          }}
        />
      )}

      {/* Actions */}
      <View className="flex-row gap-3">
        <Pressable
          onPress={() => {
            if (isEditing) {
              // If editing, cancel edit mode and reset form
              setEditingEntryId(null);
              setTitel('');
              setBeskrivelse('');
              setTemperatur(null);
              setSg(null);
              setPh(null);
              setDateString('');
              setTimeString('');
              setIsExpanded(false);
              // Notify parent to clear edit state
              onCancelEdit?.();
            } else {
              // If not editing, just collapse the form
              setIsExpanded(false);
            }
          }}
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
            {isEditing ? 'Opdater' : 'Tilføj'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
