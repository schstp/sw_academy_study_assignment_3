<template>
  <transition name="bounce">
    <div class="notifications-box-wrapper" v-if="isVisible">
      <p>{{ message }}</p>
    </div>
  </transition>
</template>

<script>
import store from '../store'

export default {
  name: 'NotificationsBox',
  computed: {
    isVisible: function () {
      return this.$store.state.notificationsBoxStatus.isShown
    },
    message: function () {
      return this.$store.state.notificationsBoxStatus.message
    }
  },
  watch: {
    isVisible: function (value) {
      if (value) {
        setTimeout(function () {
          store.state.notificationsBoxStatus = {
            isShown: false,
            message: ''
          }
        }, 2000)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .notifications-box-wrapper {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    width: 400px;
    height: 60px;
    background-color: #e7f1ff;
    border-radius: 5px;

    p {
      padding: 0 10px;
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 14px;
      line-height: 150%;
      color: #292929;
    }
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }
</style>
