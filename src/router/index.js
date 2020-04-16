import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import store from '../store'
import TodoApp from '../views/TodoApp.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import NotFoundComponent from '../views/NotFound'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'todoapp',
    component: TodoApp,
    meta: {
      requiresAuth: true
    },
    beforeEnter (to, from, next) {
      axios.get('https://my-json-server.typicode.com/schstp/todoapp/lists')
        .then(function (response) {
          store.state.todoLists = response.data
          if (store.state.todoLists.length) {
            axios.get(`https://my-json-server.typicode.com/schstp/todoapp/lists/${store.state.todoLists[0].id}/tasks`)
              .then(function (response) {
                store.state.todos = response.data
                store.state.selected = response.data[0] ? response.data[0].id : null
              })
              .catch(error => {
                console.log(error)
              })
          }
          next()
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '*',
    component: NotFoundComponent
  }
]

const router = new VueRouter({
  mode: 'history',
  routes: routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
