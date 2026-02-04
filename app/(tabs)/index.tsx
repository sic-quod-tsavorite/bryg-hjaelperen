import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  ScrollView as RNScrollView,
  View,
  Text,
  Pressable,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import { ScrollView as GHScrollView } from 'react-native-gesture-handler';

import { CalculationsCard } from '../../src/components/setup/CalculationsCard';
import { HopsSection } from '../../src/components/setup/HopsSection';
import { MaltSection } from '../../src/components/setup/MaltSection';
import { MiscSection } from '../../src/components/setup/MiscSection';
import { VolumeInput } from '../../src/components/setup/VolumeInput';
import { YeastSection } from '../../src/components/setup/YeastSection';
import { ScrollProvider } from '../../src/contexts/ScrollContext';
import { useSessionStore } from '../../src/store/sessionStore';

export default function SetupTab() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Track keyboard height for bottom padding
  useEffect(() => {
    if (Platform.OS === 'web') return;

    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const {
    session,
    setVolume,
    addMalt,
    updateMalt,
    removeMalt,
    addHop,
    updateHop,
    removeHop,
    addMisc,
    updateMisc,
    removeMisc,
    addYeast,
    updateYeast,
    removeYeast,
    resetSession,
  } = useSessionStore();

  const ScrollView = Platform.OS === 'android' ? GHScrollView : RNScrollView;

  const handleReset = () => {
    Alert.alert(
      'Nulstil session',
      'Er du sikker på at du vil nulstille alle data? Dette kan ikke fortrydes.',
      [
        { text: 'Annuller', style: 'cancel' },
        {
          text: 'Nulstil',
          style: 'destructive',
          onPress: resetSession,
        },
      ]
    );
  };

  return (
    <ScrollProvider>
      {(scrollViewRef, handleScroll, scrollEnabled) => (
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 bg-background dark:bg-background-dark"
          keyboardShouldPersistTaps="handled"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          scrollEnabled={scrollEnabled}
        >
          <View className="p-4">
            {/* Header with reset button */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-h2 font-semibold text-text-primary dark:text-text-primary-dark">
                Opsætning
              </Text>
              <Pressable
                onPress={handleReset}
                className="flex-row items-center rounded-lg bg-error-bg px-4 py-2 dark:bg-error-bg-dark"
              >
                <Ionicons name="refresh-outline" size={18} color="#dc2626" />
                <Text className="ml-2 text-sm font-medium text-error">
                  Nulstil
                </Text>
              </Pressable>
            </View>

            {/* Live calculations */}
            <CalculationsCard
              malts={session.malts}
              hops={session.hops}
              volumeLiter={session.volumeLiter}
            />

            {/* Volume input */}
            <View className="mt-4">
              <VolumeInput value={session.volumeLiter} onChange={setVolume} />
            </View>

            {/* Malt section */}
            <MaltSection
              malts={session.malts}
              onAdd={addMalt}
              onUpdate={updateMalt}
              onRemove={removeMalt}
            />

            {/* Hops section */}
            <HopsSection
              hops={session.hops}
              malts={session.malts}
              volumeLiter={session.volumeLiter}
              onAdd={addHop}
              onUpdate={updateHop}
              onRemove={removeHop}
            />

            {/* Misc section */}
            <MiscSection
              misc={session.misc}
              onAdd={addMisc}
              onUpdate={updateMisc}
              onRemove={removeMisc}
            />

            {/* Yeast section */}
            <YeastSection
              yeasts={session.yeasts}
              onAdd={addYeast}
              onUpdate={updateYeast}
              onRemove={removeYeast}
            />

            {/* Bottom padding - extra space when keyboard is open for scrolling */}
            <View
              style={{
                height: keyboardHeight > 0 ? keyboardHeight : 32,
                zIndex: -1,
              }}
            />
          </View>
        </ScrollView>
      )}
    </ScrollProvider>
  );
}
