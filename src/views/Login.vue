<template>
  <transition name="fade">
    <form name="auth" @submit.prevent="logIn" v-if="!this.$store.state.isLoggedIn">
      <header><h1>{{ formTitle }}</h1></header>
      <div>
        <input type="text"
               :placeholder="loginPlaceholder"
               v-model="login" required
               :class="{'invalid': isDataInvalid}"
               @input="hideErrorBox">

        <input type="password"
               :placeholder="passwordPlaceholder"
               v-model="password" required
               :class="{'invalid': isDataInvalid}"
               @input="hideErrorBox">

        <transition name="bounce">
          <div v-if="isDataInvalid">
            <p>{{ errorMessage }}</p>
          </div>
        </transition>

        <input type="submit" :value="submitBtnText">
      </div>
      <footer>
        <p>{{ footerText }}  <router-link to="/register">{{ footerBtnText }}</router-link></p>
      </footer>
    </form>
  </transition>
</template>
<script>
import { AuthError } from '../components/_errors'

export default {
  name: 'Auth',
  props: {
    formTitle: {
      type: String,
      default: 'Авторизация'
    },

    footerText: {
      type: String,
      default: 'Нет аккаунта?'
    },

    footerBtnText: {
      type: String,
      default: 'Зарегистрироваться'
    },

    loginPlaceholder: {
      type: String,
      default: 'Логин'
    },

    passwordPlaceholder: {
      type: String,
      default: 'Пароль'
    },

    submitBtnText: {
      type: String,
      default: 'Войти'
    }
  },

  data: function () {
    return {
      login: '',
      password: '',
      isDataInvalid: false,
      errorMessage: ''
    }
  },

  methods: {
    hideErrorBox: function () {
      this.isDataInvalid = false
      this.message = ''
    },
    logIn: function () {
      const data = {
        login: this.login,
        password: this.password
      }
      this.$store.dispatch('login', data)
        .then(() => {
          this.$router.push('/')
          this.isDataInvalid = false
        })
        .catch((error) => {
          if (error instanceof AuthError) {
            this.errorMessage = error.message
            this.isDataInvalid = true
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
</style>
