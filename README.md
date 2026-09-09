# 7 Wonders Classic & Architects

A small, installable web app for assigning wonders to players before a game of **7 Wonders**. Add the players, choose the game mode and enabled wonder packs, then draw a randomized wonder for each player and a first player.

The app is built as a client-side React application, so no server or account is required. Player names, selected mode, enabled packs, language, and Medals preference are saved in the browser's `localStorage`.

## Features

- Random wonder assignment for 2 or more players.
- Architects mode with optional **Medals** wonders: Rome and Ur.
- Classic mode with the **Cities** and **Wonder Pack** expansions.
- Random first-player selection.
- English, French, German, Italian, and Spanish UI translations.
- Responsive layout for desktop and mobile screens.
- Installable PWA with offline app-shell caching and automatic service-worker updates.
- Haptic feedback on supported devices.

## Requirements

- Node.js 24 or a compatible modern Node.js release.
- npm.

## Getting Started

Install the dependencies from the project directory:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL, normally `http://localhost:5173`.

## Available Scripts

| Command                 | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server.                                |
| `npm run build`         | Type-check the project and create a production build in `dist/`.  |
| `npm run preview`       | Serve the production build locally after running `npm run build`. |
| `npm run lint`          | Run ESLint with warnings treated as errors.                       |
| `npm test`              | Run the unit and component interaction tests once.                |
| `npm run test:coverage` | Run the tests and generate a coverage report.                     |
| `npm run format`        | Format source and configuration files with Prettier.              |
| `npm run format:check`  | Check formatting without modifying files.                         |

## Local Validation

The automated test suite uses Vitest, jsdom, and React Testing Library. It covers storage behavior and the main application workflows, including player management, mode and expansion selection, wonder drawing, settings, language switching, and theme selection.

Run the tests without coverage:

```bash
npm test
```

Run the coverage-enabled suite:

```bash
npm run test:coverage
```

The coverage configuration enforces at least 90% statements, lines, and functions, plus 85% branch coverage. The coverage report is also written to `coverage/`.

Before opening a change, run the automated tests and the same static checks used by continuous integration:

```bash
npm run test:coverage
npm run format:check
npm run lint
npm run build
```

To check the built application in a production-like local server:

```bash
npm run preview
```

Then open the URL printed by Vite and verify player management, mode and pack selection, wonder drawing, language switching, persistence after reload, and mobile layout.

## PWA Offline and Update Behavior

The production build generates a versioned service worker from the final `dist/` contents so every deployment produces a new cache identity whenever `index.html`, the manifest, the icon, or hashed assets change.

The generated service worker uses an application-shell strategy:

- precache `index.html`, the generated JS and CSS bundles, `manifest.webmanifest`, and `app-icon.svg`;
- serve the cached application shell for navigation requests so the SPA can start offline;
- delete outdated caches during activation so only the latest successful version remains active.

The application checks for service-worker updates automatically:

- on startup, right after registration;
- when the document becomes visible again;
- when the browser regains network connectivity.

When a new service worker finishes installing, the app asks it to activate immediately with `skipWaiting()`. Once the new worker takes control, the page reloads automatically so the installed Android application starts using the latest deployed assets without manual cache clearing. If downloading a new version fails, the currently active cached version keeps serving the app.

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` for GitHub Pages.

### Automatic deployment to GitHub Pages

1. In the GitHub repository, open **Settings > Pages**.
2. Set the Pages source to **GitHub Actions**.
3. Push to `main` or run the **Build and deploy** workflow manually from the Actions tab.
4. The workflow installs dependencies, runs the test suite with coverage, checks formatting, lints, builds the app, uploads the `dist/` artifact, and deploys it to GitHub Pages.

The workflow uses the Pages-provided base path when building, so the app also works when hosted under a repository subpath. Deployment occurs only for the `main` branch; other pushes still run the build job as a validation step.

### Manual deployment to another static host

Build the application and upload the generated `dist/` directory to any static hosting provider:

```bash
npm ci
npm run build
```

If the site will be served from a subpath, set `BASE_PATH` while building. The value may be a path with or without a trailing slash:

```bash
BASE_PATH=/my-app/ npm run build
```

On Windows PowerShell:

```powershell
$env:BASE_PATH = '/my-app/'
npm run build
```

Configure the host to serve `index.html` for the application entry point and allow the generated `sw.js` file to be served from the same base path. The manifest uses relative URLs (`./`) so the installed PWA remains compatible with GitHub Pages repository subpaths, while service-worker registration explicitly uses `import.meta.env.BASE_URL` as both URL and scope.

## Project Structure

```text
.
├── public/              Static PWA assets copied as-is (manifest and icon)
├── src/
│   ├── components/      Reusable UI components for players, modes, packs, and results
│   ├── context/         React context providers, including language state
│   ├── App.tsx          Main application UI and game interactions
│   ├── index.css        CSS entry point that imports the application styles
│   ├── styles/           Styles split by UI concern and responsive layout
│   │   ├── base.css      Theme variables, reset, and global layout styles
│   │   ├── extensions.css Extension and mode selection controls
│   │   ├── header.css    Header and language menu styles
│   │   ├── players.css   Player management card and input styles
│   │   ├── results.css   Draw button and result list styles
│   │   └── responsive.css Portrait and landscape layout rules
│   ├── main.tsx         React entry point and service-worker update handling
│   ├── storage.ts       Browser localStorage persistence helpers
│   ├── translations.ts  UI translations for supported languages
│   ├── types.ts         Shared TypeScript types
│   ├── vite-env.d.ts    Vite client type declarations
│   └── wonders.ts       Wonder data, packs, and language metadata
├── .github/             GitHub Actions workflow for validation and deployment
├── tests/                Unit and component interaction tests
│   ├── app.test.tsx      Main application workflow tests
│   ├── setup.ts          jsdom and testing-library setup
│   └── storage.test.ts   localStorage persistence tests
├── index.html           HTML entry point
├── package.json         Scripts and dependencies
├── tsconfig*.json       TypeScript configuration
├── vitest.config.ts     Test environment and coverage configuration
└── vite.config.ts       Vite configuration, base path, and generated service worker
```

## Data and Privacy

The application does not use a backend. Saved settings and player names remain in the browser's local storage for the current site. Clearing site data or using a different browser/device removes or resets those saved values.

## License

This project is licensed under the [MIT License](LICENSE).
