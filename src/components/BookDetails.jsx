import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import BookCard from './BookCard';

const BookDetails = ({ 
  book, 
  onBack, 
  onSearch, 
  searchType, 
  setSearchType, 
  searchHistory, 
  loading,
  onBookSelect,
  onShowAbout 
}) => {
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [bookDescription, setBookDescription] = useState('');
  const [loadingDescription, setLoadingDescription] = useState(false);
  const [detailedBook, setDetailedBook] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [editions, setEditions] = useState([]);
  const [selectedEdition, setSelectedEdition] = useState(0);
  const [showAllEditions, setShowAllEditions] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [book]); 
  const getCoverUrl = (coverId, size = 'M') => {
    return coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
      : null;
  };
  

  const getAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ');
  };

  const getPublishedYear = () => {
    // Use the selected edition's publish year first
    if (editions.length > selectedEdition) {
      const edition = editions[selectedEdition];
      if (edition.publish_date) {
        const yearMatch = edition.publish_date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
        if (yearMatch) return yearMatch[0];
      }
    }
    
    if (detailedBook?.first_publish_date) return detailedBook.first_publish_date;
    if (book.first_publish_year) return book.first_publish_year;
    
    if (book.publish_date && book.publish_date.length > 0) {
      for (let date of book.publish_date) {
        if (date && typeof date === 'string') {
          const yearMatch = date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
          if (yearMatch) return yearMatch[0];
        }
      }
    }
    
    return 'Unknown';
  };

  const getCurrentEdition = () => {
    if (editions.length === 0) return null;
    return editions[selectedEdition];
  };

  const getISBN = () => {
    const currentEdition = getCurrentEdition();
    if (!currentEdition) return 'Not available';
    
    if (currentEdition.isbn_13 && currentEdition.isbn_13.length > 0) return currentEdition.isbn_13[0];
    if (currentEdition.isbn_10 && currentEdition.isbn_10.length > 0) return currentEdition.isbn_10[0];
    if (currentEdition.isbn && currentEdition.isbn.length > 0) return currentEdition.isbn[0];
    
    return 'Not available';
  };

  const getPages = () => {
    const currentEdition = getCurrentEdition();
    if (!currentEdition) return 'Not specified';
    
    if (currentEdition.number_of_pages) return `${currentEdition.number_of_pages} pages`;
    if (currentEdition.pagination) return currentEdition.pagination;
    
    return 'Not specified';
  };

  const getPublisher = () => {
    const currentEdition = getCurrentEdition();
    if (!currentEdition) return 'Not specified';
    
    if (currentEdition.publishers && currentEdition.publishers.length > 0) {
      return currentEdition.publishers[0];
    }
    
    return 'Not specified';
  };

  const getGenres = () => {
    // Try detailed book subjects first
    if (detailedBook?.subjects && detailedBook.subjects.length > 0) {
      return detailedBook.subjects.slice(0, 3).join(', ');
    }
    // Fallback to search result subjects
    if (book.subject && book.subject.length > 0) {
      return book.subject.slice(0, 3).join(', ');
    }
    return 'Not specified';
  };

  // Sort editions by most recent first
  const sortEditions = (editionsList) => {
    return editionsList.sort((a, b) => {
      const yearA = a.publish_date ? parseInt(a.publish_date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/)?.[0] || 0) : 0;
      const yearB = b.publish_date ? parseInt(b.publish_date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/)?.[0] || 0) : 0;
      return yearB - yearA;
    });
  };

  const fetchBookDetails = async () => {
    if (!book.key) return;
    
    setLoadingDetails(true);
    try {
      const workId = book.key.replace('/works/', '');
      
      // Fetch main work details
      const workResponse = await fetch(`https://openlibrary.org/works/${workId}.json`);
      const workData = await workResponse.json();
      setDetailedBook(workData);
      
      // Fetch editions to get ISBN and pages
      const editionsResponse = await fetch(`https://openlibrary.org/works/${workId}/editions.json?limit=50`);
      const editionsData = await editionsResponse.json();
      
      if (editionsData.entries && editionsData.entries.length > 0) {
        const sortedEditions = sortEditions(editionsData.entries);
        setEditions(sortedEditions);
      }
      
      // Get description
      if (workData.description) {
        if (typeof workData.description === 'string') {
          setBookDescription(workData.description);
        } else if (workData.description.value) {
          setBookDescription(workData.description.value);
        }
      }
      
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const fetchRecommendedBooks = async () => {
    const subjects = detailedBook?.subjects || book.subject;
    if (!subjects || subjects.length === 0) return;
    
    try {
      const subject = subjects[0];
      const response = await fetch(`https://openlibrary.org/search.json?subject=${encodeURIComponent(subject)}&limit=6`);
      const data = await response.json();
      
      const filteredBooks = data.docs?.filter(recBook => recBook.key !== book.key) || [];
      const uniqueBooks = filteredBooks.reduce((acc, current) => {
        const x = acc.find(item => item.key === current.key);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      
      setRecommendedBooks(uniqueBooks.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recommended books:', error);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [book]);

  useEffect(() => {
    if (detailedBook) {
      fetchRecommendedBooks();
    }
  }, [detailedBook]);

  const placeholderCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNiMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg==';

  const currentEdition = getCurrentEdition();

  const handleEditionChange = (index) => {
    setSelectedEdition(index);
    setShowAllEditions(false);
  };

  const handleRecommendedBookClick = (recommendedBook) => {
    window.scrollTo(0, 0);
    if (onBookSelect) {
      onBookSelect(recommendedBook);
    }
  };

  return (
    <div className="book-details-container">
      {/* Header */}
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
                onClick={onBack}
                className="nav-button"
              >
                Home
              </button>
              <button 
                onClick={onShowAbout}
                className="nav-button"
              >
                About
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="book-details-content">
        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <SearchBar 
            onSearch={onSearch}
            onClear={() => {}}
            searchType={searchType}
            setSearchType={setSearchType}
            searchHistory={searchHistory}
            loading={loading}
          />
        </div>

        {/* Back Button */}
        <button 
          onClick={onBack}
          className="back-button"
        >
          ← Back to Search Results
        </button>

        {loadingDetails ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading book details...</span>
          </div>
        ) : (
          <>
            {/* Edition Selector */}
            {editions.length > 1 && (
              <div className="edition-selector">
                <h3 className="edition-title">
                  Edition {selectedEdition + 1} of {editions.length}
                </h3>
                <div className="edition-buttons">
                  {editions.slice(0, showAllEditions ? editions.length : 5).map((edition, index) => (
                    <button
                      key={index}
                      onClick={() => handleEditionChange(index)}
                      className={`edition-button ${selectedEdition === index ? 'active' : ''}`}
                    >
                      {edition.publish_date ? 
                        edition.publish_date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/)?.[0] || 'Unknown' 
                        : 'Unknown'}
                      {edition.publishers?.[0] && ` - ${edition.publishers[0]}`}
                    </button>
                  ))}
                  {editions.length > 5 && (
                    <button
                      onClick={() => setShowAllEditions(!showAllEditions)}
                      className="edition-toggle"
                    >
                      {showAllEditions ? 'Show Less' : `Show All ${editions.length} Editions`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Book Details */}
            <div className="book-details-main">
              <div className="book-cover-section">
                <img
                  src={getCoverUrl(book.cover_i, 'M') || placeholderCover}
                  alt={book.title || 'Book cover'}
                  className="book-detail-cover"
                  onError={(e) => {
                    e.target.src = placeholderCover;
                  }}
                />
              </div>

              <div className="book-info-section">
                <h1 className="book-detail-title">
                  {book.title || 'Untitled Book'}
                </h1>
                
                {/* Edition Info */}
                {currentEdition && (
                  <div className="edition-info">
                    <p className="edition-meta">
                      {currentEdition.publish_date && `Published: ${currentEdition.publish_date}`}
                      {currentEdition.publishers?.[0] && ` by ${currentEdition.publishers[0]}`}
                    </p>
                  </div>
                )}
                
                <div className="book-meta-details">
                  <div className="meta-row">
                    <span className="meta-label">Written by:</span>
                    <span className="meta-value">{getAuthors(book.author_name)}</span>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">Year of Publish:</span>
                    <span className="meta-value">{getPublishedYear()}</span>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">Genre:</span>
                    <span className="meta-value">
                      {getGenres()}
                    </span>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">ISBN:</span>
                    <span className="meta-value">{getISBN()}</span>
                  </div>
                  
                  <div className="meta-row">
                    <span className="meta-label">Pages:</span>
                    <span className="meta-value">
                      {getPages()}
                    </span>
                  </div>

                  <div className="meta-row">
                    <span className="meta-label">Publisher:</span>
                    <span className="meta-value">
                      {getPublisher()}
                    </span>
                  </div>
                </div>

                {/* Book Description */}
                <div className="description-section">
                  <h3 className="description-title">About this book</h3>
                  {bookDescription ? (
                    <p className="book-description">
                      {bookDescription.length > 500 
                        ? `${bookDescription.substring(0, 500)}...` 
                        : bookDescription
                      }
                    </p>
                  ) : (
                    <p className="no-description">
                      No description available for this book.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommended Books */}
            {recommendedBooks.length > 0 && (
              <div className="recommended-section">
                <h2 className="recommended-title">You might also like</h2>
                <div className="recommended-books">
                  {recommendedBooks.map((recBook, index) => (
                    <div 
                      key={`${recBook.key}-${index}`}
                      onClick={() => handleRecommendedBookClick(recBook)}
                      style={{cursor: 'pointer'}}
                    >
                      <BookCard 
                        book={recBook} 
                        onBookSelect={() => {}} 
                        compact={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>Powered by Open Library API</p>
      </footer>
    </div>
  );
};

export default BookDetails;