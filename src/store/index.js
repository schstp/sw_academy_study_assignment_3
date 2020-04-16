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
    todoLists: [],
    todos: [],
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
    }
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
              console.log(user)
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
        resolve()
      })
    },

    add_todo_list ({ commit }, taskList) {
      return new Promise((resolve, reject) => {
        commit('add_todo_list_request')
        axios.post('https://my-json-server.typicode.com/schstp/todoapp/lists', taskList)
          .then(response => {
            taskList.id = response.data.id
            if (this.state.todoLists.length === 0) this.state.selected = taskList.id
            commit('add_todo_list_success', taskList)
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
        axios.patch(`https://my-json-server.typicode.com/schstp/todoapp/lists/${this.state.taskListModalStatus.listId}`, taskList)
          .then(response => {
            commit('update_todo_list_success', response.data)
            resolve(response)
          })
          .catch(error => {
            commit('update_todo_list_error', error)
            reject(error)
          })
      })
    },

    add_task ({ commit }, task) {
      return new Promise((resolve, reject) => {
        commit('add_task_request')
        axios.post('https://my-json-server.typicode.com/schstp/todoapp/tasks', task)
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
    }
  },

  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  },

  modules: {
  }
})
