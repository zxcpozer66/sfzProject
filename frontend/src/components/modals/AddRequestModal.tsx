import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	TextField,
	Typography,
} from '@mui/material'
import React, { useState } from 'react'
import type { Department } from '../../interfaces/types'
import { addApplication, addUser } from './../../api'
import SearchSelect from './../SearchSelect'

interface User {
	surname: string
	name: string
	patronymic: string
	department_id: number
	user_id?: number
}

const modalStyle = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	boxShadow: 24,
	p: 4,
}

interface AddRequestModalProps {
	open: boolean
	onClose: () => void
	onSubmit: (data: any) => void
	refetchApplications: () => void
	departments: Department[]
}

export const AddRequestModal: React.FC<AddRequestModalProps> = ({
	open,
	onClose,
	onSubmit,
	refetchApplications,
	departments,
}) => {
	const [formData, setFormData] = useState({
		appeal_title: '',
		description_problem: '',
		department_id: '',
		user_id: '',
	})

	const [showDepartmentSelect, setShowDepartmentSelect] = useState(false)
	const [newUser, setNewUser] = useState(false)
	const [newUserData, setNewUserData] = useState<User | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
	) => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name as string]: value }))
	}

	const handleClose = () => {
		onClose()
		setShowDepartmentSelect(false)
		setNewUser(false)
		setNewUserData(null)
		setFormData({
			appeal_title: '',
			description_problem: '',
			department_id: '',
			user_id: '',
		})
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		try {
			let userId = formData.user_id

			if (newUser && newUserData && formData.department_id) {
				const userResponse = await addUser({
					surname: newUserData.surname,
					name: newUserData.name,
					patronymic: newUserData.patronymic,
					department_id: Number(formData.department_id),
				})
				userId =
					userResponse.data?.id?.toString() ||
					userResponse.id?.toString() ||
					userResponse.user?.id?.toString()

				if (!userId) {
					throw new Error('Failed to get user ID from response')
				}
				console.log('Пользователь успешно добавлен:', userResponse)
			}

			if (!userId) {
				throw new Error('User ID is required')
			}

			const applicationData = {
				appeal_title: formData.appeal_title,
				description_problem: formData.description_problem,
				department_id: Number(formData.department_id),
				user_id: Number(userId),
			}

			const applicationResponse = await addApplication(applicationData)
			console.log('Заявка успешно создана:', applicationResponse)

			onSubmit(applicationResponse.data || applicationResponse)
			refetchApplications()
			handleClose()
		} catch (error) {
			console.error('Ошибка:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Modal open={open} onClose={handleClose}>
			<Box sx={modalStyle}>
				<Typography variant='h6' component='h2' gutterBottom>
					Добавить новое обращение
				</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						fullWidth
						margin='normal'
						label='Обращение'
						name='appeal_title'
						value={formData.appeal_title}
						onChange={handleChange}
						required
						multiline
						rows={1}
					/>
					<TextField
						fullWidth
						margin='normal'
						label='Описание проблемы'
						name='description_problem'
						value={formData.description_problem}
						onChange={handleChange}
						required
						multiline
						rows={4}
					/>

					<SearchSelect
						setShowDepartmentSelect={setShowDepartmentSelect}
						setNewUser={setNewUser}
						setNewUserData={setNewUserData}
						formData={formData}
						setFormData={setFormData}
					/>

					{showDepartmentSelect && (
						<FormControl fullWidth margin='normal'>
							<InputLabel id='department-select-label'>Отдел</InputLabel>
							<Select
								labelId='department-select-label'
								name='department_id'
								value={formData.department_id}
								onChange={handleChange}
								label='Отдел'
								required
							>
								{departments.map(department => (
									<MenuItem key={department.id} value={department.id}>
										{department.title}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
						<Button onClick={handleClose} sx={{ mr: 1 }}>
							Отмена
						</Button>
						<Button type='submit' variant='contained' disabled={isSubmitting}>
							{isSubmitting ? 'Отправка...' : 'Добавить'}
						</Button>
					</Box>
				</form>
			</Box>
		</Modal>
	)
}
