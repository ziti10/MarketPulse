# MarketPulse

This repo contains a React dashboard component that displays real-time market data for stocks, crypto, commodities and forex pairs using the Alpha Vantage API. It is written in TypeScript and styled with Tailwind CSS.

A minimal Vite configuration is included so you can run the demo locally. The dashboard prompts for an Alpha Vantage API key on first load.

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

The main component `Index` is defined in `market-pulse-dashboard.tsx` and is mounted in `src/main.tsx`.

You can import the component into other projects:

```ts
import Index from './market-pulse-dashboard';
```

