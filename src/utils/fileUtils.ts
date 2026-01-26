import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export const eksporterTilFil = async (
  data: string,
  filnavn: string
): Promise<void> => {
  if (Platform.OS === 'web') {
    // Web: Download via blob
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filnavn;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // Mobile: Save and share
    const file = new File(Paths.document, filnavn);
    await file.write(data);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    }
  }
};

export const importerFraFil = async (): Promise<string | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];

    if (Platform.OS === 'web') {
      // Web: Read via fetch
      const response = await fetch(asset.uri);
      return await response.text();
    } else {
      // Mobile: Read file
      const file = new File(asset.uri);
      return await file.text();
    }
  } catch (error) {
    console.error('Fejl ved import:', error);
    return null;
  }
};
