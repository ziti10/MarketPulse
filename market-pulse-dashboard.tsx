import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Bitcoin, Fuel, Coins, Plus, X, BarChart3 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'stocks' | 'crypto' | 'commodities' | 'forex';
}

interface StockDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: string;
  marketData: MarketItem[];
  apiKey: string;
}

const StockDetailModal: React.FC<StockDetailModalProps> = ({ isOpen, onClose, symbol, marketData, apiKey }) => {
  const [timeframe, setTimeframe] = useState<'5min' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [chartData, setChartData] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const stockData = marketData.find(item => item.symbol === symbol);
  if (!stockData) return null;

  const fetchChart = async () => {
    if (!apiKey) return;
    setLoading(true);
    try {
      const fnMap: Record<typeof timeframe, string> = {
        '5min': 'TIME_SERIES_INTRADAY',
        'daily': 'TIME_SERIES_DAILY',
        'weekly': 'TIME_SERIES_WEEKLY',
        'monthly': 'TIME_SERIES_MONTHLY'
      };
      const interval = timeframe === '5min' ? '&interval=5min' : '';
      const url = `https://www.alphavantage.co/query?function=${fnMap[timeframe]}${interval}&symbol=${encodeURIComponent(symbol)}&outputsize=compact&apikey=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      const seriesKey = Object.keys(json).find(k => k.includes('Time Series')) as string | undefined;
      if (seriesKey && json[seriesKey]) {
        const entries = Object.entries<any>(json[seriesKey]).slice(0, 200).reverse();
        setChartData(entries.map(([time, val]) => ({ time, price: parseFloat(val['4. close'] || val['5. adjusted close'] || '0') })));
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchChart();
    }
  }, [isOpen, timeframe, symbol]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{stockData.symbol}</h2>
              <p className="text-gray-600">{stockData.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Current Price</h3>
              <p className="text-2xl font-bold text-gray-900">
                ${stockData.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${stockData.change >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Change</h3>
              <p className={`text-2xl font-bold ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.change >= 0 ? '+' : ''}{stockData.change.toFixed(2)}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${stockData.changePercent >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Change %</h3>
              <p className={`text-2xl font-bold ${stockData.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stockData.changePercent >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Price Chart
            </h3>
            <div className="mb-4">
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="border rounded p-2 text-sm"
              >
                <option value="5min">5 Minutes</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {loading ? (
              <p className="text-center text-sm text-gray-500">Loading chart...</p>
            ) : (
              <Line
                data={{
                  labels: chartData.map(d => d.time),
                  datasets: [
                    {
                      label: symbol,
                      data: chartData.map(d => d.price),
                      borderColor: 'rgb(59, 130, 246)',
                      backgroundColor: 'rgba(59, 130, 246, 0.3)',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                className="h-64"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [marketData, setMarketData] = useState<MarketItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customSymbol, setCustomSymbol] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(true);
  const [hasApiKey, setHasApiKey] = useState(false);

  const DEFAULT_SYMBOLS: { symbol: string; category: MarketItem['category'] }[] = [
    { symbol: 'AAPL', category: 'stocks' },
    { symbol: 'GOOGL', category: 'stocks' },
    { symbol: 'TSLA', category: 'stocks' },
    { symbol: 'MSFT', category: 'stocks' },
    { symbol: 'AMZN', category: 'stocks' },
    { symbol: 'NVDA', category: 'stocks' },
    { symbol: 'META', category: 'stocks' },
    { symbol: 'BTCUSD', category: 'crypto' },
    { symbol: 'ETHUSD', category: 'crypto' },
    { symbol: 'XAUUSD', category: 'commodities' },
    { symbol: 'WTI', category: 'commodities' },
    { symbol: 'EURUSD', category: 'forex' },
    { symbol: 'GBPUSD', category: 'forex' },
  ];

  const fetchQuote = async (symbol: string): Promise<any> => {
    if (!apiKey) return null;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      return json['Global Quote'];
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const fetchMarketItem = async (symbol: string, category: MarketItem['category']): Promise<MarketItem | null> => {
    const quote = await fetchQuote(symbol);
    if (!quote) return null;
    return {
      symbol: quote['01. symbol'],
      name: quote['01. symbol'],
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat((quote['10. change percent'] || '0').replace('%','')),
      category,
    };
  };

  const fetchInitialData = async () => {
    setIsLoading(true);
    const items = await Promise.all(
      DEFAULT_SYMBOLS.map(s => fetchMarketItem(s.symbol, s.category))
    );
    setMarketData(items.filter(Boolean) as MarketItem[]);
    setIsLoading(false);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setHasApiKey(true);
      setShowApiInput(false);
      fetchInitialData();
    }
  };

  useEffect(() => {
    if (hasApiKey) {
      fetchInitialData();
    }
  }, [hasApiKey]);

  const addCustomStock = async () => {
    if (!customSymbol.trim()) return;
    const item = await fetchMarketItem(customSymbol.trim(), 'stocks');
    if (item && !marketData.some(m => m.symbol === item.symbol)) {
      setMarketData(prev => [...prev, item]);
    }
    setCustomSymbol('');
  };


  const filteredData = marketData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'stocks': return <TrendingUp className="h-4 w-4" />;
      case 'crypto': return <Bitcoin className="h-4 w-4" />;
      case 'commodities': return <Fuel className="h-4 w-4" />;
      case 'forex': return <DollarSign className="h-4 w-4" />;
      default: return <Coins className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('/')) {
      return price.toFixed(4);
    }
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleItemClick = (item: MarketItem) => {
    setSelectedStock(item.symbol);
    setIsModalOpen(true);
  };

  const categories = [
    { key: 'all', label: 'All', count: filteredData.length },
    { key: 'stocks', label: 'Stocks', count: filteredData.filter(item => item.category === 'stocks').length },
    { key: 'crypto', label: 'Crypto', count: filteredData.filter(item => item.category === 'crypto').length },
    { key: 'commodities', label: 'Commodities', count: filteredData.filter(item => item.category === 'commodities').length },
    { key: 'forex', label: 'Forex', count: filteredData.filter(item => item.category === 'forex').length }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Market Pulse
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Real-time market prices for stocks, crypto, commodities & forex
          </p>
        </div>

        {/* API Key Notice */}
        {showApiInput && (
          <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/20 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-blue-200 mb-2">
                <strong>{hasApiKey ? 'API Key Saved!' : 'Demo Mode'}:</strong> {hasApiKey ? 'Your API key is saved and ready for live data.' : 'Currently showing simulated data.'} 
                {!hasApiKey && (
                  <>
                    {' '}For real-time data, get a free Alpha Vantage API key at{' '}
                    <a 
                      href="https://www.alphavantage.co/support/#api-key" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-300 hover:underline font-semibold"
                    >
                      alphavantage.co
                    </a>
                  </>
                )}
              </p>
              <button
                onClick={() => setShowApiInput(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {!hasApiKey && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter your Alpha Vantage API key"
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm text-white placeholder-white/60"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && apiKey.trim()) {
                      saveApiKey();
                    }
                  }}
                />
                <button
                  onClick={saveApiKey}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
                >
                  Save & Fetch
                </button>
              </div>
            )}
            {hasApiKey && (
              <div className="flex items-center gap-2 text-green-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">API Key: {apiKey.substring(0, 8)}...••••</span>
                <button
                  onClick={() => {
                    setHasApiKey(false);
                    setApiKey('');
                  }}
                  className="text-xs text-white/60 hover:text-white underline ml-2"
                >
                  Change Key
                </button>
              </div>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for stocks, crypto, commodities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setCustomSymbol(searchTerm.toUpperCase());
                  addCustomStock();
                }
              }}
              className="w-full pl-10 pr-4 py-3 text-lg bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:outline-none backdrop-blur-lg"
            />
          </div>

          {/* Add Custom Stock */}
          <div className="mb-6 bg-white/10 border border-white/20 backdrop-blur-lg rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3">Add Any Stock Symbol</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL, TSLA)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCustomStock();
                  }
                }}
              />
              <button 
                onClick={addCustomStock} 
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Stock
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 bg-white/10 backdrop-blur-lg rounded-lg p-2">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category.key)}
                className={`px-4 py-2 rounded-md font-medium transition-all ${
                  activeCategory === category.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {category.label} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
            <p className="text-slate-300 text-lg">Loading market data...</p>
          </div>
        )}

        {/* Market Data Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <div 
                key={item.symbol} 
                className="bg-white/10 border border-white/20 backdrop-blur-lg rounded-lg p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 cursor-pointer hover:border-blue-400 hover:shadow-xl"
                onClick={() => handleItemClick(item)}
              >
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <h3 className="text-white text-lg font-semibold">{item.symbol}</h3>
                      <span className="text-xs text-blue-300 animate-pulse">📊</span>
                    </div>
                    <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full border border-white/30">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm truncate">{item.name}</p>
                  <p className="text-blue-300 text-xs mt-1">Click for detailed chart</p>
                </div>

                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">
                    ${formatPrice(item.price, item.symbol)}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    item.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change >= 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span>
                      {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredData.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No results found for "{searchTerm}"</p>
            <p className="text-slate-500 mt-2">Try searching for popular symbols like AAPL, TSLA, BTC, GOLD, or EUR/USD</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-slate-400">
            Prices powered by Alpha Vantage • Click any item for charts • Built with React &amp; TypeScript
          </p>
        </div>
      </div>

      {/* Stock Detail Modal */}
      <StockDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStock(null);
        }}
        symbol={selectedStock || ''}
        marketData={marketData}
        apiKey={apiKey}
      />
    </div>
  );
};

export default Index;
