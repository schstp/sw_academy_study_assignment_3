<template>
  <div class="right-container">
    <template v-if="!isTodoListsContainerEmpty">
      <AddButton text-content="Добавить подзадачу..."
                 v-on:show-modal-dialog="callTaskCreationDialog"
                 class="add-task-btn">
      </AddButton>
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
  computed: {
    todos: function () {
      return this.$store.state.todos
    },
    isTodoListsContainerEmpty: function () {
      if (this.$store.state.todoLists) {
        return this.$store.state.todoLists.length === 0
      }
      return null
    },
    isEmpty: function () {
      if (this.$store.state.todos) {
        return this.$store.state.todos.length === 0
      }
      return null
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
    }
  }
}
</script>

<style lang="scss" scoped>
  .add-task-btn {
    margin-bottom: 25px;
  }
  .empty-list{
    font-family: Roboto, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    color: #B2B2B2;
  }
  ul {
    margin: 0;
    padding-left: 0;
    height: calc(100vh - 120px);
    overflow-y: scroll;

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
</style>
