import React, { useState, useEffect } from "react";
import './BookSearch.css';

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?q=${query}&page=${page}`);
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data.docs);
      setTotalPages(Math.ceil(data.num_found / 100)); 
    } catch (err) {
      setError("Error fetching books. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      fetchBooks();
    }
  }, [query, page]);

  return (
    <div className="book-search-container">
      <h1>Book Search</h1>
      
      <input
        type="text"
        className="search-bar"
        placeholder="Search for books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <div className="loader"></div>}  {}
      {error && <p className="error">{error}</p>}
      
      <div className="book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.key} className="book-card">
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
                className="book-cover"
              />
              <div className="book-info">
                <h3>{book.title}</h3>
                <p>{book.author_name?.join(", ")}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No books found</p>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="pagination-btn">
          Previous
        </button>
        <span className="page-info">{page} / {totalPages}</span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages} className="pagination-btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default BookSearch;
