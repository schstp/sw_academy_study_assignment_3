<template>
  <div class="add-button-wrapper">
    <img :src="`./${publicPath}/img/add-icon.png`" @click="callModalDialog">
    <span>{{ textContent }}</span>
  </div>
</template>

<script>
export default {
  name: 'AddButton',
  props: {
    textContent: {
      type: String
    }
  },
  data: function () {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    callModalDialog: function () {
      this.$emit('show-modal-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
  div {
    display: flex;
    align-items: center;

    img {
      cursor: pointer;
    }

    span {
      margin: 0 20px;
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 24px;
      line-height: 28px;
      color: #B2B2B2;
      user-select: none;
    }
  }
  @media screen and (max-width: 530px) {
    div {
      img {
        width: 30px;
        height: 30px;
      }

      span {
        font-size: 18px;
      }
    }
  }
</style>
