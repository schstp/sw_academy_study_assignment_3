import Vue from 'vue'
import VueRouter from 'vue-router'
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
      store.dispatch('get_todo_lists')
        .then(() => {
          next()
          setTimeout(function () {
            store.state.isDataLoaded = true
          }, 100)
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
