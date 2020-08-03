<template>
  <div class="login-mask">
    <div class="modal-login" v-loading="fullscreenLoading">
      <img src="img/logo-login.png" alt />
      <form @submit.prevent>
        <div class="mt-24">
          <custom-input
            :required="true"
            v-model="credentials.email"
            type="text"
            name="email"
            label="Digite seu e-mail"
            maxlength="500"
            :error="errorEmail"
          ></custom-input>
        </div>
        <button class="bg-green bt-modal" @click="validate">ENVIAR</button>
        <div class="mt-8">
          <base-link class="bt-link" to="/Login"
            >Sei minha senha / Ir para o login</base-link
          >
        </div>
      </form>
    </div>
    <transition name="modal">
      <div class="modal-mask" v-show="show">
        <div class="modal-container">
          <img src="/img/icon-success.png" alt="Sucesso" />
          <h5>
            Enviamos um link com
            <br />as instruções para definir <br />uma nova senha.
          </h5>
          <base-link class="bg-green bt-modal" to="/Login"
            >IR PARA o LOGIN</base-link
          >
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import accountService from '../../services/Account/accountService';
import validate from '../../validate';
export default {
  data() {
    return {
      fullscreenLoading: false,
      credentials: {
        email: ''
      },
      errorEmail: '',
      show: false
    };
  },
  methods: {
    validate() {
      const self = this;
      self.errorEmail = '';

      if (!self.credentials.email || self.credentials.email === '')
        self.errorEmail = 'Campo obrigatório';
      else if (!validate.validateEmail(self.credentials.email))
        self.errorEmail = 'E-mail inválido';
      else if (!self.credentials.email.length > 500)
        self.errorEmail = 'Máximo 500 caracteres';

      if (self.errorEmail == '') {
        self.fullscreenLoading = true;
        accountService.rememberPassword(self.$data.credentials.email).then(
          () => {
            self.fullscreenLoading = false;
            self.show = true;
          },
          err => {
            const msg =
              err.response.status == 404
                ? err.response.data.message
                : err.message;
            self.$notify({
              type: 'danger',
              message: msg
            });
            self.fullscreenLoading = false;
          }
        );
      }
    }
  }
};
</script>
<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
