import React, { useState, useEffect } from 'react'
import { Spin, Pagination } from 'antd'

import MovieService from '../../../API/MovieService'
import { useFetching } from '../../../hooks/useFetching'
import MoviesList from '../../MoviesList'

function RatedTab({ guestSessionId }) {
	const [ratedMovies, setRatedMovies] = useState([])
	const [noResults, setNoResults] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	const [fetchRatedMovies, isMoviesLoading] = useFetching(async (page) => {
		const ratedMoviesData = await MovieService.getRatedMovies(guestSessionId, page)
		setRatedMovies(ratedMoviesData.results)

		const { results, total_pages } = ratedMoviesData
		setNoResults(results.length === 0)
		setRatedMovies(results)
		setTotalPages(total_pages)
	})

	const handlePageChange = (page) => {
		setCurrentPage(page)
		fetchRatedMovies(page)
	}

	useEffect(() => {
		fetchRatedMovies()
	}, [guestSessionId])

	return isMoviesLoading ? (
		<Spin className="app__spinner" size="large" />
	) : !noResults ? (
		<>
			<MoviesList movies={ratedMovies} guestSessionId={guestSessionId} />
			<Pagination
				className="app__pagination"
				current={currentPage}
				onChange={(e) => handlePageChange(e)}
				total={totalPages <= 5000 ? totalPages * 10 : 5000}
				style={{ textAlign: 'center' }}
				showSizeChanger={false}
			/>
		</>
	) : null
}

export default RatedTab
