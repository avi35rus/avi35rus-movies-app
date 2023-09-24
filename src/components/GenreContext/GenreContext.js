import React, { createContext, useContext, useEffect, useState } from 'react'

import { useFetching } from '../../hooks/useFetching'
import MovieService from '../../API/MovieService'

const GenreContext = createContext()

export const useGenreContext = () => useContext(GenreContext)

export const GenreProvider = ({ children }) => {
	const [genres, setGenres] = useState([])

	const [fetchGenres] = useFetching(async () => {
		const response = await MovieService.getMovieGenres()
		setGenres(response.genres)
	})

	useEffect(() => {
		fetchGenres()
	}, [])

	return <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>
}
