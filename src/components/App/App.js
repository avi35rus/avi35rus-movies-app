import React, { useState, useEffect } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Alert, Tabs } from 'antd'

import { GenreProvider } from '../GenreContext/GenreContext'
import { useFetching } from '../../hooks/useFetching'
import MovieService from '../../API/MovieService'

import SearchTab from './SearchTab'
import RatedTab from './RatedTab'

import './App.css'
import './media.css'

const App = () => {
	const [guestSessionId, setGuestSessionId] = useState(null)

	const [createGuestSession] = useFetching(async () => {
		const sessionId = await MovieService.createGuestSession()
		const expirationDate = new Date()
		expirationDate.setHours(expirationDate.getHours() + 24)
		const expires = expirationDate.toGMTString()

		document.cookie = `guestSessionId=${sessionId}; expires=${expires}; path=/`
		setGuestSessionId(sessionId)
	})

	useEffect(() => {
		const cookies = document.cookie.split('; ')
		const guestSessionCookie = cookies.find((cookie) => cookie.startsWith('guestSessionId='))

		if (guestSessionCookie) {
			const guestSessionId = guestSessionCookie.split('=')[1]
			setGuestSessionId(guestSessionId)
		} else {
			createGuestSession()
		}
	}, [])

	const tabs = [
		{
			key: 'search',
			label: 'Search',
			children: <SearchTab guestSessionId={guestSessionId} />,
		},
		{
			key: 'rated',
			label: 'Rated',
			children: <RatedTab guestSessionId={guestSessionId} />,
		},
	]

	return (
		<GenreProvider>
			<div className="app">
				<Online>
					<Tabs className="app__tabs" defaultActiveKey="search" items={tabs} destroyInactiveTabPane={true} />
				</Online>
				<Offline>
					<Alert message="Error Network" description="Check your internet connection." type="warning" showIcon />
				</Offline>
			</div>
		</GenreProvider>
	)
}

export default App
