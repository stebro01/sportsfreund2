# Contributor Notes

## Architecture Overview
- The project is a **Quasar** application built on **Vue 3**.
- Application state is handled via **Pinia**. Stores are located under `src/stores` (e.g. `appStore.js`, `friendStore.js`).
- Common timer logic resides in the composable `src/composables/useTimer.js`.
- Main pages live inside `src/pages`:
  - `Timer/QuickTimer.vue` – simple countdown timer.
  - `Timer/ProgrammTimer.vue` – multi step program timer.
  - `Timer/InviteFriends.vue` – invite management.
- Routing is defined in `src/router/routes.js` with layouts in `src/layouts`.

## Styling
- Global styles are written in SCSS under `src/css`. `app.scss` defines classes like `.my-main-btn` and base typography. Theme variables (colors, etc.) are set in `src/css/quasar.variables.scss`.
- Follow these files for styling conventions; the project uses Prettier and ESLint via npm scripts (`npm run format`, `npm run lint`).

## Boot and Build Files
- Quasar boot files in `src/boot` initialize Pinia, Axios, and Firebase (`pinia.js`, `axios.js`, `firebase.js`).
- The main build configuration is `quasar.config.js` which sets router mode, plugins, and other options.
- Use `quasar dev` for the dev server and `quasar build` to create a production build.

## Testing
- Unit tests use **Jest**. Test files live in `test/jest/__tests__` and cover components/composables under `src/stores` and `src/pages/Timer`.
- Run `npm run test:unit` to execute the test suite. Continuous integration uses the same command through the `quasar.testing.json` configuration.

