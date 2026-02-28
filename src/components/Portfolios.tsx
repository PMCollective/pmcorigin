import { useEffect, useState, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react";

const SHEETDB_API_URL = "https://sheetdb.io/api/v1/qzfnvm70uo0m5";

type Portfolio = {
  link?: string;
  Link?: string;
  "Portfolio link"?: string;
  email?: string;
  Email?: string;
  [key: string]: any;
};

// Memoized Portfolio Card Component
const PortfolioCard = memo(({ 
  portfolio, 
  index 
}: { 
  portfolio: Portfolio; 
  index: number;
}) => {
  const [previewState, setPreviewState] = useState<'loading' | 'screenshot' | 'iframe' | 'fallback'>('loading');
  const [imageLoaded, setImageLoaded] = useState(false);

  const portfolioLink = useMemo(() => 
    portfolio.link || portfolio.Link || portfolio["Portfolio link"] || "",
    [portfolio]
  );
  
  const email = useMemo(() => 
    portfolio.email || portfolio.Email || "",
    [portfolio]
  );

  const previewUrl = useMemo(() => {
    if (!portfolioLink) return null;
    try {
      const cleanUrl = portfolioLink.startsWith('http') ? portfolioLink : `https://${portfolioLink}`;
      return `https://mini.s-shot.ru/1024x768/JPEG/1024/Z100/?${encodeURIComponent(cleanUrl)}`;
    } catch {
      return null;
    }
  }, [portfolioLink]);

  const hostname = useMemo(() => {
    try {
      return new URL(portfolioLink).hostname;
    } catch {
      return portfolioLink.slice(0, 30) + '...';
    }
  }, [portfolioLink]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setPreviewState('screenshot');
  }, []);

  const handleImageError = useCallback(() => {
    setPreviewState('iframe');
    // If iframe also fails after 3 seconds, show fallback
    setTimeout(() => {
      setPreviewState(prev => prev === 'iframe' ? 'fallback' : prev);
    }, 3000);
  }, []);

  const handleCardClick = useCallback(() => {
    if (portfolioLink) {
      window.open(portfolioLink, '_blank', 'noopener,noreferrer');
    }
  }, [portfolioLink]);

  const handleEmailClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      className="group relative bg-white/95 backdrop-blur-md rounded-3xl shadow-sm hover:shadow-xl border border-purple-100/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer h-64"
      onClick={handleCardClick}
    >
      {/* Portfolio Preview */}
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-3xl">
        {/* Loading State */}
        {previewState === 'loading' && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center rounded-3xl animate-pulse z-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8 text-purple-400" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-purple-200 rounded w-24 mx-auto"></div>
                <div className="h-2 bg-purple-200 rounded w-16 mx-auto"></div>
              </div>
            </div>
          </div>
        )}

        {/* Screenshot Preview */}
        {previewUrl && (previewState === 'loading' || previewState === 'screenshot') && (
          <img
            src={previewUrl}
            alt="Portfolio preview"
            className={`w-full h-full object-cover rounded-3xl transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Iframe Fallback */}
        {previewState === 'iframe' && portfolioLink && (
          <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden">
            <iframe
              src={portfolioLink}
              className="w-full h-full border-0 pointer-events-none rounded-3xl"
              style={{
                width: '100%',
                height: '100%',
                transform: 'scale(0.75)',
                transformOrigin: 'top left'
              }}
              title={`Portfolio preview ${index + 1}`}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/30 flex items-center justify-center rounded-3xl pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600">
                Live Preview
              </div>
            </div>
          </div>
        )}

        {/* Ultimate Fallback */}
        {previewState === 'fallback' && (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-white rounded-3xl border-2 border-dashed border-purple-200">
            <div className="text-center p-6">
              <div className="relative">
                <Globe className="w-20 h-20 text-purple-300 mx-auto mb-4" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">→</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-purple-600 mb-2">Portfolio Website</h3>
              <p className="text-sm text-purple-400 mb-1">Preview not available</p>
              <p className="text-xs text-purple-300">Click to visit the site</p>
              <div className="mt-3 px-3 py-1 bg-purple-100 rounded-full text-xs text-purple-600 font-medium max-w-full truncate">
                {hostname}
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl"></div>
      </div>

      {/* Email Button */}
      <div className="absolute bottom-4 right-4 z-10">
        {email ? (
          <a
            href={`mailto:${email}`}
            onClick={handleEmailClick}
            className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg border-2 border-white/20"
            title={`Contact: ${email}`}
          >
            <Mail className="w-5 h-5" />
          </a>
        ) : (
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200/80 text-gray-400 rounded-full backdrop-blur-sm border-2 border-white/20">
            <Mail className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
});

PortfolioCard.displayName = 'PortfolioCard';

// Main Component
const Portfolios = () => {
  const [data, setData] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Increased for better UX

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(SHEETDB_API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoized pagination calculations
  const { totalPages, currentPortfolios, startIndex, endIndex } = useMemo(() => {
    const total = Math.ceil(data.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const portfolios = data.slice(start, end);
    
    return {
      totalPages: total,
      currentPortfolios: portfolios,
      startIndex: start,
      endIndex: Math.min(end, data.length)
    };
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, totalPages, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // Page numbers for pagination
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, -1, totalPages];
    }
    
    if (currentPage >= totalPages - 3) {
      return [1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    
    return [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
  }, [currentPage, totalPages]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-purple-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.1)_2px,transparent_0)] [background-size:24px_24px] opacity-70"></div>
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-100 rounded-full animate-spin border-t-purple-600"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-300 animate-spin"
            style={{ animationDuration: "1.5s" }}
          ></div>
        </div>
        <h2 className="mt-6 text-xl font-semibold text-gray-800">Loading Portfolios</h2>
        <p className="text-gray-600 mt-1">Discovering amazing work...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-purple-100 text-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Portfolios</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-purple-50 to-purple-100">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSflz7IfVjb4RtvVsoYYVWm5Rve9zLBfqO7pUVRxON2nghZSiQ/viewform?usp=sharing&ouid=116901765189736149132"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 mb-4"
        >
          <Star className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
          Add Your Portfolio
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
        <p className="text-gray-600">No portfolios available yet.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(139,92,246,0.1)_2px,transparent_0)] [background-size:24px_24px] opacity-70"></div>

      <div className="relative container mx-auto p-4 sm:p-8">
        <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Creative Portfolios</h1>
              <p className="text-gray-600 mt-1">Discover exceptional work from talented creators</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSflz7IfVjb4RtvVsoYYVWm5Rve9zLBfqO7pUVRxON2nghZSiQ/viewform?usp=sharing&ouid=116901765189736149132"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 whitespace-nowrap"
            >
              <Star className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              Add Your Portfolio
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {totalPages > 1 && (
              <div className="hidden sm:block">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages} • {data.length} portfolios
                </p>
              </div>
            )}
          </div>
        </header>

        {/* Portfolio Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {currentPortfolios.map((portfolio, idx) => (
            <PortfolioCard 
              key={startIndex + idx} 
              portfolio={portfolio} 
              index={startIndex + idx}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white/90 hover:bg-purple-50 text-purple-700 shadow-sm hover:shadow-md border border-purple-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1">
                {pageNumbers.map((pageNum, idx) => 
                  pageNum === -1 ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === pageNum
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-white/90 hover:bg-purple-50 text-purple-700 border border-purple-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
              </div>

              <div className="sm:hidden">
                <span className="px-4 py-2 bg-white/90 rounded-lg text-purple-700 font-medium border border-purple-100">
                  {currentPage} / {totalPages}
                </span>
              </div>
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white/90 hover:bg-purple-50 text-purple-700 shadow-sm hover:shadow-md border border-purple-100'
              }`}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Showing {startIndex + 1}-{endIndex} of {data.length} portfolio{data.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Portfolios;