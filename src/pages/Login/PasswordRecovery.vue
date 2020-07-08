<template>
  <div class="login-mask">
    <div class="modal-login">
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
          <base-link to="/Login">Sei minha senha / Ir para o login</base-link>
        </div>
      </form>
    </div>
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
      errorEmail: ''
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
        self.$data.fullscreenLoading = true;
        accountService.rememberPassword(self.$data.credentials.email).then(
          response => {
            self.$data.fullscreenLoading = false;
            self.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
          },
          err => {
            const msg =
              err.response.status == 404
                ? err.response.data.message
                : err.message;
            self.$notify({
              type: 'primary',
              message: msg,
              icon: 'tim-icons icon-bell-55'
            });
            self.$data.fullscreenLoading = false;
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
