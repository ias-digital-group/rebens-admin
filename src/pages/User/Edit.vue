<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.users.title')">
        <h4 slot="header" class="card-title">{{ $t('pages.users.title') }}</h4>
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.name"
                type="text"
                name="name"
                placeholder="Nome"
                maxlength="300"
              ></base-input>
              <label v-show="customErrors.includes('name')" class="text-danger"
                >Este campo é obrigatório</label
              >
              <label
                v-show="customErrors.includes('name-length')"
                class="text-danger"
                >Este campo aceita no máximo 300 caracteres</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Email</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.email"
                type="email"
                name="email"
                placeholder="Email"
                maxlength="300"
              ></base-input>
              <label v-show="customErrors.includes('email')" class="text-danger"
                >Este campo é obrigatório</label
              >
              <label
                v-show="customErrors.includes('email-length')"
                class="text-danger"
                >Este campo aceite no máximo 300 caracteres</label
              >
              <label
                v-show="customErrors.includes('email-format')"
                class="text-danger"
                >O E-mail digitado não é válido</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Papel</label>
            <div class="col-md-3">
              <div class="form-group">
                <v-select
                  :options="roles"
                  :reduce="op => op.code"
                  :key="model.roles"
                  v-model="model.roles"
                ></v-select>
                <label
                  v-show="customErrors.includes('roles')"
                  class="text-danger"
                  >Este campo é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row" v-if="showOperations">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-3">
              <div class="form-group">
                <v-select
                  :options="operations"
                  :reduce="op => op.code"
                  :key="model.idOperation"
                  v-model="model.idOperation"
                ></v-select>
                <label
                  v-show="customErrors.includes('operation')"
                  class="text-danger"
                  >Este campo é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row" v-if="showOperationPartners">
            <label class="col-md-3 col-form-label">Parceiro da operação</label>
            <div class="col-md-3">
              <div class="form-group">
                <v-select
                  :options="operationPartners"
                  :reduce="op => op.code"
                  :key="model.idOperationPartner"
                  v-model="model.idOperationPartner"
                ></v-select>
                <label
                  v-show="customErrors.includes('operationPartner')"
                  class="text-danger"
                  >O campo Parceiro da Operação é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row" v-if="showPartners">
            <label class="col-md-3 col-form-label"
              >Parceiro de Benefícios</label
            >
            <div class="col-md-3">
              <div class="form-group">
                <v-select
                  :options="partners"
                  :reduce="op => op.code"
                  :key="model.idPartner"
                  v-model="model.idPartner"
                ></v-select>
                <label
                  v-show="customErrors.includes('partner')"
                  class="text-danger"
                  >O campo Parceiro de Benefícios é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label"></label>
            <div class="col-md-9">
              <div class="form-group">
                <base-checkbox v-model="model.active">Ativo</base-checkbox>
              </div>
            </div>
          </div>
          <div class="row">
            <div
              class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
            >
              <base-link class="btn mt-3 btn-simple btn-primary" to="/users"
                >Voltar</base-link
              >
              <base-button
                class="mt-3"
                native-type="button"
                type="info"
                @click="resendValidation"
                :loading="sendingLoading"
                >Reenviar o email de validação</base-button
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validate"
                :loading="submitLoading"
                >Salvar</base-button
              >
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import userService from '../../services/User/userService';
import partnerService from '../../services/Partner/partnerService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import _ from 'lodash';
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
      sendingLoading: false,
      isMaster: false,
      isRebens: false,
      isPartnerUser: false,
      customErrors: [],
      roles: [],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      model: {
        name: '',
        email: '',
        status: false,
        idOperation: null,
        idOperationPartner: null,
        idPartner: null,
        roles: ''
      },
      modelValidations: {
        name: {
          required: true,
          max: 300
        },
        email: {
          required: true,
          max: 300
        },
        roles: {
          required: true
        }
      },
      operations: [],
      operationPartners: [],
      partners: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_user' ? 'edit' : 'new';
    },
    showOperations() {
      return (
        (this.model.roles == 'administrator' ||
          this.model.roles == 'publisher' ||
          this.model.roles == 'promoter' ||
          this.model.roles == 'partnerAdministrator' ||
          this.model.roles == 'partnerApprover' ||
          this.model.roles == 'ticketChecker') &&
        this.isRebens &&
        !this.isPartnerUser
      );
    },
    showOperationPartners() {
      return (
        (this.model.roles == 'partnerAdministrator' ||
          this.model.roles == 'partnerApprover') &&
        !this.isPartnerUser &&
        this.operationPartners.length > 1
      );
    },
    showPartners() {
      return (
        this.model.roles == 'couponChecker' &&
        !this.isPartnerUser &&
        this.partners.length > 1
      );
    }
  },
  methods: {
    onOperationChange() {
      const self = this;
      if (self.isRebens) {
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
              self.operationPartners.push({ id: null, title: 'selecione' });
              _.each(response.data, function(el) {
                if (el.id != self.id) {
                  self.operationPartners.push({ id: el.id, title: el.name });
                }
              });
              self.selectLoading = false;
            },
            () => {
              self.selectLoading = false;
            }
          );
      }
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      self.customErrors = [];

      if (!self.model.name) self.customErrors.push('name');
      else if (!self.model.name.length > 300)
        self.customErrors.push('name-length');
      if (!self.model.email) self.customErrors.push('email');
      else if (!self.reg.test(self.model.email))
        self.customErrors.push('email-format');
      else if (!self.model.email.length > 300)
        self.customErrors.push('email-length');
      if (self.model.roles == '') self.customErrors.push('roles');
      if (
        self.isRebens &&
        (self.model.roles === 'publisher' ||
          self.model.roles === 'administrator' ||
          self.model.roles == 'promoter' ||
          self.model.roles == 'partnerAdministrator' ||
          self.model.roles == 'partnerApprover' ||
          self.model.roles == 'ticketChecker') &&
        self.model.idOperation == null
      )
        self.customErrors.push('operation');

      if (
        self.isRebens &&
        self.model.roles == 'couponChecker' &&
        self.model.idPartner == null
      )
        self.customErrors.push('partner');

      if (self.customErrors.length == 0) {
        self.submitLoading = true;
        self.saveUser(self);
      }
    },
    resendValidation() {
      const self = this;
      self.sendingLoading = true;
      userService.resendValidation(self.id).then(
        () => {
          self.$notify({
            type: 'success',
            message: 'E-mail reenviado com sucesso!',
            icon: 'tim-icons icon-bell-55'
          });
          self.sendingLoading = false;
        },
        () => {
          self.sendingLoading = false;
        }
      );
    },
    saveUser(vm) {
      vm = vm ? vm : this;
      if (!vm.isRebens) {
        vm.model.idOperation = vm.$store.getters.currentUser.idOperation;
      }
      if (vm.isPartnerUser) {
        vm.model.idOperationPartner =
          vm.$store.getters.currentUser.idOperationPartner;
      }
      if (vm.viewAction == 'new') {
        userService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'usuário cadastrado com sucesso!'
            });
            vm.$router.push('/users');
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'danger',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      } else {
        userService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message
            });
            vm.$router.push('/users');
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'danger',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;

      if (self.isMaster) {
        self.roles.push({ code: 'master', label: 'Master' });
      }
      if (!self.isPartnerUser) {
        self.roles.push({ code: 'publisher', label: 'publisher' });
        self.roles.push({ code: 'administrator', label: 'Administrador' });
        self.roles.push({ code: 'ticketChecker', label: 'Validador Ingresso' });
        self.roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
        if (self.isRebens) {
          self.roles.push({
            code: 'publisherRebens',
            label: 'Publicador Rebens'
          });
          self.roles.push({
            code: 'administratorRebens',
            label: 'Administrador Rebens'
          });
        }
      }
      self.roles.push({
        code: 'partnerAdministrator',
        label: 'Administrador Parceiro'
      });
      self.roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
      self.roles.push({ code: 'promoter', label: 'Promotor' });

      if (this.viewAction == 'edit') {
        this.formLoading = true;
        userService.get(self.id).then(
          response => {
            self.model = response.data;
            self.loadOperationPartner(self);
          },
          () => {
            self.formLoading = false;
          }
        );
      } else if (self.$store.getters.currentUser.idOperation > 0) {
        self.model.idOperation = self.$store.getters.currentUser.idOperation;
        self.loadOperationPartner(self);
      }

      this.selectLoading = true;
      operationService.findAll().then(
        response => {
          self.operations.push({ code: 0, label: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );

      this.loadPartners(self);
    },
    loadOperationPartner(self) {
      self.formLoading = true;
      if (!self.isPartnerUser) {
        let operationId = 0;
        if (self.isRebens) {
          if (
            self.model.roles == 'partnerAdministrator' ||
            self.model.roles == 'partnerApprover'
          ) {
            operationId = self.model.idOperation;
          }
        } else {
          operationId = self.$store.getters.currentUser.idOperation;
        }
        if (operationId > 0) {
          operationPartnerService
            .findAll({
              page: 0,
              pageItems: 1000,
              searchWord: '',
              sort: 'name ASC',
              idOperation: operationId
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
        } else {
          self.formLoading = false;
        }
      } else {
        self.formLoading = false;
      }
    },
    loadPartners(self) {
      self.formLoading = true;
      partnerService
        .findAll({
          page: 0,
          pageItems: 1000,
          searchWord: '',
          sort: 'name ASC',
          active: true,
          type: 1
        })
        .then(
          response => {
            self.partners.push({ code: 0, label: 'selecione' });
            _.each(response.data, function(el) {
              if (el.id != self.id) {
                self.partners.push({
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
  created() {
    this.isMaster = this.$store.getters.currentUser.role == 'master';
    this.isPartnerUser =
      this.$store.getters.currentUser.role == 'partnerAdministrator';
    this.isRebens =
      this.$store.getters.currentUser.role == 'administratorRebens' ||
      this.$store.getters.currentUser.role == 'master';
    this.fetchData();
  }
};
</script>
