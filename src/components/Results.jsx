import React from "react"

export default function Results({ results, onSelect }) {
  if (!results || results.length === 0)
    return <div className="py-8">No results yet. Try searching!</div>

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {results.map((movie) => (
        <div
          key={movie.imdbID}
          className="bg-white dark:bg-slate-800 p-2 rounded shadow cursor-pointer"
          onClick={() => onSelect(movie.imdbID)}
        >
          <img
            src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
            alt={movie.Title}
            className="w-full h-56 object-cover rounded"
          />
          <div className="mt-2 font-medium">{movie.Title}</div>
          <div className="text-sm text-slate-500">{movie.Year}</div>
        </div>
      ))}
    </div>
  )
}
