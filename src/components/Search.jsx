import React, { useState, useEffect } from "react"

export default function Search({ query, setQuery, onSearch, recent, setQueryFromRecent }) {
  const [local, setLocal] = useState(query)

  useEffect(() => setLocal(query), [query])

  // debounce user input
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(local)
    }, 350)
    return () => clearTimeout(id)
  }, [local, setQuery])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search movies by title..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </div>

      {recent && recent.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {recent.map((r, i) => (
            <button
              key={i}
              onClick={() => setQueryFromRecent(r)}
              className="text-sm px-2 py-1 border rounded"
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
