import React from 'react'
import { Row, Col } from 'antd'

import MovieCard from '../MovieCard'

const MoviesList = ({ movies, guestSessionId }) => {
	const getRatingFromLocalStorage = (movieId) => {
		const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {}
		return ratings[movieId] || 0
	}

	const saveRatingToLocalStorage = (movieId, rating) => {
		const ratings = JSON.parse(localStorage.getItem('movieRatings')) || {}
		ratings[movieId] = rating
		localStorage.setItem('movieRatings', JSON.stringify(ratings))
	}

	return (
		<Row gutter={[24, 24]}>
			{movies.map((movie) => (
				<Col key={movie.id} xs={24} sm={24} md={12} lg={12} xl={12}>
					<MovieCard
						movie={movie}
						guestSessionId={guestSessionId}
						initialRating={getRatingFromLocalStorage(movie.id)}
						onRatingChange={(newRating) => saveRatingToLocalStorage(movie.id, newRating)}
					/>
				</Col>
			))}
		</Row>
	)
}

export default MoviesList
