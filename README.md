📚 Book Finder - React Application
A comprehensive book discovery application built with React and Vite that helps users search, explore, and discover books using the Open Library API.
Live Demo
StackBlitz Deployment: http://stackblitz.com/edit/vitejs-vite-d2strep8
✨ Features
🔍 Advanced Search:
Search books by Title, Author, Genre, or General keywords
Real-time search with loading states
Search history with localStorage persistence
Multiple search types for flexible discovery
📖 Book Details:
Multiple edition support - browse different publications
Comprehensive book information (ISBN, pages, publisher, year)
Book descriptions and storylines
Smart recommendations based on current book
Responsive book cards with fallback images
User Experience:
Three-page seamless navigation (Home → Search → Details)
Mobile-responsive design
Clean, intuitive interface
Error handling and loading states
Smooth transitions between pages
Tech Stack:
Frontend Framework: React 18
Build Tool: Vite
Styling: Custom CSS with responsive design
State Management: React Hooks (useState, useEffect)
Storage: localStorage for search history
API: Open Library Search API
Deployment: StackBlitz
Project Structure:
book-finder/
├── public/
│   ├── logo1.jpg
│   ├── gb1.jpg
│   ├── library.jpg
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── App.jsx
│   │   ├── SearchBar.jsx
│   │   ├── BookCard.jsx
│   │   ├── BookDetails.jsx
│   │   ├── AboutPage.jsx
│   │   └── LoadingSpinner.jsx
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
└── index.html
Installation:
Prerequisites
Node.js (version 14 or higher)
npm 
Setup Instructions:
1.Clone the repository:
git clone https://github.com/your-username/book-finder.git
cd book-finder
2.Install dependencies:npm install
3.Start development server:npm run dev
4.Build for production:npm run build 

API Integration:
The application uses the Open Library Search API:
// Search by title - Your provided endpoint
https://openlibrary.org/search.json?title={bookTitle}
// Search by author  
https://openlibrary.org/search.json?author={authorName}
// Search by genre/subject
https://openlibrary.org/search.json?subject={genre}
// General search
https://openlibrary.org/search.json?q={query}
// Book cover images
https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg
// Book details by work ID
https://openlibrary.org/works/{workId}.json
// Book editions
https://openlibrary.org/works/{workId}/editions.json

Output Screenshots:
1. Home Page
<img width="1889" height="869" alt="Screenshot (44)" src="https://github.com/user-attachments/assets/21352e55-9827-4cf1-aa84-e87e092b43cb" />
Clean landing page with attractive background and "Start Your Search" button
2. Search Page
<img width="1814" height="897" alt="Screenshot (45)" src="https://github.com/user-attachments/assets/98e3d6bb-abd5-4c16-b307-d61f4f7578f4" />
Advanced search interface with search type selection and results grid
3. Book Details Page
<img width="1884" height="820" alt="Screenshot (47)" src="https://github.com/user-attachments/assets/3f18bb2d-1a58-4dfe-b2df-79d84e32779f" />
<img width="1899" height="888" alt="Screenshot (48)" src="https://github.com/user-attachments/assets/231e4f5a-745f-4a70-a300-40e35c5f2788" />
Detailed book information with edition selector and recommendations
4. Search Results
<img width="1901" height="924" alt="Screenshot (46)" src="https://github.com/user-attachments/assets/1427adb8-4d79-472e-b43e-12da29bbf15a" />
Grid layout of book cards with covers and essential information
6. About Page
<img width="1898" height="886" alt="Screenshot (49)" src="https://github.com/user-attachments/assets/9ed9e84f-0d9a-4cef-adb8-44f8062bf541" />
Informative about page explaining application features

License
This project is open source and available under the MIT License.
Developer
Dollypriya
https://github.com/dollypriya2004
⭐ If you find this project helpful, please give it a star on GitHub!
