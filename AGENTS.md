# Contributor Notes

## Architecture Overview
- The repository combines a **Quasar** (Vue 3) frontend and a **FastAPI** backend.
- Application state on the client is handled via **Pinia** with stores under `src/stores` (e.g. `appStore.js`, `friendStore.js`).
- Common timer logic resides in `src/composables/useTimer.js`.
- Main pages live inside `src/pages`:
  - `Timer/QuickTimer.vue` – simple countdown timer.
  - `Timer/ProgrammTimer.vue` – multi step program timer.
  - `Timer/InviteFriends.vue` – invite management.
- Routing is defined in `src/router/routes.js` with layouts in `src/layouts`.
- The backend is served from `backend/server.py` and exposes REST and WebSocket endpoints for user accounts, friend requests and logging. Data files live in `backend/appdata`.

## Styling
- Global styles are written in SCSS under `src/css`. `app.scss` defines classes like `.my-main-btn` and base typography. Theme variables (colors, etc.) are set in `src/css/quasar.variables.scss`.
- Use Prettier and ESLint via the npm scripts `npm run format` and `npm run lint`.

## Boot and Build Files
- Quasar boot files in `src/boot` initialize Pinia, Axios and Firebase (`pinia.js`, `axios.js`, `firebase.js`).
- The main build configuration is `quasar.config.js` which sets router mode, plugins and other options.
- Use `quasar dev` for the dev server and `quasar build` to create a production build.
- Start the backend with `./start_backend.sh` or manually with:
  ```bash
  pip install -r backend/requirements.txt
  uvicorn backend.server:app --reload
  ```

## Testing
- Frontend unit tests use **Jest**. Test files reside in `test/jest/__tests__` and cover components and composables.
  Run `npm run test:unit` to execute them.
- Backend tests use **pytest** and live in `backend/tests`. Install requirements and run:
  ```bash
  pip install -r backend/requirements.txt
  PYTHONPATH=. pytest backend/tests
  ```
