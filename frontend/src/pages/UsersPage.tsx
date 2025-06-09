import { useState, useEffect } from "react"
import { UserTable } from "./../components/tables/users/UserTable"

import { getUsersData2, editUser, deleteUser, getDepartments } from "./../api/"
import { transformUserData } from "../utils/utils"
import type { Department, UserData } from "../interfaces/types"

export function UsersPage() {
	const [users, setUsers] = useState<UserData[]>([])
	const [departments, setDepartments] = useState<Department[]>([])
	const [loading, setLoading] = useState(true)


	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true)
				const [usersRes, deptsRes] = await Promise.all([
					getUsersData2(),
					getDepartments(),
				])

				const userDataArray = usersRes.data.data || []
				setUsers(transformUserData(userDataArray))
				setDepartments(deptsRes.data || [])
			} catch (error) {
				console.error("Ошибка загрузки данных:", error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	const handleEdit = async (id: number, data: Partial<UserData>) => {
		try {
			setLoading(true)
			await editUser(id, {
				name: data.name,
				surname: data.surname,
				patronymic: data.patronymic,
				department_id: data.department_id,
			})

			setUsers(
				users.map((u) =>
					u.id === id
						? {
								...u,
								...data,
								department:
									departments.find(
										(d) => d.id === data.department_id
									)?.title || u.department,
						  }
						: u
				)
			)
		} catch (error) {
			console.error("Ошибка сохранения:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (id: number) => {
		try {
			setLoading(true)
			await deleteUser(id)
			setUsers(users.filter((u) => u.id !== id))
		} catch (error) {
			console.error("Ошибка удаления:", error)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<UserTable
				users={users}
				departments={departments}
				onEdit={handleEdit}
				onDelete={handleDelete}
				loading={loading}
			/>
		</div>
	)
}
