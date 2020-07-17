<template>
  <div class="edit-box" v-loading="submitLoading">
    <div class="page-header">
      <h2>Alterar Senha</h2>
      <div class="box-actions">
        <base-link to="/users" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form @submit.prevent>
        <div class="form-left">
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.oldPassword"
              type="password"
              name="password"
              label="Senha Atual"
              :error="customErrors.get('password')"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.newPassword"
              type="password"
              name="newPassword"
              label="Nova Senha"
              :error="customErrors.get('newPassword')"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.newPasswordConfirm"
              type="password"
              name="newPasswordConfirm"
              label="Confirmação Senha"
              :error="customErrors.get('confirm')"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                Salvar
              </button>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right"></div>
      </form>
    </div>
  </div>
</template>
<script>
import accountService from '../../services/Account/accountService';

export default {
  data() {
    return {
      submitLoading: false,
      customErrors: new Map(),
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
    };
  },
  computed: {
    backUrl() {
      let ret = '/';
      if (this.$store.getters.currentUser.role === 'ticketChecker') {
        ret += 'orders';
      } else if (this.$store.getters.currentUser.role === 'promoter') {
        ret += 'promoter';
      } else if (this.$store.getters.currentUser.role === 'partnerApprover') {
        ret += 'operationPartner/approve';
      } else if (this.$store.getters.currentUser.role === 'couponChecker') {
        ret += 'benefits/validation';
      }
      return ret;
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();

      if (self.model.oldPassword === '')
        self.customErrors.set('password', 'Campo obrigatório');
      if (self.model.newPassword === '')
        self.customErrors.set('newPassword', 'Campo obrigatório');
      if (self.model.newPasswordConfirm === '')
        self.customErrors.set('confirm', 'Campo obrigatório');
      if (
        self.model.newPassword !== '' &&
        self.model.newPasswordConfirm !== self.model.newPassword
      ) {
        self.customErrors.set(
          'newPassword',
          'A nova senha e a confirmação devem ser iguais.'
        );
        self.customErrors.set(
          'confirm',
          'A nova senha e a confirmação devem ser iguais.'
        );
      }
      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        self.changePass(self);
      }
    },
    changePass(vm) {
      vm = vm ? vm : this;
      accountService.changePassword(vm.model).then(
        () => {
          vm.$notify({
            type: 'success',
            message: 'Senha alterada com sucesso!'
          });
          vm.submitLoading = false;
        },
        err => {
          vm.$notify({
            type: 'primary',
            message:
              err.response && err.response.data
                ? err.response.data.message
                : err.message
          });
          vm.submitLoading = false;
        }
      );
    }
  }
};
</script>
