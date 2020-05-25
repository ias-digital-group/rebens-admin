<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show">
      <div class="modal-container">
        <img src="/img/icon-success.png" alt="Sucesso" />
        <p v-if="isEdit">
          CADASTRO SALVO
          <br />COM SUCESSO!
        </p>
        <p v-else>
          CADASTRO REALIZADO
          <br />COM SUCESSO!
        </p>
        <button class="bg-green" @click="backToList">IR PARA LISTAGEM</button>
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
