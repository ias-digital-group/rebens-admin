<template>
  <div class="container">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <form @submit.prevent>
        <card class="card-login card-white">
          <template slot="header">
            <img src="img/card-primary.png" alt="" />
            
          </template>

          <div>
            <base-input
              required
              v-model="credentials.email"
              v-validate="modelValidations.email"
              :error="getError($t('pages.login.input-email'))"
              :name="$t('pages.login.input-email')"
              type="email"
              :placeholder="$t('pages.login.input-email')" 
            >
            </base-input>
            <base-input 
              :placeholder="$t('pages.login.input-password')" 
              required
              :name="$t('pages.login.input-password')"
              v-model="credentials.password"
              v-validate="modelValidations.password"
              :error="getError($t('pages.login.input-password'))"
              type="password">
            </base-input>
          </div>

          <div slot="footer">
            <base-button 
              type="primary" 
              class="mb-3" 
              size="lg" 
              native-type="submit"
              @click.native.prevent="validate"
              :loading="fullscreenLoading"
              block>
              {{$t('pages.login.signin-button')}}
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
        email: '',
        password: ''
      },
      modelValidations: {
        email: {
          required: true,
          email: true
        },
        password: {
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
        //R3bens#123
        if (isValid) {
          accountService
            .signin(
              self.$data.credentials.email,
              self.$data.credentials.password
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
                const msg = err.response.status == 404 ? err.response.data.message : err.message;
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
  }
};
</script>
<style>
.navbar-nav .nav-item p {
  line-height: inherit;
  margin-left: 5px;
}
</style>
