<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Usuário</span>
        <span v-else>Editar Usuário</span>
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
    <div class="ias-card" v-loading="formLoading">
      <form @submit.prevent>
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
              :disabled="viewAction !== 'new'"
            ></custom-input>
          </div>
          <div class="ias-row" v-if="viewAction === 'new'">
            <custom-input
              :required="true"
              v-model="emailConfirm"
              type="text"
              name="emailConfirm"
              @paste.prevent
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
              :disabled="viewAction !== 'new'"
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
                <span slot="no-options">Nenhum papel encontrado</span>
              </v-select>
              <label v-if="customErrors.get('roles')" class="ias-error">{{
                customErrors.get('roles')
              }}</label>
            </div>
          </div>
          <div class="ias-row" v-show="isRebens">
            <div class="select-holder">
              <v-select
                :options="operations"
                :reduce="op => op.code"
                :key="model.idOperation"
                v-model="model.idOperation"
                :class="{ 'has-error': customErrors.get('operation') }"
                :placeholder="blockOperations ? 'Todos' : 'Clube'"
                :disabled="blockOperations"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
              <label v-if="customErrors.get('operation')" class="ias-error">{{
                customErrors.get('operation')
              }}</label>
            </div>
          </div>
          <div class="ias-row">
            <div class="select-holder" v-if="model.roles === 'couponChecker'">
              <v-select
                :options="partners"
                :reduce="op => op.code"
                :key="model.idPartner"
                v-model="model.idPartner"
                :placeholder="blockOperationPartners ? 'Todas' : 'Empresa'"
                :disabled="blockOperationPartners"
              >
                <span slot="no-options">Nenhuma empresa encontrada</span>
              </v-select>
            </div>
            <div class="select-holder" v-else-if="showOperationPartners">
              <v-select
                :options="operationPartners"
                :reduce="op => op.code"
                :key="model.idOperationPartner"
                v-model="model.idOperationPartner"
                :placeholder="blockOperationPartners ? 'Todas' : 'Empresa'"
                :disabled="blockOperationPartners"
              >
                <span slot="no-options">Nenhuma empresa encontrada</span>
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
            <custom-input
              v-model="model.phoneComercialMobile"
              type="text"
              name="phoneComercialMobile"
              label="Celular Comercial"
              maxlength="50"
              v-show="!showOperationPartners"
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
              v-show="showOperationPartners"
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
            <div class="div-spacer" v-show="!showOperationPartners"></div>
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
            img-size="(360x360)"
            :src="model.picture"
          />
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/users"
    ></success-modal>
  </div>
</template>
<script>
import userService from '../../services/User/userService';
import partnerService from '../../services/Partner/partnerService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import helperService from '../../services/Helper/helperService';
import { SuccessModal } from 'src/components';
import validate from '../../validate';
import _ from 'lodash';

