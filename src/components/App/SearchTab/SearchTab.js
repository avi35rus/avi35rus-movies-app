import React, { useState, useCallback, useEffect } from 'react'
import { Spin, Alert, Empty, Pagination } from 'antd'
import { debounce } from 'lodash'

import MovieService from '../../../API/MovieService'
import { useFetching } from '../../../hooks/useFetching'
import SearchBar from '../../SearchBar'
import MoviesList from '../../MoviesList'

const SearchTab = ({ guestSessionId }) => {
	const [movies, setMovies] = useState([])
	const [searchQuery, setSearchQuery] = useState('')
	const [noResults, setNoResults] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(0)

	const [fetchMovies, isMoviesLoading, moviesError] = useFetching(async (query, page) => {
		const moviesData = !query ? await MovieService.getPopular(page) : await MovieService.searchMovies(query, page)

		const { results, total_pages } = moviesData
		setNoResults(results.length === 0)
		setMovies(results)
		setTotalPages(total_pages)
	})

	const debouncedFetchMovies = useCallback(
		debounce((value, page) => fetchMovies(value, page), 1000),
		[]
	)

	const handleInputChange = (value) => {
		setCurrentPage(1)
		setSearchQuery(value)
		debouncedFetchMovies(value, 1)
	}

	const handlePageChange = (page) => {
		setCurrentPage(page)
		fetchMovies(searchQuery, page)
	}

	useEffect(() => {
		fetchMovies()
	}, [])

	return (
		<>
			<SearchBar value={searchQuery} onChange={handleInputChange}></SearchBar>
			{moviesError && <Alert message="Error" description={moviesError} type="error" showIcon />}
			{isMoviesLoading ? (
				<Spin className="app__spinner" size="large" />
			) : noResults ? (
				<Empty description="No results found." />
			) : (
				<>
					<MoviesList movies={movies} guestSessionId={guestSessionId} />
					<Pagination
						className="app__pagination"
						current={currentPage}
						onChange={(e) => handlePageChange(e)}
						total={totalPages <= 5000 ? totalPages * 10 : 5000}
						showSizeChanger={false}
					/>
				</>
			)}
		</>
	)
}

export default SearchTab
