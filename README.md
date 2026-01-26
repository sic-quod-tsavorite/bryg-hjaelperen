# Bryg-hjælperen

A cross-platform brewing helper app for homebrewers. Plan your brew with live calculations for OG, IBU, and EBC, then log your brewing process with notes and photos.

> **Note:** The app UI is in Danish, as it's primarily built for Danish homebrewers.

## Features

### Opsætning (Setup Tab)

- **Beer Style Selection** — Choose from 16 beer styles with typical parameter ranges
- **Malt Management** — Autocomplete with 24 predefined malts, EBC suggestions, percentage calculations
- **Hop Management** — Autocomplete with 24 predefined hops, alpha acid suggestions, per-hop IBU contribution
- **Miscellaneous Ingredients** — 16 predefined items (Irish Moss, lactose, spices, etc.) with usage info
- **Yeast Configuration** — Top/bottom fermenting selection, package count, fermentation temperature
- **Live Calculations:**
  - Original Gravity (OG) from grain bill and volume
  - IBU using the Tinseth formula
  - Beer color (EBC) using the Morey equation with visual color swatch

### Log Tab

- **Beer Naming** — Name and describe your brew
- **Final Gravity Input** — With calculated ABV and attenuation percentage
- **Brewing Log Entries** — Timestamped notes with optional measurements (temperature, SG, pH)
- **Photo Documentation** — Add photos from camera or gallery
- **PDF Export** — Generate a complete brewing report

### Data Persistence

- Session state automatically saved to device storage
- Resume your brewing session after closing the app

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) SDK 54 with [React Native](https://reactnative.dev/) 0.81
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.9
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) 6
- **Styling:** [NativeWind](https://www.nativewind.dev/) 4 (Tailwind CSS for React Native)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) 5 with AsyncStorage persistence
- **Package Manager:** [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or later)
- [Node.js](https://nodejs.org/) (v18 or later, for Expo CLI)
- For Android development: Android Studio with an emulator or physical device
- For iOS development: Xcode (macOS only)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bryg-hjaelperen

# Install dependencies
bun install
```

### Running the App

```bash
# Start for web (primary development target)
bun run web

# Start for Android
bun run android

# Start for iOS (macOS only)
bun run ios

# Start Expo dev server (choose platform interactively)
bun run start
```

## Project Structure

```
bryg-hjaelperen/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout (Stack navigator)
│   ├── (tabs)/                   # Tab navigator group
│   │   ├── _layout.tsx           # Tab layout
│   │   ├── index.tsx             # Setup tab (Opsætning)
│   │   └── log.tsx               # Log tab
│   └── modal/
│       └── ingredient-info.tsx   # Ingredient info modal
├── src/
│   ├── components/
│   │   ├── common/               # Shared components
│   │   ├── setup/                # Setup tab components
│   │   └── log/                  # Log tab components
│   ├── data/                     # Predefined ingredient data (JSON)
│   ├── store/                    # Zustand stores
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Utility functions & calculations
├── assets/                       # Static assets
└── package.json
```

## Available Scripts

| Script               | Description                                |
| -------------------- | ------------------------------------------ |
| `bun run start`      | Start Expo development server              |
| `bun run web`        | Start for web browser                      |
| `bun run android`    | Start for Android                          |
| `bun run ios`        | Start for iOS                              |
| `bun run check`      | Run all checks (typecheck + lint + format) |
| `bun run typecheck`  | TypeScript type checking                   |
| `bun run lint`       | ESLint checking                            |
| `bun run lint:fix`   | ESLint with auto-fix                       |
| `bun run format`     | Prettier format checking                   |
| `bun run format:fix` | Prettier with auto-fix                     |

## Brewing Calculations

The app uses industry-standard formulas:

- **OG (Original Gravity):** Calculated from malt extract potential, amount, and batch volume with configurable mash efficiency
- **IBU (International Bitterness Units):** Tinseth formula accounting for boil time, alpha acids, and wort gravity
- **EBC (European Brewery Convention color):** Morey equation converting MCU to SRM, then to EBC
- **ABV (Alcohol By Volume):** Standard formula: `(OG - FG) × 131.25`
- **Attenuation:** Percentage of sugars converted: `((OG - FG) / (OG - 1)) × 100`

## Contributing

Contributions are welcome! Please ensure your code passes all checks before submitting:

```bash
bun run check
```

## License

This project is private and not licensed for public use.
