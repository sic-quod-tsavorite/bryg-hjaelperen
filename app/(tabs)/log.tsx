import { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  useDerivedValue,
  SharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { SectionHeader } from '../../src/components/common/SectionHeader';
import { ExportButton } from '../../src/components/log/ExportButton';
import { FGInput } from '../../src/components/log/FGInput';
import { LogEntryDisplay } from '../../src/components/log/LogEntry';
import { LogForm } from '../../src/components/log/LogForm';
import { PhotoPicker } from '../../src/components/log/PhotoPicker';
import { StylePicker } from '../../src/components/setup/StylePicker';
import { useResolvedTheme } from '../../src/components/ThemeProvider';
import { useSessionStore } from '../../src/store/sessionStore';
import type { LogEntry as LogEntryType } from '../../src/types/session';

interface DraggableLogEntryProps {
  entry: LogEntryType;
  visualIndex: number;
  onRemove: () => void;
  onEdit: () => void;
  draggedId: SharedValue<string | null>;
  dragOffset: SharedValue<number>;
  startIndex: SharedValue<number | null>;
  currentIndex: SharedValue<number | null>;
  panGesture: ReturnType<typeof Gesture.Pan>;
}

const ENTRY_HEIGHT = 120; // Approximate height including gap

function DraggableLogEntry({
  entry,
  visualIndex,
  onRemove,
  onEdit,
  draggedId,
  dragOffset,
  startIndex,
  currentIndex,
  panGesture,
}: DraggableLogEntryProps) {
  const isDragged = useDerivedValue(() => draggedId.value === entry.id);

  const animatedStyle = useAnimatedStyle(() => {
    const draggedEntryId = draggedId.value;
    const startIdx = startIndex.value;
    const currIdx = currentIndex.value;

    if (draggedEntryId === null || startIdx === null || currIdx === null) {
      return { transform: [{ translateY: 0 }] };
    }

    // Dragged item follows finger
    if (isDragged.value) {
      return {
        transform: [{ translateY: dragOffset.value }],
        zIndex: 1000,
      };
    }

    // Items shift dynamically based on where the dragged item currently is
    let targetShift = 0;

    if (currIdx > startIdx) {
      // Dragging down: items between start and current shift up
      if (visualIndex > startIdx && visualIndex <= currIdx) {
        targetShift = -ENTRY_HEIGHT;
      }
    } else if (currIdx < startIdx) {
      // Dragging up: items between current and start shift down
      if (visualIndex >= currIdx && visualIndex < startIdx) {
        targetShift = ENTRY_HEIGHT;
      }
    }

    return { transform: [{ translateY: withSpring(targetShift) }] };
  });

  return (
    <Animated.View style={animatedStyle}>
      <LogEntryDisplay
        entry={entry}
        onRemove={onRemove}
        onEdit={onEdit}
        visualIndex={visualIndex}
        dragGesture={panGesture}
      />
    </Animated.View>
  );
}

export default function LogTab() {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const {
    session,
    setStil,
    setNavn,
    setBeskrivelse,
    setFaktiskFG,
    addPhoto,
    removePhoto,
    addLogEntry,
    removeLogEntry,
    updateLogEntry,
    reorderLogEntries,
  } = useSessionStore();

  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

  const displayOG = session.faktiskOG ?? session.beregnetOG;

  const reversedEntries = useMemo(() => {
    return [...session.logIndlaeg].reverse();
  }, [session.logIndlaeg]);

  const draggedEntryId = useSharedValue<string | null>(null);
  const dragOffset = useSharedValue<number>(0);
  const startIndex = useSharedValue<number | null>(null);
  const currentIndex = useSharedValue<number | null>(null);
  const lastReorderId = useSharedValue<string | null>(null);

  // Reset animation values after reorder completes to avoid flicker
  useEffect(() => {
    if (lastReorderId.value !== null) {
      draggedEntryId.value = null;
      startIndex.value = null;
      currentIndex.value = null;
      dragOffset.value = 0;
      lastReorderId.value = null;
    }
  }, [
    session.logIndlaeg,
    draggedEntryId,
    startIndex,
    currentIndex,
    dragOffset,
    lastReorderId,
  ]);

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        <Text className="mb-6 text-h2 font-semibold text-text-primary dark:text-text-primary-dark">
          Bryggelog
        </Text>

        <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
          Ølnavn
        </Text>
        <TextInput
          className="mb-4 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-lg text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
          value={session.navn}
          onChangeText={setNavn}
          placeholder="Navngiv dit bryg..."
          placeholderTextColor="#a3a3a3"
        />

        <View className="mb-4">
          <StylePicker
            value={session.stil}
            onChange={setStil}
            isDark={isDark}
          />
        </View>

        <Text className="mb-2 text-sm font-medium text-text-secondary dark:text-text-secondary-dark">
          Beskrivelse
        </Text>
        <TextInput
          className="mb-4 min-h-[100px] rounded-lg border border-border bg-surface-elevated px-4 py-3 text-text-primary dark:border-border-dark dark:bg-surface-elevated-dark dark:text-text-primary-dark"
          value={session.beskrivelse}
          onChangeText={setBeskrivelse}
          placeholder="Noter om dit bryg, inspiration, mål..."
          placeholderTextColor="#a3a3a3"
          multiline
          textAlignVertical="top"
        />

        <SectionHeader title="Målinger" icon="analytics-outline" />
        <FGInput
          og={displayOG}
          fg={session.faktiskFG}
          onFGChange={setFaktiskFG}
        />

        <SectionHeader title="Fotos" icon="camera-outline" />
        <PhotoPicker
          photos={session.fotos}
          onAdd={addPhoto}
          onRemove={removePhoto}
        />

        <SectionHeader title="Logindlæg" icon="document-text-outline" />

        <LogForm
          onSubmit={addLogEntry}
          onUpdate={(entry) => updateLogEntry(entry.id, entry)}
          onCancelEdit={() => setEditingEntryId(null)}
          entryToEdit={
            editingEntryId
              ? (session.logIndlaeg.find((e) => e.id === editingEntryId) ??
                null)
              : null
          }
        />

        {session.logIndlaeg.length > 0 && (
          <View className="mt-4 gap-2">
            {reversedEntries.map((entry, visualIndex) => {
              const totalCount = session.logIndlaeg.length;
              const panGesture = Gesture.Pan()
                .onBegin(() => {
                  draggedEntryId.value = entry.id;
                  startIndex.value = visualIndex;
                  currentIndex.value = visualIndex;
                  dragOffset.value = 0;
                })
                .onUpdate((event) => {
                  dragOffset.value = event.translationY;
                  // Calculate current position in real-time
                  const startIdx = startIndex.value ?? visualIndex;
                  const delta = Math.round(event.translationY / ENTRY_HEIGHT);
                  const newIndex = Math.max(
                    0,
                    Math.min(totalCount - 1, startIdx + delta)
                  );
                  currentIndex.value = newIndex;
                })
                .onEnd(() => {
                  const startIdx = startIndex.value ?? visualIndex;
                  const currIdx = currentIndex.value ?? visualIndex;

                  const fromActualIndex = totalCount - 1 - startIdx;
                  const toActualIndex = totalCount - 1 - currIdx;

                  if (fromActualIndex !== toActualIndex) {
                    // Mark reordering so useEffect knows to reset values after render
                    lastReorderId.value = entry.id;
                    const newOrder = [...session.logIndlaeg];
                    const [removed] = newOrder.splice(fromActualIndex, 1);
                    newOrder.splice(toActualIndex, 0, removed);
                    scheduleOnRN(
                      reorderLogEntries,
                      newOrder.map((e) => e.id)
                    );
                  } else {
                    // No reorder happened, reset immediately
                    draggedEntryId.value = null;
                    startIndex.value = null;
                    currentIndex.value = null;
                    dragOffset.value = 0;
                  }
                });

              return (
                <DraggableLogEntry
                  key={entry.id}
                  entry={entry}
                  visualIndex={visualIndex}
                  onRemove={() => removeLogEntry(entry.id)}
                  onEdit={() => setEditingEntryId(entry.id)}
                  draggedId={draggedEntryId}
                  dragOffset={dragOffset}
                  startIndex={startIndex}
                  currentIndex={currentIndex}
                  panGesture={panGesture}
                />
              );
            })}
          </View>
        )}

        <View className="mt-6">
          <ExportButton session={session} />
        </View>

        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