export default {
  components: {
    SuccessModal
  },
  props: {
    id: String,
    removeText: {
      type: String,
      default: 'Remove'
    }
  },
  watch: {
    'model.roles': function(value) {
      if (
        value === 'master' ||
        value === 'publisherRebens' ||
        value === 'administratorRebens'
      ) {
        this.model.idOperation = null;
        this.model.idOperationPartner = null;
      }
    },
    'model.idOperation': function() {
      const self = this;
      if (self.isRebens) {
        if (self.model.roles === 'couponChecker') self.loadPartners(self);
        else if (
          self.model.roles === 'partnerAdministrator' ||
          self.model.roles === 'partnerApprover'
        )
          self.loadOperationPartner(self);
      }
    }
  },
  data() {
    return {
      formLoading: false,
      isMaster: false,
      isRebens: false,
      isPartnerUser: false,
      showSuccessModal: false,
      customErrors: new Map(),
      showOperationPartners: true,
      roles: [],
      image: null,
      emailConfirm: '',
      idCompany: 0,
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
        idPartner: null,
        idOperationPartner: null,
        roles: '',
        picture: ''
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
    blockOperations() {
      return (
        this.model.roles == 'publisherRebens' ||
        this.model.roles == 'administratorRebens' ||
        this.model.roles == 'master'
      );
    },
    blockOperationPartners() {
      return (
        this.model.roles == 'publisher' ||
        this.model.roles == 'publisherRebens' ||
        this.model.roles == 'administrator' ||
        this.model.roles == 'administratorRebens' ||
        this.model.roles == 'promoter' ||
        this.model.roles == 'ticketChecker' ||
        this.model.roles == 'master'
      );
    }
  },
  methods: {
    onImageChange(file) {
      this.image = file;
      if (file == null) {
        this.model.picture = file;
      }
    },
    validate() {
      const self = this;
      self.customErrors = new Map();

      if (!self.model.doc) self.customErrors.set('doc', 'Campo obrigatório');
      else if (!validate.validateCpf(self.model.doc))
        self.customErrors.set('doc', 'CPF inválido!');
      if (!self.model.name) self.customErrors.set('name', 'Campo obrigatório');
      else if (!self.model.name.length > 200)
        self.customErrors.set('name', 'Máximo 200 caracteres');
      if (!self.model.surname)
        self.customErrors.set('surname', 'Campo obrigatório');
      else if (!self.model.surname.length > 200)
        self.customErrors.set('surname', 'Máximo 200 caracteres');
      if (!self.model.email)
        self.customErrors.set('email', 'Campo obrigatório');
      else if (!validate.validateEmail(self.model.email))
        self.customErrors.set('email', 'E-mail inválido');
      else if (!self.model.email.length > 300)
        self.customErrors.set('email', 'Máximo 300 caracteres');
      if (self.viewAction === 'new') {
        if (!self.emailConfirm)
          self.customErrors.set('email-confirm', 'Campo obrigatório');
        else if (!validate.validateEmail(self.emailConfirm))
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
          self.model.roles == 'partnerApprover' ||
          self.model.roles == 'ticketChecker') &&
        self.model.idOperation == null
      )
        self.customErrors.set('operation', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.formLoading = true;
        if (self.image) {
          helperService.uploadImage(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'danger',
                  message: response.message
                });
                self.formLoading = false;
                return;
              }
              self.model.picture = response.data.url;
              self.saveUser(self);
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.formLoading = false;
            }
          );
        } else {
          self.saveUser(self);
        }
      }
    },
    resendValidation() {
      const self = this;
      self.formLoading = true;
      userService.resendValidation(self.id).then(
        () => {
          self.$notify({
            type: 'success',
            message: 'E-mail reenviado com sucesso!'
          });
          self.formLoading = false;
        },
        () => {
          self.formLoading = false;
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
            vm.formLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400 && err.response.data.message) {
              vm.$notify({
                type: 'warning',
                message: err.response.data.message
              });
            } else {
              vm.$notify({
                type: 'danger',
                message: err.message
              });
            }
            vm.formLoading = false;
          }
        );
      } else {
        userService.update(vm.model).then(
          () => {
            vm.formLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            vm.$notify({
              type: 'danger',
              message: err.message
            });
            vm.formLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;

      if (self.$store.getters.currentUser.role === 'ticketChecker')
        self.roles.push({ code: 'ticketChecker', label: 'Validador Ingresso' });
      else if (self.$store.getters.currentUser.role === 'couponChecker')
        self.roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
      else if (self.$store.getters.currentUser.role === 'promoter')
        self.roles.push({ code: 'promoter', label: 'Promotor' });
      else if (self.$store.getters.currentUser.role === 'partnerApprover')
        self.roles.push({
          code: 'partnerApprover',
          label: 'Aprovador Parceiro'
        });
      else if (self.$store.getters.currentUser.role === 'publisher')
        self.roles.push({ code: 'publisher', label: 'Publicador' });
      else if (
        self.$store.getters.currentUser.role === 'partnerAdministrator'
      ) {
        self.model.idOperation = self.$store.getters.currentUser.idOperation;
        self.model.idPartner = self.$store.getters.currentUser.idPartner;
        self.model.idOperationPartner =
          self.$store.getters.currentUser.idOperationPartner;
        self.showOperationPartners = false;
        self.roles.push({
          code: 'partnerAdministrator',
          label: 'Administrador Parceiro'
        });
        self.roles.push({
          code: 'partnerApprover',
          label: 'Aprovador Parceiro'
        });
      } else {
        if (self.isMaster) {
          self.roles.push({ code: 'master', label: 'Master' });
        }
        if (!self.isPartnerUser) {
          self.roles.push({ code: 'publisher', label: 'Publicador' });
          self.roles.push({ code: 'administrator', label: 'Administrador' });
          self.roles.push({
            code: 'ticketChecker',
            label: 'Validador Ingresso'
          });
          self.roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
          if (self.isRebens) {
            // self.roles.push({
            //   code: 'publisherRebens',
            //   label: 'Publicador Rebens'
            // });
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
        self.roles.push({
          code: 'partnerApprover',
          label: 'Aprovador Parceiro'
        });
        if (
          self.isRebens ||
          (self.$store.getters.currentUser.modules &&
            self.$store.getters.currentUser.modules.include('promoter'))
        )
          self.roles.push({ code: 'promoter', label: 'Promotor' });

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

        this.loadPartners(self);
      }

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
    },
    loadOperationPartner(self) {
      self.formLoading = true;
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
