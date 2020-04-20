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
      <TodoList v-for="todoList in todoLists" :key="todoList.id" :todo-list="todoList" v-on:go-to-todos="showTodos"></TodoList>
    </ul>
  </div>

</template>

<script>
import NavBar from './NavBar'
import TodoList from './TodoList'
import Dropdown from './Dropdown'
import AddButton from './AddButton'

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
      return this.$store.state.todoLists.length === 0
    }
  },
  watch: {
    filterStatus: function (value) {
      this.$store.state.filterStatus = value
    }
  },
  methods: {
    callTaskListCreationDialog: function () {
      this.$store.state.taskListModalStatus = {
        method: 'POST',
        isInProcess: true
      }
    },
    showTodos: function () {
      this.$emit('go-to-todos')
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
  #left-container {
    background-color: #f6f9ff;
    border-radius: 5px;
    padding: 0 10px;
    padding-top: 10px;
    height: calc(100vh - 60px);
  }
  .filter {
    margin-top: 60px;
    margin-bottom: 45px;
  }
  .add-task-btn {
    margin-bottom: 50px;
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
    height: calc(100vh - 400px);
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

  @media screen and (max-width: 768px) {
    #left-container {
      background-color: #FFFFFF;
      padding: 0 15px;
    }
  }
  @media screen and (max-width: 530px) {
    #left-container {
      ul {
        height: calc(100% - 330px);
      }
    }
  }
  @media screen and (max-width: 370px) {
    #left-container {
      width: 90% !important;
    }
  }
  @media screen and (max-width: 340px) {
    #left-container {
      ul {
        height: calc(100vh - 330px);
      }
      .filter {
        margin-top: 35px;
        margin-bottom: 20px;
      }
      .add-task-btn {
        margin-bottom: 40px;
      }
    }
  }
  @media screen and (max-width: 320px) {
    #left-container {
      ul {
        height: calc(100vh - 280px);
      }
    }
  }
</style>
