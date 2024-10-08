import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/helpers/api'

import { useNotification } from '../usefull/notification'

const base_url = '/api/language'

export const languageStore = defineStore('languageStore', () => {
  const languages = ref([])
  const languageCount = ref(0)
  const notification = useNotification()

  const getlanguages = async (params) => {
    const { data } = await api.get(base_url, { params })
    languages.value = [...data.data]
    languageCount.value = data.count
  }

  const addlanguage = async (language) => {
    const { data } = await api.post(base_url, language)
    languages.value = [...languages.value, data]
    languageCount.value += 1
    notification.setNotif(true, 'Yangi ma`lumot qo`shildi', 'success')
  }

  const removelanguage = async (id) => {
    await api.delete(`${base_url}/${id}`)
    languages.value = languages.value.filter((item) => item._id !== id)
    languageCount.value > 0 ? (languageCount.value -= 1) : 0
    notification.setNotif(true, 'O`chirildi', 'info')
  }

  const savelanguage = async (language) => {
    const { data } = await api.put(`${base_url}`, language)
    languages.value = languages.value.map((item) => {
      if (item._id == data._id) return data
      return item
    })
    notification.setNotif(true, 'Yangilandi', 'info')
  }

  const getlanguage = async (id) => {
    return await api.get(`${base_url}/getone/${id}`)
  }

  return {
    languages,
    languageCount,
    addlanguage,
    savelanguage,
    removelanguage,
    getlanguages,
    getlanguage
  }
})
