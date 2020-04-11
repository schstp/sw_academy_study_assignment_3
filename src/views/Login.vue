<template>
  <form name="auth" @submit.prevent="logIn">
    <header><h1>{{ formTitle }}</h1></header>
    <div>
      <input type="text" :placeholder="loginPlaceholder" v-model="login" required>

      <input type="password" :placeholder="passwordPlaceholder" v-model="password" required>

      <input type="submit" :value="submitBtnText">
    </div>
    <footer>
      <p>{{ footerText }}  <router-link to="/register">{{ footerBtnText }}</router-link></p>
    </footer>
  </form>
</template>
<script>
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
      password: ''
    }
  },

  methods: {
    logIn: function () {
      const data = {
        login: this.login,
        password: this.password
      }
      this.$store.dispatch('login', data)
        .then(() => this.$router.push('/todoapp'))
        .catch(error => console.log(error))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
