import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, Pressable, Image, ScrollView, Alert } from 'react-native';

import { useResolvedTheme } from '../ThemeProvider';

interface PhotoPickerProps {
  photos: string[];
  onAdd: (uri: string) => void;
  onRemove: (uri: string) => void;
}

export function PhotoPicker({ photos, onAdd, onRemove }: PhotoPickerProps) {
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const handlePickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Tilladelse påkrævet',
        'Vi har brug for adgang til dit billedbibliotek for at tilføje fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onAdd(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Tilladelse påkrævet',
        'Vi har brug for adgang til dit kamera for at tage fotos.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onAdd(result.assets[0].uri);
    }
  };

  const handleRemove = (uri: string) => {
    Alert.alert('Fjern foto', 'Er du sikker på at du vil fjerne dette foto?', [
      { text: 'Annuller', style: 'cancel' },
      {
        text: 'Fjern',
        style: 'destructive',
        onPress: () => onRemove(uri),
      },
    ]);
  };

  return (
    <View>
      {photos.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          <View className="flex-row gap-3">
            {photos.map((uri) => (
              <Pressable
                key={uri}
                onLongPress={() => handleRemove(uri)}
                className="relative"
              >
                <Image
                  source={{ uri }}
                  className="h-28 w-28 rounded-xl"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleRemove(uri)}
                  className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full bg-error shadow-sm"
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}

      <View className="flex-row gap-3">
        <Pressable
          onPress={handlePickImage}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-border bg-surface-elevated py-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark"
        >
          <Ionicons
            name="images-outline"
            size={20}
            color={isDark ? '#4ade80' : '#1a7f45'}
          />
          <Text className="ml-2 font-medium text-primary dark:text-primary-light">
            Vælg foto
          </Text>
        </Pressable>

        <Pressable
          onPress={handleTakePhoto}
          className="flex-1 flex-row items-center justify-center rounded-xl border border-border bg-surface-elevated py-4 shadow-sm dark:border-border-dark dark:bg-surface-elevated-dark"
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={isDark ? '#4ade80' : '#1a7f45'}
          />
          <Text className="ml-2 font-medium text-primary dark:text-primary-light">
            Tag foto
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
