<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Parceiro</span>
        <span v-else>Editar Parceiro</span>
      </h2>
      <div class="box-actions">
        <base-link to="/partner" class="bt bt-square bg-white-2 c-light-blue">
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
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.companyName"
              type="text"
              name="companyName"
              label="Razão Social"
              :error="customErrors.get('companyName')"
              maxlength="300"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.cnpj"
              type="text"
              name="cnpj"
              label="CNPJ"
              :inputMask="['##.###.###/####-##']"
              :error="customErrors.get('cnpj')"
              maxlength="50"
            ></custom-input>
            <div class="select-holder">
              <v-select
                :options="types"
                :reduce="op => op.code"
                :key="model.type"
                v-model="model.type"
                placeholder="Tipo"
                :class="{ 'has-error': customErrors.get('type') }"
              >
                <span slot="no-options">Nenhum Tipo encontrado</span>
              </v-select>
              <label
                v-if="customErrors.get('type')"
                class="ias-error"
              >{{ customErrors.get('type') }}</label>
            </div>
          </div>
          <ias-address
            ref="ias-address"
            :customErrors="customErrors"
            :address.sync="model.mainAddress"
          ></ias-address>
          <div class="ias-row-editor">
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.description"
              placeholder="Descrição"
            />
            <label v-show="customErrors.get('description')" class="text-danger">Campo obrigatório!</label>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.mainContact.name"
              type="text"
              name="contactName"
              label="Nome Responsável"
              :error="customErrors.get('contactName')"
              maxlength="200"
            ></custom-input>
            <custom-input
              v-model="model.mainContact.surname"
              type="text"
              name="contactSurname"
              label="Sobrenome Responsável"
              :error="customErrors.get('contactSurname')"
              maxlength="200"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.mainContact.email"
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
              v-model="model.mainContact.jobTitle"
              type="text"
              name="contactJobTitle"
              label="Cargo"
              :error="customErrors.get('contactJobTitle')"
              maxlength="400"
            ></custom-input>
            <custom-input
              v-model="model.mainContact.phone"
              type="text"
              name="contactPhone"
              label="Telefone"
              :error="customErrors.get('contactPhone')"
              maxlength="50"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.mainContact.cellPhone"
              type="text"
              name="contactMobile"
              label="Celular Comercial"
              maxlength="50"
              :error="customErrors.get('contactMobile')"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
            <div class="phone-branch">
              <custom-input
                v-model="model.mainContact.comercialPhone"
                type="text"
                name="contactComercialPhone"
                label="Telefone Comercial"
                maxlength="50"
                :inputMask="['(##) ####-####']"
              ></custom-input>
              <custom-input
                v-model="model.mainContact.comercialPhoneBranch"
                type="text"
                name="contactComercialPhoneBranch"
                label="Ramal"
                maxlength="50"
              ></custom-input>
            </div>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button class="bt bg-green c-white" type="button" @click.prevent="validate">
                <span v-if="viewAction === 'new'">Cadastrar</span>
                <span v-else>Salvar</span>
              </button>
              <ias-checkbox v-model="model.active">Ativo</ias-checkbox>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <ias-image-upload @change="onImageChange" img-size="(360x360)" :src="model.picture" />
        </div>
      </form>
    </div>
    <success-modal :isEdit="viewAction !== 'new'" :show="showSuccessModal" link="/partner"></success-modal>
  </div>
</template>
<script>
import { SuccessModal, Address } from 'src/components';
import partnerService from '../../services/Partner/partnerService';
// import helperService from '../../services/Helper/helperService';
import config from '../../config';

