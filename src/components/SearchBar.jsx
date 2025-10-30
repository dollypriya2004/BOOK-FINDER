import { useState } from 'react';

const SearchBar = ({ onSearch, onClear, searchType, setSearchType, searchHistory, loading, compact = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  const searchFromHistory = (historyItem) => {
    setQuery(historyItem.query);
    setSearchType(historyItem.type);
    onSearch(historyItem.query);
  };

  if (compact) {
    return (
      <div style={{display: 'flex', gap: '0.5rem'}}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-select"
          disabled={loading}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="genre">Genre</option>
        </select>
        <button
          onClick={handleSubmit}
          disabled={loading || !query.trim()}
          className="search-button-primary"
        >
          {loading ? '...' : 'Search'}
        </button>
        <button
          onClick={handleClear}
          disabled={loading}
          className="search-button-secondary"
        >
          Clear
        </button>
      </div>
    );
  }

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-row">
       
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="search-input"
              disabled={loading}
            />
          </div>
          
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="search-select"
            disabled={loading}
          >
            <option value="title">Title</option>
            <option value="author">Author</option>
            <option value="genre">Genre</option>
            <option value="general">General</option>
          </select>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="search-button-primary"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="search-button-secondary"
          >
            Clear
          </button>
        </div>
      </form>

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h3 className="history-title">Recent Searches:</h3>
          <div className="history-buttons">
            {searchHistory.slice(0, 5).map((item, index) => (
              <button
                key={index}
                onClick={() => searchFromHistory(item)}
                className="history-button"
              >
                {item.query} ({item.type})
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;