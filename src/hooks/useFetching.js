import { useState } from 'react'

export const useFetching = (callback) => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState('')

	const fetching = async (arg1, arg2) => {
		try {
			setIsLoading(true)
			await callback(arg1, arg2)
		} catch (error) {
			setError(error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return [fetching, isLoading, error]
}
