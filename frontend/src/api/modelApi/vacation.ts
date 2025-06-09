import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000/api/vacations"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const addVacation = async (rangeDate: { startDate: Date; endDate: Date }) => {
  const res = await apiClient.post('/', {
    start_date: rangeDate.startDate.toISOString().split('T')[0] ,
    end_date: rangeDate.endDate.toISOString().split('T')[0] 
  });
  return res.data;
};