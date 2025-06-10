import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
	Autocomplete,
	Box,
	Button,
	Collapse,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from '@mui/material'
import { useState, type FC } from 'react'
import { deleteApplication } from '../../../../api'
import type { User } from '../../../../interfaces/modelsTypes/user'
import {
	calculateTimeDifference,
	formatTimeDifference,
} from '../../../../utils/utils'
import AlertDialog from '../../../modals/AlertDialog'
import { useRequestForm } from '../../../RequestFormContext'
import { DetailTable } from './Details'

interface IProps {
	refetchApplications: () => void
	reactionOptions: any
	notationOptions: any
	userList: User[]
	masterList: User[]
}

export const Row: FC<IProps> = ({
	refetchApplications,
	reactionOptions,
	notationOptions,
	userList,
	masterList,
}) => {
	const { formData, setFormData, editMode, setEditMode, handleSave } =
		useRequestForm()
	const [open, setOpen] = useState(false)

	const { id, data, department, user, master, appeal_title } = formData

	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [deletingId, setDeletingId] = useState<number | null>(null)

	const handleInputChange = (field: keyof typeof formData, value: any) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}))
	}
	const formatFullName = (userData: any): string => {
		if (!userData) return 'Не указан'

		if (typeof userData === 'object') {
			return `${userData.surname} ${userData.name[0]}.${userData.patronymic[0]}.`
		}
		return userData
	}

	const timeDiff = calculateTimeDifference(
		formData.start_time,
		formData.end_time
	)

	const handleDeleteClick = (e: React.MouseEvent, id: number) => {
		e.stopPropagation()
		setDeletingId(id)
		setIsDialogOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (deletingId === null) return
		try {
			await deleteApplication(deletingId)
			refetchApplications()
		} catch (error) {
			console.error('Ошибка при удалении заявки:', error)
		} finally {
			setIsDialogOpen(false)
			setDeletingId(null)
		}
	}

	const handleCancelDelete = () => {
		setIsDialogOpen(false)
		setDeletingId(null)
	}

	return (
		<>
			<TableRow
				sx={{ cursor: 'pointer' }}
				onClick={() => setOpen(!open)}
				onDoubleClick={e => {
					e.stopPropagation()
					setEditMode(!editMode)
					setOpen(true)
				}}
			>
				<TableCell component='th' scope='row' align='center'>
					{data ? new Date(data).toLocaleDateString() : 'Нет даты'}
				</TableCell>

				<TableCell align='center'>
					{typeof department === 'string'
						? department
						: department?.title || ''}
				</TableCell>

				<TableCell align='center'>
					{editMode ? (
						<Autocomplete
							options={userList}
							getOptionLabel={(option: User) =>
								`${option.surname} ${option.name} ${option.patronymic}`
							}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							value={userList.find(u => u.id === user?.id) || null}
							onChange={(event, newValue) => {
								handleInputChange('user', newValue || '')
							}}
							renderInput={params => (
								<TextField
									{...params}
									variant='outlined'
									size='small'
									label='Пользователь'
									onClick={e => e.stopPropagation()}
									onDoubleClick={e => e.stopPropagation()}
									onFocus={e => e.stopPropagation()}
									onMouseDown={e => e.stopPropagation()}
								/>
							)}
							sx={{ width: 250 }}
							onClick={e => e.stopPropagation()}
							onFocus={e => e.stopPropagation()}
							onMouseDown={e => e.stopPropagation()}
						/>
					) : (
						formatFullName(user)
					)}
				</TableCell>

				<TableCell align='center'>
					{editMode ? (
						<Autocomplete
							options={masterList}
							getOptionLabel={(option: User) =>
								`${option.surname} ${option.name} ${option.patronymic}`
							}
							isOptionEqualToValue={(option, value) => option.id === value.id}
							value={masterList.find(u => u.id === master?.id) || null}
							onChange={(event, newValue) => {
								handleInputChange('master', newValue || '')
							}}
							renderInput={params => (
								<TextField
									{...params}
									variant='outlined'
									size='small'
									label='Мастер'
									onClick={e => e.stopPropagation()}
									onDoubleClick={e => e.stopPropagation()}
									onFocus={e => e.stopPropagation()}
									onMouseDown={e => e.stopPropagation()}
								/>
							)}
							sx={{ width: 250 }}
							onClick={e => e.stopPropagation()}
							onFocus={e => e.stopPropagation()}
							onMouseDown={e => e.stopPropagation()}
						/>
					) : (
						formatFullName(master)
					)}
				</TableCell>

				<TableCell align='left'>
					{editMode ? (
						<TextField
							value={appeal_title || ''}
							onChange={e => handleInputChange('appeal_title', e.target.value)}
							onClick={e => e.stopPropagation()}
							onDoubleClick={e => e.stopPropagation()}
							fullWidth
							variant='outlined'
							size='small'
							label='Заголовок обращения'
						/>
					) : (
						appeal_title || 'Нет заголовка'
					)}
				</TableCell>

				<TableCell align='center'>{formatTimeDifference(timeDiff)}</TableCell>

				<TableCell
					align='center'
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						padding: '8px',
						height: 56,
					}}
				>
					{editMode ? (
						<Button
							color='primary'
							variant='outlined'
							size='small'
							onClick={e => {
								e.stopPropagation()
								handleSave()
								setOpen(false)
							}}
						>
							Сохранить
						</Button>
					) : (
						<DeleteForeverIcon
							color='error'
							titleAccess='Удалить'
							onClick={e => handleDeleteClick(e, id)}
							style={{ cursor: 'pointer' }}
						/>
					)}
				</TableCell>
			</TableRow>

			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
					<Collapse in={open} timeout='auto' unmountOnExit>
						<Box sx={{ margin: 1 }}>
							<Typography variant='h6' gutterBottom component='div'>
								Детали заявки
							</Typography>
							<DetailTable
								reactionOptions={reactionOptions}
								notationOptions={notationOptions}
							/>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>

			<AlertDialog
				open={isDialogOpen}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				textMessage={
					'Удаление уже выполненной заявки приведет к потере учета времени, потраченного на нее. Это время не войдет в расчет отпускных.'
				}
			/>
		</>
	)
}
