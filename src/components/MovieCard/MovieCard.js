import React, { useRef, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, Tag, Rate } from 'antd'

import { useGenreContext } from '../GenreContext/GenreContext'
import MovieService from '../../API/MovieService'
import { useFetching } from '../../hooks/useFetching'

import './MovieCard.css'

const { Meta } = Card

const MovieCard = ({ movie, guestSessionId, initialRating, onRatingChange }) => {
	const [movieRating, setMovieRating] = useState(initialRating)
	const genres = useGenreContext()

	const imageUrl = movie.poster_path
		? `https://image.tmdb.org/t/p/original${movie.poster_path}`
		: 'https://via.placeholder.com/240x360'

	const formattedReleaseDate = movie.release_date ? format(new Date(movie.release_date), 'MMMM dd, yyyy') : null
	const defaultRating = Math.round(movie.vote_average * 10) / 10 || 0

	const [handleRatingChange, isLoading] = useFetching(async (newRating) => {
		await MovieService.addRating(movie.id, newRating, guestSessionId)
		onRatingChange(newRating)
		setMovieRating(newRating)
	})

	const containerRef = useRef(null)
	const textRef = useRef(null)

	const truncateText = () => {
		if (containerRef.current && textRef.current) {
			const containerHeight = containerRef.current.clientHeight
			const originalText = textRef.current.textContent

			if (textRef.current.scrollHeight > containerHeight) {
				let newText = originalText
				while (textRef.current.scrollHeight > containerHeight) {
					newText = newText.slice(0, newText.lastIndexOf(' ')) + '\u00a0...'
					textRef.current.textContent = newText
				}
			}
		}
	}

	useEffect(() => {
		window.addEventListener('resize', truncateText)
		return () => {
			window.removeEventListener('resize', truncateText)
		}
	}, [])

	useEffect(() => {
		setTimeout(() => truncateText(), 1000)
	}, [isLoading])

	const getGenreNames = () => {
		if (movie.genre_ids) {
			return movie.genre_ids.map((genreId) => {
				const genre = genres.find((genre) => genre.id === genreId)
				return genre ? genre.name : ''
			})
		} else {
			return []
		}
	}

	const getRatingColor = () => {
		if (defaultRating > 7) {
			return '#66E900'
		} else if (defaultRating > 4) {
			return '#E9D100'
		} else if (defaultRating > 2) {
			return '#E97E00'
		} else {
			return '#E90000'
		}
	}

	return (
		<Card
			className="movie-card"
			hoverable
			cover={<img className="movie-card__banner" alt={movie.title} src={imageUrl} />}
		>
			<Meta
				title={
					<div className="movie-card__title">
						{movie.title}
						<div className="movie-card__rating-circle" style={{ borderColor: getRatingColor() }}>
							{defaultRating}
						</div>
					</div>
				}
				description={<div className="movie-card__release-date">{formattedReleaseDate}</div>}
			/>
			<div className="movie-card__tags">
				{getGenreNames().map((genreName, index) => (
					<Tag key={index}>{genreName}</Tag>
				))}
			</div>
			<div className="movie-card__truncate-description" ref={containerRef}>
				<p ref={textRef}>{movie.overview}</p>
			</div>
			<Rate
				className="movie-card__rating-star"
				allowHalf
				value={movieRating}
				onChange={(newRating) => {
					handleRatingChange(newRating)
					onRatingChange(newRating)
				}}
				count={10}
			/>
		</Card>
	)
}

export default MovieCard
