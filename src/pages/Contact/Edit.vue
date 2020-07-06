<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Contato</span>
        <span v-else>Editar Contato</span>
      </h2>
      <div class="box-actions">
        <base-link to="/contact" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="submitLoading" @submit.prevent>
        <div class="form-left">
          <div class="ias-row" v-if="viewAction === 'new'">
            <div class="select-holder">
              <v-select
                :options="types"
                :reduce="op => op.code"
                :key="model.type"
                v-model="model.type"
                placeholder="Tipo de Contato"
                :class="{ 'has-error': customErrors.get('type') }"
              >
                <span slot="no-options">Nenhum Tipo encontrado</span>
              </v-select>
              <label v-if="customErrors.get('type')" class="ias-error">{{
                customErrors.get('type')
              }}</label>
            </div>
          </div>
          <div class="ias-row" v-if="model.type === 22 && viewAction === 'new'">
            <div class="select-holder">
              <v-select
                :options="operations"
                :reduce="op => op.code"
                :key="model.idItem"
                v-model="model.idItem"
                placeholder="Clube"
                :class="{ 'has-error': customErrors.get('idItem') }"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
              <label v-if="customErrors.get('idItem')" class="ias-error">{{
                customErrors.get('idItem')
              }}</label>
            </div>
          </div>
          <div class="ias-row" v-if="model.type === 23 && viewAction === 'new'">
            <div class="select-holder">
              <v-select
                :options="partners"
                :reduce="op => op.code"
                :key="model.idItem"
                v-model="model.idItem"
                placeholder="Parceiro"
                :class="{ 'has-error': customErrors.get('idItem') }"
              >
                <span slot="no-options">Nenhum Parceiro encontrado</span>
              </v-select>
              <label v-if="customErrors.get('idItem')" class="ias-error">{{
                customErrors.get('idItem')
              }}</label>
            </div>
          </div>
          <div class="ias-row" v-if="model.type === 31 && viewAction === 'new'">
            <div class="select-holder">
              <v-select
                :options="companies"
                :reduce="op => op.code"
                :key="model.idItem"
                v-model="model.idItem"
                placeholder="Empresa"
                :class="{ 'has-error': customErrors.get('idItem') }"
              >
                <span slot="no-options">Nenhuma Empresa encontrada</span>
              </v-select>
              <label v-if="customErrors.get('idItem')" class="ias-error">{{
                customErrors.get('idItem')
              }}</label>
            </div>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.name"
              type="text"
              name="contactName"
              label="Nome"
              :error="customErrors.get('contactName')"
              maxlength="200"
            ></custom-input>
            <custom-input
              v-model="model.surname"
              type="text"
              name="contactSurname"
              label="Sobrenome"
              :error="customErrors.get('contactSurname')"
              maxlength="200"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.email"
              type="email"
              name="contactEmail"
              label="E-mail"
              :error="customErrors.get('contactEmail')"
              maxlength="800"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.jobTitle"
              type="text"
              name="contactJobTitle"
              label="Cargo"
              :error="customErrors.get('contactJobTitle')"
              maxlength="400"
            ></custom-input>
            <custom-input
              v-model="model.phone"
              type="text"
              name="contactPhone"
              label="Telefone"
              :error="customErrors.get('phone')"
              maxlength="50"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.cellPhone"
              type="text"
              name="contactMobile"
              label="Celular Comercial"
              maxlength="50"
              :error="customErrors.get('phone')"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
            <div class="phone-branch">
              <custom-input
                v-model="model.comercialPhone"
                type="text"
                name="contactComercialPhone"
                label="Telefone Comercial"
                :error="customErrors.get('phone')"
                maxlength="50"
                :inputMask="['(##) ####-####']"
              ></custom-input>
              <custom-input
                v-model="model.comercialPhoneBranch"
                type="text"
                name="contactComercialPhoneBranch"
                label="Ramal"
                maxlength="50"
              ></custom-input>
            </div>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                <span v-if="viewAction === 'new'">Cadastrar</span>
                <span v-else>Salvar</span>
              </button>
              <ias-checkbox v-model="model.active">Ativo</ias-checkbox>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <div class="right-img-holder">
            <img :src="imageRight" :alt="altImageRight" />
          </div>
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/contact"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal, Modal } from 'src/components';
import companyService from '../../services/Company/companyService';
import operationService from '../../services/Operation/operationService';
import partnerService from '../../services/Partner/partnerService';
import contactService from '../../services/Contact/contactService';
import config from '../../config';
import validate from '../../validate';
import _ from 'lodash';