export default {
  components: {
    SuccessModal,
    [Address.name]: Address
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
      parentList: [],
      showSuccessModal: false,
      level: 'root',
      types: [
        { code: 1, label: 'Benefícios' },
        { code: 2, label: 'Cursos Livres' }
      ],
      model: {
        id: 0,
        name: '',
        companyName: '',
        cnpj: null,
        active: true,
        logo: '',
        description: '',
        type: 1,
        idMainAddress: null,
        idMainContact: null,
        customErrors: new Map(),
        customToolbar: [],
        stateList: [],
        mainContact: {
          id: 0,
          name: '',
          surname: '',
          email: '',
          jobTitle: '',
          phone: null,
          cellPhone: null,
          comercialPhone: null,
          comercialPhoneBranch: null
        },
        mainAddress: {
          id: 0,
          name: '',
          street: '',
          number: '',
          complement: null,
          neighborhood: '',
          city: '',
          state: '',
          country: 'Brasil',
          zipcode: '',
          latitude: null,
          longitude: null
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_partner' ? 'edit' : 'new';
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.name || self.model.name === '')
        self.customErrors.set('name', 'Campo obrigatório');
      if (!self.model.type || self.model.type === '')
        self.customErrors.set('type', 'Campo obrigatório');
      if (!self.model.companyName || self.model.companyName === '')
        self.customErrors.set('companyName', 'Campo obrigatório');
      if (!self.model.cnpj || self.model.cnpj === '')
        self.customErrors.set('cnpj', 'Campo obrigatório');
      if (!self.model.description || self.model.description === '')
        self.customErrors.set('description', 'Campo obrigatório');

      if (
        !self.model.mainAddress.zipcode ||
        self.model.mainAddress.zipcode === ''
      )
        self.customErrors.set('zipcode', 'Campo obrigatório');
      if (
        !self.model.mainAddress.street ||
        self.model.mainAddress.street === ''
      )
        self.customErrors.set('street', 'Campo obrigatório');
      if (
        !self.model.mainAddress.number ||
        self.model.mainAddress.number === ''
      )
        self.customErrors.set('number', 'Campo obrigatório');
      if (
        !self.model.mainAddress.neighborhood ||
        self.model.mainAddress.neighborhood === ''
      )
        self.customErrors.set('neighborhood', 'Campo obrigatório');
      if (!self.model.mainAddress.city || self.model.mainAddress.city === '')
        self.customErrors.set('city', 'Campo obrigatório');
      if (!self.model.mainAddress.state || self.model.mainAddress.state === '')
        self.customErrors.set('state', 'Campo obrigatório');

      if (!self.model.mainContact.name || self.model.mainContact.name === '')
        self.customErrors.set('contactName', 'Campo obrigatório');
      if (
        !self.model.mainContact.surname ||
        self.model.mainContact.surname === ''
      )
        self.customErrors.set('contactSurname', 'Campo obrigatório');
      if (!self.model.mainContact.email || self.model.mainContact.email === '')
        self.customErrors.set('contactEmail', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        self.savePartner(self);
      }
    },
    savePartner(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        partnerService.create(vm.model).then(
          res => {
            vm.id = res.id;
            vm.submitLoading = false;
            vm.showSuccessModal = true;
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
        partnerService.update(vm.model).then(
          () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
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
      self.customToolbar = config.customToolbar;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        partnerService.get(self.id).then(
          response => {
            self.model = response.data;
            if (!self.model.mainContact) {
              self.model.mainContact = {
                id: 0,
                name: '',
                surname: '',
                email: '',
                jobTitle: '',
                phone: null,
                cellPhone: null,
                comercialPhone: null,
                comercialPhoneBranch: null
              };
            }
            if (!self.model.mainAddress) {
              self.model.mainAddress = {
                id: 0,
                name: '',
                street: '',
                number: '',
                complement: null,
                neighborhood: '',
                city: '',
                state: '',
                country: 'Brasil',
                zipcode: '',
                latitude: null,
                longitude: null
              };
            }
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
    },
    validateCnpj(cnpj) {
      cnpj = cnpj.replace(/[^\d]+/g, '');
      if (cnpj == '') return false;
      if (cnpj.length != 14) return false;

      if (
        cnpj == '00000000000000' ||
        cnpj == '11111111111111' ||
        cnpj == '22222222222222' ||
        cnpj == '33333333333333' ||
        cnpj == '44444444444444' ||
        cnpj == '55555555555555' ||
        cnpj == '66666666666666' ||
        cnpj == '77777777777777' ||
        cnpj == '88888888888888' ||
        cnpj == '99999999999999'
      )
        return false;

      let size = cnpj.length - 2;
      let numbers = cnpj.substring(0, size);
      let digits = cnpj.substring(size);
      let sum = 0;
      let pos = size - 7;
      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result != digits.charAt(0)) return false;
      size = size + 1;
      numbers = cnpj.substring(0, size);
      sum = 0;
      pos = size - 7;
      for (let i = size; i >= 1; i--) {
        sum += numbers.charAt(size - i) * pos--;
        if (pos < 2) pos = 9;
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result != digits.charAt(1)) return false;

      return true;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
