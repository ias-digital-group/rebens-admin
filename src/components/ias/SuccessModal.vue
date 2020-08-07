<template>
  <transition name="modal">
    <div class="modal-mask" v-show="show">
      <div class="modal-container">
        <img src="/img/icon-success.png" alt="Sucesso" />
        <p v-html="boxMessage"></p>
        <button class="bg-green bt-modal mt-24" @click="backToList">
          <span v-if="isProfileEdit">OK</span>
          <span v-else>IR PARA LISTAGEM</span>
        </button>
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
    boxMessage: {
      type: String,
      default: 'CADASTRO REALIZADO<br />COM SUCESSO!'
    },
    isProfileEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    backToList() {
      if (this.isProfileEdit) this.$router.push('/');
      else this.$router.push(this.link);
    }
  }
};
</script>
