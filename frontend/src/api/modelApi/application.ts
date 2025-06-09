import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8000/api/applications"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

export const getApplications = () => {
  return apiClient.get("/")
}


export const deleteApplication = async (id: number) => {
  const res = await apiClient.delete(`/${id}`);
  return res.data;
};

export const editApplication = async (id:number, value: {}) => {
  const res = await apiClient.put(`/${id}`, value);
  return res.data;
}

export const addApplication = async (formData: {user_id: number, description_problem: string, appeal_title: string}) => {
  console.log(formData)
  const res = await apiClient.post('/', formData);
  return res.data; 
  }