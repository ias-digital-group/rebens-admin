<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Pré-cadastro">
        <h4 slot="header" class="card-title">Cliente</h4>
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-4">
              <base-input
                required
                v-model="model.name"
                type="text"
                name="nome"
                placeholder="Nome"
                maxlength="150"
              ></base-input>
              <label v-show="customErros.includes('name')" class="text-danger"
                >O campo Nome é obrigatório</label
              >
              <label
                v-show="customErros.includes('name-length')"
                class="text-danger"
                >O campo Nome possui um limite de 300 caracteres</label
              >
            </div>
            <div class="col-md-4">
              <base-input
                required
                v-model="model.surname"
                type="text"
                name="surname"
                placeholder="Sobrenome"
                maxlength="150"
              ></base-input>
              <label
                v-show="customErros.includes('surname')"
                class="text-danger"
                >O campo Sobrenome é obrigatório</label
              >
              <label
                v-show="customErros.includes('surname-length')"
                class="text-danger"
                >O campo Sobrenome possui um limite de 300 caracteres</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">CPF</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.cpf"
                type="text"
                name="cpf"
                placeholder="CPF"
                :inputMask="['###.###.###-##']"
                maxlength="50"
              ></base-input>
              <label v-show="customErros.includes('cpf')" class="text-danger"
                >O campo CPF é obrigatório</label
              >
              <label
                v-show="customErros.includes('cpf-registered')"
                class="text-danger"
                >O CPF digitado já está cadastrado em nossa base</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">E-mail</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.email"
                type="email"
                name="email1"
                placeholder="email"
                maxlength="500"
              ></base-input>
              <label v-show="customErros.includes('email')" class="text-danger"
                >O campo E-mail é obrigatório</label
              >
              <label
                v-show="customErros.includes('email-length')"
                class="text-danger"
                >O campo E-mail possui um limite de 300 caracteres</label
              >
              <label
                v-show="customErros.includes('email-format')"
                class="text-danger"
                >O E-mail digitado não é válido</label
              >
              <label
                v-show="customErros.includes('email-registered')"
                class="text-danger"
                >O E-mail digitado já está cadastrado em nossa base</label
              >
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/promoter"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateCustomer"
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
import { Select, Option } from 'element-ui';
import promoterService from '../../services/Promoter/promoterService';
export default {
  components: {
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
      customErros: [],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      model: {
        name: '',
        surname: '',
        cpf: '',
        email: null
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateCustomer() {
      const self = this;
      self.customErros = [];
      if (!self.model.name || self.model.name === '')
        self.customErros.push('name');
      else if (self.model.name.length > 150)
        self.customErros.push('name-length');
      if (!self.model.surname || self.model.surname === '')
        self.customErros.push('surname');
      else if (self.model.surname.length > 150)
        self.customErros.push('surname-length');
      if (!self.model.cpf || self.model.cpf === '')
        self.customErros.push('cpf');
      if (!self.model.email || self.model.email === '')
        self.customErros.push('email');
      else if (!self.reg.test(self.model.email))
        self.customErros.push('email-format');
      else if (!self.model.email.length > 300)
        self.customErros.push('email-length');

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.submitLoading = true;
          self.saveCustomer(self);
        }
      });
    },
    clearForm() {
      const self = this;
      self.model.name = '';
      self.model.cpf = '';
      self.model.email = '';
    },
    saveCustomer() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          promoterService.create(self.model).then(
            response => {
              if (response.status === 'ok') {
                self.$notify({
                  type: 'primary',
                  message: response
                    ? response.message
                    : 'Cliente cadastrado com sucesso.',
                  icon: 'tim-icons icon-bell-55'
                });
                self.clearForm();
                self.submitLoading = false;
                self.$router.push('/promoter');
              } else if (response.status === 'cpf-registered') {
                self.customErros.push('cpf-registered');
                self.submitLoading = false;
              } else if (response.status === 'email-registered') {
                self.customErros.push('email-registered');
                self.submitLoading = false;
              } else {
                self.$notify({
                  type: 'danger',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.submitLoading = false;
              }
            },
            err => {
              self.$notify({
                type: 'primary',
                message: err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.submitLoading = false;
            }
          );
        }
      });
    }
  }
};
</script>
