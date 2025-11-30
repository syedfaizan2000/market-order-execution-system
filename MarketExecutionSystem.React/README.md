# Market Execution System UI (React + Vite)

Frontend dashboard for the **MarketExecutionSystem** .NET 8 backend.

## Tech stack

- React 18
- TypeScript
- Vite
- Axios
- Modern glassmorphism-style UI

## Getting started

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn
```

2. Configure API base URL:

Copy `.env.example` to `.env` and adjust the backend URL if needed:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_BASE_URL=https://localhost:5001
```

3. Run the app:

```bash
npm run dev
```

4. Open the URL Vite shows (usually `http://localhost:5173`).

You should see:

- "New Order" form on the left.
- "Recent Executions" panel on the right.
- "Order Book" table at the bottom.

When you place a new order:

- Frontend calls `POST /api/orders` on the .NET API.
- Background simulator on backend moves prices.
- When conditions match, backend writes to `TradeLogs`.
- Frontend auto-refreshes every 5 seconds via API calls to show latest state.