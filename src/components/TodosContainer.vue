<template>
  <div class="right-container">
    <template v-if="!isTodoListsContainerEmpty">
      <AddButton text-content="Добавить подзадачу..."
                 v-on:show-modal-dialog="callTaskCreationDialog"
                 class="add-task-btn">
      </AddButton>
      <div
        v-if="isWindowNarrow"
        class="back-btn-wrapper"><img
        :src="`./${puplicPath}/img/arrow-back.png`"
      @click="backToTodoListsView">
      </div>
      <p v-if="isEmpty" class="empty-list">Список подзадач пуст</p>
      <ul v-else>
        <transition-group name="list">
          <Todo v-for="todo in todos" :key="todo.id" :todo="todo"></Todo>
        </transition-group>
      </ul>
    </template>
  </div>
</template>

<script>
import AddButton from './AddButton'
import Todo from './Todo'

export default {
  name: 'TodosContainer',
  data: function () {
    return {
      puplicPath: process.env.BASE_URL
    }
  },
  computed: {
    todos: function () {
      if (this.$store.state.selected === null) return []
      const tasks = this.$store.getters.selectedTaskList.tasks
      return tasks.sort(function (taskA, taskB) {
        const dateA = new Date(taskA.created_at)
        const dateB = new Date(taskB.created_at)
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
      })
    },
    isTodoListsContainerEmpty: function () {
      return this.$store.state.filtered.length === 0
    },
    isEmpty: function () {
      return this.$store.state.selected ? this.$store.getters.selectedTaskList.tasks.length === 0 : true
    },
    isWindowNarrow: function () {
      return this.$parent.$data.isWindowNarrow
    }
  },
  components: {
    AddButton,
    Todo
  },
  methods: {
    callTaskCreationDialog: function () {
      this.$store.state.taskModalStatus = {
        method: 'POST',
        isInProcess: true
      }
    },
    backToTodoListsView: function () {
      this.$emit('back-to-lists')
    }
  }
}
</script>

<style lang="scss" scoped>
  .right-container {
    position: relative;
    background-color: #fffef7;
    border-radius: 5px;
    padding: 0 10px;
    padding-top: 10px;
    height: calc(100vh - 50px);
  }
  .back-btn-wrapper {
    position: absolute;
    top: 24px;
    right: 20px;
    cursor: pointer;
  }
  .add-task-btn {
    margin-bottom: 25px;
  }
  .empty-list{
    font-family: Roboto, sans-serif;
    font-style: italic;
    font-weight: normal;
    font-size: 18px;
    color: #292929;
  }
  ul {
    margin: 0;
    padding-left: 0;
    height: calc(100vh - 130px);
    overflow-y: auto;

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

  .list-enter-active {
    transition: .3s ease;
  }
  .list-enter, .list-leave-to /* .list-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }
  @media screen and (max-width: 768px) {
    .right-container {
      padding: 15px !important;
      background-color: #FFFFFF;
    }
  }
  @media screen and (max-width: 530px) {
    .back-btn-wrapper {
      top: 22px;
      > img {
        width: 25px;
        height: auto;
      }
    }
  }
</style>
