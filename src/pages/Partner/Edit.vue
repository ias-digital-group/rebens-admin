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
      <form v-loading="submitLoading" @submit.prevent>
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
          </div>
          <ias-address
            ref="ias-address"
            :customErrors="customErrors"
            :address.sync="model.mainAddress"
          ></ias-address>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('description') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.description"
              placeholder="Descrição"
            />
            <label v-show="customErrors.get('description')" class="ias-error">
              {{ customErrors.get('description') }}
            </label>
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
              :error="customErrors.get('contactPhone')"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            ></custom-input>
            <div class="phone-branch">
              <custom-input
                v-model="model.mainContact.comercialPhone"
                type="text"
                name="contactComercialPhone"
                label="Telefone Comercial"
                maxlength="50"
                :error="customErrors.get('contactPhone')"
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
            :src="model.logo"
            :error="customErrors.get('logo')"
          />
          <div class="ias-file-uploader">
            <div class="event-holder">
              Clique aqui para inserir o contrato
              <input
                accept="*"
                @change="handleFileSelect"
                type="file"
                class="valid"
                :multiple="false"
                aria-invalid="false"
                ref="file"
                id="fileInput"
              />
            </div>
            <div class="files-holder">
              <div class="item" v-for="item in files" :key="item.idx">
                <i class="icon-icon-times" @click="removeFile(item)"></i>
                <a target="_blank" :href="item.fileURL" class="file-content">
                  <img src="/img/icon-file.png" :alt="item.name" />
                  <p>
                    <span>{{ item.name }}</span>
                    <b>{{ item.createdUserName }} - {{ item.created }}</b>
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/partner"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal, Address, Modal } from 'src/components';
import partnerService from '../../services/Partner/partnerService';
import helperService from '../../services/Helper/helperService';
import fileService from '../../services/File/fileService';
import config from '../../config';
import validate from '../../validate';

export default {
  components: {
    SuccessModal,
    [Address.name]: Address,
    Modal
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
      submitLoading: false,
      customErrors: new Map(),
      customToolbar: [],
      showSuccessModal: false,
      files: [],
      fileCounter: 0,
      level: 'root',
      modal: {
        visible: false,
        submitLoading: false,
        name: '',
        modelValidations: {
          name: {
            required: true,
            confirmed: 'nome',
            max: 200
          }
        }
      },
      types: [
        { code: 4, label: 'Benefícios' },
        { code: 19, label: 'Cursos Livres' }
      ],
      file: Object,
      model: {
        id: 0,
        name: '',
        companyName: '',
        cnpj: null,
        active: true,
        logo: '',
        description: '',
        type: 4,
        idMainAddress: null,
        idMainContact: null,
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
      else if (!validate.validateCnpj(self.model.cnpj))
        self.customErrors.set('cnpj', 'CNPJ inválido');
      if (!self.model.description || self.model.description === '')
        self.customErrors.set('description', 'Campo obrigatório');
      if (!self.image && !self.model.logo)
        self.customErrors.set('logo', 'Campo obrigatório');
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

      if (
        (!self.model.mainContact.phone ||
          self.model.mainContact.phone === '') &&
        (!self.model.mainContact.cellPhone ||
          self.model.mainContact.cellPhone === '') &&
        (!self.model.mainContact.comercialPhone ||
          self.model.mainContact.comercialPhone === '')
      )
        self.customErrors.set(
          'contactPhone',
          'Preencha pelo menos um telefone'
        );

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          self.uploadImage(self);
        } else if (self.model.logo) {
          self.savePartner(self);
        }
      }
    },
    uploadImage(self) {
      helperService.uploadImage(self.image).then(
        response => {
          if (response.status != 200) {
            self.$notify({
              type: 'warning',
              message: response.message
            });
            self.submitLoading = false;
            return;
          }
          self.model.logo = response.data.url;
          self.savePartner(self);
        },
        err => {
          self.$notify({
            type: 'danger',
            message: err.message
          });
          self.submitLoading = false;
        }
      );
    },
    async savePartner(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        partnerService.create(vm.model).then(
          async res => {
            vm.id = res.id;
            if (vm.files.length > 0) {
              for (let i = 0; i < vm.files.length; i++) {
                vm.files[i].idItem = vm.id;
                await fileService.create(vm.files[i]);
              }
            }
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
          async () => {
            let newFiles = vm.files.filter(f => f.id === 0);
            if (newFiles.length > 0) {
              for (let i = 0; i < newFiles.length; i++) {
                await fileService.create(newFiles[i]);
              }
            }
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
        this.submitLoading = true;
        partnerService.get(self.id).then(
          response => {
            self.model = response.data;
            self.loadFiles();
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
            self.submitLoading = false;
          },
          () => {
            self.submitLoading = false;
          }
        );
      }
    },
    handleFileSelect(event) {
      if (event.target.files.length == 0) {
        return;
      }
      const self = this;
      self.submitLoading = true;
      helperService.uploadFile(event.target.files[0], 'partnerFile').then(
        response => {
          if (response.status != 200) {
            self.$notify({
              type: 'warning',
              message: response.message
            });
            self.submitLoading = false;
            return;
          }
          self.fileCounter++;
          let idx = 0;
          if (self.files.length > 0) {
            self.files.map(obj => {
              if (obj.idx > idx) idx = obj.idx;
            });
            idx++;
          }
          self.files.push({
            id: 0,
            name: `Contrato ${self.fileCounter}`,
            fileUrl: response.data.url,
            fileName: response.data.fileName,
            idItem: self.model.id,
            itemType: 23,
            idx: idx,
            created: ' - ',
            createdUserName: ' - '
          });
          document.getElementById('fileInput').value = '';
          self.submitLoading = false;
        },
        err => {
          self.$notify({
            type: 'danger',
            message: err.message
          });
          self.submitLoading = false;
        }
      );
    },
    onImageChange(file) {
      this.image = file;
      if (file == null) {
        this.model.logo = file;
      }
    },
    removeFile(item) {
      const self = this;
      if (item.id === 0) {
        for (let i = 0; i < self.files.length; i++) {
          if (self.files[i].idx === item.idx) self.files.splice(i, 1);
        }
      } else {
        self.submitLoading = true;
        fileService.delete(item.id).then(
          () => {
            for (let i = 0; i < self.files.length; i++) {
              if (self.files[i].id === item.id) self.files.splice(i, 1);
            }
            self.submitLoading = false;
          },
          err => {
            self.$notify({
              type: 'danger',
              message: err.message
            });
            self.submitLoading = false;
          }
        );
      }
    },
    loadFiles() {
      const self = this;
      self.submitLoading = true;
      fileService.findAll(self.model.id, 23).then(
        response => {
          if (response && response.data) {
            self.files = response.data;
            for (let i = 0; i < self.files.length; i++) {
              self.files[0].idx = i + 1;
            }
          }
          self.submitLoading = false;
        },
        err => {
          self.$notify({
            type: 'danger',
            message: err.message
          });
          self.submitLoading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
