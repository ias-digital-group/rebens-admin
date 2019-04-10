<template>
  <div class="container">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <form @submit.prevent>
        <card class="card-login card-white">
          <template slot="header">
            <img src="img/logo-login.png" alt="" />
          </template>
          <p style="text-align:center">Crie sua senha, para validar seu cadastro!</p>
          <hr>
          <div>
            <base-input 
              placeholder="Senha" 
              required
              name="password"
              v-model="credentials.password"
              v-validate="modelValidations.password"
              type="password">
            </base-input>
            <base-input 
              placeholder="Confirmação da senha" 
              required
              name="passwordConfirm"
              v-model="credentials.passwordConfirm"
              v-validate="modelValidations.passwordConfirm"
              type="password">
            </base-input>
          </div>

          <div slot="footer">
            <base-button 
              type="info" 
              class="mb-3" 
              size="lg" 
              native-type="submit"
              @click.native.prevent="validate"
              :loading="fullscreenLoading"
              block>
              Validar
            </base-button>
          </div>
        </card>
      </form>
    </div>
  </div>
</template>
<script>
import accountService from '../../services/Account/accountService';
export default {
  data() {
    return {
      fullscreenLoading: false,
      credentials: {
        code: '',
        passwordConfirm: '',
        password: ''
      },
      modelValidations: {
        password: {
          required: true,
          min: 8
        },
        passwordConfirm: {
          required: true,
          min: 8
        }
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      this.$data.fullscreenLoading = true;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
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
                  window.location = '/';
                  return;
                }
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
        } else {
          this.$data.fullscreenLoading = false;
        }
      });
    }
  },
  created() {
    if(this.$route.query.c)
    {
      this.credentials.code = this.$route.query.c;
    }
    else{
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
