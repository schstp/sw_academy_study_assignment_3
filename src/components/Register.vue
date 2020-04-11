<template>
    <form name="registration" @submit.prevent="validateForm">
        <header><h1>{{ formTitle }}</h1></header>
        <div>
            <input id="login" type="text" :placeholder="loginPlaceholder" v-model="login" required>
            <transition name="bounce">
                <div v-if="isLoginInvalid">
                    <p>Логин должен удовлетворять следующим условиям:</p>
                    <uL>
                        <li v-for="(constraint, index) in loginConstraints" :key="index">{{constraint}}</li>
                    </uL>
                </div>
            </transition>

            <input id="password" type="password" :placeholder="passwordPlaceholder" v-model="password" required>
            <transition name="bounce">
                <div v-if="isPasswordInvalid">
                    <p>Пароль должен удовлетворять следующим условиям:</p>
                    <uL>
                        <li v-for="(constraint, index) in passwordConstraints" :key="index">{{constraint}}</li>
                    </uL>
                </div>
            </transition>

            <input id="passwordConfirmation" type="password" :placeholder="confirmPasswordPlaceholder"
                   v-model="passwordConfirmation" required>
            <transition name="bounce">
                <div v-if="isPasswordConfirmationInvalid">
                    <p>Введенные пароли не совпадают</p>
                </div>
            </transition>

            <input type="submit" :value="submitBtnText">
        </div>
        <footer>
            <p>{{ footerText }}  <a href="">{{ footerBtnText }}</a></p>
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
      const data = {
        login: this.login,
        password: this.password
      }
      this.$store.dispatch('register', data)
        .then(() => this.$router.push('/todoapp'))
        .catch(err => console.log(err))
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
