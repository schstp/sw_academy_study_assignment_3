<template>
  <span title="Удалить" @click.stop="showModalDialog"><img :src="`./${publicPath}/img/del-icon.png`"></span>
</template>

<script>
export default {
  name: 'DeleteButton',
  props: [],
  data: function () {
    return {
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    showModalDialog: function () {
      this.$emit('show-modal-dialog')
    }
  }
}
</script>

<style lang="scss" scoped>
  span {
    margin-left: 20px;
    cursor: pointer;

    img {
      padding: 2px;
      border: solid 1px #FFFFFF;
      border-radius: 3px;
    }

    img:hover {
      border: solid 1px #B2B2B2;
    }
  }
</style>
