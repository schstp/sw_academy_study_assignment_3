<template>
  <div id="content">
    <TodosListContainer
      :class="['todo-lists-container', 'animation',
      isWindowNarrow ? isTodoListsActive ?
      'todo-lists-container-md-sm-active' : 'todo-lists-container-md-sm-leave' : '']"
      v-on:go-to-todos="showTodos">
    </TodosListContainer>
    <TodosContainer
      :class="['todos-container', 'animation',
      isWindowNarrow ? isTodosActive ?
      'todos-container-md-sm-active' : 'todos-container-md-sm-leave' : '']"
      v-on:back-to-lists="backToTodoListsView">
    </TodosContainer>
    <NotificationsBox></NotificationsBox>
  </div>
</template>

<script>
import TodosListContainer from '../components/TodosListContainer'
import TodosContainer from '../components/TodosContainer'
import NotificationsBox from '../components/NotificationsBox'

export default {
  name: 'TodoApp',
  components: {
    TodosListContainer,
    TodosContainer,
    NotificationsBox
  },
  created () {
    window.addEventListener('resize', this.checkLayout)
  },
  destroyed () {
    window.removeEventListener('resize', this.checkLayout)
  },
  data: function () {
    return {
      isWindowNarrow: window.outerWidth < 769,
      isTodoListsActive: true,
      isTodosActive: false
    }
  },
  methods: {
    checkLayout (e) {
      this.isWindowNarrow = e.target.outerWidth < 769
    },
    showTodos: function () {
      if (this.isWindowNarrow) {
        setTimeout(() => {
          this.isTodoListsActive = false
          this.isTodosActive = true
        }, 100)
      }
    },
    backToTodoListsView: function () {
      this.isTodoListsActive = true
      this.isTodosActive = false
    }
  }
}
</script>

<style lang="scss">
  #content {
    position: relative;
    display: flex;
    width: 60%;
    margin: auto;
    margin-top: 50px;

    .todo-lists-container {
      width: 370px;
    }

    .todos-container {
      box-sizing: border-box;
      padding-left: 30px;
      width: calc(100% - 370px);
    }

    .animation {
      animation-name: open;
      animation-duration: 0.3s;
      animation-iteration-count: 1;
      animation-direction: normal;
      animation-timing-function: ease-out;
      animation-fill-mode: forwards;
      animation-delay: 0s;
    }

    @keyframes open {
      0% {
        display: block;
        opacity: 0;
        visibility: hidden;
      }
      100% {
        display: block;
        opacity: 1;
        visibility: visible;
      }
    }

    .todo-lists-container-md-sm-active {
      width: 100%;
    }
    .todo-lists-container-md-sm-leave {
      display: none;
    }
    .todos-container-md-sm-active {
      width: 100%;
    }
    .todos-container-md-sm-leave {
      display: none;
    }
  }

  @media screen and (min-width: 1920px) {
    #content {
      width: 1150px;
    }
  }

  @media screen and (max-width: 1700px) {
    #content {
      width: 70%;
    }
  }

  @media screen and (max-width: 1450px) {
    #content {
      width: 85%;
    }
  }
  @media screen and (max-width: 1200px) {
    #content {
      width: 100%;
    }
  }
  @media screen and (max-width: 768px) {
    #content {
      .todos-container {
        padding: 0;
      }
    }
  }
</style>
