import React, { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://www.omdbapi.com/"
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || ""

export default function Popup({ imdbID, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function fetchDetails() {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(API_URL, {
          params: { i: imdbID, apikey: API_KEY, plot: "full" },
        })
        if (mounted) setData(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
    return () => (mounted = false)
  }, [imdbID])

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded p-4 max-w-3xl w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded"
        >
          Close
        </button>

        {loading && <div>Loading details...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {data && (
          <div className="flex gap-4">
            <img
              src={data.Poster !== "N/A" ? data.Poster : "/placeholder.png"}
              alt={data.Title}
              className="w-40 h-60 object-cover rounded"
            />
            <div>
              <h2 className="text-xl font-bold">
                {data.Title} <span className="text-sm">({data.Year})</span>
              </h2>
              <div className="text-sm text-slate-500">
                Rated: {data.Rated} • Runtime: {data.Runtime} • Genre:{" "}
                {data.Genre}
              </div>
              <p className="mt-2">{data.Plot}</p>
              <div className="mt-4 text-sm">
                <div>Director: {data.Director}</div>
                <div>Actors: {data.Actors}</div>
                <div>Awards: {data.Awards}</div>
                <div>IMDB Rating: {data.imdbRating}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
