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
- Installable PWA with a service worker for caching application assets.
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

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally after running `npm run build`. |
| `npm run lint` | Run ESLint with warnings treated as errors. |
| `npm run format` | Format source and configuration files with Prettier. |
| `npm run format:check` | Check formatting without modifying files. |

## Local Validation

There is currently no dedicated automated test suite. Before opening a change, run the same checks used by continuous integration:

```bash
npm run format:check
npm run lint
npm run build
```

To check the built application in a production-like local server:

```bash
npm run preview
```

Then open the URL printed by Vite and verify player management, mode and pack selection, wonder drawing, language switching, persistence after reload, and mobile layout.

## Deployment

The repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` for GitHub Pages.

### Automatic deployment to GitHub Pages

1. In the GitHub repository, open **Settings > Pages**.
2. Set the Pages source to **GitHub Actions**.
3. Push to `main` or run the **Build and deploy** workflow manually from the Actions tab.
4. The workflow installs dependencies, checks formatting, lints, builds the app, uploads the `dist/` artifact, and deploys it to GitHub Pages.

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

Configure the host to serve `index.html` for the application entry point and allow the generated `sw.js` file to be served from the same base path.

## Project Structure

```text
.
├── public/              Static PWA files and service worker
├── src/
│   ├── App.tsx          Main application UI and game interactions
│   ├── index.css        Application styles
│   ├── main.tsx         React entry point and service-worker registration
│   └── wonders.ts       Wonder data, packs, and translations metadata
├── index.html           HTML entry point
├── vite.config.ts       Vite configuration and configurable base path
└── package.json         Scripts and dependencies
```

## Data and Privacy

The application does not use a backend. Saved settings and player names remain in the browser's local storage for the current site. Clearing site data or using a different browser/device removes or resets those saved values.

## License

No license has been specified for this project yet.
