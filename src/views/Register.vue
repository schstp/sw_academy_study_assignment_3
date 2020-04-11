<template>
    <form name="registration" @submit.prevent="validateForm">
        <header><h1>{{ formTitle }}</h1></header>
        <div>
            <input id="login" type="text" :placeholder="loginPlaceholder" v-model="login" autocomplete="off">
            <transition name="bounce">
                <div v-if="isLoginInvalid">
                    <p>Логин должен удовлетворять следующим условиям:</p>
                    <uL>
                        <li v-for="(constraint, index) in loginConstraints" :key="index">{{constraint}}</li>
                    </uL>
                </div>
                <div v-if="loginExists">
                  <p>Пользователь с таким логином уже существует, выберите другой.</p>
                </div>
            </transition>

            <input id="password" type="password" :placeholder="passwordPlaceholder" v-model="password"
                   autocomplete="off">
            <transition name="bounce">
                <div v-if="isPasswordInvalid">
                    <p>Пароль должен удовлетворять следующим условиям:</p>
                    <uL>
                        <li v-for="(constraint, index) in passwordConstraints" :key="index">{{constraint}}</li>
                    </uL>
                </div>
            </transition>

            <input id="passwordConfirmation" type="password" :placeholder="confirmPasswordPlaceholder"
                   v-model="passwordConfirmation" autocomplete="off">
            <transition name="bounce">
                <div v-if="isPasswordConfirmationInvalid">
                    <p>Введенные пароли не совпадают</p>
                </div>
            </transition>

            <input type="submit" :value="submitBtnText">
        </div>
        <footer>
          <p>{{ footerText }}  <router-link to="/login">{{ footerBtnText }}</router-link></p>
        </footer>
    </form>
</template>
<script>
export default {
  name: 'Register',
  props: {
    formTitle: {
      type: String,
      default: 'Регистрация'
    },

    footerText: {
      type: String,
      default: 'Уже есть аккаунт?'
    },

    footerBtnText: {
      type: String,
      default: 'Войти в систему'
    },

    loginPlaceholder: {
      type: String,
      default: 'Логин'
    },

    loginPattern: {
      type: String,
      default: '^[A-Za-z]{1}([_]?[A-Za-z0-9]+){0,}$'
    },

    loginConstraints: {
      type: Array,
      default: () => ['длина должна быть не менее 4 и не более 15 символов',
        'допустимы только буквы латинского алфавита, цифры и символ нижнего подчеркивания',
        'логин должен начинаться к буквы',
        'логин не может заканчиваться символом нижнего подчеркивания',
        'не допускается более одного символа нижнего подчеркивания подряд']
    },

    passwordPlaceholder: {
      type: String,
      default: 'Пароль'
    },

    passwordPattern: {
      type: String,
      default: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}'
    },

    passwordConstraints: {
      type: Array,
      default: () => ['длина должна быть не менее 8 символов',
        'допустимы только буквы латинского алфавита, цифры и специальные символы',
        'как минимум 1 буква в нижнем регистре',
        'как минимум 1 буква в верхнем регистре',
        'как минимум 1 цифра',
        'набор допустимых специальных символов: !@#$%^&* (их наличие в пароле не обязательно)']
    },

    confirmPasswordPlaceholder: {
      type: String,
      default: 'Подтвердите пароль'
    },

    submitBtnText: {
      type: String,
      default: 'Создать аккаунт'
    }
  },

  data: function () {
    return {
      login: '',
      password: '',
      passwordConfirmation: '',
      isLoginInvalid: false,
      loginExists: false,
      isPasswordInvalid: false,
      isPasswordConfirmationInvalid: false
    }
  },

  methods: {
    validateForm: function () {
      const login = document.getElementById('login')
      const password = document.getElementById('password')
      const passwordConfirmation = document.getElementById('passwordConfirmation')

      if (login.value.length < 4 || login.value.length > 15 || !login.value.match(this.loginPattern)) {
        this.isLoginInvalid = true
        login.classList.add('invalid')
        login.focus()
        return false
      } else this.hideErrorBox(login)

      if (!password.value.match(this.passwordPattern)) {
        this.isPasswordInvalid = true
        password.classList.add('invalid')

        if (!this.isLoginInvalid) password.focus()
        return false
      } else this.hideErrorBox(password)

      if (passwordConfirmation.value !== password.value) {
        this.isPasswordConfirmationInvalid = true
        passwordConfirmation.classList.add('invalid')

        if (!this.isLoginInvalid && !this.isPasswordInvalid) passwordConfirmation.focus()
        return false
      } else this.hideErrorBox(passwordConfirmation)

      this.register()
    },

    hideErrorBox: function (input) {
      input.classList.remove('invalid')

      if (input.id === 'login') this.isLoginInvalid = false
      else if (input.id === 'password') this.isPasswordInvalid = false
      else if (input.id === 'passwordConfirm') this.isPasswordConfirmationInvalid = false
    },

    register: function () {
      const user = {
        login: this.login,
        password: this.password
      }
      this.$store.dispatch('register', user)
        .then(() => this.$router.push('/'))
        .catch(err => console.log(err))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
