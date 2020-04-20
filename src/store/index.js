import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { AuthError } from '../components/_errors'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    isRegistrationFinished: false,
    isDataLoaded: false,
    filterStatus: 0,
    todoLists: [],
    filtered: [],
    selected: null,
    taskListModalStatus: {
      isInProcess: false,
      method: 'POST',
      listId: null
    },
    taskModalStatus: {
      isInProcess: false,
      method: 'POST',
      taskId: null
    },
    taskListDeletionModalStatus: {
      isInProcess: false,
      listId: null
    },
    taskDeletionModalStatus: {
      isInProcess: false,
      taskId: null
    },
    notificationsBoxStatus: {
      isShown: false,
      message: ''
    },
    isLogoutInProcess: false
  },
  mutations: {
    auth_request (state) {
      state.status = 'authentication:loading'
    },

    auth_success (state, { token, user }) {
      state.status = 'authentication:success'
      state.token = token
      state.user = user
    },

    auth_error (state) {
      state.status = 'authentication:error'
    },

    logout (state) {
      state.status = ''
      state.token = ''
    },

    get_todo_lists_request (state) {
      state.status = 'get_lists:loading'
    },

    get_todo_lists_success (state, todoLists) {
      state.status = 'get_lists:success'

      state.todoLists = todoLists.sort(function (listA, listB) {
        const dateA = new Date(listA.created_at)
        const dateB = new Date(listB.created_at)
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
      })

      state.selected = state.todoLists.length ? state.todoLists[0].id : null
    },

    get_todo_lists_error (state, error) {
      state.status = 'get_lists:error'
      console.log(error)
    },

    add_todo_list_request (state) {
      state.status = 'add_list:loading'
    },

    add_todo_list_success (state, todoList) {
      state.status = 'add_list:success'
      state.todoLists.unshift(todoList)
      if (state.todoLists.length === 1) state.selected = todoList.id
    },

    add_todo_list_error (state, error) {
      state.status = 'add_list:error'
      console.log(error)
    },

    update_todo_list_request (state) {
      state.status = 'update_list:loading'
    },

    update_todo_list_success (state, todoList) {
      state.status = 'update_list:success'
      const updatedList = state.todoLists.find(list => list.id === todoList.id)
      const indexOfUpdatedList = this.state.todoLists.indexOf(updatedList)
      todoList.tasks = updatedList.tasks
      Vue.set(this.state.todoLists, indexOfUpdatedList, todoList)
    },

    update_todo_list_error (state, error) {
      state.status = 'update_list:error'
      console.log(error)
    },

    delete_todo_list_request (state) {
      state.status = 'delete_list:loading'
    },

    delete_todo_list_success (state, listId) {
      state.status = 'delete_list:success'
      state.filtered.splice(state.filtered.indexOf(listId), 1)

      if (listId === state.selected) {
        state.selected = state.filtered.length ? state.filtered[0] : null
      }
      const indexOfDeletedList = state.todoLists.findIndex(list => list.id === listId)
      state.todoLists.splice(indexOfDeletedList, 1)
    },

    delete_todo_list_error (state, error) {
      state.status = 'delete_list:error'
      console.log(error)
    },

    add_task_request (state) {
      state.status = 'add_task:loading'
    },

    add_task_success (state, task) {
      state.status = 'add_task:success'
      this.getters.selectedTaskList.tasks.unshift(task)
    },

    add_task_error (state, error) {
      state.status = 'add_task:error'
      console.log(error)
    },

    update_task_request (state) {
      state.status = 'update_task:loading'
    },

    update_task_success (state, task) {
      state.status = 'update_task:success'
      const tasksOfSelectedTaskList = this.getters.selectedTaskList.tasks
      const indexOfUpdatedTask = tasksOfSelectedTaskList.findIndex(_task => _task.id === task.id)
      Vue.set(tasksOfSelectedTaskList, indexOfUpdatedTask, task)
    },

    update_task_error (state, error) {
      state.status = 'update_task:error'
      console.log(error)
    },

    delete_task_request (state) {
      state.status = 'delete_task:loading'
    },

    delete_task_success (state, taskId) {
      state.status = 'delete_task:success'
      const tasksOfSelectedTaskList = this.getters.selectedTaskList.tasks
      const deletedTaskIndex = tasksOfSelectedTaskList.findIndex(task => task.id === taskId)
      tasksOfSelectedTaskList.splice(deletedTaskIndex, 1)
    },

    delete_task_error (state, error) {
      state.status = 'delete_task:error'
      console.log(error)
    },

    change_task_status_request (state) {
      state.status = 'mark_done_task:loading'
    },

    change_task_status_success (state) {
      state.status = 'mark_done_task:success'
    },

    change_task_status_error (state, error) {
      state.status = 'mark_done_task:error'
      console.log(error)
    }
  },

  actions: {
    login ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://host1813162.hostland.pro/api/test/login', data: user, method: 'POST' })
          .then(response => {
            if (!response.data.message) {
              const token = response.data.access_token
              const user = response.data.user
              localStorage.setItem('token', token)
              localStorage.setItem('user', JSON.stringify(user))
              axios.defaults.headers.common.Authorization = token
              commit('auth_success', { token, user })
              resolve(response)
            } else {
              reject(new AuthError(response.data.message))
            }
          })
          .catch(error => {
            commit('auth_error', error)
            localStorage.removeItem('token')
            reject(error)
          })
      })
    },

    register ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios({ url: 'http://host1813162.hostland.pro/api/test/register', data: user, method: 'POST' })
          .then(response => {
            const token = response.data.access_token
            const user = response.data.user
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            axios.defaults.headers.common.Authorization = token
            commit('auth_success', { token, user })
            resolve(response)
          })
          .catch(error => {
            commit('auth_error', error)
            localStorage.removeItem('token')
            reject(error)
          })
      })
    },

    logout ({ commit, state }, user) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        state.todoLists = []
        state.todos = []
        state.selected = null
        state.isDataLoaded = false
        delete axios.defaults.headers.common.Authorization
        resolve()
      })
    },

    get_todo_lists ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('get_todo_lists_request')
        // `http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions`
        axios.get(`http://host1813162.hostland.pro/api/test/user/${state.user.id}/actions`)
          .then(response => {
            commit('get_todo_lists_success', response.data.data)
            resolve(response)
          })
          .catch(error => {
            commit('get_todo_lists_error', error)
            reject(error)
          })
      })
    },

    add_todo_list ({ commit, state }, task) {
      return new Promise((resolve, reject) => {
        commit('add_todo_list_request')
        axios.post(`http://host1813162.hostland.pro/api/test/user/${state.user.id}/actions`, task)
          .then(response => {
            response.data.data.attributes.tasks = []
            commit('add_todo_list_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('add_todo_list_error', error)
            reject(error)
          })
      })
    },

    update_todo_list ({ commit, state }, taskList) {
      return new Promise((resolve, reject) => {
        commit('update_todo_list_request')
        axios.patch(`http://host1813162.hostland.pro/api/test/actions/${state.taskListModalStatus.listId}`, taskList)
          .then(response => {
            commit('update_todo_list_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('update_todo_list_error', error)
            reject(error)
          })
      })
    },

    delete_todo_list ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('delete_todo_list_request')
        axios.delete(`http://host1813162.hostland.pro/api/test/actions/${state.taskListDeletionModalStatus.listId}`)
          .then(response => {
            commit('delete_todo_list_success', state.taskListDeletionModalStatus.listId)
            resolve(response)
          })
          .catch(error => {
            commit('delete_todo_list_error', error)
            reject(error)
          })
      })
    },

    add_task ({ commit, state }, task) {
      return new Promise((resolve, reject) => {
        commit('add_task_request')
        axios.post(`http://host1813162.hostland.pro/api/test/user/${state.user.id}/actions/${state.selected}/tasks`, task)
          .then(response => {
            commit('add_task_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('add_task_error', error)
            reject(error)
          })
      })
    },

    update_task ({ commit, state }, task) {
      return new Promise((resolve, reject) => {
        commit('update_task_request')
        axios.patch(`http://host1813162.hostland.pro/api/test/tasks/${state.taskModalStatus.taskId}`, task)
          .then(response => {
            commit('update_task_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('update_task_error', error)
            reject(error)
          })
      })
    },

    delete_task ({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('delete_task_request')
        axios.delete(`http://host1813162.hostland.pro/api/test/tasks/${state.taskDeletionModalStatus.taskId}`)
          .then(response => {
            commit('delete_task_success', state.taskDeletionModalStatus.taskId)
            resolve(response)
          })
          .catch(error => {
            commit('delete_task_error', error)
            reject(error)
          })
      })
    },

    change_task_status ({ commit }, task) {
      return new Promise((resolve, reject) => {
        commit('change_task_status_request')
        axios.patch(`http://host1813162.hostland.pro/api/test/tasks/${task.id}/markdone`, task.payload)
          .then(response => {
            commit('change_task_status_success')
            resolve(response)
          })
          .catch(error => {
            commit('change_task_status_error', error)
            reject(error)
          })
      })
    }
  },

  getters: {
    isLoggedIn: state => !!state.token,
    selectedTaskList: state => state.todoLists.find((list) => list.id === state.selected)
  },

  modules: {
  }
})
