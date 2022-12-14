// import { toast } from '@atmoutsourcing/siakit';
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // toast.danger({ title: 'Erro', text: error.response?.data?.message || 'Houve um erro ao processar sua solicitação' });
    return Promise.reject(error.response)
  },
)

export default api
