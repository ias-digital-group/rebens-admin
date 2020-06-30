<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Operação</span>
        <span v-else>Edição Operação</span>
      </h2>
      <div class="box-actions">
        <base-link
          to="/operations"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="submitLoading" @submit.prevent>
        <div class="form-left">
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.title"
              type="text"
              name="title"
              label="Nome Clube"
              :error="customErrors.get('title')"
              maxlength="200"
            ></custom-input>
            <custom-input
              :required="true"
              v-model="model.companyDoc"
              type="text"
              name="companyDoc"
              label="CNPJ"
              :error="customErrors.get('companyDoc')"
              maxlength="50"
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
              maxlength="50"
            ></custom-input>
          </div>
          <ias-address
            ref="ias-address"
            :customErrors="customErrors"
            :address.sync="model.mainAddress"
          ></ias-address>
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
            <custom-input
              v-model="model.domain"
              type="text"
              name="domain"
              label="Url do Domínio"
              :error="customErrors.get('domain')"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row tmp-url">
            <custom-input
              v-model="model.temporarySubdomain"
              type="text"
              name="temporarySubdomain"
              :error="customErrors.get('temporarySubdomain')"
              label="Url temporária"
              maxlength="500"
            ></custom-input>
          </div>
          <template v-for="(field, idx) in config.data.fields">
            <div class="ias-row" :key="idx" v-if="field.type == 'text'">
              <custom-input
                :required="true"
                v-model="field.data"
                type="text"
                :name="field.name"
                :label="field.label"
                :error="customErrors.get(`config.${field.name}`)"
                maxlength="200"
              ></custom-input>
            </div>
            <div
              class="ias-row"
              :key="idx"
              v-else-if="field.type == 'tel' || field.type == 'phone'"
            >
              <custom-input
                :required="true"
                v-model="field.data"
                type="tel"
                :name="field.name"
                :label="field.label"
                :error="customErrors.get(`config.${field.name}`)"
                :inputMask="['(##) ####-####', '(##) #####-####']"
                maxlength="50"
              ></custom-input>
            </div>
            <div class="ias-row" :key="idx" v-else-if="field.type == 'boolean'">
              <ias-checkbox v-model="field.checked">
                {{ field.label }}
              </ias-checkbox>
            </div>
            <div
              class="ias-row-editor"
              :key="idx"
              v-else-if="field.type == 'html'"
            >
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="field.data"
                :placeholder="field.label"
              />
            </div>
            <div class="ias-row" v-else-if="field.type == 'select'" :key="idx">
              <ias-radio
                v-for="(t, index) in field.options"
                :value="t.value"
                :key="index"
                :name="t.value"
                v-model="field.data"
                >{{ t.name }}</ias-radio
              >
            </div>
          </template>
          <div class="ias-row" v-show="showWirecard">
            <custom-input
              v-model="wirecard.token"
              type="text"
              name="token"
              :error="customErrors.get('token')"
              label="Token Wirecard"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row" v-show="showWirecard">
            <custom-input
              v-model="wirecard.jsToken"
              type="text"
              name="jsToken"
              :error="customErrors.get('jsToken')"
              label="Token JS Wirecard"
              maxlength="500"
            ></custom-input>
          </div>
          <div v-for="(arr, idx1) in modulesChunk" class="ias-row" :key="idx1">
            <template v-for="(mod, idx) in arr">
              <ias-checkbox v-model="mod.checked" :key="idx">
                {{ mod.title }}
              </ias-checkbox>
            </template>
            <div class="div-spacer" v-show="arr.length === 1"></div>
            <div class="div-spacer" v-show="arr.length === 2"></div>
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
        <div class="form-right">
          <ias-image-upload
            @change="onImageChange"
            img-size="(360x360)"
            :src="model.logo"
            :error="customErrors.get('logo')"
          />
          <div v-for="(field, idx) in config.data.fields" :key="idx">
            <template v-if="field.type == 'image'">
              <ias-image-upload
                @change="onImageChange"
                :img-size="field.label"
                :src="field.data"
              />
            </template>
          </div>
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/operations"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal, Address, Modal } from 'src/components';
import operationService from '../../services/Operation/operationService';
import helperService from '../../services/Helper/helperService';
import validate from '../../validate';
import _ from 'lodash';

