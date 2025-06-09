import { Box, Button, Modal, Typography } from '@mui/material'
import { ru } from 'date-fns/locale/ru'
import React, { useEffect, useState } from 'react'
import { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { addVacation } from '../../api/modelApi/vacation'
import { Calendar } from './Calendar'

registerLocale('ru', ru)

interface AddVacationModal {
	open: boolean
	onClose: () => void
}

export const AddVacationModal: React.FC<AddVacationModal> = ({
	open,
	onClose,
}) => {
	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	useEffect(() => {
		if (open) {
			setStartDate(null)
			setEndDate(null)
		}
	}, [open])

	const handleDateChange = (dates: [Date | null, Date | null]) => {
		const [start, end] = dates
		setStartDate(start)
		setEndDate(end)
	}

	const handleSubmit = async () => {
		if (startDate === null || endDate === null) {
			console.error('Даты не выбраны!')
			return
		}

		const newStartDate = new Date(startDate)
		newStartDate.setDate(newStartDate.getDate() + 1)

		const newEndDate = new Date(endDate)
		newEndDate.setDate(newEndDate.getDate() + 1)

		const rangeDate = {
			startDate: newStartDate,
			endDate: newEndDate,
		}

		try {
			await addVacation(rangeDate)
			onClose()
		} catch (error) {
			console.error('Ошибка при создании отпуска:', error)
		}
	}

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					bgcolor: 'background.paper',
					boxShadow: 24,
					borderRadius: 2,
					outline: 'none',
					maxWidth: '95vw',
					width: 'fit-content',
				}}
			>
				<Typography variant='h6' sx={{ p: 3, pb: 0, textAlign: 'center' }}>
					Создать заявку на отпуск
				</Typography>
				<Calendar
					startDate={startDate}
					endDate={endDate}
					handleDateChange={handleDateChange}
				/>
				<Box
					sx={{
						p: 3,
						pt: 0,
						display: 'flex',
						justifyContent: 'flex-end',
						gap: 2,
					}}
				>
					<Button onClick={onClose} variant='outlined'>
						Отмена
					</Button>
					<Button
						onClick={handleSubmit}
						variant='contained'
						color='primary'
						disabled={startDate === null || endDate === null}
					>
						Создать
					</Button>
				</Box>
			</Box>
		</Modal>
	)
}
