import AddIcon from '@mui/icons-material/Add'
import {
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'
import { useEffect, useState, type FC } from 'react'
import { AddRequestModal } from '../../modals/AddRequestModal'
import { RequestFormProvider } from '../../RequestFormContext'
import { Row } from './insideTable/Row'

import { getApplications } from '../../../api/modelApi/application'

import {
	getDepartments,
	getNotation,
	getReactions,
	getUsers,
} from '../../../api'
import type { RequestData } from '../../../interfaces/api/response/request/requestData'
import type { User } from '../../../interfaces/modelsTypes/user'
import type { Department } from '../../../interfaces/types'

export const CollapsibleTable: FC = () => {
	const [reactionOptions, setReactionOptions] = useState<any>([])
	const [notationOptions, setNotationOptions] = useState<any>([])
	const [departments, setDepartments] = useState<Department[]>([])
	const [applications, setApplications] = useState<RequestData[]>()
	const [userList, setUserList] = useState<User[]>([])
	const [modalOpen, setModalOpen] = useState(false)

	const handleModal = () => setModalOpen(!modalOpen)

	useEffect(() => {
		const loadOptions = async () => {
			const resNotation = await getNotation()
			setNotationOptions(resNotation.data)
			const resReaction = await getReactions()
			setReactionOptions(resReaction.data)
		}

		const fetchDepartments = async () => {
			const res = await getDepartments()
			setDepartments(res.data)
		}

		fetchDepartments()
		loadOptions()
	}, [])

	const titleCell = [
		'Дата',
		'Отдел',
		'Пользователь',
		'Мастер',
		'Обращение',
		'Время',
	]

	const fetchData = async () => {
		try {
			const response = await getApplications()
			setApplications(response.data)
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		fetchData()
		getUsers()
			.then(res => setUserList(res.data))
			.catch(err => console.error(err))
	}, [])


	return (
		<>
			<TableContainer component={Paper}>
				<Table aria-label='collapsible table'>
					<TableHead>
						<TableRow>
							{titleCell.map((title, index) => (
								<TableCell
									key={index}
									align={title == 'Обращение' ? 'left' : 'center'}
									sx={{ fontSize: 16 }}
								>
									{title}
								</TableCell>
							))}
							<TableCell align='center'>
								<Button
									variant='contained'
									endIcon={<AddIcon />}
									onClick={handleModal}
								>
									Добавить
								</Button>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{applications &&
							applications.map(row => (
								<RequestFormProvider key={row.id} initialData={row}>
									<Row
										refetchApplications={fetchData}
										reactionOptions={reactionOptions}
										notationOptions={notationOptions}
										userList={userList}
									/>
								</RequestFormProvider>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<AddRequestModal
				open={modalOpen}
				onClose={handleModal}
				onSubmit={fetchData}
				refetchApplications={fetchData}
				departments={departments}
			/>
		</>
	)
}
