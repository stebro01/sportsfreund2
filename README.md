# Sportsfreund Timer App

A Quasar/Vue 3 timer application for organizing workouts paired with a small FastAPI backend. The app offers Quick Timer and Program Timer modes and lets you invite friends to share sessions.

### Program Timer
Workout steps are created automatically from your preset settings. Manual step addition is no longer available.

## Backend
The Python backend uses **FastAPI** to handle user management and real-time chat.

### Start the server
Run the backend using the helper script. It sets up a virtual environment and
installs dependencies from `backend/requirements.txt`.

```bash
./start_backend.sh
```

### Backend tests
Execute the server tests with:

```bash
pytest
```

## Frontend
The client is located in the `frontend` directory.

### Project setup
Install dependencies using npm or yarn:

```bash
# from the repository root
cd frontend
npm install
# or
yarn
```

> **Proxy configuration:** npm looks for `proxy` or `https-proxy` settings.
> Configure your proxy via `NPM_CONFIG_PROXY` or add `proxy=<url>` in your
> `.npmrc` instead of using `npm_config_http_proxy`.

### Development server
Run the dev server with hot reloading (first-time install shown for convenience):

```bash
cd frontend && npm install && quasar dev
```

### Build for production
Create an optimized build:

```bash
cd frontend && quasar build
```

### Unit tests
Execute unit tests with:

```bash
cd frontend && npm run test:unit
```

