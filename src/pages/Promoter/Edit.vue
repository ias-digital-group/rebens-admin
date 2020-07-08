<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>Cadastro Cliente</h2>
      <div class="box-actions">
        <base-link to="/promoter" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="formLoading" @submit.prevent>
        <div class="form-left">
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.name"
              type="text"
              name="name"
              label="Nome"
              :error="customErrors.get('name')"
              maxlength="200"
            ></custom-input>
            <custom-input
              :required="true"
              v-model="model.surname"
              type="text"
              name="surname"
              label="Sobrenome"
              :error="customErrors.get('surname')"
              maxlength="200"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.email"
              type="text"
              name="email"
              label="E-mail"
              :error="customErrors.get('email')"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.cpf"
              type="text"
              name="cpf"
              label="CPF"
              :inputMask="['###.###.###-##']"
              :error="customErrors.get('cpf')"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validateCustomer"
              >
                Cadastrar
              </button>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right"></div>
      </form>
    </div>
    <success-modal
      :isEdit="false"
      :show="showSuccessModal"
      link="/promoter"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal } from 'src/components';
import { Select, Option } from 'element-ui';
import promoterService from '../../services/Promoter/promoterService';
import validate from '../../validate';
export default {
  components: {
    SuccessModal,
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    id: String,
    removeText: {
      type: String,
      default: 'Remove'
    }
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      customErrors: new Map(),
      showSuccessModal: false,
      model: {
        name: '',
        surname: '',
        cpf: '',
        email: null
      }
    };
  },
  methods: {
    validateCustomer() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.name || self.model.name === '')
        self.customErrors.set('name', 'Campo obrigatório');
      else if (self.model.name.length > 150)
        self.customErrors.set('name', 'Máximo 150 caracteres');
      if (!self.model.surname || self.model.surname === '')
        self.customErrors.set('surname', 'Campo obrigatório');
      else if (self.model.surname.length > 150)
        self.customErrors.set('surname', 'Máximo 150 caracteres');
      if (!self.model.cpf || self.model.cpf === '')
        self.customErrors.set('cpf', 'Campo obrigatório');
      else if (!validate.validateCpf(self.model.cpf))
        self.customErrors.set('cpf', 'CPF inválido!');
      if (!self.model.email || self.model.email === '')
        self.customErrors.set('email', 'Campo obrigatório');
      else if (!validate.validateEmail(self.model.email))
        self.customErrors.set('email', 'E-mail inválido');
      else if (!self.model.email.length > 300)
        self.customErrors.set('email', 'Máximo 150 caracteres');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        self.saveCustomer(self);
      }
    },
    clearForm() {
      const self = this;
      self.model.name = '';
      self.model.cpf = '';
      self.model.email = '';
      self.customErrors = new Map();
    },
    saveCustomer() {
      const self = this;
      promoterService.create(self.model).then(
        response => {
          if (response.status === 'ok') {
            self.clearForm();
            self.submitLoading = false;
            self.showSuccessModal = true;
          } else if (response.status === 'cpf-registered') {
            self.customErrors.set(
              'cpf',
              'Este cpf já está cadastrado em nossa base'
            );
            self.submitLoading = false;
          } else if (response.status === 'email-registered') {
            self.customErrors.set(
              'email',
              'Este email já está cadastrado em nossa base'
            );
            self.submitLoading = false;
          } else {
            self.$notify({
              type: 'warning',
              message: response.message
            });
            self.submitLoading = false;
          }
        },
        err => {
          self.$notify({
            type: 'danger',
            message: err.message
          });
          self.submitLoading = false;
        }
      );
    }
  }
};
</script>
