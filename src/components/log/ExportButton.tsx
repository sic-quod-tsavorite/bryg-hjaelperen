import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
  Pressable,
  Text,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';

import type { BrewingSession } from '../../types/session';
import { calculateABV, calculateAttenuation } from '../../utils/calculations';
import { useResolvedTheme } from '../ThemeProvider';

interface ExportButtonProps {
  session: BrewingSession;
}

export function ExportButton({ session }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const resolvedTheme = useResolvedTheme();
  const isDark = resolvedTheme === 'dark';

  const generateHTML = async () => {
    const abv =
      session.faktiskOG && session.faktiskFG
        ? calculateABV(session.faktiskOG, session.faktiskFG)
        : session.beregnetOG
          ? calculateABV(session.beregnetOG, session.beregnetOG * 0.75)
          : null;

    const attenuation =
      session.faktiskOG && session.faktiskFG
        ? calculateAttenuation(session.faktiskOG, session.faktiskFG)
        : null;

    // Helper function to convert blob to base64 data URL
    const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    // Convert photos to base64 for embedding in HTML using modern File API
    let photosHTML = '';
    if (session.fotos && session.fotos.length > 0) {
      try {
        const photoDataPromises = session.fotos.map(async (uri) => {
          try {
            const response = await fetch(uri);
            const blob = await response.blob();
            const base64 = await blobToBase64(blob);
            return base64;
          } catch (error) {
            console.error('Failed to read photo:', error);
            return null;
          }
        });

        const photoDataUrls = await Promise.all(photoDataPromises);
        const validPhotos = photoDataUrls.filter(
          (url): url is string => url !== null
        );

        if (validPhotos.length > 0) {
          photosHTML = `
          <div style="display: flex; gap: 24px; margin-bottom: 24px; align-items: flex-start;">
            <img src="${validPhotos[0]}" style="width: 200px; height: 200px; object-fit: cover; border-radius: 12px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
            <div style="flex: 1;">
              <h1 style="margin: 0 0 12px 0; color: #1a7f45; border-bottom: 3px solid #1a7f45; padding-bottom: 12px; font-size: 28px;">${session.navn || 'Unavngivet bryg'}</h1>
              ${session.beskrivelse ? `<p style="color: #525252; line-height: 1.6; margin: 0;">${session.beskrivelse}</p>` : ''}
            </div>
          </div>
          `;
        }
      } catch (error) {
        console.error('Failed to process photos:', error);
      }
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${session.navn || 'Bryggelog'}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #171717;
            background: #f5f5f5;
          }
          h1 { color: #1a7f45; border-bottom: 3px solid #1a7f45; padding-bottom: 12px; font-size: 28px; }
          h2 { color: #166534; margin-top: 32px; font-size: 20px; }
          .stats { display: flex; gap: 24px; margin: 24px 0; flex-wrap: wrap; }
          .stat { text-align: center; background: #ffffff; padding: 16px 24px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          .stat-value { font-size: 28px; font-weight: bold; color: #1a7f45; }
          .stat-label { font-size: 12px; color: #525252; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          th, td { padding: 12px 16px; text-align: left; border-bottom: 1px solid #e5e5e5; }
          th { background: #dcfce7; color: #166534; font-weight: 600; }
          tr:last-child td { border-bottom: none; }
          .log-entry { margin: 16px 0; padding: 16px; background: #ffffff; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
          .log-entry-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .log-entry-type { font-weight: 600; color: #1a7f45; }
          .log-entry-date { color: #a3a3a3; font-size: 14px; }
          .measurements { display: flex; gap: 16px; margin-top: 12px; }
          .measurement { background: #f5f5f5; padding: 6px 12px; border-radius: 8px; font-size: 14px; color: #525252; }
        </style>
      </head>
      <body>
        ${photosHTML}
        ${
          !photosHTML
            ? `
        <h1 style="color: #1a7f45; border-bottom: 3px solid #1a7f45; padding-bottom: 12px; font-size: 28px; margin: 0 0 12px 0;">${session.navn || 'Unavngivet bryg'}</h1>
        ${session.beskrivelse ? `<p style="color: #525252; line-height: 1.6; margin: 0;">${session.beskrivelse}</p>` : ''}
        <div style="height: 24px;"></div>
        `
            : ''
        }

        <div class="stats">
          ${session.beregnetOG ? `<div class="stat"><div class="stat-value">${session.beregnetOG.toFixed(3)}</div><div class="stat-label">OG</div></div>` : ''}
          ${session.faktiskFG ? `<div class="stat"><div class="stat-value">${session.faktiskFG.toFixed(3)}</div><div class="stat-label">FG</div></div>` : ''}
          ${abv ? `<div class="stat"><div class="stat-value">${abv.toFixed(1)}%</div><div class="stat-label">ABV</div></div>` : ''}
          ${session.beregnetIBU ? `<div class="stat"><div class="stat-value">${session.beregnetIBU}</div><div class="stat-label">IBU</div></div>` : ''}
          ${session.beregnetEBC ? `<div class="stat"><div class="stat-value">${session.beregnetEBC}</div><div class="stat-label">EBC</div></div>` : ''}
          ${attenuation ? `<div class="stat"><div class="stat-value">${attenuation}%</div><div class="stat-label">Attenuation</div></div>` : ''}
        </div>

        ${
          session.malts.length > 0
            ? `
        <h2>Malt</h2>
        <table>
          <tr><th>Navn</th><th>Mængde</th><th>EBC</th></tr>
          ${session.malts.map((m) => `<tr><td>${m.navn}</td><td>${m.maengde}g</td><td>${m.ebc}</td></tr>`).join('')}
        </table>
        `
            : ''
        }

        ${
          session.hops.length > 0
            ? `
        <h2>Humle</h2>
        <table>
          <tr><th>Navn</th><th>Mængde</th><th>Alpha %</th><th>Kogetid</th></tr>
          ${session.hops.map((h) => `<tr><td>${h.navn}</td><td>${h.maengde}g</td><td>${h.alfaSyre}%</td><td>${h.type === 'dryhopping' ? 'Tørhumle' : h.kogeTid + ' min'}</td></tr>`).join('')}
        </table>
        `
            : ''
        }

        ${
          session.misc.length > 0
            ? `
        <h2>Specialtilsætninger</h2>
        <table>
          <tr><th>Navn</th><th>Mængde</th><th>Tidspunkt</th></tr>
          ${session.misc.map((m) => `<tr><td>${m.navn}</td><td>${m.maengde} ${m.enhed}</td><td>${m.tilsaetning}</td></tr>`).join('')}
        </table>
        `
            : ''
        }

        ${
          session.yeasts.length > 0
            ? `
        <h2>Gær</h2>
        ${session.yeasts
          .map(
            (yeast) => `
        <p><strong>${yeast.navn}</strong> (${yeast.type === 'overgaeret' ? 'Overgæret' : 'Undergæret'})</p>
        <p style="color: #525252;">Antal pakker: ${yeast.pakker}${yeast.temperatur ? `, Temperatur: ${yeast.temperatur}°C` : ''}</p>
        `
          )
          .join('')}
        `
            : ''
        }

        <div style="height: 24px;"></div>
        ${
          session.logIndlaeg.length > 0
            ? `
          <h2>Bryggelog</h2>
          ${[...session.logIndlaeg]
            .reverse()
            .map(
              (entry) => `
            <div class="log-entry">
              <div class="log-entry-header">
                <span class="log-entry-type">${entry.titel}</span>
                <span class="log-entry-date">${(() => {
                  const parts: string[] = [];
                  if (entry.visDato !== false) {
                    parts.push(
                      new Date(entry.dato).toLocaleDateString('da-DK')
                    );
                  }
                  if (entry.visTid) {
                    parts.push(
                      new Date(entry.dato).toLocaleTimeString('da-DK', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    );
                  }
                  return parts.join(' : ');
                })()}</span>
              </div>
              ${entry.beskrivelse ? `<p style="color: #525252; margin: 8px 0 0 0;">${entry.beskrivelse}</p>` : ''}
              ${
                entry.maalinger
                  ? `
                <div class="measurements">
                  ${entry.maalinger.temperatur !== undefined ? `<span class="measurement">Temp: ${entry.maalinger.temperatur}°C</span>` : ''}
                  ${entry.maalinger.sg !== undefined ? `<span class="measurement">SG: ${entry.maalinger.sg.toFixed(3)}</span>` : ''}
                  ${entry.maalinger.ph !== undefined ? `<span class="measurement">pH: ${entry.maalinger.ph.toFixed(1)}</span>` : ''}
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
          `
            : ''
        }

        <p style="margin-top: 48px; color: #a3a3a3; font-size: 12px; text-align: center;">
          Genereret med Bryg-hjælperen • ${new Date().toLocaleDateString('da-DK')}
        </p>
      </body>
      </html>
    `;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const html = await generateHTML();

      if (Platform.OS === 'web') {
        // For web, open print dialog using Blob URL
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(url);
          };
        } else {
          URL.revokeObjectURL(url);
        }
      } else {
        // For native, generate PDF
        const { uri } = await Print.printToFileAsync({
          html,
          base64: false,
        });

        // Check if sharing is available
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Eksporter bryggelog',
            UTI: 'com.adobe.pdf',
          });
        } else {
          Alert.alert('Eksporteret', `PDF gemt til: ${uri}`);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Fejl', 'Kunne ikke eksportere bryggeloggen.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Pressable
      onPress={handleExport}
      disabled={isExporting}
      className={`flex-row items-center justify-center rounded-xl py-5 shadow-sm ${
        isExporting
          ? 'bg-border dark:bg-border-dark'
          : isDark
            ? 'bg-primary-light'
            : 'bg-primary'
      }`}
    >
      {isExporting ? (
        <ActivityIndicator color={isDark ? '#171717' : 'white'} />
      ) : (
        <>
          <Ionicons
            name="download-outline"
            size={24}
            color={isDark ? '#171717' : 'white'}
          />
          <Text
            className={`ml-2 text-base font-semibold ${
              isDark ? 'text-background-dark' : 'text-text-inverse'
            }`}
          >
            Eksporter PDF
          </Text>
        </>
      )}
    </Pressable>
  );
}
