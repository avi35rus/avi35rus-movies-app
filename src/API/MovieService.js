import axios from 'axios'

const API_KEY = '0d3d44b1817b86fa8c26ec1b1a88124d'

export default class MovieService {
	static async getPopular(page) {
		const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
			params: {
				api_key: API_KEY,
				page: page,
			},
		})

		return response.data
	}

	static async searchMovies(query, page) {
		const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
			params: {
				api_key: API_KEY,
				query: query,
				page: page,
			},
		})

		return response.data
	}

	static async createGuestSession() {
		const response = await axios.post('https://api.themoviedb.org/3/authentication/guest_session/new', null, {
			params: {
				api_key: API_KEY,
			},
		})

		return response.data.guest_session_id
	}

	static async addRating(movieId, rating, guestSessionId) {
		const response = await axios.post(
			`https://api.themoviedb.org/3/movie/${movieId}/rating`,
			{
				value: rating,
			},
			{
				params: {
					api_key: API_KEY,
					guest_session_id: guestSessionId,
				},
			}
		)

		return response.data
	}

	static async getRatedMovies(guestSessionId, page) {
		const response = await axios.get(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies`, {
			params: {
				api_key: API_KEY,
				page: page,
			},
		})

		return response.data
	}

	static async getMovieGenres() {
		const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
			params: {
				api_key: API_KEY,
			},
		})

		return response.data
	}
}
