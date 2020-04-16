<template>
  <li :class="{'selected': selected }" @click="changeSelectedTodoList($event)">
    <div>
      <p class="todo-list-titile" :title="title">{{ title }}</p>
      <div>
        <EditButton v-on:show-modal-dialog="callTodoListEditDialog"></EditButton>
        <DeleteButton v-on:show-modal-dialog="callTodoListDeleteDialog"></DeleteButton>
      </div>
    </div>
    <div>
      <p class="created-time-stamp">Создано: {{ createdAt }}</p>
    </div>
  </li>
</template>

<script>
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'
import axios from 'axios'
import store from '../store'
export default {
  name: 'TodoList',
  props: {
    todoList: {
      type: Object
    },
    dateFormatOptions: {
      type: Object,
      default: function () {
        return {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          timezone: 'UTC'
        }
      }
    }
  },
  data: function () {
    return {
      done: false
    }
  },
  computed: {
    title: function () {
      return this.todoList.action_name
    },
    selected: function () {
      return this.id === this.$store.state.selected
    },
    id: function () {
      return this.todoList.id
    },
    createdAt: function () {
      return new Date(this.todoList.created_at).toLocaleString('ru', this.dateFormatOptions)
    }
  },
  methods: {
    changeSelectedTodoList: function (e) {
      this.$store.state.selected = this.id
      axios.get(`https://my-json-server.typicode.com/schstp/todoapp/lists/${this.id}/tasks`)
        .then(function (response) {
          store.state.todos = response.data
        })
        .catch(error => {
          console.log(error)
        })
      this.$store.state.todos = this.todoList.tasks
    },
    callTodoListEditDialog: function () {
      this.$store.state.taskListModalStatus = {
        isInProcess: true,
        method: 'PATCH',
        listId: this.id
      }
    },
    callTodoListDeleteDialog: function () {
      alert('todo list delete dialog must be implemented!')
    }
  },
  components: {
    EditButton,
    DeleteButton
  }
}
</script>

<style lang="scss" scoped>
  li {
    display: block;
    box-sizing: border-box;
    width: 99%;
    height: 110px;
    margin: 30px 0;
    padding: 0 20px;
    padding-top: 20px;
    padding-bottom: 10px;
    border: 1px solid #B2B2B2;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;

    &.selected {
      border: 3px solid #2596FF;
    }

    &:first-of-type {
      margin-top: 0;
    }

    p {
      margin: 0;

      &.todo-list-titile {
        max-width: 230px;
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 24px;
        line-height: 28px;
        color: #292929;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &.created-time-stamp {
        margin-top: 30px;
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        color: #B2B2B2;
      }
    }

    div:first-of-type {
      display: flex;
      justify-content: space-between;

      div {
        display: flex;
        align-items: center;
      }
    }
  }
</style>
