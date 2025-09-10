import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const apiKey = "9a373d32"; // ✅ your OMDb API key

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavs = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavs);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      setError("");
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}${typeFilter ? `&type=${typeFilter}` : ""}`
      );
      if (response.data.Response === "True") {
        let sorted = response.data.Search.sort((a, b) => {
          if (sortOrder === "newest") return b.Year.localeCompare(a.Year);
          return a.Year.localeCompare(b.Year);
        });
        setResults(sorted);
      } else {
        setResults([]);
        setError(response.data.Error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  const toggleFavorite = (movie) => {
    const exists = favorites.find((fav) => fav.imdbID === movie.imdbID);
    if (exists) {
      setFavorites(favorites.filter((fav) => fav.imdbID !== movie.imdbID));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  // Open movie modal and fetch recommendations by Genre
  const openMovieModal = async (id) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&i=${id}&plot=full`);
      if (response.data.Response === "True") {
        setSelectedMovie(response.data);

        // ✅ Always recommend based on first Genre
        let recGenre = response.data.Genre?.split(",")[0]?.trim();

        if (recGenre) {
          const recRes = await axios.get(`https://www.omdbapi.com/?apikey=${apiKey}&s=${recGenre}`);
          if (recRes.data.Response === "True") {
            setRecommendations(recRes.data.Search.filter(m => m.imdbID !== id));
          } else {
            setRecommendations([]);
          }
        }
        setShowModal(true);
      }
    } catch {
      setError("Failed to load movie details.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
    setRecommendations([]);
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>🎬 CineVault</h1>
        <nav>
          <button onClick={() => setResults(favorites)}>❤️ My Watchlist</button>
        </nav>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Year: Newest</option>
          <option value="oldest">Year: Oldest</option>
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="movie">Movies</option>
          <option value="series">Series</option>
          <option value="game">Games</option>
        </select>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="movie-grid">
        {results.map((movie) => (
          <div className="movie-card" key={movie.imdbID} onClick={() => openMovieModal(movie.imdbID)}>
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
              alt={movie.Title}
            />
            <div className="movie-info">
              <h3>{movie.Title}</h3>
              <p>{movie.Year}</p>
              <p className="type">{movie.Type}</p>
              <button
                className={favorites.find((fav) => fav.imdbID === movie.imdbID) ? "fav-btn active" : "fav-btn"}
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent modal opening
                  toggleFavorite(movie);
                }}
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Movie Details */}
      {showModal && selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✖</button>
            <div className="modal-header">
              <img
                src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/300x450?text=No+Image"}
                alt={selectedMovie.Title}
              />
              <div className="modal-details">
                <h2>{selectedMovie.Title}</h2>
                <p><strong>Year:</strong> {selectedMovie.Year}</p>
                <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                <p><strong>Director:</strong> {selectedMovie.Director}</p>
                <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
              </div>
            </div>

            <h3>🎬 More Like This</h3>
            <div className="recommendations">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <div className="rec-card" key={rec.imdbID} onClick={() => openMovieModal(rec.imdbID)}>
                    <img
                      src={rec.Poster !== "N/A" ? rec.Poster : "https://via.placeholder.com/150x200?text=No+Image"}
                      alt={rec.Title}
                    />
                    <p>{rec.Title}</p>
                  </div>
                ))
              ) : (
                <p>No recommendations found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
