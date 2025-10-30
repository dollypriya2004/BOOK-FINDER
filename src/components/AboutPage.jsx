import React from 'react';

const AboutPage = ({ onBack }) => {
  return (
    <div className="about-container">
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
              <button className="nav-button active">About</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="about-content">
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="back-button"
        >
          ← Back to Home
        </button>

        <div className="about-header">
          <h1 className="about-title">About BookFinder</h1>
          <p className="about-subtitle">Your Gateway to Infinite Stories</p>
        </div>

        <div className="about-sections">
          <section className="about-section">
            <h2>What is BookFinder?</h2>
            <p>
              BookFinder is a comprehensive web application designed for book lovers, students, 
              and avid readers who want to discover their next favorite book. Our platform 
              leverages the powerful Open Library API to provide you with access to millions 
              of books from around the world.
            </p>
          </section>

          <section className="about-section">
            <h2>Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>Advanced Search</h3>
                <p>Search books by title, author, subject, or general keywords to find exactly what you're looking for.</p>
              </div>
              <div className="feature-card">
                <h3>Detailed Information</h3>
                <p>Get comprehensive book details including covers, descriptions, ISBN, publication years, and more.</p>
              </div>
              <div className="feature-card">
                <h3>Smart Recommendations</h3>
                <p>Discover similar books based on your interests with our intelligent recommendation system.</p>
              </div>
              <div className="feature-card">
                <h3>Multiple Editions</h3>
                <p>View different editions of books with their specific publication details and ISBN numbers.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Technology</h2>
            <p>
              BookFinder is built with modern web technologies including React.js for the frontend, 
              and integrates with the Open Library API to provide real-time book data. The application 
              features a responsive design that works seamlessly across all devices.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We believe that everyone should have easy access to book information and discovery tools. 
              Our mission is to make book searching effortless and enjoyable, helping readers connect 
              with stories that inspire, educate, and entertain.
            </p>
          </section>

          <section className="about-section">
            <h2>Contact & Support</h2>
            <p>
              Have questions or suggestions? We'd love to hear from you! BookFinder is constantly 
              evolving to serve our readers better.
            </p>
            <div className="contact-info">
              <p><strong>Developer:</strong> Dollypriya</p>
              <p><strong>Data Source:</strong> Open Library API</p>
              <p><strong>Version:</strong> 1.0.0</p>
            </div>
          </section>
        </div>

        <div className="about-footer">
          <button 
            onClick={onBack}
            className="back-to-home-button"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 BOOKFINDER | Made with for book lovers everywhere</p>
      </footer>
    </div>
  );
};

export default AboutPage;
