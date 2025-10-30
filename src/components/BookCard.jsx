const BookCard = ({ book, onBookSelect, compact = false }) => {
  // Helper function to get book cover image URL
  const getCoverUrl = (coverId, size = 'S') => {
    return coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
      : null;
  };

  // Format author names - show max 2 authors
  const getAuthors = (authors) => {
    if (!authors || authors.length === 0) return 'Unknown Author';
    return authors.slice(0, 2).join(', ');
  };

  // Extract publication year from different possible fields
  const getPublishedYear = () => {
    if (book.first_publish_year) return book.first_publish_year;
    
    if (book.publish_date && book.publish_date.length > 0) {
      for (let date of book.publish_date) {
        if (date && typeof date === 'string') {
          const yearMatch = date.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
          if (yearMatch) return yearMatch[0];
        }
      }
    }
    
    return null;
  };

  // Format language display - show main language only
  const getLanguageDisplay = (languages) => {
    if (!languages || languages.length === 0) return null;
    
    const mainLanguage = languages[0];
    if (languages.length === 1) return mainLanguage.toUpperCase();
    return `${mainLanguage.toUpperCase()} +${languages.length - 1}`;
  };

  // Fallback image when no cover is available
  const placeholderCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNiMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIENvdmVyPC90ZXh0Pjwvc3ZnPg==';

  // Check what book data is available to display
  const hasYear = getPublishedYear();
  const hasPages = book.number_of_pages_median;
  const hasLanguage = book.language && book.language.length > 0;
  const hasPublisher = book.publisher && book.publisher[0];
  const hasSubjects = book.subject && book.subject.length > 0;

  // Handle click on book card
  const handleClick = () => {
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  //  for recommended books
  if (compact) {
    return (
      <div className="book-card compact" onClick={handleClick}>
        <div className="book-card-content">
          <div className="book-cover-container">
            <img
              src={getCoverUrl(book.cover_i) || placeholderCover}
              alt={book.title || 'Book cover'}
              className="book-cover"
              onError={(e) => {
                e.target.src = placeholderCover;
              }}
            />
          </div>
          <div className="book-info">
            <h3 className="book-title">
              {book.title || 'Untitled Book'}
            </h3>
            <p className="book-author">
              by {getAuthors(book.author_name)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className="book-card" onClick={handleClick}>
      <div className="book-card-content">
        {/* Book cover image */}
        <div className="book-cover-container">
          <img
            src={getCoverUrl(book.cover_i) || placeholderCover}
            alt={book.title || 'Book cover'}
            className="book-cover"
            onError={(e) => {
              e.target.src = placeholderCover;
            }}
          />
        </div>
        
        {/* Book details */}
        <div className="book-info">
          {/* Book title */}
          <h3 className="book-title">
            {book.title || 'Untitled Book'}
          </h3>
          
          {/* Author names */}
          <p className="book-author">
            by {getAuthors(book.author_name)}
          </p>

          {/* Book metadata - It only show what's available */}
          <div className="book-meta">
            {/* Publication year */}
            {hasYear && (
              <div className="meta-item">
                <span className="meta-icon">📅</span>
                <span className="meta-text">{hasYear}</span>
              </div>
            )}

            {/* Page count */}
            {hasPages && (
              <div className="meta-item">
                <span className="meta-icon">📖</span>
                <span className="meta-text">{book.number_of_pages_median} pages</span>
              </div>
            )}

            {/* Language */}
            {hasLanguage && (
              <div className="meta-item">
                <span className="meta-icon">🌐</span>
                <span className="meta-text">{getLanguageDisplay(book.language)}</span>
              </div>
            )}

            {/* Publisher */}
            {hasPublisher && (
              <div className="meta-item">
                <span className="meta-icon">🏢</span>
                <span className="meta-text line-clamp-1">
                  {book.publisher[0]}
                </span>
              </div>
            )}
          </div>

          {/* Subject tags -  max 2 tags */}
          {hasSubjects && (
            <div className="book-subjects">
              <div className="subjects-container">
                {book.subject.slice(0, 2).map((subject, index) => (
                  <span
                    key={index}
                    className="subject-tag"
                  >
                    {subject.length > 12 ? subject.substring(0, 12) + '...' : subject}
                  </span>
                ))}
                {book.subject.length > 2 && (
                  <span className="subject-more">
                    +{book.subject.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* It show message if very little book data is available */}
          {(!hasYear && !hasPages && !hasLanguage && !hasPublisher) && (
            <div className="basic-info">
              Basic info available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;