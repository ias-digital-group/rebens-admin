<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span>Cadastro Cliente</span>
      </h2>
      <div class="box-actions">
        <base-link to="/customers" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card" v-loading="formLoading">
      <form @submit.prevent>
        <div class="form-left">
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="operations"
                :reduce="op => op.code"
                :key="model.idOperation"
                v-model="model.idOperation"
                :class="{ 'has-error': customErrors.get('operation') }"
                placeholder="Clube"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
              <label v-if="customErrors.get('operation')" class="ias-error">{{
                customErrors.get('operation')
              }}</label>
            </div>
            <div class="select-holder">
              <v-select
                :options="operationPartners"
                :reduce="op => op.code"
                :key="model.idOperationPartner"
                v-model="model.idOperationPartner"
                placeholder="Empresa / Parceiro"
              >
                <span slot="no-options">Nenhuma empresa encontrada</span>
              </v-select>
            </div>
          </div>
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
              :error="customErrors.get('email')"
              label="E-mail"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="emailConfirm"
              @paste.prevent
              type="text"
              name="emailConfirm"
              :error="customErrors.get('email-confirm')"
              label="Confirmação E-mail"
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
              :error="customErrors.get('cpf')"
              :inputMask="['###.###.###-##']"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.cellphone"
              type="text"
              name="cellphone"
              label="Celular"
              maxlength="50"
              :inputMask="['(##) #####-####']"
            ></custom-input>
            <custom-input
              v-model="model.phone"
              type="text"
              name="phone"
              label="Telefone"
              maxlength="50"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                <span>Cadastrar</span>
              </button>

              <ias-checkbox v-model="model.active">Ativo</ias-checkbox>
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
      link="/customers"
    ></success-modal>
  </div>
</template>
<script>
import customerService from '../../services/Customer/customerService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import { SuccessModal } from 'src/components';
import validate from '../../validate';
import _ from 'lodash';
export default {
  components: {
    SuccessModal
  },
  props: {
    removeText: {
      type: String,
      default: 'Remove'
    }
  },
  data() {
    return {
      formLoading: false,
      showSuccessModal: false,
      customErrors: new Map(),
      emailConfirm: '',
      model: {
        id: 0,
        name: '',
        surname: '',
        idOperation: null,
        gender: null,
        birthday: null,
        email: '',
        idAddress: '',
        cpf: '',
        rg: null,
        phone: null,
        cellphone: null,
        picture: null,
        customerType: 0,
        status: 0,
        active: false,
        address: null,
        idOperationPartner: null
      },
      operations: [],
      operationPartners: []
    };
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();

      if (!self.model.cpf) self.customErrors.set('cpf', 'Campo obrigatório');
      else if (!validate.validateCpf(self.model.cpf))
        self.customErrors.set('cpf', 'CPF inválido!');
      if (!self.model.email)
        self.customErrors.set('email', 'Campo obrigatório');
      else if (!validate.validateEmail(self.model.email))
        self.customErrors.set('email', 'E-mail inválido');
      else if (!self.model.email.length > 300)
        self.customErrors.set('email', 'Máximo 300 caracteres');
      if (!self.emailConfirm)
        self.customErrors.set('email-confirm', 'Campo obrigatório');
      else if (!self.reg.test(self.emailConfirm))
        self.customErrors.set('email-confirm', 'E-mail inválido');
      else if (!self.emailConfirm.length > 300)
        self.customErrors.set('email-confirm', 'Máximo 300 caracteres');
      else if (self.emailConfirm !== self.model.email)
        self.customErrors.set(
          'email-confirm',
          'Este campo deve ser igual ao E-mail'
        );
      if (self.model.idOperation == null)
        self.customErrors.set('operation', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.formLoading = true;
        self.saveCustomer(self);
      }
    },
    saveCustomer() {
      const self = this;
      customerService.create(self.model).then(
        () => {
          self.formLoading = false;
          self.showSuccessModal = true;
        },
        err => {
          if (err.response.status == 400 && err.response.data) {
            self.$notify({
              type: 'danger',
              message: err.response.data.message
            });
          } else {
            self.$notify({
              type: 'danger',
              message: err.message
            });
          }
          self.formLoading = false;
        }
      );
    },
    fetchData() {
      const self = this;

      self.operations = [];
      operationService.findAll().then(
        response => {
          self.operations.push({ code: 0, label: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
            }
          });
        },
        () => {}
      );
    },
    loadOperationPartner() {
      const self = this;
      self.formLoading = true;
      self.operationPartners = [];
      operationPartnerService
        .findAll({
          page: 0,
          pageItems: 1000,
          searchWord: '',
          sort: 'name ASC',
          idOperation: self.model.idOperation
        })
        .then(
          response => {
            self.operationPartners.push({ code: 0, label: 'selecione' });
            _.each(response.data, function(el) {
              if (el.id != self.id) {
                self.operationPartners.push({
                  code: el.id,
                  label: el.name
                });
              }
            });
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
    }
  },
  watch: {
    'model.idOperation': function() {
      this.loadOperationPartner();
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
