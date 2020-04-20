<template>
  <span title="Редактировать" @click.stop="showModalDialog"><img :src="`./${publicPath}/img/edit-icon.png`"></span>
</template>

<script>
export default {
  name: 'EditButton',
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
    cursor: pointer;

    img {
      padding: 2px;
      border: solid 1px transparent;
      border-radius: 3px;
    }

    img:hover {
      border: solid 1px #B2B2B2;
    }
  }
  @media screen and (max-width: 530px){
    img {
      width: 16px;
      height: 16px;
    }
  }
</style>
