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

  @media screen and (max-width: 790px) {
    .new-task-model-wrapper {
      left: calc(50% - 350px);
      width: 700px;
    }
  }

  @media screen and (max-width: 740px) {
    .new-task-model-wrapper {
      top: calc(50% - 175px);
      left: calc(50% - 250px);
      width: 500px;
      height: 350px;
      border-radius: 10px;

      label {
        font-size: 30px;
        width: 400px;
      }
      > div:last-of-type {
        margin-top: 50px;
      }
      button {
        width: 200px;
        height: 50px;

        font-size: 20px;

        &:first-of-type {
          margin-right: 30px;
        }

        &:last-of-type {
          margin-left: 30px;
        }
      }
    }
  }

  @media screen and (max-width: 530px) {
    .new-task-model-wrapper {
      top: calc(50% - 115px);
      left: calc(50% - 150px);
      width: 300px;
      height: 230px;
      border-radius: 10px;

      label {
        font-size: 24px;
        width: 250px;
        margin-bottom: 20px;
      }
      > div:last-of-type {
        margin-top: 20px;
      }
      button {
        width: 120px;
        height: 40px;;

        font-size: 18px;

        &:first-of-type {
          margin-right: 10px;
        }

        &:last-of-type {
          margin-left: 10px;
        }
      }
    }
  }
</style>
