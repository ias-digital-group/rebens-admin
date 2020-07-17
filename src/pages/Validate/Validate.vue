<template>
  <div class="login-mask">
    <div class="modal-login" v-loading="formLoading">
      <img src="img/logo-login.png" alt />
      <form @submit.prevent>
        <h5>
          crie sua senha!
          <br />para validar seu cadastro.
        </h5>
        <div class="mt-24">
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
        <div class="mt-24">
          <custom-input
            :required="true"
            v-model="credentials.passwordConfirm"
            type="password"
            name="password"
            label="Digite sua confirmação de senha"
            maxlength="50"
            :error="errorConfirm"
          ></custom-input>
        </div>
        <button class="bg-green bt-modal" @click="validate">VALIDAR</button>
      </form>
    </div>
  </div>
</template>
<script>
import accountService from '../../services/Account/accountService';
export default {
  data() {
    return {
      formLoading: false,
      credentials: {
        code: '',
        passwordConfirm: '',
        password: ''
      },
      errorPassword: '',
      errorConfirm: ''
    };
  },
  methods: {
    validate() {
      const self = this;
      self.errorConfirm = '';
      self.errorPassword = '';
      if (!self.credentials.password || self.credentials.password === '')
        self.errorPassword = 'Campo obrigatório';
      else if (!self.credentials.password.length > 50)
        self.errorPassword = 'Máximo 50 caracteres';
      if (
        !self.credentials.passwordConfirm ||
        self.credentials.passwordConfirm === ''
      )
        self.errorConfirm = 'Campo obrigatório';
      else if (self.credentials.passwordConfirm !== self.credentials.password)
        self.errorConfirm = self.errorPassword =
          'A senha e a confirmação devem ser iguais';

      if (self.errorConfirm == '' && self.errorPassword == '') {
        self.$data.formLoading = true;
        accountService
          .validate(
            self.$data.credentials.code,
            self.$data.credentials.password,
            self.$data.credentials.passwordConfirm
          )
          .then(
            response => {
              if (response && response.authenticated) {
                self.$store.dispatch('setUser', response);
                const jwtData = JSON.parse(
                  atob(response.accessToken.split('.')[1])
                );
                setTimeout(() => {
                  if (jwtData.role === 'promoter') {
                    self.$router.push(`/promoter`);
                  } else if (jwtData.role == 'partnerApprover') {
                    self.$router.push(`/operationPartner/approve`);
                  } else {
                    window.location = '/';
                  }
                }, 500);
                return;
              }
              self.$data.formLoading = false;
              self.$notify({
                type: 'warning',
                message: response.message
              });
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
              self.$data.formLoading = false;
            }
          );
      }
    }
  },
  created() {
    if (this.$route.query.c) {
      this.credentials.code = this.$route.query.c;
    } else {
      window.location = '/';
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
