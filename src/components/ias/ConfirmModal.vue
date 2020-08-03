<template>
  <div class="modal-mask" v-show="show">
    <div class="modal-container">
      <h4 v-html="question"></h4>
      <div class="btns-actions mt-24">
        <button class="bt-modal c-dark-gray" @click="closeModal">
          Cancelar
        </button>
        <button class="bg-green bt-modal" @click="confirm">Confirmar</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'confirm-modal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    question: {
      type: String,
      default: ''
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    closeModal() {
      this.$emit('closeModal');
    }
  }
};
</script>
