<template>
  <div>
    <div class="modal-mask" v-show="show">
      <div class="modal-container">
        <span @click="closeModal" class="bt-remove">
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M17.6777 14.8492L14.1421 11.3137L17.6777 7.77817C18.0666 7.38927 18.0666 6.75287 17.6777 6.36396L16.2635 4.94975C15.8746 4.56084 15.2382 4.56084 14.8493 4.94975L11.3137 8.48528L7.77819 4.94975C7.38928 4.56084 6.75288 4.56084 6.36397 4.94975L4.94976 6.36396C4.56085 6.75287 4.56085 7.38927 4.94976 7.77817L8.48529 11.3137L4.94976 14.8492C4.56085 15.2382 4.56085 15.8745 4.94976 16.2635L6.36397 17.6777C6.75288 18.0666 7.38928 18.0666 7.77819 17.6777L11.3137 14.1421L14.8493 17.6777C15.2382 18.0666 15.8746 18.0666 16.2635 17.6777L17.6777 16.2635C18.0666 15.8745 18.0666 15.2382 17.6777 14.8492Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect
                  x="11.3137"
                  width="16"
                  height="16"
                  transform="rotate(45 11.3137 0)"
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>
        </span>
        <h4>
          DESEJA
          <br />REALMENTE EXCLUIR
        </h4>
        <p class="c-red">{{ itemName }}</p>
        <div class="mtb-40">
          <custom-input
            :required="true"
            v-model="confirm"
            type="text"
            name="confirm"
            label="Digite DELETE para confirmar"
            maxlength="200"
            :error="errorMsg"
          ></custom-input>
        </div>
        <button class="bg-red bt-modal" @click="deleteItem">EXCLUIR</button>
      </div>
    </div>
    <div class="modal-mask" v-show="showSuccess">
      <div class="modal-container">
        <img src="/img/icon-success.png" alt="Sucesso" />
        <p>
          ITEM EXCLUIDO
          <br />COM SUCESSO!
        </p>
        <button class="bg-green bt-modal" @click="closeSuccess">
          IR PARA LISTAGEM
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'delete-modal',
  data() {
    return {
      confirm: '',
      hasError: false,
      errorMsg: ''
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    showSuccess: {
      type: Boolean,
      default: false
    },
    itemName: {
      type: String,
      default: ''
    }
  },
  methods: {
    deleteItem() {
      this.hasError = false;
      this.errorMsg = '';
      if (this.confirm === '') {
        this.hasError = true;
        this.errorMsg = 'Campo obrigatório';
      } else if (this.confirm !== 'DELETE') {
        this.hasError = true;
        this.errorMsg = 'Campo inválido';
      } else {
        this.$emit('confirmDelete', true);
        this.confirm = '';
      }
    },
    closeSuccess() {
      this.$emit('closeDeleteSuccess');
    },
    closeModal() {
      this.$emit('confirmDelete', false);
    }
  }
};
</script>
