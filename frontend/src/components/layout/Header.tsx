import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../useAuth'
import { AddVacationModal } from '../modals/AddVacationModal'

const Header = () => {
	const { user, loading } = useAuth()
	const roleId = user?.role_id ?? null

	const [modalOpen, setModalOpen] = useState(false)
	const handleModal = () => setModalOpen(prev => !prev)

	const renderNavLinks = () => (
		<Box sx={{ display: 'flex', gap: 2 }}>
			<NavLink to='/' style={{ textDecoration: 'none' }}>
				<Button
					color='inherit'
					sx={{ color: 'text.primary', textTransform: 'none' }}
				>
					Главная
				</Button>
			</NavLink>

			<NavLink to='/users' style={{ textDecoration: 'none' }}>
				<Button
					color='inherit'
					sx={{ color: 'text.primary', textTransform: 'none' }}
				>
					Пользователи
				</Button>
			</NavLink>

			<NavLink to='/vacations' style={{ textDecoration: 'none' }}>
				<Button
					color='inherit'
					sx={{ color: 'text.primary', textTransform: 'none' }}
				>
					Отпуска
				</Button>
			</NavLink>
		</Box>
	)

	if (loading) return null

	if (roleId !== null && ![1, 3].includes(roleId)) {
		return null
	}

	return (
		<>
			<AppBar
				position='static'
				sx={{
					backgroundColor: 'white',
					boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
				}}
			>
				<Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
					{roleId === 3 && (
						<Button variant='outlined' onClick={handleModal}>
							Подать заявку на отпуск
						</Button>
					)}

					{roleId === 1 && <Box sx={{ ml: 'auto' }}>{renderNavLinks()}</Box>}
				</Toolbar>
			</AppBar>

			<AddVacationModal open={modalOpen} onClose={handleModal} />
		</>
	)
}

export default Header
