# Copilot Instructions - Repos Project

## Project Overview

This is a React 19 web application for exploring GitHub repositories, built with Create React App. It uses React Router v7 for navigation and styled-components for styling.

**Key Technologies:**

- React 19 & React Router v7 (supports nested routes via `<Switch>`)
- styled-components for CSS-in-JS
- Create React App (CRA) build setup

## Architecture

### Core Structure

- **Entry Point**: `src/App.js` wraps the app with `<Routes />` component
- **Routing**: `src/routes.js` defines URL mappings using React Router v7's `<BrowserRouter>`, `<Switch>`, and `<Route>`
- **Pages**: Located in `src/pages/` with folder-based organization (e.g., `Main`, `Repositorio`)
- **Styles**: Global CSS in `src/styles/global.js` + component-scoped styled-components

### Current Routes

```
GET  /                      → Main page (search/list repos)
GET  /repositorio/:repositorio → Repository detail page
```

### Page Pattern

Each page is a function component in its own folder:

```
src/pages/PageName/
├── index.js          (main component, imports from styles.js)
└── styles.js         (styled-components exports)
```

Pages like `Main` import styled components from `./styles` (see `src/pages/Main/index.js` importing `Title` from `./styles`). The `Repositorio` page is incomplete—it currently returns plain JSX and should follow the styled-components pattern.

## Styling Conventions

**Global Styles** (`src/styles/global.js`):

- Uses `createGlobalStyle` for reset CSS and body/button defaults
- Dark theme base: `background: #0D2636`
- Font size: 14px

**Component Styles** (e.g., `src/pages/Main/styles.js`):

- Export named styled components (e.g., `export const Title = styled.h1...`)
- Use nested selectors for child elements (e.g., `span { color: blue; }`)
- Colors are hardcoded (Red: `#FF0000`, Blue: `blue`)

When adding new pages, create a `styles.js` file exporting styled components and import them in the page's `index.js`.

## Development Workflow

**Commands:**

- `npm start` – Dev server on localhost:3000 with hot reload
- `npm test` – Jest runner in watch mode
- `npm run build` – Optimize production bundle
- `npm run eject` – ⚠️ One-way: exposes CRA config (avoid unless necessary)

**Key Files to Reference:**

- `package.json` – Dependencies, scripts, ESLint config (extends react-app)
- `public/index.html` – Single root div with id="root"

## Common Patterns

1. **Adding a New Page:**

   - Create `src/pages/PageName/index.js` with a functional component
   - Create `src/pages/PageName/styles.js` with styled-component exports
   - Add route in `src/routes.js` inside the `<Switch>`

2. **React Router URL Params:**

   - Use `:paramName` in route path (e.g., `/repositorio/:repositorio`)
   - Access via `useParams()` hook in the page component

3. **Styled-Components Usage:**
   - Always import styled from `'styled-components'`
   - Export components as named exports for easy reuse
   - Follow the pattern: `export const ComponentName = styled.element\`...`

## Known Issues / Incomplete Features

- `Repositorio` page (`src/pages/Repositorio/index.js`) lacks styling—should use styled-components
- `index.js` entry file is empty (CRA typically has ReactDOM render call there)
- No error boundaries or loading states implemented

## Testing & Linting

- ESLint config extends `react-app` (standard CRA ruleset)
- Testing library: `@testing-library/react` v16.3.0
- Run tests with `npm test` in watch mode
