import axios from 'axios'

const API_KEY = '4f6baa3485e32af2c54e8dff814ff2cf'
const BASE_URL = 'https://api.themoviedb.org/3'

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
}

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES',
  },
})

export async function getTrending(): Promise<Movie[]> {
  const response = await api.get('/trending/movie/week')
  return response.data.results
}
