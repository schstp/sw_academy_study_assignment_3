<template>
  <li
    :class="[selected ? 'selected' : '', statusColor]"
    @click="changeSelectedTodoList($event)"
    v-if="isVisible">
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
    },
    tasks: function () {
      return this.todoList.tasks
    },
    status: function () {
      if (this.tasks.length === 0) {
        return 2
      } else {
        for (let i = 0; i < this.tasks.length; i++) {
          if (!this.tasks[i].mark_done) return 0
        }
        return 1
      }
    },
    statusColor: function () {
      if (this.status === 0) {
        return 'green'
      } else if (this.status === 1) {
        return 'gray'
      } else {
        return 'white'
      }
    },
    isVisible: function () {
      if (this.$store.state.filterStatus === 2) return true
      else {
        if (this.$store.state.filterStatus === 0 && (this.status === 0 || this.status === 2)) return true
        else return this.$store.state.filterStatus === 1 && this.status === 1
      }
    }
  },
  watch: {
    isVisible: function (value) {
      if (value) {
        this.$store.state.filtered.push(this.id)
      } else if (this.$store.state.filtered.includes(this.id)) {
        this.$store.state.filtered.splice(this.$store.state.filtered.indexOf(this.id), 1)
      }

      if (this.$store.state.filtered.length === 0) {
        this.$store.state.selected = null
      } else {
        this.$store.state.selected = this.$store.state.filtered[0]
      }
    }
  },
  methods: {
    changeSelectedTodoList: function (e) {
      this.$store.state.selected = this.id
      this.$store.state.todos = this.tasks
      this.$emit('go-to-todos')
    },
    callTodoListEditDialog: function () {
      this.$store.state.taskListModalStatus = {
        isInProcess: true,
        method: 'PATCH',
        listId: this.id
      }
    },
    callTodoListDeleteDialog: function () {
      this.$store.state.taskListDeletionModalStatus = {
        isInProcess: true,
        listId: this.id
      }
    }
  },
  components: {
    EditButton,
    DeleteButton
  },
  beforeMount () {
    if (this.isVisible) {
      this.$store.state.filtered.push(this.id)
    } else if (this.$store.state.filtered.includes(this.id)) {
      this.$store.state.filtered.splice(this.$store.state.filtered.indexOf(this.id), 1)
    }

    if (this.$store.state.filtered.length === 0) {
      this.$store.state.selected = null
    } else {
      this.$store.state.selected = this.$store.state.filtered[0]
    }
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

    &.white {
      background-color: #FFFFFF;
    }

    &.green {
      background-color: #DBFFDE;
    }

    &.gray {
      background-color: #EFEFEF;
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
  @media screen and (max-width: 320px) {
    li {
      height: 80px;
      padding: 10px;

      p {
        &.todo-list-titile {
          font-size: 18px;
        }

        &.created-time-stamp {
          margin-top: 12px;
          font-size: 14px;
        }
      }
    }
  }
</style>
