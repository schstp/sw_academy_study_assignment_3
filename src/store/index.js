import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { LoginError, AuthError } from '../components/_errors'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user')) || {},
    isRegistrationFinished: false,
    filterStatus: 0,
    todoLists: [],
    todos: [],
    isDataLoaded: false,
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
      state.status = 'loading'
    },

    auth_success (state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
    },

    auth_error (state) {
      state.status = 'error'
    },

    logout (state) {
      state.status = ''
      state.token = ''
    },

    get_todo_lists_request (state) {
      state.status = 'loading'
    },

    get_todo_lists_success (state, todoLists) {
      state.status = 'success'
      state.todoLists = todoLists
      state.selected = state.todoLists[0] ? state.todoLists[0].id : null
    },

    get_todo_lists_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    add_todo_list_request (state) {
      state.status = 'loading'
    },

    add_todo_list_success (state, todoList) {
      state.status = 'success'
      state.todoLists.push(todoList)
    },

    add_todo_list_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    update_todo_list_request (state) {
      state.status = 'loading'
    },

    update_todo_list_success (state, todoList) {
      state.status = 'success'
      const updatedList = state.todoLists.find(function (list) {
        return list.id === todoList.id
      })
      const indexOfUpdatedList = this.state.todoLists.indexOf(updatedList)
      Vue.set(this.state.todoLists, indexOfUpdatedList, todoList)
    },

    update_todo_list_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    delete_todo_list_request (state) {
      state.status = 'loading'
    },

    delete_todo_list_success (state, listId) {
      state.status = 'success'
      const deletedList = state.todoLists.find(function (list) {
        return list.id === this
      }, listId)
      const indexOfDeletedList = state.todoLists.indexOf(deletedList)
      state.todoLists.splice(indexOfDeletedList, 1)
    },

    delete_todo_list_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    get_tasks_request (state) {
      state.status = 'loading'
    },

    get_tasks_success (state, tasks) {
      state.status = 'success'
      state.todos = tasks
    },

    get_tasks_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    add_task_request (state) {
      state.status = 'loading'
    },

    add_task_success (state, task) {
      state.status = 'success'
      state.todos.push(task)
    },

    add_task_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    update_task_request (state) {
      state.status = 'loading'
    },

    update_task_success (state, task) {
      state.status = 'success'
      const updatedTask = state.todos.find(function (task) {
        return task.id === this
      }, task.id)
      const indexOfUpdatedTask = this.state.todos.indexOf(updatedTask)
      Vue.set(this.state.todos, indexOfUpdatedTask, task)
    },

    update_task_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    delete_task_request (state) {
      state.status = 'loading'
    },

    delete_task_success (state, taskId) {
      state.status = 'success'
      const deletedTask = state.todos.find(function (task) {
        return task.id === this
      }, taskId)
      const indexOfDeletedTask = state.todos.indexOf(deletedTask)
      state.todos.splice(indexOfDeletedTask, 1)
    },

    delete_task_error (state, error) {
      state.status = 'error'
      console.log(error)
    },

    change_task_status_request (state) {
      state.status = 'loading'
    },

    change_task_status_success (state) {
      state.status = 'success'
    },

    change_task_status_error (state, error) {
      state.status = 'error'
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
            if (!response.data.errors) {
              const token = response.data.access_token
              const user = response.data.user
              localStorage.setItem('token', token)
              localStorage.setItem('user', JSON.stringify(user))
              axios.defaults.headers.common.Authorization = token
              commit('auth_success', { token, user })
              resolve(response)
            } else {
              reject(new LoginError(response.data.errors.login))
            }
          })
          .catch(error => {
            commit('auth_error', error)
            localStorage.removeItem('token')
            reject(error)
          })
      })
    },

    logout ({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
        this.state.isDataLoaded = false
        resolve()
      })
    },

    get_todo_lists ({ commit }, filter) {
      console.log(filter)
      return new Promise((resolve, reject) => {
        commit('get_todo_lists_request')
        // `http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions`
        axios.get(`http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions`)
          .then(response => {
            commit('get_todo_lists_success', response.data.data)
            /* if (response.data.data.length) {
              this.dispatch('get_tasks', response.data.data[0].id)
            } */
            resolve(response)
          })
          .catch(error => {
            commit('get_todo_lists_error', error)
            reject(error)
          })
      })
    },

    add_todo_list ({ commit }, taskList) {
      return new Promise((resolve, reject) => {
        commit('add_todo_list_request')
        axios.post(`http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions`, taskList)
          .then(response => {
            commit('add_todo_list_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('add_todo_list_error', error)
            reject(error)
          })
      })
    },

    update_todo_list ({ commit }, taskList) {
      return new Promise((resolve, reject) => {
        commit('update_todo_list_request')
        axios.patch(`http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions/${this.state.taskListModalStatus.listId}`, taskList)
          .then(response => {
            console.log(response.data.date.attributes)
            commit('update_todo_list_success', response.data.data.attributes)
            resolve(response)
          })
          .catch(error => {
            commit('update_todo_list_error', error)
            reject(error)
          })
      })
    },

    delete_todo_list ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('delete_todo_list_request')
        axios.delete(`http://host1813162.hostland.pro/api/test/actions/${this.state.taskListDeletionModalStatus.listId}`)
          .then(response => {
            commit('delete_todo_list_success', this.state.taskListDeletionModalStatus.listId)
            resolve(response)
          })
          .catch(error => {
            commit('delete_todo_list_error', error)
            reject(error)
          })
      })
    },

    get_tasks ({ commit }, listId) {
      return new Promise((resolve, reject) => {
        console.log(listId)
        commit('get_tasks_request')
        axios.get(`http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions/${listId}/tasks`)
          .then(response => {
            console.log(response.data.data)
            commit('get_tasks_success', response.data.data)
            resolve(response)
          })
          .catch(error => {
            commit('get_tasks_error', error)
            reject(error)
          })
      })
    },

    add_task ({ commit }, task) {
      return new Promise((resolve, reject) => {
        commit('add_task_request')
        console.log(task.listId)
        axios.post(`http://host1813162.hostland.pro/api/test/user/${this.state.user.id}/actions/${task.listId}/tasks`, task)
          .then(response => {
            task.id = response.data.id
            commit('add_task_success', task)
            resolve(response)
          })
          .catch(error => {
            commit('add_task_error', error)
            reject(error)
          })
      })
    },

    update_task ({ commit }, task) {
      return new Promise((resolve, reject) => {
        commit('update_task_request')
        axios.patch(`https://my-json-server.typicode.com/schstp/todoapp/tasks/${this.state.taskModalStatus.taskId}`, task)
          .then(response => {
            commit('update_task_success', response.data)
            resolve(response)
          })
          .catch(error => {
            commit('update_task_error', error)
            reject(error)
          })
      })
    },

    delete_task ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('delete_task_request')
        axios.delete(`https://my-json-server.typicode.com/schstp/todoapp/tasks/${this.state.taskDeletionModalStatus.taskId}`)
          .then(response => {
            commit('delete_task_success', this.state.taskDeletionModalStatus.taskId)
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
        axios.patch(`https://my-json-server.typicode.com/schstp/todoapp/tasks/mark_done/${task.id}`, task.payload)
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
    authStatus: state => state.status
  },

  modules: {
  }
})
