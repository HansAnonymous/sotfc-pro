## Setup

Make sure to install the dependencies:

```bash
yarn install
```

## Scaffold Database

```bash
supabase gen types typescript --project-id ufkxwhxtmmjkgedlkikl > types/database.types.ts
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Serve on production:

```bash
yarn start
```