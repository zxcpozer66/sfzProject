import { useState } from 'react'
import { NavLink } from "react-router-dom"
import { AppBar, Toolbar, Box, Button } from "@mui/material"
import { AddVacationModal } from '../modals/AddVacationModal'

const Header = () => {
	const [modalOpen, setModalOpen] = useState(false)

	const handleModal = () => setModalOpen(!modalOpen)
	return (
		<>
			<AppBar
				position="static"
				sx={{
					backgroundColor: "white",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box
					>
						<Button
										variant='outlined'
										onClick={handleModal}
									>
										Подать заявку на отпуск
									</Button>
					</Box>
					<Box
						sx={{
							display: "flex",
							gap: 1,
							alignItems: "center",
						}}
					>
						
						<NavLink to="/" style={{ textDecoration: "none" }}>
							<Button
								color="inherit"
								sx={{
									color: "text.primary",
									textTransform: "none",
								}}
							>
								Главная
							</Button>
						</NavLink>

						<NavLink to="/users" style={{ textDecoration: "none" }}>
							<Button
								color="inherit"
								sx={{
									color: "text.primary",
									textTransform: "none",
								}}
							>
								Пользователи
							</Button>
						</NavLink>

						<NavLink to="/vacations" style={{ textDecoration: "none" }}>
							<Button
								color="inherit"
								sx={{
									color: "text.primary",
									textTransform: "none",
								}}
							>
								Отпуска
							</Button>
						</NavLink>
					</Box>
				</Toolbar>
			</AppBar>
			<AddVacationModal
				open={modalOpen}
				onClose={handleModal}
			/>
	</>
	)
}

export default Header
