<template>
  <li>
    <div>
      <div>
        <input type="checkbox" v-model="done" title="Отметить как выполненную">
        <p class="todo-titile" :title="title">{{ title }}</p>
      </div>
      <div>
        <EditButton v-on:show-modal-dialog="callTaskEditDialog"></EditButton>
        <DeleteButton v-on:show-modal-dialog="callTaskDeleteDialog"></DeleteButton>
      </div>
    </div>
    <div class="description">
      <p>{{ description }}</p>
    </div>
    <div class="note-wrapper">
      <div>
        <p class="created-time-stamp">Создано: {{ createdAt }}</p>
      </div>
      <div class="importance">
        <p>Срочность</p>
        <div>
          <span :class="{ 'green': importance < 4, 'yellow': importance === 4, 'orange': importance === 5}"
                v-for="i in importance"
                :key="i">
          </span>
        </div>
      </div>
    </div>
  </li>
</template>

<script>
import EditButton from './EditButton'
import DeleteButton from './DeleteButton'

export default {
  name: 'Todo',
  props: {
    todo: {
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
      mark_done: null
    }
  },
  computed: {
    id: function () {
      return this.todo.id
    },
    title: function () {
      return this.todo.task_name
    },
    createdAt: function () {
      return new Date(this.todo.created_at).toLocaleString('ru', this.dateFormatOptions)
    },
    description: function () {
      return this.todo.description
    },
    importance: function () {
      return this.todo.important
    },
    done: {
      get: function () {
        return this.todo.mark_done
      },
      set: function (value) {
        this.mark_done = value
        const task = {
          id: this.id,
          payload: { mark_done: value }
        }

        this.$store.dispatch('change_task_status', task)
          .then((response) => {
            const selectedList = this.$store.state.todoLists.find(function (list) {
              return list.id === this
            }, this.$store.state.selected)
            const indexOfSelectedList = this.$store.state.todoLists.indexOf(selectedList)
            const indexOfTask = this.$store.state.todoLists[indexOfSelectedList].tasks.indexOf(this.todo)
            this.$store.state.todoLists[indexOfSelectedList].tasks[indexOfTask].mark_done = value
          })
          .catch()
      }
    }
  },
  methods: {
    callTaskEditDialog: function () {
      this.$store.state.taskModalStatus = {
        isInProcess: true,
        method: 'PATCH',
        taskId: this.id
      }
    },
    callTaskDeleteDialog: function () {
      this.$store.state.taskDeletionModalStatus = {
        isInProcess: true,
        taskId: this.id
      }
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
    width: 99.5%;
    height: 260px;
    margin: 30px 0;
    padding: 20px;
    border: 1px solid #2596FF;
    border-radius: 10px;
    background-color: #FFFFFF;

    &:first-of-type {
      margin-top: 0;
    }

    input[type='checkbox'] {
      &:checked, &:not(:checked) {
        width: 30px;
        height: 30px;
        margin-right: 20px;
        cursor: pointer;
      }
    }

    p {
      margin: 0;

      &.todo-titile {
        max-width: 560px;
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
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        color: #B2B2B2;
      }
    }

    div {
      &.description {
        width: 500px;
        height: 120px;
        margin-top: 15px;
        margin-bottom: 25px;
        margin-left: 50px;

        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        color: #B2B2B2;
        word-wrap: break-word;
      }

      &.note-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &.importance {
        display: flex;
        align-items: center;
        width: 275px;
        font-family: Roboto, sans-serif;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        color: #292929;

        p {
          margin-right: 10px;
        }

        > div > span {
          margin: 0 3px;
          width: 30px;
          height: 30px;
          border-radius: 3px;

          &.orange {
            background-color: #FFA800;
          }

          &.yellow {
            background-color: #edfc46;
          }

          &.green {
            background-color: #5ED301;
          }
        }
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
