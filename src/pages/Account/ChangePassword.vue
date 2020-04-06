<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.change-password.title')">
        <h4 slot="header" class="card-title">
          {{ $t('pages.change-password.title') }}
        </h4>
        <form class="form-horizontal" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Senha atual</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.oldPassword"
                type="password"
                :name="$t('pages.change-password.input-actual')"
                :placeholder="$t('pages.change-password.input-actual')"
                maxlength="50"
              ></base-input>
              <label
                v-show="customErrors.includes('oldPassword')"
                class="text-danger"
                >Este campo é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Nova senha</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.newPassword"
                type="password"
                :name="$t('pages.change-password.input-password')"
                :placeholder="$t('pages.change-password.input-password')"
                maxlength="50"
              ></base-input>
              <label
                v-show="customErrors.includes('newPassword')"
                class="text-danger"
                >Este campo é obrigatório!</label
              >
              <label
                v-show="customErrors.includes('NotMatch')"
                class="text-danger"
                >A nova senha e a confirmação devem ser iguais!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Confirmação da senha</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.newPasswordConfirm"
                type="password"
                :name="$t('pages.change-password.input-confirm')"
                :placeholder="$t('pages.change-password.input-confirm')"
                maxlength="50"
              ></base-input>
              <label
                v-show="customErrors.includes('newPasswordConfirm')"
                class="text-danger"
                >Este campo é obrigatório!</label
              >
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validate"
                :loading="submitLoading"
              >
                Salvar
              </base-button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import accountService from '../../services/Account/accountService';

export default {
  data() {
    return {
      submitLoading: false,
      customErrors: [],
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      self.customErrors = [];

      if (self.model.oldPassword === '') self.customErrors.push('oldPassword');
      if (self.model.newPassword === '') self.customErrors.push('newPassword');
      if (self.model.newPasswordConfirm === '')
        self.customErrors.push('newPasswordConfirm');
      if (
        self.model.newPassword !== '' &&
        self.model.newPasswordConfirm !== self.model.newPassword
      )
        self.customErrors.push('NotMatch');

      if (self.customErrors.length === 0) {
        self.submitLoading = true;
        self.changePass(self);
      }
    },
    changePass(vm) {
      vm = vm ? vm : this;
      accountService.changePassword(vm.model).then(
        () => {
          vm.$notify({
            type: 'primary',
            message: 'Senha alterada com sucesso!',
            icon: 'tim-icons icon-bell-55'
          });
          vm.submitLoading = false;
        },
        err => {
          vm.$notify({
            type: 'primary',
            message:
              err.response && err.response.data
                ? err.response.data.message
                : err.message,
            icon: 'tim-icons icon-bell-55'
          });
          vm.submitLoading = false;
        }
      );
    }
  }
};
</script>
