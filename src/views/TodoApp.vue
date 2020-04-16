<template>
  <div id="content">
    <TodosListContainer class="todo-lists-container"></TodosListContainer>
    <TodosContainer class="todos-container"></TodosContainer>
  </div>
</template>

<script>
import TodosListContainer from '../components/TodosListContainer'
import TodosContainer from '../components/TodosContainer'

export default {
  name: 'TodoApp',
  components: {
    TodosListContainer,
    TodosContainer
  }
}
</script>

<style lang="scss">
  #content {
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
  }
</style>
