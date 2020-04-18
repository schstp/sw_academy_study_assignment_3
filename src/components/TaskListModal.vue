<template>
  <div :class="['modal-wrapper', isVisible ? 'show-model':'']">
    <div class="new-task-model-wrapper">
      <label for="taskListName">{{ title }}</label>
      <input
        type="text" id="taskListName"
        placeholder="Название"
        v-model="name"
        :class="{'invalid': isNameInvalid}">
      <transition name="bounce">
        <div v-if="isNameInvalid">
          <p v-if="nameIsEmpty">Введите название.</p>
          <p v-else>Название не может быть больше 200 символов.</p>
        </div>
      </transition>
      <div>
        <button @click="closeModal">Отмена</button>
        <button @click="createNewTaskList">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewTaskListModal',
  props: {
    title: String,
    nameInit: String
  },
  data: function () {
    return {
      name: '',
      isNameInvalid: false,
      nameIsEmpty: false
    }
  },
  computed: {
    isVisible: function () {
      return this.$store.state.taskListModalStatus.isInProcess
    },
    type: function () {
      return this.$store.state.taskListModalStatus.method === 'POST' ? 'add_todo_list' : 'update_todo_list'
    }
  },
  watch: {
    nameInit: function (value) {
      this.name = value
    }
  },
  methods: {
    closeModal: function () {
      this.$store.state.taskListModalStatus.isInProcess = false
      this.name = ''
      this.isNameInvalid = false
      this.nameIsEmpty = false
    },
    createNewTaskList: function () {
      if (this.validateForm()) {
        const taskList = {
          action_name: this.name
        }

        this.$store.dispatch(this.type, taskList)
          .then((response) => {
            this.closeModal()
            const pofyfill = this.$store.state.taskListModalStatus.method === 'POST' ? 'добавлена' : 'изменена'
            this.$store.state.notificationsBoxStatus = {
              isShown: true,
              message: `Задача успешно ${pofyfill}.`
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    validateForm: function () {
      if (this.name.trim().length === 0) {
        this.isNameInvalid = true
        this.nameIsEmpty = true
        return false
      } else if (this.name.length > 200) {
        this.isNameInvalid = true
        this.nameIsEmpty = false
        return false
      }

      return true
    }
  }
}
</script>

<style lang="scss" scoped>
  .modal-wrapper {
    display: none;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  }
  .new-task-model-wrapper {
    display: flex;
    position: absolute;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: calc(50% - 175px);
    left: calc(50% - 385px);
    width: 770px;
    height: 350px;
    background-color: #FFFFFF;
    border-radius: 40px;

    label {
      margin-bottom: 60px;
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 50px;
      color: #292929;
    }

    input {
      box-sizing: border-box;
      width: 570px;
      height: 60px;
      padding: 0 10px;
      border: 1px solid #2596FF;
      border-radius: 10px;
      font-size: 24px;
      outline: none;

      &::placeholder {
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 60px;
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
    }
    > div:last-of-type {
      margin-top: 50px;
    }
    button {
      box-sizing: border-box;
      width: 230px;
      height: 60px;
      background: #2596FF;
      border: solid 1px #2596FF;
      border-radius: 50px;
      outline: none;
      cursor: pointer;

      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 28px;
      color: #FFFFFF;

      &:first-of-type {
        margin-right: 55px;
      }

      &:last-of-type {
        margin-left: 55px;
      }
    }

    p {
      width: 570px;
      margin-bottom: 0;
      color: #DC3545;
      font-family: Roboto, sans-serif;
      font-size: 12px;
      line-height: 14px;
      text-align: left;
    }
  }

  .show-model {
    display: flex;
  }

  .bounce-enter-active {
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
</style>
