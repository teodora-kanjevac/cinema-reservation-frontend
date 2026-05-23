import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:3001/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`

  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    const isLoginRequest = originalRequest.url?.includes('/auth/login')

    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true
      try {
        const response = await axios.post('/auth/refresh', {}, { withCredentials: true })
        const newToken = response.data.token

        localStorage.setItem('accessToken', newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return client(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userProfile')
        window.location.href = '/auth/login'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.data?.error) {
      const backendError = error.response.data.error
      error.code = backendError.code
      error.message = backendError.message
    } else {
      error.code = 'UNKNOWN_ERROR'
    }

    return Promise.reject(error)
  },
)

export default client
