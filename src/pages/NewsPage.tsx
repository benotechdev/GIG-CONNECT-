import React, { useState, useEffect, useRef, ChangeEvent, DragEvent } from 'react';
import {
  Newspaper,
  Search,
  ExternalLink,
  Calendar,
  Clock,
  Globe,
  Flame,
  Sparkles,
  Share2,
  Bookmark,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronRight,
  TrendingUp,
  Eye,
  Key,
  ShieldCheck,
  X,
  Radio,
  FileText,
  UploadCloud,
  Languages,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewsArticle, NewsDataItem } from '../types';
import {
  fetchNewsArticles,
  testNewsApiKey,
  NEWS_API_KEY,
  NewsApiResponse,
  parseNewsDataItem,
  IMPORTED_NEWS_ARTICLES,
} from '../services/newsService';

export const NewsPage: React.FC = () => {
  const { setCurrentView } = useApp();

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'uganda' | 'entertainment' | 'sports' | 'culture' | 'global' | 'file'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sourceOrigin, setSourceOrigin] = useState<'live_api' | 'fallback_cache' | 'file_data'>('live_api');
  const [latency, setLatency] = useState(0);

  // Selected article for in-app reader modal
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Custom JSON Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API Key diagnostics modal
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(NEWS_API_KEY);
  const [keyTestStatus, setKeyTestStatus] = useState<{
    tested: boolean;
    ok?: boolean;
    message?: string;
  } | null>(null);
  const [testingKey, setTestingKey] = useState(false);

  // Saved articles in local storage
  const [savedArticleUrls, setSavedArticleUrls] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('gig_ug_saved_news');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleSaveArticle = (url: string) => {
    setSavedArticleUrls((prev) => {
      const next = prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url];
      try {
        localStorage.setItem('gig_ug_saved_news', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const loadNews = async (
    category = activeCategory,
    query = activeQuery,
    keyToUse = keyInput
  ) => {
    setLoading(true);
    try {
      const response: NewsApiResponse = await fetchNewsArticles({
        category,
        query,
        apiKey: keyToUse,
        pageSize: 24,
      });

      setArticles(response.articles);
      setTotalResults(response.totalResults);
      setSourceOrigin(response.sourceOrigin);
      setLatency(response.latencyMs);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews(activeCategory, activeQuery);
  }, [activeCategory, activeQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveQuery('');
    setSelectedLanguage('all');
  };

  const handleTestKey = async () => {
    setTestingKey(true);
    const res = await testNewsApiKey(keyInput);
    setKeyTestStatus({
      tested: true,
      ok: res.ok,
      message: res.message,
    });
    setTestingKey(false);
  };

  const handleShareArticle = async (article: NewsArticle) => {
    const text = `${article.title} - Read more on Gig Connect UG News`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text,
          url: article.url,
        });
        return;
      } catch {}
    }
    // Fallback copy
    navigator.clipboard.writeText(`${article.title}\n${article.url}`);
    alert('Article link copied to clipboard!');
  };

  // Process uploaded JSON file (supports array of NewsDataItem or NewsArticle)
  const processUploadedJsonFile = (file: File) => {
    setUploadError(null);
    setUploadSuccessMsg(null);

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setUploadError('Please select a valid .json file containing news data.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);

        if (!Array.isArray(parsed)) {
          setUploadError('The uploaded JSON must be an array of news articles.');
          return;
        }

        // Parse items
        const newArticles: NewsArticle[] = parsed.map((item: any) => {
          if (item.article_id && item.link) {
            return parseNewsDataItem(item as NewsDataItem);
          }
          return {
            source: {
              id: item.source?.id || null,
              name: item.source?.name || item.source_name || 'Uploaded Source',
              icon: item.source_icon,
            },
            author: item.author || (Array.isArray(item.creator) ? item.creator[0] : null),
            title: item.title || 'Untitled Article',
            description: item.description || item.content || null,
            url: item.url || item.link || '#',
            urlToImage: item.urlToImage || item.image_url || null,
            publishedAt: item.publishedAt || item.pubDate || new Date().toISOString(),
            content: item.content || item.description || null,
            category: item.category ? (Array.isArray(item.category) ? item.category[0] : item.category) : 'top',
            language: item.language || 'english',
            country: item.country || [],
            keywords: item.keywords || [],
          };
        });

        // Add to state and switch to file category
        setArticles(newArticles);
        setTotalResults(newArticles.length);
        setSourceOrigin('file_data');
        setActiveCategory('file');
        setUploadSuccessMsg(`Successfully imported ${newArticles.length} news articles from "${file.name}"!`);
        setTimeout(() => setUploadModalOpen(false), 1500);
      } catch (err: any) {
        setUploadError(`Failed to parse JSON file: ${err.message}`);
      }
    };

    reader.onerror = () => {
      setUploadError('Error reading file from storage.');
    };

    reader.readAsText(file);
  };

  // Filter articles by selected language if not 'all'
  const filteredArticles = articles.filter((a) => {
    if (selectedLanguage === 'all') return true;
    return a.language?.toLowerCase() === selectedLanguage.toLowerCase();
  });

  // Hero article (first article with a good image)
  const heroArticle = filteredArticles.find((a) => a.urlToImage) || filteredArticles[0];
  const gridArticles = heroArticle
    ? filteredArticles.filter((a) => a.url !== heroArticle.url)
    : filteredArticles;

  const categories = [
    { id: 'all', label: 'All Dispatches', icon: Newspaper },
    { id: 'file', label: `Imported File (${IMPORTED_NEWS_ARTICLES.length})`, icon: FileText },
    { id: 'uganda', label: 'Uganda & Kampala', icon: Globe },
    { id: 'entertainment', label: 'Music & Concerts', icon: Flame },
    { id: 'sports', label: 'Sports & Games', icon: TrendingUp },
    { id: 'culture', label: 'Culture & Tourism', icon: Sparkles },
    { id: 'global', label: 'Global Headliners', icon: Radio },
  ] as const;

  // Available languages from current articles
  const availableLanguages = Array.from(
    new Set(articles.map((a) => a.language).filter(Boolean) as string[])
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Live Breaking News Marquee / Ticker */}
      <div className="bg-slate-950 text-white py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="font-extrabold uppercase tracking-wider text-red-400 text-[10px] bg-red-950/80 px-2 py-0.5 rounded border border-red-800/60">
              Live Wire
            </span>
            <span className="font-bold text-slate-300 hidden sm:inline">Uganda & Global News Feed:</span>
          </div>

          <div className="truncate text-slate-300 font-medium">
            {articles.length > 0
              ? articles.slice(0, 4).map((a) => a.title).join('  •  ')
              : 'Streaming live music, festival, and concert updates across Uganda in real time...'}
          </div>

          <div className="shrink-0 flex items-center gap-2 text-slate-400">
            <button
              onClick={() => setActiveCategory('file')}
              className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer text-[11px] font-mono"
            >
              <FileText className="w-3 h-3 text-amber-400" />
              <span className="hidden md:inline">File Data:</span>
              <span className="text-amber-300 font-bold">{IMPORTED_NEWS_ARTICLES.length} Stories</span>
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => setApiKeyModalOpen(true)}
              className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors cursor-pointer text-[11px] font-mono"
              title="Inspect NewsAPI key & connection"
            >
              <Key className="w-3 h-3 text-emerald-400" />
              <span className="hidden md:inline">NewsAPI:</span>
              <span className="text-emerald-400 font-bold">1d455...c35f</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                <Newspaper className="w-3.5 h-3.5 text-amber-700" />
                <span>The Gig Gazette · Live News & Media Stream</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                Live News & Event Buzz
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Stay updated with concert announcements, festival lineups, celebrity interviews, nightlife culture, sports, and world events loaded from live NewsAPI and imported data files.
              </p>
            </div>

            {/* Quick status & Actions */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                <span
                  className={`w-2 h-2 rounded-full ${
                    sourceOrigin === 'file_data'
                      ? 'bg-amber-500'
                      : sourceOrigin === 'live_api'
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-blue-500'
                  }`}
                />
                <span>
                  {sourceOrigin === 'file_data'
                    ? 'Imported File'
                    : sourceOrigin === 'live_api'
                    ? 'NewsAPI Live'
                    : 'Curated Backup'}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">({latency}ms)</span>
              </div>

              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Upload or inspect news JSON file"
              >
                <UploadCloud className="w-4 h-4 text-slate-950" />
                <span>Upload JSON</span>
              </button>

              <button
                type="button"
                onClick={() => loadNews(activeCategory, activeQuery)}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Refresh news"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => setApiKeyModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>API Status</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8">
            <div className="relative max-w-2xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search news by topic, title, source (e.g. Blankets and Wine, Messi, Trend, Kazakhstan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-24 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-hidden focus:border-blue-600 focus:bg-white font-medium transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-20 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold p-1"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 border-t border-slate-100 mt-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id && !activeQuery;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setActiveQuery('');
                    setSearchQuery('');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm scale-[1.02]'
                      : cat.id === 'file'
                      ? 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300/60'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Language Filter Chips */}
          {availableLanguages.length > 1 && (
            <div className="flex items-center gap-2 pt-3 text-xs overflow-x-auto no-scrollbar">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
                <Languages className="w-3 h-3 text-slate-500" />
                <span>Languages:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedLanguage('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  selectedLanguage === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Languages ({articles.length})
              </button>
              {availableLanguages.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize cursor-pointer transition-all ${
                    selectedLanguage.toLowerCase() === lang.toLowerCase()
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Notice when viewing Imported File */}
        {activeCategory === 'file' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <p className="font-bold">Loaded from <code>src/data/newsData.json</code></p>
                <p className="text-amber-800 text-[11px]">
                  Viewing all 10 international news dispatches in English, Arabic, Bosnian, Dutch, Azerbaijani, Spanish, and Russian.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold transition-colors cursor-pointer"
              >
                Upload Another JSON File
              </button>
            </div>
          </div>
        )}

        {/* Search feedback indicator */}
        {activeQuery && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs">
            <div className="flex items-center gap-2 text-blue-900 font-semibold">
              <Search className="w-4 h-4 text-blue-600" />
              <span>
                Showing live news matching "<strong>{activeQuery}</strong>" ({filteredArticles.length} stories found)
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="text-blue-700 hover:text-blue-900 font-bold underline cursor-pointer"
            >
              Reset to all
            </button>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-80 bg-slate-200 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Newspaper className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No stories found</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              No articles matched your active filters. Try broadening your keywords or select another language.
            </p>
            <button
              onClick={handleClearSearch}
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-sm"
            >
              Browse All Dispatches
            </button>
          </div>
        )}

        {!loading && heroArticle && !activeQuery && (
          /* Hero Spotlight Article */
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl group border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
              {/* Media image */}
              <div className="lg:col-span-7 relative overflow-hidden bg-slate-950">
                <img
                  src={
                    heroArticle.urlToImage ||
                    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt={heroArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[260px] lg:min-h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:hidden" />
              </div>

              {/* Text content */}
              <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                      Featured Story
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                      {heroArticle.source.icon && (
                        <img
                          src={heroArticle.source.icon}
                          alt=""
                          className="w-3.5 h-3.5 rounded-full"
                        />
                      )}
                      <span>{heroArticle.source.name}</span>
                    </span>
                    {heroArticle.language && (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300 text-[10px] font-mono uppercase">
                        {heroArticle.language}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight hover:text-amber-400 transition-colors">
                    <a
                      href={heroArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer"
                    >
                      {heroArticle.title}
                    </a>
                  </h2>

                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">
                    {heroArticle.description || heroArticle.content}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(heroArticle.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {heroArticle.author && (
                      <span className="truncate max-w-[140px]">By {heroArticle.author}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={heroArticle.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                    >
                      <span>Read Full Story</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setSelectedArticle(heroArticle)}
                      className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Quick Read</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareArticle(heroArticle)}
                      className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                      title="Share Article"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        {!loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>
                  {activeCategory === 'file'
                    ? 'Dispatches from News Data File'
                    : 'Latest News & Event Buzz'}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {filteredArticles.length}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {gridArticles.map((article, idx) => {
                const isSaved = savedArticleUrls.includes(article.url);
                return (
                  <article
                    key={article.url + idx}
                    className="flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden group"
                  >
                    {/* Image Header */}
                    <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                      <img
                        src={
                          article.urlToImage ||
                          'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
                        }
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                            {article.source.icon && (
                              <img
                                src={article.source.icon}
                                alt=""
                                className="w-3 h-3 rounded-full"
                              />
                            )}
                            <span>{article.source.name}</span>
                          </span>

                          {article.language && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-900/70 text-amber-300 text-[9px] font-mono font-bold uppercase backdrop-blur-xs">
                              {article.language}
                            </span>
                          )}
                        </div>

                        <div className="pointer-events-auto flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleSaveArticle(article.url)}
                            className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                              isSaved
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-slate-950/60 text-white hover:bg-slate-950'
                            }`}
                            title={isSaved ? 'Saved in bookmarks' : 'Bookmark story'}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Article Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          {article.author && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[120px] font-medium text-slate-500">
                                {article.author}
                              </span>
                            </>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            {article.title}
                          </a>
                        </h4>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {article.description || 'Click to read complete dispatches and full reporting.'}
                        </p>

                        {/* Country or Keyword tags */}
                        {((article.country && article.country.length > 0) ||
                          (article.keywords && article.keywords.length > 0)) && (
                          <div className="flex flex-wrap items-center gap-1 pt-1">
                            {article.country?.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider"
                              >
                                {c}
                              </span>
                            ))}
                            {article.keywords?.slice(0, 2).map((k) => (
                              <span
                                key={k}
                                className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-medium"
                              >
                                #{k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle(article)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-800 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick View</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleShareArticle(article)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            title="Share story"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>

                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-blue-700 rounded-lg flex items-center gap-1 text-xs font-semibold"
                            title="Read source publication"
                          >
                            <span>Source</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick View Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center gap-1.5">
                  {selectedArticle.source.icon && (
                    <img src={selectedArticle.source.icon} alt="" className="w-3.5 h-3.5 rounded-full" />
                  )}
                  <span>{selectedArticle.source.name}</span>
                </span>
                {selectedArticle.language && (
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-mono uppercase">
                    {selectedArticle.language}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  {new Date(selectedArticle.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedArticle.urlToImage && (
              <div className="rounded-2xl overflow-hidden aspect-16/9 bg-slate-100 border border-slate-200">
                <img
                  src={selectedArticle.urlToImage}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>

              {selectedArticle.author && (
                <p className="text-xs text-slate-500 font-medium">
                  Reported by: <span className="text-slate-800 font-bold">{selectedArticle.author}</span>
                </p>
              )}

              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {selectedArticle.description}
              </p>

              {selectedArticle.content && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed font-mono">
                  {selectedArticle.content}
                </div>
              )}

              {/* Keywords and countries */}
              {selectedArticle.keywords && selectedArticle.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedArticle.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleShareArticle(selectedArticle)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Story</span>
              </button>

              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Read Full Article on {selectedArticle.source.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* JSON File Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload News JSON File</h3>
                  <p className="text-[11px] text-slate-500">Import articles from device storage</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".json,application/json"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files.length > 0) {
                  processUploadedJsonFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setIsDraggingFile(true);
              }}
              onDragLeave={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setIsDraggingFile(false);
              }}
              onDrop={(e: DragEvent<HTMLDivElement>) => {
                e.preventDefault();
                setIsDraggingFile(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  processUploadedJsonFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                isDraggingFile
                  ? 'border-amber-500 bg-amber-50/70 scale-[1.01]'
                  : 'border-slate-300 hover:border-amber-500 bg-slate-50/70'
              }`}
            >
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs">
                  <FileText className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800">
                  <span className="text-amber-600 underline">Click to choose JSON file</span> or drag it here
                </p>
                <p className="text-[11px] text-slate-500">
                  Supports NewsData.io or standard JSON array formats
                </p>
              </div>
            </div>

            {uploadSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-bold block text-slate-800">Preloaded File:</span>
              <p><code>src/data/newsData.json</code> is already loaded with 10 international articles.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NewsAPI Key Configuration & Diagnostics Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">NewsAPI Integration Status</h3>
                  <p className="text-[11px] text-slate-500">Live news feed configuration for Uganda</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setApiKeyModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Key Configured & Active</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  API Key: <code className="bg-white px-2 py-0.5 rounded border font-bold">1d4550cf9675470e9dc5e9116658c35f</code>
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Active NewsAPI Key
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-hidden focus:border-blue-600 bg-slate-50"
                />
              </div>

              {keyTestStatus?.tested && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                    keyTestStatus.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {keyTestStatus.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{keyTestStatus.message}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="font-semibold text-slate-700">Endpoints Enabled:</p>
                <p>• <code>/everything?q=Uganda...</code> (Entertainment & Concerts)</p>
                <p>• <code>/top-headlines?category=entertainment</code> (Global Headliners)</p>
                <p>• Built-in proxy at <code>/api/news</code> for CORS handling</p>
                <p>• Preloaded file at <code>src/data/newsData.json</code> ({IMPORTED_NEWS_ARTICLES.length} items)</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testingKey}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingKey ? 'animate-spin' : ''}`} />
                <span>Test Connection</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  loadNews(activeCategory, activeQuery, keyInput);
                  setApiKeyModalOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Apply & Reload News
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
