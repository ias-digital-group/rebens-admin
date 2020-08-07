<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>Editar Cliente</h2>
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
                :disabled="!isRebens"
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
              v-model="model.cpf"
              type="text"
              name="cpf"
              label="CPF"
              :error="customErrors.get('cpf')"
              :inputMask="['###.###.###-##']"
              maxlength="50"
            ></custom-input>
            <custom-input
              :required="true"
              v-model="model.rg"
              type="text"
              name="rg"
              label="RG"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              label="Data Nascimento (DD/MM/AAAA)"
              :class="{
                'ias-focus': model.birthday != null && model.birthday != ''
              }"
              :error="customErrors.get('birthday')"
            >
              <el-date-picker
                type="date"
                name="birthday"
                data-vv-name="birthday"
                v-model="model.birthday"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </custom-input>
            <div class="opts-holder">
              <ias-radio v-model="model.gender" name="M" value="M"
                >Masculino</ias-radio
              >
              <ias-radio v-model="model.gender" name="F" value="F"
                >Feminino</ias-radio
              >
            </div>
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
            <custom-input
              v-model="model.address.zipcode"
              type="text"
              name="zipcode"
              label="CEP"
              maxlength="9"
              :inputMask="['#####-###']"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.address.street"
              type="text"
              name="street"
              label="Endereço"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.address.number"
              type="text"
              name="number"
              label="Número"
              maxlength="100"
            ></custom-input>
            <custom-input
              v-model="model.address.complement"
              type="text"
              name="complement"
              label="Complemento"
              maxlength="100"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              v-model="model.address.neighborhood"
              type="text"
              name="neighborhood"
              label="Bairro"
              maxlength="400"
            ></custom-input>
            <custom-input
              v-model="model.address.city"
              type="text"
              name="city"
              label="Cidade"
              maxlength="400"
            ></custom-input>
          </div>
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="stateList"
                :reduce="op => op.code"
                :key="model.address.state"
                v-model="model.address.state"
                placeholder="Estado"
              >
                <span slot="no-options">Nenhum Estado encontrado</span>
              </v-select>
            </div>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                Salvar
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
      boxMessage="CADASTRO SALVO<br />COM SUCESSO!"
      :show="showSuccessModal"
      link="/customers"
    ></success-modal>
  </div>
</template>
<script>
import { DatePicker } from 'element-ui';
import helperService from '../../services/Helper/helperService';
import customerService from '../../services/Customer/customerService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import { SuccessModal } from 'src/components';
import validate from '../../validate';
import _ from 'lodash';

export default {
  components: {
    SuccessModal,
    [DatePicker.name]: DatePicker
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
      formLoading: false,
      showSuccessModal: false,
      customErrors: new Map(),
      isRebens: false,
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
        address: {
          id: 0,
          name: '',
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          country: 'Brasil',
          zipcode: '',
          latitude: null,
          longitude: null
        },
        idOperationPartner: null
      },
      operations: [],
      operationPartners: [],
      stateList: [
        { code: 'AC', label: 'Acre' },
        { code: 'AL', label: 'Alagoas' },
        { code: 'AP', label: 'Amapá' },
        { code: 'AM', label: 'Amazonas' },
        { code: 'BA', label: 'Bahia' },
        { code: 'CE', label: 'Ceará' },
        { code: 'DF', label: 'Distrito Federal' },
        { code: 'ES', label: 'Espírito Santo' },
        { code: 'GO', label: 'Goiás' },
        { code: 'MA', label: 'Maranhão' },
        { code: 'MT', label: 'Mato Grosso' },
        { code: 'MS', label: 'Mato Grosso do Sul' },
        { code: 'MG', label: 'Minas Gerais' },
        { code: 'PA', label: 'Pará' },
        { code: 'PB', label: 'Paraíba' },
        { code: 'PR', label: 'Paraná' },
        { code: 'PE', label: 'Pernambuco' },
        { code: 'PI', label: 'Piauí' },
        { code: 'RJ', label: 'Rio de Janeiro' },
        { code: 'RN', label: 'Rio Grande do Norte' },
        { code: 'RO', label: 'Rondônia' },
        { code: 'RR', label: 'Roraima' },
        { code: 'RS', label: 'Rio Grande do Sul' },
        { code: 'SC', label: 'Santa Catarina' },
        { code: 'SP', label: 'São Paulo' },
        { code: 'SE', label: 'Sergipe' },
        { code: 'TO', label: 'Tocantins' }
      ]
    };
  },
  watch: {
    'model.address.zipcode': function(value) {
      if (value && value.length == 8) {
        this.getAddressData(value);
      }
    },
    'model.idOperation': function() {
      this.loadOperationPartner();
    }
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
      if (self.model.idOperation == null)
        self.customErrors.set('operation', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.formLoading = true;
        self.saveCustomer(self);
      }
    },
    saveCustomer() {
      const self = this;
      customerService.update(self.model).then(
        () => {
          self.formLoading = false;
          self.showSuccessModal = true;
        },
        err => {
          self.$notify({
            type: 'danger',
            message: err.message
          });
          self.formLoading = false;
        }
      );
    },
    fetchData() {
      const self = this;
      self.formLoading = true;
      customerService.get(self.id).then(
        response => {
          self.model = response.data;
          if (!self.model.address) {
            self.model.address = {
              id: 0,
              name: '',
              street: '',
              number: '',
              complement: '',
              neighborhood: '',
              city: '',
              state: '',
              country: 'Brasil',
              zipcode: '',
              latitude: null,
              longitude: null
            };
          }
          self.loadOperationPartner(self);
        },
        () => {
          self.formLoading = false;
        }
      );

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
            self.operationPartners = [];
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
    },
    getAddressData(zipCode) {
      const self = this;
      helperService.getAddressFromZipCode(zipCode).then(response => {
        self.model.address.street = response.logradouro;
        self.model.address.neighborhood = response.bairro;
        self.model.address.city = response.localidade;
        self.model.address.state = response.uf;
      });
    }
  },
  created() {
    this.isRebens =
      this.$store.getters.currentUser.role == 'administratorRebens' ||
      this.$store.getters.currentUser.role == 'master';
    this.fetchData();
  }
};
</script>
