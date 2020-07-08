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
        <div class="mt-40">
          <custom-input
            :required="true"
            v-model="credentials.password"
            type="password"
            name="password"
            label="Digite sua senha"
            maxlength="50"
            :error="errorPassword"
          ></custom-input>
        </div>
        <div class="text-right mt-8">
          <base-link to="/passwordRecovery">Esqueci minha senha</base-link>
        </div>
      </form>
      <button class="bg-green bt-modal" @click="validate">ENTRAR</button>
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
        email: '',
        password: ''
      },
      errorEmail: '',
      errorPassword: ''
    };
  },
  methods: {
    validate() {
      const self = this;
      self.errorEmail = '';
      self.errorPassword = '';
      if (!self.credentials.email || self.credentials.email === '')
        self.errorEmail = 'Campo obrigatório';
      else if (!validate.validateEmail(self.credentials.email))
        self.errorEmail = 'E-mail inválido';
      else if (!self.credentials.email.length > 500)
        self.errorEmail = 'Máximo 500 caracteres';
      if (!self.credentials.password || self.credentials.password === '')
        self.errorPassword = 'Campo obrigatório';

      if (self.errorEmail == '' && self.errorPassword == '') {
        self.$data.fullscreenLoading = true;
        accountService
          .signin(self.$data.credentials.email, self.$data.credentials.password)
          .then(
            response => {
              if (response && response.authenticated) {
                self.$store.dispatch('setUser', response);
                const jwtData = JSON.parse(
                  atob(response.accessToken.split('.')[1])
                );
                if (jwtData.role === 'promoter') {
                  window.location = '/#/promoter';
                } else if (jwtData.role == 'partnerApprover') {
                  window.location = '/#/operationPartner/approve';
                } else {
                  window.location = '/';
                }
                return;
              }
              self.$data.fullscreenLoading = false;
              self.$notify({
                type: 'warning',
                message: response.message
              });
            },
            err => {
              if (err.response.status === 400 && err.response.data.message) {
                self.$notify({
                  type: 'warning',
                  message: err.response.data.message
                });
              } else {
                self.$notify({
                  type: 'danger',
                  message:
                    err.response.status == 404
                      ? err.response.data.message
                      : err.message
                });
              }
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
