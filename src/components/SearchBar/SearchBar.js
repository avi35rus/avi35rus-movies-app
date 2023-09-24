import React from 'react'
import { Input } from 'antd'

const SearchBar = ({ value, onChange }) => {
	return <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Type to search..." />
}

export default SearchBar
