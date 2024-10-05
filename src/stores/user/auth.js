import { ref } from 'vue'
import { defineStore } from 'pinia'
import cookies from 'vue-cookies'
import api from '@/helpers/api'

import router from '../../router'

import { useNotification } from '../usefull/notification'

export const authStore = defineStore('authStore', () => {
  const user = ref('')
  const notification = useNotification()

  const login = async (user) => {
    try {
      const { data } = await api.post('/auth/login', user)
      console.log(data)
      if (data?.token) {
        cookies.set('dashboard-token', data?.token)
        user = { ...data.user }
        notification.setNotif(true, 'Добро пожаловать', 'success')
        router.push({ name: 'dashboard' })
      }
    } catch (error) {
      console.log(error)
      notification.setNotif(true, error?.response?.data?.message, 'danger')
    }
  }

  const checkUser = async () => {
    try {
      const { data } = await api.get('auth/checkuser')
      user.value = { ...data }
    } catch (error) {
      if (error.response?.status == 401) {
        router.push({ name: 'signIn' })
      }
      console.log(error)
    }
  }

  const logout = () => {
    cookies.remove('dashboard-token')
    router.push({ name: 'signIn' })
  }

  return {
    user,
    logout,
    checkUser,
    login
  }
})
