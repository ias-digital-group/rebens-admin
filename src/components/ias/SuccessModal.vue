<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show">
      <div class="modal-container" @click.stop="close">
        <img src="/img/icon-success.png" alt="Sucesso" />
        <p>CADASTRO REALIZADO<br />COM SUCESSO!</p>
        <button @click="backToList">IR PARA LISTAGEM</button>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: 'success-modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    link: {
      type: String,
      default: ''
    }
  },
  methods: {
    backToList() {
      this.$router.push(this.link);
    }
  }
};
</script>
