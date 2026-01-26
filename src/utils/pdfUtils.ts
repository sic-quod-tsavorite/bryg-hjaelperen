import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

import { Opskrift } from '../types/recipe';

const stilNavne: Record<string, string> = {
  pilsner: 'Pilsner',
  lager: 'Lager',
  ale: 'Ale',
  ipa: 'IPA',
  stout: 'Stout',
  porter: 'Porter',
  wheat: 'Hvedeøl',
  sour: 'Suröl',
  belgian: 'Belgisk',
  other: 'Andet',
};

const genererHTML = (opskrift: Opskrift): string => {
  const maltListe = opskrift.malte
    .map(
      (m) =>
        `<tr><td>${m.navn}</td><td>${m.maengde} kg</td><td>${m.farve || '-'} EBC</td></tr>`
    )
    .join('');

  const humleListe = opskrift.humler
    .map(
      (h) =>
        `<tr><td>${h.navn}</td><td>${h.maengde} g</td><td>${h.alfaSyre || '-'}%</td><td>${h.tilsaetTidspunkt} min</td><td>${h.type}</td></tr>`
    )
    .join('');

  const gaerListe = opskrift.gaer
    .map(
      (g) =>
        `<li>${g.navn} (${g.type === 'toerret' ? 'tørret' : 'flydende'})${g.maengde ? ` - ${g.maengde}g` : ''}</li>`
    )
    .join('');

  const maeskeTrin = opskrift.maeskeskema
    .map(
      (t) =>
        `<tr><td>${t.temperatur}°C</td><td>${t.varighed} min</td><td>${t.beskrivelse || '-'}</td></tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 {
          color: #92400e;
          border-bottom: 3px solid #fbbf24;
          padding-bottom: 10px;
        }
        h2 {
          color: #b45309;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        th {
          background-color: #fef3c7;
          color: #92400e;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin: 20px 0;
        }
        .info-box {
          background: #fffbeb;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .info-box .label {
          font-size: 12px;
          color: #666;
          text-transform: uppercase;
        }
        .info-box .value {
          font-size: 24px;
          font-weight: bold;
          color: #92400e;
        }
        .notes {
          background: #f9fafb;
          padding: 15px;
          border-radius: 8px;
          margin-top: 20px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <h1>${opskrift.navn}</h1>
      <p><strong>Stil:</strong> ${stilNavne[opskrift.stil] || opskrift.stil}</p>
      ${opskrift.beskrivelse ? `<p>${opskrift.beskrivelse}</p>` : ''}

      <div class="info-grid">
        <div class="info-box">
          <div class="label">Batch størrelse</div>
          <div class="value">${opskrift.batchStorrelse} L</div>
        </div>
        <div class="info-box">
          <div class="label">ABV</div>
          <div class="value">${opskrift.forventetABV}%</div>
        </div>
        <div class="info-box">
          <div class="label">IBU</div>
          <div class="value">${opskrift.forventetIBU}</div>
        </div>
        <div class="info-box">
          <div class="label">OG</div>
          <div class="value">${opskrift.forventetOG}</div>
        </div>
        <div class="info-box">
          <div class="label">FG</div>
          <div class="value">${opskrift.forventetFG}</div>
        </div>
        <div class="info-box">
          <div class="label">Farve</div>
          <div class="value">${opskrift.forventetFarve} EBC</div>
        </div>
      </div>

      <h2>Malt</h2>
      <table>
        <thead>
          <tr><th>Navn</th><th>Mængde</th><th>Farve</th></tr>
        </thead>
        <tbody>
          ${maltListe || '<tr><td colspan="3">Ingen malt tilføjet</td></tr>'}
        </tbody>
      </table>

      <h2>Humle</h2>
      <table>
        <thead>
          <tr><th>Navn</th><th>Mængde</th><th>Alfa</th><th>Tid</th><th>Type</th></tr>
        </thead>
        <tbody>
          ${humleListe || '<tr><td colspan="5">Ingen humle tilføjet</td></tr>'}
        </tbody>
      </table>

      <h2>Gær</h2>
      <ul>
        ${gaerListe || '<li>Ingen gær tilføjet</li>'}
      </ul>

      <h2>Mæskeskema</h2>
      <table>
        <thead>
          <tr><th>Temperatur</th><th>Varighed</th><th>Beskrivelse</th></tr>
        </thead>
        <tbody>
          ${maeskeTrin || '<tr><td colspan="3">Ingen mæsketrin tilføjet</td></tr>'}
        </tbody>
      </table>

      <p><strong>Kogetid:</strong> ${opskrift.kogetid} minutter</p>

      ${opskrift.noter ? `<div class="notes"><h2>Noter</h2><p>${opskrift.noter}</p></div>` : ''}

      <div class="footer">
        <p>Genereret med Bryg-hjælperen</p>
        <p>${new Date().toLocaleDateString('da-DK')}</p>
      </div>
    </body>
    </html>
  `;
};

export const genererPDF = async (opskrift: Opskrift): Promise<void> => {
  const html = genererHTML(opskrift);

  if (Platform.OS === 'web') {
    // Web: Open print dialog
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  } else {
    // Mobile: Generate and share PDF
    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  }
};
