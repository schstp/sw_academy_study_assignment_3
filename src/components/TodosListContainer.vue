<template>
  <div id="left-container">
    <NavBar></NavBar>
    <Dropdown class="filter" :options="filterOptions" dropdown-id="listFilter" v-model="filterStatus"></Dropdown>
    <AddButton text-content="Добавить задачу..."
               v-on:show-modal-dialog="callTaskListCreationDialog"
               class="add-task-btn">
    </AddButton>
    <p v-if="isEmpty" class="empty-list">Список задач пуст.</p>
    <ul v-else>
      <TodoList v-for="todoList in todoLists" :key="todoList.id" :todo-list="todoList"></TodoList>
    </ul>
  </div>

</template>

<script>
import NavBar from './NavBar'
import TodoList from './TodoList'
import Dropdown from './Dropdown'
import AddButton from './AddButton'
import store from '../store'

export default {
  name: 'TodosListContainer',
  data: function () {
    return {
      filterOptions: ['Невыполненные', 'Выполненные', 'Все'],
      filterStatus: 0
    }
  },
  computed: {
    todoLists: function () {
      return this.$store.state.todoLists
    },
    isEmpty: function () {
      if (this.$store.state.todoLists) {
        return this.$store.state.todoLists.length === 0
      }
      return null
    }
  },
  watch: {
    filterStatus: function (value) {
      store.dispatch('get_todo_lists', value)
        .then(() => {
          this.$store.state.filterStatus = value
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  methods: {
    callTaskListCreationDialog: function () {
      this.$store.state.taskListModalStatus = {
        method: 'POST',
        isInProcess: true
      }
    }
  },
  components: {
    NavBar,
    TodoList,
    Dropdown,
    AddButton
  }
}
</script>

<style lang="scss" scoped>
  .filter {
    margin-top: 60px;
    margin-bottom: 45px;
  }
  .add-task-btn {
    margin-bottom: 50px;
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
    height: calc(100vh - 390px);
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
</style>
