import axios from 'axios'
import type { User } from '../../interfaces/modelsTypes/user'

const API_BASE_URL = 'http://127.0.0.1:8000/api/users'

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

export const getUsers = () => {
	return apiClient.get('/')
}



export const addUser = async (userData: {
	surname: string
	name: string
	patronymic: string
}): Promise<User> => {
	const res = await apiClient.post('/', userData)
	return res.data
}

export const deleteUser = async (id: number) => {
	const res = await apiClient.delete(`/${id}`)
	return res.data
}

export const editUser = async (id: number, value: {}) => {
	const res = await apiClient.put(`/${id}`, value)
	return res.data
}

const apiClient2 = axios.create({
	baseURL: 'http://127.0.0.1:8000/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

export const getUsersData2 = () => {
	return apiClient2.get('/vacations/get-users-and-available-vacation-minutes')
}
