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
              <label v-show="customErros.includes('name')" class="text-danger"
                >O campo Nome é obrigatório</label
              >
              <label
                v-show="customErros.includes('name-length')"
                class="text-danger"
                >O campo Nome possui um limite de 300 caracteres</label
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
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Papel</label>
            <div class="col-md-3">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Papel"
                  v-model="model.roles"
                  v-loading.lock="selectLoading"
                  v-validate="modelValidations.roles"
                  lock
                >
                  <el-option
                    v-show="isMaster"
                    class="select-primary"
                    value="master"
                    label="Master"
                  ></el-option>
                  <el-option
                    v-show="!isPartnerUser"
                    class="select-primary"
                    value="publisher"
                    label="Publicador"
                  ></el-option>
                  <el-option
                    v-show="!isPartnerUser"
                    class="select-primary"
                    value="administrator"
                    label="Administrador"
                  ></el-option>
                  <el-option
                    v-show="isRebens && !isPartnerUser"
                    class="select-primary"
                    value="publisherRebens"
                    label="Publicador Rebens"
                  ></el-option>
                  <el-option
                    v-show="isRebens && !isPartnerUser"
                    class="select-primary"
                    value="administratorRebens"
                    label="Administrador Rebens"
                  ></el-option>
                  <el-option
                    class="select-primary"
                    value="partnerAdministrator"
                    label="Administrador Parceiro"
                  ></el-option>
                  <el-option
                    class="select-primary"
                    value="partnerApprover"
                    label="Aprovador Parceiro"
                  ></el-option>
                </el-select>
                <label
                  v-show="customErros.includes('roles')"
                  class="text-danger"
                  >O campo Papel é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row" v-if="showOperations">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-3">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Operação"
                  v-model="model.idOperation"
                  v-loading.lock="selectLoading"
                  @change="onOperationChange()"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in operations"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('operation')"
                  class="text-danger"
                  >O campo Operação é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row" v-if="showOperationPartners">
            <label class="col-md-3 col-form-label">Parceiro da operação</label>
            <div class="col-md-3">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Parceiro da operação"
                  v-model="model.idOperationPartner"
                  v-loading.lock="selectLoading"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in operationPartners"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('operationPartner')"
                  class="text-danger"
                  >O campo Parceiro da Operação é obrigatório</label
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
              >
                Reenviar o email de validação
              </base-button>
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
import { Select, Option } from 'element-ui';
import userService from '../../services/User/userService';
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
      customErros: [],
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      model: {
        name: '',
        email: '',
        status: false,
        idOperation: null,
        idOperationPartner: null,
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
      operationPartners: []
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
          this.model.roles == 'partnerAdministrator' ||
          this.model.roles == 'partnerApprover') &&
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
      self.customErros = [];

      if (!self.model.name) self.customErros.push('name');
      else if (!self.model.name.length > 300)
        self.customErros.push('name-length');
      if (!self.model.email) self.customErros.push('email');
      else if (!self.reg.test(self.model.email))
        self.customErros.push('email-format');
      else if (!self.model.email.length > 300)
        self.customErros.push('email-length');
      if (self.model.roles == '') self.customErros.push('roles');
      if (
        self.isRebens &&
        (self.model.roles === 'publisher' ||
          self.model.roles === 'administrator' ||
          self.model.roles == 'partnerAdministrator' ||
          self.model.roles == 'partnerApprover') &&
        self.model.idOperation == null
      )
        self.customErros.push('operation');

      this.$validator.validateAll().then(isValid => {
        if (isValid && self.customErros.length == 0) {
          self.submitLoading = true;
          self.saveUser(self);
        }
      });
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
              message: 'usuário cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/users');
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      } else {
        userService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/users');
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;

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
          self.operations.push({ id: null, title: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ id: el.id, title: el.title });
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
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
                self.operationPartners.push({ id: null, title: 'selecione' });
                _.each(response.data, function(el) {
                  if (el.id != self.id) {
                    self.operationPartners.push({ id: el.id, title: el.name });
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
