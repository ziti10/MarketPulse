import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, Bitcoin, Fuel, Coins, Plus, X, BarChart3 } from 'lucide-react';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'stocks' | 'crypto' | 'commodities' | 'forex';
}

const StockDetailModal = ({ isOpen, onClose, symbol, marketData }) => {
  if (!isOpen) return null;

  const stockData = marketData.find(item => item.symbol === symbol);
  if (!stockData) return null;

  // Generate mock chart data
  const generateChartData = () => {
    const data = [];
    const basePrice = stockData.price;
    for (let i = 30; i >= 0; i--) {
      const variation = (Math.random() - 0.5) * 0.1;
      data.push({
        time: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: basePrice * (1 + variation)
      });
    }
    return data;
  };

  const chartData = generateChartData();

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
              30-Day Price Chart (Simulated)
            </h3>
            <div className="h-64 flex items-end space-x-1">
              {chartData.map((point, index) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t flex-1 transition-all hover:bg-blue-600"
                  style={{
                    height: `${Math.max(10, (point.price / Math.max(...chartData.map(d => d.price))) * 100)}%`
                  }}
                  title={`${point.time}: $${point.price.toFixed(2)}`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Hover over bars to see price data. This is simulated data for demonstration.
            </p>
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

  const generateMockData = (): MarketItem[] => {
    return [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 175.84, change: 2.34, changePercent: 1.35, category: 'stocks' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 138.21, change: -1.45, changePercent: -1.04, category: 'stocks' },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: 5.67, changePercent: 2.33, category: 'stocks' },
      { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.85, change: 0.95, changePercent: 0.25, category: 'stocks' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.32, change: -2.15, changePercent: -1.46, category: 'stocks' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.28, change: 12.45, changePercent: 1.44, category: 'stocks' },
      { symbol: 'META', name: 'Meta Platforms Inc.', price: 312.54, change: 4.87, changePercent: 1.58, category: 'stocks' },
      { symbol: 'NFLX', name: 'Netflix Inc.', price: 487.23, change: -8.92, changePercent: -1.80, category: 'stocks' },
      { symbol: 'AMD', name: 'Advanced Micro Devices', price: 142.67, change: 3.21, changePercent: 2.30, category: 'stocks' },
      { symbol: 'BABA', name: 'Alibaba Group Holding', price: 89.45, change: 1.23, changePercent: 1.39, category: 'stocks' },
      { symbol: 'BTC', name: 'Bitcoin', price: 43567.89, change: 1234.56, changePercent: 2.91, category: 'crypto' },
      { symbol: 'ETH', name: 'Ethereum', price: 2456.78, change: -67.23, changePercent: -2.66, category: 'crypto' },
      { symbol: 'SOL', name: 'Solana', price: 98.45, change: 3.21, changePercent: 3.37, category: 'crypto' },
      { symbol: 'GOLD', name: 'Gold Spot', price: 2034.50, change: 12.75, changePercent: 0.63, category: 'commodities' },
      { symbol: 'OIL', name: 'Crude Oil WTI', price: 78.92, change: -2.15, changePercent: -2.65, category: 'commodities' },
      { symbol: 'SILVER', name: 'Silver Spot', price: 24.67, change: 0.45, changePercent: 1.86, category: 'commodities' },
      { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0892, change: 0.0023, changePercent: 0.21, category: 'forex' },
      { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2734, change: -0.0087, changePercent: -0.68, category: 'forex' },
    ];
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setHasApiKey(true);
      setShowApiInput(false);
      alert(`API Key saved: ${apiKey.substring(0, 8)}... 
      
In a real application, this would now fetch live data from Alpha Vantage API. For this demo, we'll continue showing simulated data that updates every 30 seconds.`);
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMarketData(generateMockData());
      setIsLoading(false);
    }, 1500);

    // Update data every 30 seconds with small random changes
    const interval = setInterval(() => {
      setMarketData(prevData => 
        prevData.map(item => ({
          ...item,
          price: item.price * (1 + (Math.random() - 0.5) * 0.001),
          change: item.change + (Math.random() - 0.5) * 0.5,
          changePercent: item.changePercent + (Math.random() - 0.5) * 0.1
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const addCustomStock = () => {
    if (!customSymbol.trim()) return;
    
    const mockItem: MarketItem = {
      symbol: customSymbol.toUpperCase(),
      name: `${customSymbol.toUpperCase()} Corporation`,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      category: 'stocks'
    };
    
    // Check if symbol already exists
    const exists = marketData.some(item => item.symbol === mockItem.symbol);
    if (!exists) {
      setMarketData(prev => [...prev, mockItem]);
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
            Market data updates every 30 seconds • Click any item for real-time charts • Built with React & TypeScript
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
      />
    </div>
  );
};

export default Index;