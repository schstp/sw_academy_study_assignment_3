<template>
  <div id="app" :class="[this.$store.state.isLoggedIn ? 'todoapp-container' : 'auth-reg-container']">
    <transition name="component-fade" mode="out-in">
      <router-view></router-view>
    </transition>
    <TaskListModal :title="taskListModalTitle" :name-init="processingListTitle"></TaskListModal>
    <TaskModal :title="taskModalTitle" :task="processingTask"></TaskModal>
    <DeleteTaskListModal></DeleteTaskListModal>
    <DeleteTaskModal></DeleteTaskModal>
    <RegisterSuccessModal></RegisterSuccessModal>
    <LogoutConfirmationModal></LogoutConfirmationModal>
  </div>
</template>

<script>
import TaskListModal from './components/TaskListModal'
import TaskModal from './components/TaskModal'
import RegisterSuccessModal from './components/RegisterSuccessModal'
import LogoutConfirmationModal from './components/LogoutConfirmationModal'
import DeleteTaskListModal from './components/DeleteTaskListModal'
import DeleteTaskModal from './components/DeleteTaskModal'

export default {
  name: 'App',
  components: {
    TaskListModal,
    TaskModal,
    RegisterSuccessModal,
    LogoutConfirmationModal,
    DeleteTaskListModal,
    DeleteTaskModal
  },
  data: function () {
    return {}
  },
  computed: {
    taskListModalTitle: function () {
      return this.$store.state.taskListModalStatus.method === 'POST' ? 'Создать задачу' : 'Редактировать задачу'
    },
    processingListTitle: function () {
      let title = ''
      if (this.$store.state.taskListModalStatus.isInProcess) {
        if (this.$store.state.taskListModalStatus.method === 'PATCH') {
          title = this.$store.state.todoLists.find(function (list) {
            return list.id === this
          }, this.$store.state.taskListModalStatus.listId).action_name
        }
      }

      return title
    },

    taskModalTitle: function () {
      return this.$store.state.taskModalStatus.method === 'POST' ? 'Создать подзадачу' : 'Редактировать подзадачу'
    },
    processingTask: function () {
      let task = {}
      task.task_name = ''
      task.description = ''
      task.important = 1
      if (this.$store.state.taskModalStatus.isInProcess) {
        if (this.$store.state.taskModalStatus.method === 'PATCH') {
          const selectedList = this.$store.state.todoLists.find(function (list) {
            return list.id === this
          }, this.$store.state.selected)
          const indexOfSelectedList = this.$store.state.todoLists.indexOf(selectedList)
          task = this.$store.state.todoLists[indexOfSelectedList].tasks.find(function (task) {
            return task.id === this
          }, this.$store.state.taskModalStatus.taskId)
        }
      }
      return task
    }
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (error) {
      return new Promise(function (resolve, reject) {
        if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
          this.store.dispatch('logout')
        }
        throw error
      })
    })
  }
}
</script>

<style lang="scss">

  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    position: relative;
    display: flex;
    height: 100%;
  }

  .auth-reg-container {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  .todoapp-container {
    height: auto;
  }

  .component-fade-enter-active, .component-fade-leave-active {
    transition: opacity .1s ease;
  }
  .component-fade-enter, .component-fade-leave-to {
    opacity: 0;
  }

  form {
    &[name='registration'], &[name='auth'] {
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

        div {
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

      input {

        display: block;
        height: 60px;
        outline: none;
        -webkit-appearance: none;

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
  }

  @media screen and (max-width: 768px) {
    form {
      &[name='registration'], &[name='auth']{
        h1 {
          font-size: 40px;
          line-height: 49px;
          margin-bottom: 80px;
        }

        div div {
          width: 490px;
        }

        input {
          &[type='text'], &[type='password'] {
            width: 470px;
            margin-bottom: 30px;

            &::placeholder {
              font-size: 20px;
            }
          }

          &[type='submit'] {
            width: 270px;
            font-size: 20px;
            margin-top: 40px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 540px) {
    form {
      &[name='registration'], &[name='auth'] {
        h1 {
          font-size: 30px;
          line-height: 30px;
          margin-bottom: 50px;
        }

        div div {
          width: 290px;
          margin-bottom: 15px;
          padding: 0 5px;
          font-size: 11px;

          > ul {
            padding-inline-start: 25px;
          }

          > p {
            font-size: 11px;
          }
        }

        input {
          &[type='text'], &[type='password'] {
            width: 280px;
            height: 40px;
            padding-left: 10px;
            margin-bottom: 15px;
            font-size: 18px;

            &::placeholder {
              font-size: 16px;
            }
          }

          &[type='submit'] {
            width: 220px;
            height: 40px;
            font-size: 18px;
            margin-top: 10px;
            margin-bottom: 20px;
          }
        }

        p {
          font-size: 14px;
          line-height: 21px;
        }
      }
    }
  }
</style>
