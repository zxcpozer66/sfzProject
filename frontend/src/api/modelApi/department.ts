import axios from "axios";
import { config } from "../../config";

const API_BASE_URL = `${config.apiUrl}api/departments`;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const getDepartments = () => {
	return apiClient.get("/");
};