export default {
  components: {
    SuccessModal,
    [Address.name]: Address,
    Modal
  },
  props: {
    id: String
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      publishLoading: false,
      publishTempLoading: false,
      showTempPublishBtn: false,
      showSuccessModal: false,
      registerType: '',
      image: null,
      isMaster: false,
      configKey: 0,
      customErrors: new Map(),
      selectedOperationType: '',
      modules: [],
      wirecard: {
        token: '',
        jsToken: ''
      },
      config: {
        id: 0,
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true,
        images: []
      },
      model: {
        id: 0,
        title: '',
        companyName: '',
        companyDoc: '',
        domain: '',
        idOperationType: 0,
        cachbackPercentage: 0,
        active: false,
        logo: '',
        temporarySubdomain: '',
        subdomainCreated: false,
        canPublish: false,
        temporaryPublishStatus: '',
        publishStatus: '',
        canPublishTemporary: false,
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
      },
      operationTypeList: []
    };
  },
  computed: {
    showWirecard: function() {
      const self = this;
      let ret = false;
      if (self.config.data) {
        if (self.config.data.fields) {
          for (var field of self.config.data.fields) {
            if (field.name === 'register-type' && field.data === 'signature') {
              ret = true;
            }
          }
        }
        if (self.modules) {
          for (var mod of self.modules) {
            if (mod.info.needWirecard && mod.checked) {
              ret = true;
            }
          }
        }
      }
      return ret;
    },
    viewAction() {
      return this.$route.name == 'edit_operation' ? 'edit' : 'new';
    },
    temporaryUrl() {
      return (
        'http://' + this.model.temporarySubdomain + '.sistemarebens.com.br'
      );
    },
    modulesChunk() {
      var R = [];
      for (var i = 0; i < this.modules.length; i += 3)
        R.push(this.modules.slice(i, i + 3));
      return R;
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (
        !self.model.idOperationType ||
        self.model.idOperationType === '' ||
        self.model.idOperationType === 0
      ) {
        self.customErrors.set('idOperationType', 'Campo obrigatório');
      }

      if (!self.model.title || self.model.title === '') {
        self.customErrors.set('title', 'Campo obrigatório');
      } else if (self.model.title.length > 300) {
        self.customErrors.set('title', 'Campo obrigatório');
      }

      if (!self.model.companyName || self.model.companyName === '') {
        self.customErrors.set('companyName', 'Campo obrigatório');
      } else if (self.model.companyName.length > 300) {
        self.customErrors.set('companyName', 'Campo obrigatório');
      }

      if (
        !self.model.temporarySubdomain ||
        self.model.temporarySubdomain === ''
      ) {
        self.customErrors.set('temporarySubdomain', 'Campo obrigatório');
      } else if (self.model.temporarySubdomain.length > 20) {
        self.customErrors.set('temporarySubdomainMax', 'Campo obrigatório');
      }

      if (!self.model.companyDoc || self.model.companyDoc === '') {
        self.customErrors.set('companyDoc', 'Campo obrigatório');
      } else if (self.model.companyDoc.length > 18) {
        self.customErrors.set('companyDoc', 'Campo obrigatório');
      }

      if (self.model.domain && self.model.domain.length > 200) {
        self.customErrors.set('domainMax', 'Campo obrigatório');
      }
      if ((!self.model.logo || self.model.logo === '') && !self.image) {
        self.customErrors.set('logo', 'Campo obrigatório');
      }
      if (!self.model.mainAddress.name || self.model.mainAddress.name === '')
        self.customErrors.set('addrName', 'Campo obrigatório');
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
      else if (!validate.validateEmail(self.model.mainContact.email))
        self.customErrors.set('contactEmail', 'E-mail inválido');
      if (
        !self.model.mainContact.jobTitle ||
        self.model.mainContact.jobTitle === ''
      )
        self.customErrors.set('contactJobTitle', 'Campo obrigatório');

      for (let i = 0; i < self.config.data.fields.length; i++) {
        if (
          self.config.data.fields[i].isRequired &&
          self.config.data.fields[i].data === ''
        ) {
          self.customErrors.set(
            `config.${self.model.data.fields[i].name}`,
            'Campo obrigatório'
          );
        }
      }

      if (self.customErrors.size === 0) {
        self.submitLoading = true;

        if (
          self.image ||
          (self.config.images && self.config.images.length > 0)
        ) {
          let promises = new Array(
            (self.image ? 1 : 0) +
              (self.config.images ? self.config.images.length : 0)
          );
          if (self.image) {
            promises[i] = helperService.uploadImage(self.image);
          }
          if (self.config.images && self.config.images.length > 0) {
            for (var i = 0; i <= self.config.images.length - 1; i++) {
              promises[i] = helperService.uploadImage(
                self.config.images[i].img
              );
            }
          }
          Promise.all(promises)
            .then(values => {
              let start = 0;
              if (self.image) {
                self.model.logo = values[0].data.url;
                start++;
              }
              for (var j = start; j <= values.length - 1; j++) {
                const fieldIndex = self.config.images[j - start].index;
                self.model.data.fields[fieldIndex].data = values[j].data.url;
              }
              self.saveOperation(self);
            })
            .catch(reason => {
              self.$notify({
                type: 'danger',
                message: reason.message
              });
              self.submitLoading = false;
            });
        } else {
          self.saveOperation(self);
        }
      }
    },
    saveOperation(vw) {
      if (vw.viewAction == 'new') {
        operationService.create(vw.model).then(
          response => {
            vw.model.id = response.data.id;
            vw.saveConfiguration(vw);
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message
            });
            vw.submitLoading = false;
          }
        );
      } else {
        operationService.update(vw.model).then(
          () => {
            vw.saveConfiguration(vw);
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message
            });
            vw.submitLoading = false;
          }
        );
      }
    },
    saveConfiguration(vw) {
      operationService
        .saveConfiguration(vw.model.id, vw.config.data, vw.modules, vw.wirecard)
        .then(
          () => {
            vw.submitLoading = false;
            vw.showSuccessModal = true;
          },
          () => {
            self.formLoading = false;
          }
        );
    },
    publish() {
      const self = this;
      self.publishLoading = true;
      operationService.publish(self.id).then(
        () => {
          self.$notify({
            type: 'primary',
            message:
              'A operação está sendo publicada, e assim que estiver concluído você verá aqui.',
            icon: 'tim-icons icon-bell-55'
          });
          self.model.publishStatus = 'Processando';
        },
        err => {
          self.$notify({
            type: 'primary',
            message: err.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.publishLoading = false;
        }
      );
    },
    publishTemp() {
      const self = this;
      self.publishTempLoading = true;
      operationService.publish(self.id).then(
        () => {
          self.$notify({
            type: 'primary',
            message:
              'A operação está sendo publicada, e assim que estiver concluído você verá aqui.',
            icon: 'tim-icons icon-bell-55'
          });
          self.model.temporaryPublishStatus = 'Processando';
        },
        err => {
          self.$notify({
            type: 'primary',
            message: err.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.publishTempLoading = false;
        }
      );
    },
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        operationService.get(self.id).then(
          response => {
            self.model = response.data;
            self.publishLoading = response.data.publishStatus === 'Processando';
            self.formLoading = false;
            self.publishTempLoading =
              response.data.temporaryPublishStatus === 'Processando Temporário';
            self.showTempPublishBtn =
              response.data.temporaryPublishStatus !== 'Incompleto Temporário';
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.selectLoading = true;
      helperService.findAllOperationTypes().then(
        response => {
          _.each(response.data, function(el) {
            self.operationTypeList.push({ code: el.id, label: el.name });
            if (el.id === self.model.idOperationType)
              self.selectedOperationType = el.name;
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
      operationService.getConfiguration(self.id).then(
        response => {
          self.config.images = [];
          self.config.data = response.data;
          self.wirecard = response.data.wirecard;
          self.$data.loading = false;
          if (self.config.data && self.config.data.fields) {
            for (var field of self.config.data.fields) {
              if (field.name === 'register-type') {
                self.$emit('change', field.data);
              }
            }
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
      operationService.listModules(self.id).then(response => {
        self.modules = response;
      });
    },
    onImageChange(file) {
      this.image = file;
    },
    onRegisterType(type) {
      this.registerType = type;
    }
  },
  created() {
    this.isMaster = this.$store.getters.currentUser.role == 'master';
    this.fetchData();
  }
};
</script>
<style>
.tmp-url .ias-input-group .ias-input {
  padding-right: 50%;
  text-align: right;
}
.tmp-url .ias-input-group::after {
  content: '.sistemarebens.com.br';
  position: absolute;
  bottom: 0;
  left: 50%;
  line-height: 43px;
  color: #41b0ce;
  font-size: 16px;
  font-weight: 500;
}
</style>
