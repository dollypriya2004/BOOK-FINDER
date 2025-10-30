import { useState } from 'react';
import SearchBar from './components/SearchBar';
import BookCard from './components/BookCard';
import LoadingSpinner from './components/LoadingSpinner';
import BookDetails from './components/BookDetails';
import AboutPage from './components/AboutPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import './index.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useLocalStorage('bookSearchHistory', []);
  const [searchType, setSearchType] = useState('title');
  const [showSearchPage, setShowSearchPage] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Search books using Open Library API
  const searchBooks = async (query) => {
    if (!query.trim()) return;
    
    setSearchPerformed(true);
    setLoading(true);
    setError('');
    
    try {
      let apiUrl = '';
      switch (searchType) {
        case 'title':
          apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=50`;
          break;
        case 'author':
          apiUrl = `https://openlibrary.org/search.json?author=${encodeURIComponent(query)}&limit=50`;
          break;
        case 'genre':
          apiUrl = `https://openlibrary.org/search.json?subject=${encodeURIComponent(query)}&limit=50`;
          break;
        default:
          apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=50`;
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch books');
      
      const data = await response.json();
      setBooks(data.docs || []);
      
      // Update search history
      const newSearch = {
        query,
        type: searchType,
        timestamp: new Date().toISOString(),
        results: data.docs?.length || 0
      };
      
      setSearchHistory(prev => {
        const filtered = prev.filter(item => 
          !(item.query === query && item.type === searchType)
        );
        return [newSearch, ...filtered.slice(0, 9)];
      });
      
    } catch (err) {
      setError('Failed to search books. Please check your internet connection and try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setBooks([]);
    setError('');
    setSearchPerformed(false);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const startSearch = () => {
    setShowSearchPage(true);
    setShowAbout(false);
    setSelectedBook(null);
    setSearchPerformed(false);
  };

  const goToDashboard = () => {
    setShowSearchPage(false);
    setShowAbout(false);
    setBooks([]);
    setError('');
    setSelectedBook(null);
    setSearchPerformed(false);
  };

  const showAboutPage = () => {
    setShowAbout(true);
    setShowSearchPage(false);
    setSelectedBook(null);
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
  };

  const handleBackToSearch = () => {
    setSelectedBook(null);
  };

  // About Page
  if (showAbout) {
    return <AboutPage onBack={goToDashboard} />;
  }

  // Book Details Page (Third Page)
  if (selectedBook) {
    return (
      <BookDetails 
        book={selectedBook}
        onBack={handleBackToSearch}
        onSearch={searchBooks}
        searchType={searchType}
        setSearchType={setSearchType}
        searchHistory={searchHistory}
        loading={loading}
        onBookSelect={handleBookSelect}
        onShowAbout={showAboutPage}
      />
    );
  }

  // Dashboard First Page
  if (!showSearchPage && !selectedBook) {
    return (
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="container">
            <div className="flex justify-between items-center">
              <div className="logo-container">
                <img 
                  src="/logo1.jpg" 
                  alt="BookFinder Logo" 
                  className="logo-image"
                />
                <div className="dashboard-title">
                  BOOKFINDER
                </div>
              </div>
              
              <div className="dashboard-nav">
                <button className="nav-button active">Home</button>
                <button 
                  onClick={showAboutPage}
                  className="nav-button"
                >
                  About
                </button>
              </div>
            </div>
          </div>
        </header>
        
        
        <div className="dashboard-content">
          <div className="text-center">
            <h1 className="universe-heading">
              Find your next universe
            </h1>
            
            <button
              onClick={startSearch}
              className="search-button"
            >
              START YOUR SEARCH
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="container">
            <p className="text-gray-300">
              © 2025 BOOKFINDER | Privacy Policy by Dollypriya
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Search Page (Second Page)
  return (
    <div className="searchpage-container">
      {/* Navigation for Search Page */}
      <nav className="searchpage-header">
        <div className="container">
          <div className="flex justify-between items-center">
            {/* Left Side - BOOKFINDER with logo */}
            <div className="logo-container">
              <img 
                src="/logo1.jpg" 
                alt="BookFinder Logo" 
                className="logo-image"
              />
              <div className="dashboard-title">
                BOOKFINDER
              </div>
            </div>
            
            {/* Right Side - Navigation */}
            <div className="dashboard-nav">
              <button 
                onClick={goToDashboard}
                className="nav-button"
              >
                Home
              </button>
              <button 
                onClick={showAboutPage}
                className="nav-button"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="searchpage-content">
        {/* Back Button */}
        <button 
          onClick={goToDashboard}
          className="back-button"
        >
          ← Back to Home
        </button>

        {/* Header */}
        <header className="text-center mb-8">
          <div className="page-header-container">
            <img 
              src="/gb1.jpg" 
              alt="BookFinder Logo" 
              className="header-logo"
            />
            <h1 className="page-title">
              Search Books
            </h1>
          </div>
          <p className="page-subtitle">
            Discover your next favorite book with powerful search
          </p>
        </header>

        {/* Search Bar */}
        <SearchBar 
          onSearch={searchBooks}
          onClear={clearResults}
          searchType={searchType}
          setSearchType={setSearchType}
          searchHistory={searchHistory}
          loading={loading}
        />

        {/* Clear History Button */}
        {searchHistory.length > 0 && (
          <div className="text-center mb-4">
            <button
              onClick={clearHistory}
              className="text-sm text-gray-500"
              style={{border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline'}}
            >
              Clear Search History
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && <LoadingSpinner />}

        {/* Results Count */}
        {books.length > 0 && !loading && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Found <span className="font-semibold text-blue-600">{books.length}</span> books
            </p>
          </div>
        )}

        {/* Books Grid */}
        <div className="books-grid">
          {books.map((book, index) => (
            <BookCard 
              key={`${book.key}-${index}`} 
              book={book} 
              onBookSelect={handleBookSelect}
            />
          ))}
        </div>

        {/*It show when search was performed but returned no books */}
        {searchPerformed && books.length === 0 && !loading && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No books found</h3>
            <p>Try a different search type.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Powered by Open Library API</p>
      </footer>
    </div>
  );
}

export default App;