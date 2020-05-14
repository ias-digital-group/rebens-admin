<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show">
      <div class="modal-container" @click.stop="close">
        <img src="/img/icon-success.png" alt="Sucesso" />
        <p v-if="isEdit">CADASTRO ATUALIZADO<br />COM SUCESSO!</p>
        <p v-else>CADASTRO REALIZADO<br />COM SUCESSO!</p>
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
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backToList() {
      this.$router.push(this.link);
    }
  }
};
</script>
