import { useEffect, useState } from 'react'
import { getTrending, type Movie } from './api/tmdb'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTrending()
      .then(setMovies)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-8">Cargando películas...</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Cineteca</h1>
      <ul className="space-y-2">
        {movies.map(m => (
          <li key={m.id} className="border-b pb-2">
            {m.title} <span className="text-gray-500">({m.release_date})</span>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
