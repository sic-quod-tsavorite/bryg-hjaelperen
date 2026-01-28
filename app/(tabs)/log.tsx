import { ScrollView, View, Text, TextInput } from 'react-native';

import { SectionHeader } from '../../src/components/common/SectionHeader';
import { ExportButton } from '../../src/components/log/ExportButton';
import { FGInput } from '../../src/components/log/FGInput';
import { LogEntryDisplay } from '../../src/components/log/LogEntry';
import { LogForm } from '../../src/components/log/LogForm';
import { PhotoPicker } from '../../src/components/log/PhotoPicker';
import { useSessionStore } from '../../src/store/sessionStore';

export default function LogTab() {
  const {
    session,
    setNavn,
    setBeskrivelse,
    setFaktiskFG,
    addPhoto,
    removePhoto,
    addLogEntry,
    removeLogEntry,
  } = useSessionStore();

  // Use calculated OG or actual OG if measured
  const displayOG = session.faktiskOG ?? session.beregnetOG;

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        <Text className="mb-6 text-h2 font-semibold text-text-primary dark:text-text-primary-dark">
          Bryggelog
        </Text>

        {/* Beer name */}
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

        {/* Description */}
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

        {/* FG Input with ABV calculation */}
        <SectionHeader title="Målinger" icon="analytics-outline" />
        <FGInput
          og={displayOG}
          fg={session.faktiskFG}
          onFGChange={setFaktiskFG}
        />

        {/* Photos */}
        <SectionHeader title="Fotos" icon="camera-outline" />
        <PhotoPicker
          photos={session.fotos}
          onAdd={addPhoto}
          onRemove={removePhoto}
        />

        {/* Log entries */}
        <SectionHeader title="Logindlæg" icon="document-text-outline" />

        {/* Add new entry form */}
        <LogForm onSubmit={addLogEntry} />

        {/* Existing entries */}
        {session.logIndlaeg.length > 0 && (
          <View className="mt-4">
            {session.logIndlaeg
              .slice()
              .reverse()
              .map((entry) => (
                <LogEntryDisplay
                  key={entry.id}
                  entry={entry}
                  onRemove={() => removeLogEntry(entry.id)}
                />
              ))}
          </View>
        )}

        {/* Export button */}
        <View className="mt-6">
          <ExportButton session={session} />
        </View>

        {/* Bottom padding */}
        <View className="h-8" />
      </View>
    </ScrollView>
  );
}
