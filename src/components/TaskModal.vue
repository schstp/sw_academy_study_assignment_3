<template>
  <div :class="['modal-wrapper', isVisible ? 'show-model':'']">
    <div class="new-task-model-wrapper">
      <label for="taskName"> {{ title }}</label>
      <input
        type="text" id="taskName"
        placeholder="Введите название"
        v-model="name"
        :class="{'invalid': isNameInvalid}">
      <transition name="bounce">
        <div v-if="isNameInvalid">
          <p v-if="nameIsEmpty">Введите название.</p>
          <p v-else>Название не может быть больше 200 символов.</p>
        </div>
      </transition>
      <textarea
        placeholder="Краткое описание"
        v-model="description"
        :class="{'invalid': isDescriptionInvalid}"></textarea>
      <transition name="bounce">
        <div v-if="isDescriptionInvalid">
          <p>Описание не может быть больше 500 символов.</p>
        </div>
      </transition>
      <Dropdown ref="dropdown"
        :options="importanceOptions"
        class="importance" dropdown-id="importance"
        v-model="importanceIndex">
      </Dropdown>
      <div>
        <button @click="closeModal">Отмена</button>
        <button @click="createNewTask">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
import Dropdown from './Dropdown'

export default {
  name: 'NewTaskModal',
  components: { Dropdown },
  props: {
    title: String,
    task: Object
  },
  data: function () {
    return {
      name: '',
      description: '',
      importanceOptions: [1, 2, 3, 4, 5],
      importanceIndex: 0,
      isNameInvalid: false,
      nameIsEmpty: false,
      isDescriptionInvalid: false
    }
  },
  computed: {
    isVisible: function () {
      return this.$store.state.taskModalStatus.isInProcess
    },
    type: function () {
      return this.$store.state.taskModalStatus.method === 'POST' ? 'add_task' : 'update_task'
    }
  },
  watch: {
    task: function (value) {
      this.name = value.task_name
      this.description = value.description
      this.importanceIndex = this.importanceOptions.indexOf(value.important)
      const importanceFirstOptionEl = document
        .querySelector(`#importance .custom-options > span[data-value='${this.importanceIndex}']`)
      this.$refs.dropdown.changeSelected({ target: importanceFirstOptionEl })
    }
  },
  methods: {
    closeModal: function () {
      this.$store.state.taskModalStatus.isInProcess = false
      this.name = ''
      this.description = ''
      this.importanceIndex = 0
      this.isNameInvalid = false
      this.nameIsEmpty = false
      this.isDescriptionInvalid = false
      const importanceFirstOptionEl = document.querySelector('#importance .custom-options > span:first-of-type')
      this.$refs.dropdown.changeSelected({ target: importanceFirstOptionEl })
    },
    createNewTask: function () {
      if (this.validateForm()) {
        const task = {
          task_name: this.name,
          description: this.description,
          important: this.importanceOptions[+this.importanceIndex]
        }

        this.$store.dispatch(this.type, task)
          .then((response) => {
            const pofyfill = this.$store.state.taskModalStatus.method === 'POST' ? 'добавлена' : 'изменена'
            this.$store.state.notificationsBoxStatus = {
              isShown: true,
              message: `Подзадача успешно ${pofyfill}.`
            }
            this.closeModal()
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    validateForm: function () {
      if (this.name.length === 0) {
        this.isNameInvalid = true
        this.nameIsEmpty = true
        return false
      } else if (this.name.length > 200) {
        this.isNameInvalid = true
        this.nameIsEmpty = false
        return false
      } else {
        this.isNameInvalid = false
      }

      if (this.description.length > 500) {
        this.isDescriptionInvalid = true
        return false
      } else {
        this.isDescriptionInvalid = false
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
    top: calc(50% - 318px);
    left: calc(50% - 385px);
    width: 770px;
    height: 636px;
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

    textarea {
      box-sizing: border-box;
      width: 570px;
      height: 100px;
      margin-top: 30px;
      padding: 10px;
      border: 1px solid #2596FF;
      border-radius: 10px;

      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;

      outline: none;
      resize: none;

      &.invalid {
        border-color: #DC3545;
        box-shadow: 0 0  5px #DC3545;
        animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
      }

      &::-webkit-scrollbar {
        width: 5px;
        height: 3px;
        cursor: pointer;
      }
      &::-webkit-scrollbar-button {
        display: none;
      }
      &::-webkit-scrollbar-track {
        background-color: #999;
      }
      &::-webkit-scrollbar-track-piece {
        background-color: #e8e8e8;
      }
      &::-webkit-scrollbar-thumb {
        height: 50px;
        background-color: #cecece;
        border-radius: 3px;
      }
      &::-webkit-scrollbar-corner {
        background-color: #999;
        border-radius: 3px;
      }
      &::-webkit-resizer {
        background-color:#666;
      }
    }
    .importance {
      width: 570px;
      margin-top: 30px;
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
