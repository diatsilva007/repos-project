# Copilot Instructions - Repos Project

## Project Overview

GitHub repository explorer built with React 19 + Create React App. Users can search, save, and manage GitHub repositories with optional personal access token authentication.

**Stack:** React 19, React Router v7, styled-components, Axios, React Icons

## Architecture

### Data Flow & State Management

**localStorage-based persistence** (no backend):
- `repos` - Array of saved repositories: `[{ name: "owner/repo" }]`
- `github_token` - Optional GitHub personal access token

**API Layer** (`src/services/api.js`):
- Axios instance configured for GitHub API v3
- `setGithubToken(token)` - Dynamically adds/removes Authorization header
- Auto-initializes token from localStorage on module load

**Component State Pattern** (see `src/pages/Main/index.js`):
```javascript
// Load from localStorage on mount
useEffect(() => {
  const repoStorage = localStorage.getItem("repos");
  if (repoStorage) setRepositorios(JSON.parse(repoStorage));
}, []);

// Persist to localStorage on change
useEffect(() => {
  localStorage.setItem("repos", JSON.stringify(repositorios));
}, [repositorios]);
```

### Routing Structure

```
src/index.js → src/App.js → src/routes.js
                 ↓
          GlobalStyle applied
                 ↓
          <BrowserRouter>
            / → Main (list/search repos)
            /repositorio/:repositorio → Repositorio (details)
```

**Route param format:** `/repositorio/facebook/react` (owner/repo)

### Page Architecture Pattern

**Standard page structure:**
```
src/pages/PageName/
├── index.js   - Functional component with hooks
└── styles.js  - Exported styled-components
```

**Import pattern:**
```javascript
import { Container, Form, SubmitButton } from "./styles";
```

## Styling System

**Global reset** (`src/styles/global.js`):
- Dark background: `#0D2636`
- Base font: 14px Arial/Helvetica
- Box-sizing, margin/padding reset

**Component styles** (example from `Main/styles.js`):
```javascript
// Keyframe animations for loading states
const animate = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

// Conditional styling with props
export const SubmitButton = styled.button.attrs(props => ({
  disabled: props.loading
}))`
  ${props => props.loading && css`
    svg { animation: ${animate} 2s linear infinite; }
  `}
`;

// Error state via props
export const Form = styled.form`
  input {
    border: 1px solid ${props => props.error ? "#FF0000" : "#eee"};
  }
`;
```

**Color palette:**
- Primary: `#0D2636` (dark blue)
- Error: `#FF0000`, `#c62828`, `#ffebee` (red variants)
- Neutral: `#eee`, `#f5f5f5`, `#666`

## Critical Patterns

### Form Submission with API Calls

Pattern from `Main/index.js` - wrap async logic in sync handler:
```javascript
const handleSubmit = useCallback((e) => {
  e.preventDefault();
  
  async function submit() {
    setLoading(true);
    setAlert(null);
    try {
      const response = await api.get(`repos/${newRepo}`);
      // Duplicate check
      const hasRepo = repositorios.find(repo => repo.name === newRepo);
      if (hasRepo) throw new Error("Repositorio Duplicado");
      // Add to state
      setRepositorios([...repositorios, { name: response.data.full_name }]);
      setNewRepo("");
    } catch (error) {
      setAlert(error.message || "Erro ao buscar repositório...");
    } finally {
      setLoading(false);
    }
  }
  
  submit();
}, [newRepo, repositorios]);
```

### Icon Integration (react-icons)

```javascript
import { FaGithub, FaSpinner, FaTrash } from "react-icons/fa";

// Loading state toggle
{loading ? <FaSpinner color="#FFF" size={14} /> : <FaPlus color="#FFF" size={14} />}
```

### Button Attributes Pattern

Use `styled.button.attrs()` for dynamic HTML attributes:
```javascript
export const SubmitButton = styled.button.attrs(props => ({
  type: "submit",
  disabled: props.loading
}))`...`;
```

## Development Workflow

**Local development:**
```bash
npm start  # localhost:3000 with hot reload
```

**GitHub token setup** (optional, increases rate limits):
1. Generate at https://github.com/settings/tokens
2. Add via UI or localStorage: `localStorage.setItem("github_token", "ghp_...")`
3. Token persists across sessions

**Testing:**
```bash
npm test  # Jest watch mode
```

## Known Implementation Details

**Incomplete features:**
- `src/pages/Repositorio/index.js` - Placeholder only, no API call or styling
- No error boundary components
- No route-based code splitting

**Dependencies notes:**
- React 19 + React Router 7 use modern `<Routes>` API (not `<Switch>`)
- `styled-components` v6 requires explicit `attrs()` for dynamic props
- Axios v1.13+ configured with GitHub API v3 headers

**Navigation:**
- Use `<a href="/repositorio/...">` not `<Link>` (see `Main/index.js` line 167)
- Full page reload on navigation (could optimize with React Router `<Link>`)

## Adding Features

**New page checklist:**
1. Create `src/pages/NewPage/index.js` with functional component
2. Create `src/pages/NewPage/styles.js` with styled exports
3. Add route in `src/routes.js`: `<Route path="/new" element={<NewPage />} />`
4. Follow localStorage pattern if persistence needed
5. Use `useCallback` for event handlers that depend on state

**API calls:**
- Always use `api` from `src/services/api.js` (pre-configured)
- Handle loading/error states in UI
- Check for duplicates/validation before setState
