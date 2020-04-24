<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Usuário</span
        ><span v-else>Editar Usuário</span>
      </h2>
      <div class="box-actions">
        <button
          @click="resendValidation"
          type="button"
          class="bt bt-square bg-white-2 c-orange"
        >
          <i class="icon-icon-send"></i>
        </button>
        <base-link to="/users" class="bt bt-square bg-white-2 c-light-blue">
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
              :error="customErrors.get('email')"
              label="E-mail"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row" v-if="viewAction === 'new'">
            <custom-input
              :required="true"
              v-model="emailConfirm"
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
              v-model="model.doc"
              type="text"
              name="doc"
              label="CPF"
              :error="customErrors.get('doc')"
              :inputMask="['###.###.###-##']"
              maxlength="50"
            ></custom-input>
            <div class="select-holder">
              <v-select
                :options="roles"
                :reduce="op => op.code"
                :key="model.roles"
                v-model="model.roles"
                placeholder="Papel"
                :class="{ 'has-error': customErrors.get('roles') }"
              >
              </v-select>
              <label v-if="customErrors.get('roles')" class="ias-error">{{
                customErrors.get('roles')
              }}</label>
            </div>
          </div>
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
              </v-select>
              <label v-if="customErrors.get('operation')" class="ias-error">{{
                customErrors.get('operation')
              }}</label>
            </div>
          </div>
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="operationPartners"
                :reduce="op => op.code"
                :key="model.idOperationPartner"
                v-model="model.idOperationPartner"
                placeholder="Empresa"
              >
              </v-select>
            </div>
            <custom-input
              v-model="model.phoneMobile"
              type="text"
              name="phoneMobile"
              label="Telefone"
              maxlength="50"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.phoneComercialMobile"
              type="text"
              name="phoneComercialMobile"
              label="Celular Comercial"
              maxlength="50"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
            <div class="phone-branch">
              <custom-input
                v-model="model.phoneComercial"
                type="text"
                name="phoneComercial"
                label="Telefone Comercial"
                maxlength="50"
                :inputMask="['(##) ####-####']"
              ></custom-input>
              <custom-input
                v-model="model.phoneComercialBranch"
                type="text"
                name="phone"
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
          <ias-image-upload
            @change="onImageChange"
            img-size="(100x100)"
            :src="model.picture"
          />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import userService from '../../services/User/userService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import helperService from '../../services/Helper/helperService';
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
      customErrors: new Map(),
      roles: [],
      image: null,
      emailConfirm: '',
      reg: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
      model: {
        id: 0,
        name: '',
        surname: '',
        doc: '',
        phoneComercial: '',
        phoneComercialBranch: '',
        phoneComercialMobile: '',
        phoneMobile: '',
        email: '',
        status: false,
        idOperation: null,
        idOperationPartner: null,
        roles: '',
        picture: ''
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
          this.model.roles == 'promoter' ||
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
    onImageChange(file) {
      this.image = file;
    },
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
      self.customErrors = new Map();

      if (!self.model.doc) self.customErrors.set('doc', 'Campo obrigatório');
      if (!self.model.name) self.customErrors.set('name', 'Campo obrigatório');
      else if (!self.model.name.length > 200)
        self.customErrors.set('name', 'Máximo 200 caracteres');
      if (!self.model.surname)
        self.customErrors.set('surname', 'Campo obrigatório');
      else if (!self.model.surname.length > 200)
        self.customErrors.set('surname', 'Máximo 200 caracteres');
      if (!self.model.email)
        self.customErrors.set('email', 'Campo obrigatório');
      else if (!self.reg.test(self.model.email))
        self.customErrors.set('email', 'E-mail inválido');
      else if (!self.model.email.length > 300)
        self.customErrors.set('email', 'Máximo 300 caracteres');
      if (self.viewAction === 'new') {
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
      }
      if (self.model.roles == null || self.model.roles === '')
        self.customErrors.set('roles', 'Campo obrigatorio');
      if (
        self.isRebens &&
        (self.model.roles === 'publisher' ||
          self.model.roles === 'administrator' ||
          self.model.roles == 'promoter' ||
          self.model.roles == 'partnerAdministrator' ||
          self.model.roles == 'partnerApprover') &&
        self.model.idOperation == null
      )
        self.customErrors.set('operation', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          helperService.uploadFile(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.submitLoading = false;
                return;
              }
              self.model.picture = response.data.url;
              self.saveUser(self);
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
        } else {
          self.saveUser(self);
        }
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

      if (self.isMaster) {
        self.roles.push({ code: 'master', label: 'Master' });
      }
      if (!self.isPartnerUser) {
        self.roles.push({ code: 'publisher', label: 'publisher' });
        self.roles.push({ code: 'administrator', label: 'Administrador' });
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
