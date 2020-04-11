<template>
  <form name="registration" @submit.prevent="logIn">
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

  form {
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 50px;
      line-height: 59px;
      text-align: center;

      margin-bottom: 100px;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    input {

      display: block;
      height: 60px;
      outline: none;

      &[type='text'], &[type='password'] {
        width: 570px;
        margin-bottom: 30px;
        font-size: 24px;
        line-height: 28px;
        padding-left: 20px;
        border: solid 1px #B2B2B2;
        border-radius: 5px;

        &::placeholder {
          font-family: inherit;
          font-size: 24px;
          line-height: 28px;
          color:  #B2B2B2;
        }

        &.invalid {
          border-color: #DC3545;
          box-shadow: 0 0  5px #DC3545;
          animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% {
            transform: translate3d(-2px, 0, 0);
          }

          20%, 80% {
            transform: translate3d(4px, 0, 0);
          }

          30%, 50%, 70% {
            transform: translate3d(-8px, 0, 0);
          }

          40%, 60% {
            transform: translate3d(8px, 0, 0);
          }
        }

        + div {
          display: block;
          box-sizing: border-box;
          width: 592px;
          margin-bottom: 30px;
          padding: 10px;
          color: #DC3545;
          font-family: Roboto, sans-serif;
          font-size: 12px;
          line-height: 14px;

          &.bounce-enter-active {
            animation: bounce-in .5s;
          }

          @keyframes bounce-in {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          > p {
            color: #DC3545;
            font-family: Roboto, sans-serif;
            font-size: 12px;
            line-height: 14px;
            text-align: left;
          }

          > ul {
            margin-bottom: 0;
          }
        }
      }

      &[type='submit'] {
        width: 370px;
        background: #2596FF;
        border-radius: 50px;
        margin-top: 70px;
        margin-bottom: 50px;
        border: none;
        cursor: pointer;

        font-family: Roboto, sans-serif;
        font-style: inherit;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        text-align: center;
        color: #FFFFFF;
      }

    }

    p {
      margin: 0;
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 21px;
      text-align: center;

      color: #787878;

      a {
        text-decoration: none;
        color: #2596FF;
      }

    }

  }
</style>
