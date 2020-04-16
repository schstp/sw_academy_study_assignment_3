<template>
  <div :class="['modal-wrapper', isVisible ? 'show-model':'']">
    <div class="new-task-model-wrapper">
      <label>{{ title }}</label>
      <div>
        <button @click="closeModal">Отмена</button>
        <button @click="deleteTaskList">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteTaskListModal',
  data: function () {
    return {
      title: 'Вы действительно хотите удалить задачу?'
    }
  },
  computed: {
    isVisible: function () {
      return this.$store.state.taskListDeletionModalStatus.isInProcess
    }
  },
  methods: {
    closeModal: function () {
      this.$store.state.taskListDeletionModalStatus.isInProcess = false
    },
    deleteTaskList: function () {
      this.$store.dispatch('delete_todo_list')
        .then((response) => {
          const deletedListId = this.$store.state.taskListDeletionModalStatus.listId
          const selectedId = this.$store.state.selected
          const todoLists = this.$store.state.todoLists

          if (deletedListId === selectedId) {
            if (todoLists.length) {
              this.$store.dispatch('get_tasks', todoLists[0].id)
                .then(() => {
                  this.$store.state.selected = todoLists[0].id
                })
                .catch((error) => {
                  console.log(error)
                })
            }
          }

          this.$store.state.notificationsBoxStatus = {
            isShown: true,
            message: 'Задача успешно удалена.'
          }
          this.closeModal()
        })
        .catch(error => {
          console.log(error)
        })
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
      text-align: center;
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
