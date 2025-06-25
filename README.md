# MarketPulse

This repo contains a React dashboard component that displays simulated market data for stocks, crypto, commodities and forex pairs. It is written in TypeScript and styled with Tailwind CSS.

A minimal Vite configuration is included so you can run the demo locally.

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
