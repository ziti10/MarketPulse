# MarketPulse

This repository contains a single React component written in TypeScript that renders a market dashboard. It displays simulated pricing for stocks, cryptocurrencies, commodities and forex pairs.

The main component `Index` manages mock data and provides interactive features such as search, category filtering, and the ability to add custom symbols. Clicking an item opens `StockDetailModal` which shows a simulated price chart.

To use the code, import `Index` into a React application. The component uses Tailwind CSS for styling and depends on icons from `lucide-react`.

```
import Index from './market-pulse-dashboard';
```

Because this repository does not include a build setup or dependencies, integrate the component into an existing React project that has TypeScript, Tailwind CSS and `lucide-react` installed.
