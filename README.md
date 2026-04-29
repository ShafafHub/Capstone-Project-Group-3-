# Websie — Full‑Stack E‑Commerce (React + Express + SQLite)

A full‑stack e‑commerce app with a React (Vite) frontend and an Express backend, running on SQLite via Knex.

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS, React Router, Zustand, Axios
- **Backend**: Node.js (ESM) + Express, CORS, JWT, bcrypt
- **Database**: SQLite (`database/dev.sqlite3`) + Knex migrations/seeds

## Features (as implemented in the codebase)

- **Auth**: register & login, returns `token` (JWT) + user object
- **Products**: product list/details + CRUD (create/update/delete are implemented)
  - “New products” filter: `GET /api/products?sort=new`
- **Cart** (JWT required): view cart, add item, remove item
- **Orders** (JWT required): place an order, fetch orders
- **Categories**: list + CRUD
- **Favorites**: add/remove/list favorites (with `userId` in the route)
- **Admin**: admin login + dashboard data (products/categories/orders/users)

## Project Structure

```text
websie/
  client/        # React app (Vite)
  server/        # Express API (entry: server.js)
  database/      # Knex config + migrations + seeds + dev.sqlite3
  README.md
  package.json   # DB tooling (knex/sqlite) is also installed at repo root
```

## Requirements

- Node.js (prefer a recent **LTS**)
- npm

## Quick Start (Development)

### 1) Install dependencies

At the repo root:

```bash
npm install
```

Then:

```bash
cd server && npm install
cd ../client && npm install
```

### 2) Create the database (migrate + seed)

Run from the repo root (this will create/update `database/dev.sqlite3`):

```bash
npx knex migrate:latest --knexfile database/knexfile.js
npx knex seed:run --knexfile database/knexfile.js
```

### 3) Start the backend

From `server/`:

```bash
node server.js
```

Or, for development with auto‑restart:

```bash
npx nodemon server.js
```

By default, the backend starts on `http://localhost:3000`.

### 4) Start the frontend

From `client/`:

```bash
npm run dev
```

By default, the frontend starts on `http://localhost:5173`.

## API Reference

Frontend base URL: `http://localhost:3000/api`
