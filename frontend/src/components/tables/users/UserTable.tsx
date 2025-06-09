import React, { useState, useMemo } from "react"
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Paper,
	IconButton,
	Select,
	MenuItem,
	Button,
	Input,
} from "@mui/material"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import AlertDialog from "../../modals/AlertDialog"
import type { Department, HeadCell, UserData } from "../../../interfaces/types"
import { getComparator } from "../../../utils/utils"

interface UserTableProps {
	users: UserData[]
	departments: Department[]
	onEdit: (id: number, data: Partial<UserData>) => Promise<void>
	onDelete: (id: number) => Promise<void>
	loading: boolean
}

const headCells: readonly HeadCell[] = [
	{ id: "username", align: "left", label: "Username" },
	{ id: "name", align: "left", label: "Имя" },
	{ id: "surname", align: "left", label: "Фамилия" },
	{ id: "patronymic", align: "left", label: "Отчество" },
	{ id: "department", align: "left", label: "Департамент" },
	{ id: "total_work_minutes", align: "center", label: "Минут отработано" },
	{ id: "available_minutes", align: "center", label: "Осталось минут" },
]

export function UserTable({
	users,
	departments,
	onEdit,
	onDelete,
	loading,
}: UserTableProps) {
	const [order, setOrder] = useState<"asc" | "desc">("asc")
	const [orderBy, setOrderBy] = useState<keyof UserData>("surname")
	const [page, setPage] = useState(0)
	const [rowsPerPage, setRowsPerPage] = useState(5)
	const [editingId, setEditingId] = useState<number | null>(null)
	const [editData, setEditData] = useState<Partial<UserData> | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [deletingId, setDeletingId] = useState<number | null>(null)

	const handleRowDoubleClick = (row: UserData) => {
		if (editingId === row.id) {
			cancelEditing()
			return
		}
		if (editingId !== null) {
			cancelEditing()
		}
		setEditingId(row.id)
		setEditData({
			name: row.name,
			surname: row.surname,
			patronymic: row.patronymic,
			department_id: row.department_id,
		})
	}

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: keyof UserData
	) => {
		if (!editData) return
		setEditData({ ...editData, [field]: e.target.value })
	}

	const handleDepartmentChange = (e: any) => {
		if (!editData) return
		setEditData({ ...editData, department_id: Number(e.target.value) })
	}

	const handleSave = async () => {
		if (editingId === null || !editData) return
		await onEdit(editingId, editData)
		cancelEditing()
	}

	const cancelEditing = () => {
		setEditingId(null)
		setEditData(null)
	}

	const handleDeleteClick = (e: React.MouseEvent, id: number) => {
		e.stopPropagation()
		setDeletingId(id)
		setIsDialogOpen(true)
	}

	const handleConfirmDelete = async () => {
		if (deletingId === null) return
		await onDelete(deletingId)
		setIsDialogOpen(false)
		setDeletingId(null)
		if (editingId === deletingId) cancelEditing()
	}

	const handleCancelDelete = () => {
		setIsDialogOpen(false)
		setDeletingId(null)
	}

	const handleRequestSort = (
		_: React.MouseEvent<unknown>,
		property: keyof UserData
	) => {
		const isAsc = orderBy === property && order === "asc"
		setOrder(isAsc ? "desc" : "asc")
		setOrderBy(property)
	}

	const handleChangePage = (_: unknown, newPage: number) => setPage(newPage)

	const handleChangeRowsPerPage = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(e.target.value, 10))
		setPage(0)
	}

	const visibleRows = useMemo(
		() =>
			[...users]
				.sort(getComparator(order, orderBy))
				.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
		[order, orderBy, page, rowsPerPage, users]
	)

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<TableContainer>
					<Table size="medium">
						<TableHead>
							<TableRow>
								{headCells.map((headCell) => (
									<TableCell
										key={headCell.id}
										align={headCell.align}
										sortDirection={
											orderBy === headCell.id
												? order
												: false
										}
									>
										<TableSortLabel
											active={orderBy === headCell.id}
											direction={
												orderBy === headCell.id
													? order
													: "asc"
											}
											onClick={(e) =>
												handleRequestSort(
													e,
													headCell.id
												)
											}
										>
											{headCell.label}
										</TableSortLabel>
									</TableCell>
								))}
								<TableCell align="center">Действия</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{visibleRows.map((row) => {
								const isEditing = editingId === row.id
								return (
									<TableRow
										hover
										tabIndex={-1}
										key={row.id}
										onDoubleClick={() =>
											handleRowDoubleClick(row)
										}
										sx={{
											backgroundColor: isEditing
												? "#f0f7ff"
												: "inherit",
											"&:hover": {
												backgroundColor: isEditing
													? "#e3f2fd"
													: "#f5f5f5",
											},
										}}
									>
										<TableCell component="th" scope="row">
											{row.username}
										</TableCell>
										<TableCell align="left">
											{isEditing ? (
												<Input
													value={editData?.name || ""}
													onChange={(e) =>
														handleInputChange(
															e,
															"name"
														)
													}
													fullWidth
													autoFocus
												/>
											) : (
												row.name
											)}
										</TableCell>
										<TableCell align="left">
											{isEditing ? (
												<Input
													value={
														editData?.surname || ""
													}
													onChange={(e) =>
														handleInputChange(
															e,
															"surname"
														)
													}
													fullWidth
												/>
											) : (
												row.surname
											)}
										</TableCell>
										<TableCell align="left">
											{isEditing ? (
												<Input
													value={
														editData?.patronymic ||
														""
													}
													onChange={(e) =>
														handleInputChange(
															e,
															"patronymic"
														)
													}
													fullWidth
												/>
											) : (
												row.patronymic || "н/д"
											)}
										</TableCell>
										<TableCell align="left">
											{isEditing ? (
												<Select
													value={
														editData?.department_id ||
														0
													}
													onChange={
														handleDepartmentChange
													}
													fullWidth
													variant="outlined"
												>
													{departments.map((dept) => (
														<MenuItem
															key={dept.id}
															value={dept.id}
														>
															{dept.title}
														</MenuItem>
													))}
												</Select>
											) : (
												row.department
											)}
										</TableCell>
										<TableCell align="center">
											{row.total_work_minutes}
										</TableCell>
										<TableCell align="center">
											{row.available_minutes}
										</TableCell>
										<TableCell align="center">
											{isEditing ? (
												<Button
													color="primary"
													variant="outlined"
													onClick={handleSave}
													size="small"
												>
													Сохранить
												</Button>
											) : (
												<IconButton
													color="error"
													onClick={(e) =>
														handleDeleteClick(
															e,
															row.id
														)
													}
													disabled={loading}
												>
													<DeleteForeverIcon />
												</IconButton>
											)}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					labelRowsPerPage="Количество записей:"
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={users.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					labelDisplayedRows={({ from, to, count }) =>
						`${from}-${to} из ${count}`
					}
				/>
			</Paper>
			<AlertDialog
				open={isDialogOpen}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				textMessage="Вы уверены, что хотите удалить пользователя?"
			/>
		</Box>
	)
}
