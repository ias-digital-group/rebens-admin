<template>
  <div class="container">
    <div class="col-lg-4 col-md-6 ml-auto mr-auto">
      <form @submit.prevent>
        <card class="card-login card-white">
          <template slot="header">
            <img src="img/logo-login2.png" alt="" />
            
          </template>

          <div>
            <base-input
              required
              v-model="credentials.email"
              v-validate="modelValidations.email"
              :error="getError('email')"
              name="email"
              type="email"
              placeholder="Email" 
            >
            </base-input>
            <base-input 
              placeholder="Password" 
              required
              name="password"
              v-model="credentials.password"
              v-validate="modelValidations.password"
              :error="getError('password')"
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
                if (
                  response.data.message == null &&
                  response.data.extra &&
                  response.data.extra.token &&
                  response.data.extra.token.authenticated
                ) {
                  self.$auth.saveUser(response.data);
                  self.$router.push('/');
                  return;
                }
                self.$notify({
                  type: 'primary',
                  message: response.data.message,
                  icon: 'tim-icons icon-bell-55'
                });
              },
              err => {
                self.$notify({
                  type: 'primary',
                  message: err,
                  icon: 'tim-icons icon-bell-55'
                });
              }
            );
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
