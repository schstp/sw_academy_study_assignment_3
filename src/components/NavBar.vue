<template>
  <div id="navbar">
    <div>{{ this.$store.state.user.login }}</div>
    <button class="sign-out-btn" @click="logout" title="Выйти">
      <img :src="`./${publicPath}/img/logout-icon.png`" alt="logout-icon" title="Выйти">
    </button>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data: function () {
    return {
      login: this.$store.state.user.login,
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    logout: function () {
      this.$store.state.isLogoutInProcess = true
    }
  }
}
</script>

<style lang="scss" scoped>
  #navbar {
    display: flex;
    width: 100%;
    height: 80px;
    align-items: center;
    justify-content: space-between;
    border: 1px solid #2596FF;
    border-radius: 10px;
    background-color: #FFFFFF;

    div {
      margin-left: 20px;
      font-family: Roboto, sans-serif;
      color: #292929;
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 28px;
      text-align: center;
    }

    .sign-out-btn {
      padding: 0;
      margin-right: 20px;
      background-color: #FFFFFF;
      border: none;
      outline: none;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 320px) {
    #navbar {

      .content-wrapper {
        width: 90%;
      }

      .navigation {
        width: 100%;
        justify-content: space-between;
      }
    }
  }
</style>