export default {
  components: {
    SuccessModal,
    Modal
  },
  props: {
    id: String,
    removeText: {
      type: String,
      default: 'Remove'
    }
  },
  watch: {
    'model.idItem': function(value) {
      if (value > 0) {
        if (this.model.type === 22) {
          const op = this.operations.filter(o => o.code === value);
          if (op && op.length > 0) {
            this.imageRight = op[0].img;
            this.altImageRight = op[0].label;
          }
        } else if (this.model.type === 23) {
          const part = this.partners.filter(o => o.code === value);
          if (part && part.length > 0) {
            this.imageRight = part[0].img;
            this.altImageRight = part[0].label;
          }
        } else {
          this.imageRight = '/img/img-holder.png';
          this.altImageRight = '';
        }
      }
    },
    'model.type': function() {
      if (this.viewAction === 'new') this.model.idItem = 0;
    }
  },
  data() {
    return {
      selectLoading: false,
      submitLoading: false,
      customErrors: new Map(),
      showSuccessModal: false,
      operations: [],
      partners: [],
      companies: [],
      imageRight: '/img/img-holder.png',
      altImageRight: '',
      types: [
        { code: 22, label: 'Clube' },
        { code: 23, label: 'Parceiro' },
        { code: 31, label: 'Empresa' }
      ],
      model: {
        id: 0,
        name: '',
        surname: '',
        email: '',
        jobTitle: '',
        phone: null,
        cellPhone: null,
        comercialPhone: null,
        comercialPhoneBranch: null,
        active: true,
        type: 0,
        idItem: 0
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_contact' ? 'edit' : 'new';
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.type || self.model.type === '' || self.model.type === 0)
        self.customErrors.set('type', 'Campo obrigatório');
      if (
        !self.model.idItem ||
        self.model.idItem === '' ||
        self.model.idItem === 0
      )
        self.customErrors.set('idItem', 'Campo obrigatório');

      if (!self.model.name || self.model.name === '')
        self.customErrors.set('contactName', 'Campo obrigatório');
      if (!self.model.surname || self.model.surname === '')
        self.customErrors.set('contactSurname', 'Campo obrigatório');
      if (!self.model.email || self.model.email === '')
        self.customErrors.set('contactEmail', 'Campo obrigatório');
      else if (!validate.validateEmail(self.model.email))
        self.customErrors.set('contactEmail', 'E-mail inválido');
      if (!self.model.jobTitle || self.model.jobTitle === '')
        self.customErrors.set('contactJobTitle', 'Campo obrigatório');
      if (
        (!self.model.phone || self.model.phone === '') &&
        (!self.model.cellPhone || self.model.cellPhone === '') &&
        (!self.model.comercialPhone || self.model.comercialPhone === '')
      )
        self.customErrors.set('phone', 'Preencha pelo menos um telefone');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        self.saveContact(self);
      }
    },
    async saveContact(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        contactService.create(vm.model).then(
          async res => {
            vm.id = res.id;
            vm.submitLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400 && err.response.data) {
              if (err.response.data.title) {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.title
                });
              } else {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.message
                });
              }
            } else {
              vm.$notify({
                type: 'danger',
                message: err.message
              });
            }
            vm.submitLoading = false;
          }
        );
      } else {
        contactService.update(vm.model).then(
          async () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400 && err.response.data) {
              if (err.response.data.title) {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.title
                });
              } else {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.message
                });
              }
            } else {
              vm.$notify({
                type: 'danger',
                message: err.message
              });
            }
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      self.loadItems();
      if (this.viewAction == 'edit') {
        this.submitLoading = true;
        contactService.get(self.id).then(
          response => {
            self.model = response.data;
            self.submitLoading = false;
          },
          () => {
            self.submitLoading = false;
          }
        );
      }
    },
    loadItems() {
      const self = this;

      operationService
        .findAll({
          page: 0,
          pageItems: 100,
          searchWord: '',
          sort: 'name ASC',
          active: true
        })
        .then(
          response => {
            self.operations.push({ code: 0, label: 'selecione' });
            _.each(response.data, function(el) {
              self.operations.push({
                code: el.id,
                label: el.title,
                img: el.image
              });

              if (
                self.viewAction === 'edit' &&
                self.model.type === 22 &&
                el.id === self.model.idItem
              ) {
                self.imageRight = el.logo;
                self.altImageRight = el.title;
              }
            });
            self.selectLoading = false;
          },
          () => {
            self.selectLoading = false;
          }
        );

      partnerService
        .findAll({
          page: 0,
          pageItems: 100,
          searchWord: '',
          sort: 'name ASC',
          active: true,
          type: ''
        })
        .then(
          response => {
            self.partners.push({ code: 0, label: 'selecione' });
            _.each(response.data, function(el) {
              self.partners.push({
                code: el.id,
                label: el.name,
                img: el.logo
              });
              if (
                self.viewAction === 'edit' &&
                self.model.type === 23 &&
                el.id === self.model.idItem
              ) {
                self.imageRight = el.logo;
                self.altImageRight = el.name;
              }
            });
          },
          () => {
            self.$data.loading = false;
          }
        );

      companyService
        .findAll({
          page: 0,
          pageItems: 100,
          searchWord: '',
          sort: 'name ASC',
          active: true,
          type: '',
          idItem: '',
          idOperation: '',
          idPartner: ''
        })
        .then(
          response => {
            self.companies.push({ code: 0, label: 'selecione' });
            _.each(response.data, function(el) {
              self.companies.push({
                code: el.id,
                label: el.name
              });
            });
          },
          () => {
            self.$data.loading = false;
          }
        );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
