<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>Editar Parceiro Cupom</h2>
      <div class="box-actions">
        <base-link to="/zanox" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form @submit.prevent v-loading="submitLoading">
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
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('localDescription') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.localDescription"
              placeholder="Descrição"
            />
            <label
              v-show="customErrors.get('localDescription')"
              class="ias-error"
              >{{ customErrors.get('localDescription') }}</label
            >
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('terms') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.terms"
              placeholder="Termos"
            />
            <label v-show="customErrors.get('terms')" class="ias-error">{{
              customErrors.get('terms')
            }}</label>
          </div>

          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                <span>Salvar</span>
              </button>
              <ias-checkbox v-model="model.published">Publicado</ias-checkbox>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <ias-image-upload
            @change="onImageChange"
            img-size="(360x360)"
            :src="model.image"
            :error="customErrors.get('picture')"
          />
        </div>
      </form>
    </div>
    <success-modal
      :boxMessage="`CADASTRO SALVO <br />COM SUCESSO!`"
      :show="showSuccessModal"
      link="/zanox"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal } from 'src/components';
import zanoxService from '../../services/Zanox/zanoxService';
import helperService from '../../services/Helper/helperService';
import config from '../../config';

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
  data() {
    return {
      submitLoading: false,
      image: null,
      customErrors: new Map(),
      showSuccessModal: false,
      customToolbar: [],
      model: {
        id: 0,
        name: '',
        image: '',
        localDescription: '',
        terms: '',
        published: false
      }
    };
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.name || self.model.name === '')
        self.customErrors.set('name', 'Campo obrigatório');
      if (!self.model.localDescription || self.model.localDescription === '')
        self.customErrors.set('localDescription', 'Campo obrigatório');
      if (!self.image && !self.model.image)
        self.customErrors.set('picture', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
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
              self.model.image = response.data.url;
              self.saveProgram(self);
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.submitLoading = false;
            }
          );
        } else if (self.model.image) {
          self.saveProgram(self);
        }
      }
    },
    saveProgram(vm) {
      vm = vm ? vm : this;
      zanoxService.update(vm.model).then(
        () => {
          vm.submitLoading = false;
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
          vm.submitLoading = false;
        }
      );
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;

      self.submitLoading = true;
      zanoxService.get(self.id).then(
        response => {
          self.model = response.data;
          self.submitLoading = false;
        },
        () => {
          self.submitLoading = false;
        }
      );
    },
    onImageChange(file) {
      this.image = file;
      if (file == null) {
        this.model.image = file;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
