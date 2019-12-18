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
                v-validate="modelValidations.oldPassword"
                type="password"
                :error="getError($t('pages.change-password.input-actual'))"
                :name="$t('pages.change-password.input-actual')"
                :placeholder="$t('pages.change-password.input-actual')"
                maxlength="50"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Nova senha</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.newPassword"
                v-validate="modelValidations.newPassword"
                type="password"
                :error="getError($t('pages.change-password.input-password'))"
                :name="$t('pages.change-password.input-password')"
                :placeholder="$t('pages.change-password.input-password')"
                maxlength="50"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Confirmação da senha</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.newPasswordConfirm"
                v-validate="modelValidations.newPasswordConfirm"
                type="password"
                :error="getError($t('pages.change-password.input-confirm'))"
                :name="$t('pages.change-password.input-confirm')"
                :placeholder="$t('pages.change-password.input-confirm')"
                maxlength="50"
              ></base-input>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-link
                class="btn mt-3 btn-simple btn-primary"
                to="/categories"
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
      model: {
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
      },
      modelValidations: {
        oldPassword: {
          required: true,
          max: 50,
          min: 8
        },
        newPassword: {
          required: true,
          max: 50,
          min: 8
        },
        newPasswordConfirm: {
          required: true,
          max: 50,
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
        if (isValid) {
          self.submitLoading = true;
          self.changePass(self);
        }
      });
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
