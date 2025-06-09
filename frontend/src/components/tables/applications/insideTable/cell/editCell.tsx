import { FormControl, Input, MenuItem, Select } from '@mui/material'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { EditableCellProps } from '../../../../../interfaces/otherTypes/editableCellProps'

export const EditableCell: FC<EditableCellProps> = ({
	keyName,
	value,
	editMode,
	onChange,
	reactionOptions,
	notationOptions,
}) => {
	const [selectedTypeReactionId, setSelectedTypeReactionId] = useState<
		number | null
	>(null)

	const [selectedNotationId, setSelectedNotationId] = useState<number | null>(
		null
	)

	useEffect(() => {
		if (!editMode || !['notation', 'typeReaction'].includes(keyName)) return
		const currentOptions =
			keyName === 'notation' ? notationOptions : reactionOptions

		if (currentOptions.length === 0) return

		const matchedOption =
			currentOptions.find(opt => opt.id === Number(value)) ||
			currentOptions.find(
				opt => opt.title.toLowerCase() === String(value).toLowerCase()
			)

		const id = matchedOption?.id ?? currentOptions[0]?.id ?? null

		if (keyName === 'notation') {
			setSelectedNotationId(id)
		} else {
			setSelectedTypeReactionId(id)
		}
	}, [notationOptions, reactionOptions, value, keyName, editMode])

	if (!editMode) {
		const options = keyName === 'notation' ? notationOptions : reactionOptions
		const displayedValue =
			options.find(opt => opt.title === value)?.title || value

		return <>{displayedValue || '—'}</>
	}

	if (keyName === 'notation' || keyName === 'typeReaction') {
		const handleChange = (e: React.ChangeEvent<{ value: any }>) => {
			const selectedId = e.target.value as number

			if (keyName === 'notation') {
				setSelectedNotationId(selectedId)
			} else {
				setSelectedTypeReactionId(selectedId)
			}

			const currentOptions =
				keyName === 'notation' ? notationOptions : reactionOptions

			const selectedOption = currentOptions.find(opt => opt.id === selectedId)
			onChange(selectedOption?.id)
		}

		const selectedId =
			keyName === 'notation' ? selectedNotationId : selectedTypeReactionId

		const currentOptions =
			keyName === 'notation' ? notationOptions : reactionOptions

		return (
			<FormControl fullWidth size='small'>
				<Select
					value={selectedId ?? ''}
					onChange={handleChange}
					displayEmpty
					sx={{ width: keyName !== 'notation' ? 400 : 200 }}
				>
					{currentOptions.map(option => (
						<MenuItem key={option.id} value={option.id}>
							{option.title}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		)
	}

	return (
		<Input
			value={value?.toString() || ''}
			onChange={e => onChange(e.target.value)}
			fullWidth
			multiline
			size='small'
		/>
	)
}
