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
    if (photos.length >= 1) {
      Alert.alert('Max fotos', 'Du kan kun tilføje ét foto.');
      return;
    }

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
    if (photos.length >= 1) {
      Alert.alert('Max fotos', 'Du kan kun tilføje ét foto.');
      return;
    }

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
              <View key={uri} className="relative">
                <Pressable
                  onLongPress={() => onRemove(uri)}
                  className="rounded-xl"
                >
                  <Image
                    source={{ uri }}
                    className="h-28 w-28 rounded-xl"
                    resizeMode="cover"
                    onError={() => onRemove(uri)}
                  />
                </Pressable>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onRemove(uri);
                  }}
                  className="absolute right-2 top-2 h-7 w-7 items-center justify-center rounded-full bg-error shadow-sm"
                >
                  <Ionicons name="close" size={16} color="white" />
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View className="flex-row gap-3">
        <Pressable
          onPress={handlePickImage}
          disabled={photos.length >= 1}
          className={`flex-1 flex-row items-center justify-center rounded-xl border py-4 shadow-sm ${
            photos.length >= 1
              ? 'border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'
              : 'border-border bg-surface-elevated dark:border-border-dark dark:bg-surface-elevated-dark'
          }`}
        >
          <Ionicons
            name="images-outline"
            size={20}
            color={
              photos.length >= 1 ? '#9ca3af' : isDark ? '#4ade80' : '#1a7f45'
            }
          />
          <Text
            className={`ml-2 font-medium ${
              photos.length >= 1
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-primary dark:text-primary-light'
            }`}
          >
            {photos.length >= 1 ? 'Foto tilføjet' : 'Vælg foto'}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleTakePhoto}
          disabled={photos.length >= 1}
          className={`flex-1 flex-row items-center justify-center rounded-xl border py-4 shadow-sm ${
            photos.length >= 1
              ? 'border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800'
              : 'border-border bg-surface-elevated dark:border-border-dark dark:bg-surface-elevated-dark'
          }`}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={
              photos.length >= 1 ? '#9ca3af' : isDark ? '#4ade80' : '#1a7f45'
            }
          />
          <Text
            className={`ml-2 font-medium ${
              photos.length >= 1
                ? 'text-gray-400 dark:text-gray-500'
                : 'text-primary dark:text-primary-light'
            }`}
          >
            {photos.length >= 1 ? 'Ikke tilladt' : 'Tag foto'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
