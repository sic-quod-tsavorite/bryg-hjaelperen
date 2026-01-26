import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { View, Text, Pressable, ScrollView } from 'react-native';

import { useResolvedTheme } from '../../src/components/ThemeProvider';
import miscData from '../../src/data/misc.json';
import type { PredefinedMisc } from '../../src/types/ingredients';

const predefinedMisc: PredefinedMisc[] = miscData as PredefinedMisc[];

const kategoriLabels: Record<string, string> = {
  klaring: 'Klaring',
  sukker: 'Sukker',
  krydderi: 'Krydderi',
  gaering: 'Gæring',
  modning: 'Modning',
};

export default function IngredientInfoModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const ingredient = predefinedMisc.find((m) => m.id === id);

  if (!ingredient) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-4 dark:bg-background-dark">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-error-bg dark:bg-error-bg-dark">
          <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
        </View>
        <Text className="mt-4 text-lg font-semibold text-text-primary dark:text-text-primary-dark">
          Ingrediens ikke fundet
        </Text>
        <Pressable
          onPress={() => router.back()}
          className={`mt-6 rounded-xl px-8 py-4 shadow-sm ${isDark ? 'bg-primary-light' : 'bg-primary'}`}
        >
          <Text
            className={`font-semibold ${isDark ? 'text-background-dark' : 'text-text-inverse'}`}
          >
            Tilbage
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="flex-1 text-h1 font-semibold text-text-primary dark:text-text-primary-dark">
            {ingredient.navn}
          </Text>
          <View className="ml-3 rounded-full bg-primary-subtle px-4 py-1.5 dark:bg-surface-dark">
            <Text className="text-sm font-semibold text-primary-dark dark:text-primary-light">
              {kategoriLabels[ingredient.kategori]}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
          <Text className="leading-6 text-text-secondary dark:text-text-secondary-dark">
            {ingredient.beskrivelse}
          </Text>
        </View>

        {/* Usage methods */}
        {ingredient.brug && ingredient.brug.length > 0 && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Måder at bruge {ingredient.navn.toLowerCase()} på
            </Text>
            <View className="gap-4">
              {ingredient.brug.map((metode, index) => (
                <View key={index} className="flex-row">
                  <View className="mr-3 mt-1 h-6 w-6 items-center justify-center rounded-full bg-primary-subtle dark:bg-surface-dark">
                    <Text className="text-xs font-semibold text-primary-dark dark:text-primary-light">
                      {index + 1}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="mb-1 font-medium text-text-primary dark:text-text-primary-dark">
                      {metode.titel}
                    </Text>
                    <Text className="leading-5 text-text-secondary dark:text-text-secondary-dark">
                      {metode.beskrivelse}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Ideal beer types */}
        {ingredient.oeltyper && ingredient.oeltyper.length > 0 && (
          <View className="mb-4 rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Ideelle øltyper
            </Text>
            <View className="gap-3">
              {ingredient.oeltyper.map((type, index) => (
                <View key={index} className="flex-row">
                  <Ionicons
                    name="beer-outline"
                    size={18}
                    color={isDark ? '#4ade80' : '#1a7f45'}
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text className="flex-1 leading-5 text-text-secondary dark:text-text-secondary-dark">
                    {type}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Benefits */}
        {ingredient.fordele && ingredient.fordele.length > 0 && (
          <View className="rounded-xl bg-surface-elevated p-5 shadow-sm dark:bg-surface-elevated-dark">
            <Text className="mb-4 text-base font-semibold text-text-primary dark:text-text-primary-dark">
              Vigtige fordele
            </Text>
            <View className="gap-3">
              {ingredient.fordele.map((fordel, index) => (
                <View key={index} className="flex-row">
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={isDark ? '#4ade80' : '#1a7f45'}
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <Text className="flex-1 leading-5 text-text-secondary dark:text-text-secondary-dark">
                    {fordel}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          className={`mt-6 items-center rounded-xl py-5 shadow-sm ${isDark ? 'bg-primary-light' : 'bg-primary'}`}
        >
          <Text
            className={`text-base font-semibold ${isDark ? 'text-background-dark' : 'text-text-inverse'}`}
          >
            Luk
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
