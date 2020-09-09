<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Prêmio</span>
        <span v-else>Editar Prêmio</span>
      </h2>
      <div class="box-actions">
        <base-link
          to="/scratchcard/prizes"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form @submit.prevent v-loading="submitLoading">
        <div class="form-left">
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="scratchcards"
                :reduce="op => op.code"
                :key="model.idScratchcard"
                v-model="model.idScratchcard"
                placeholder="Campanha"
                :disabled="viewAction !== 'new'"
                :class="{ 'has-error': customErrors.get('idScratchcard') }"
              >
                <span slot="no-options">Nenhuma Campanha encontrada</span>
              </v-select>
              <label v-if="customErrors.get('idScratchcard')" class="ias-error">{{
                customErrors.get('idScratchcard')
              }}</label>
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
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.title"
              type="text"
              name="title"
              label="Título"
              :error="customErrors.get('title')"
              maxlength="200"
            ></custom-input>
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('description') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.description"
              placeholder="Instruções de resgate"
            />
            <label v-show="customErrors.get('description')" class="ias-error"
              >Campo obrigatório</label
            >
          </div>

          
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.quantity"
              type="number"
              name="quantity"
              label="Quantidade"
              :error="customErrors.get('quantity')"
              maxlength="3"
            ></custom-input>
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
              
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <ias-image-upload
            @change="onImageChange"
            img-size="(200x200)"
            :src="imagePath"
            :error="customErrors.get('imagePath')"
          />
        </div>
      </form>
    </div>
    <success-modal
      :boxMessage="
        `CADASTRO ${
          viewAction !== 'new' ? 'REALIZADO' : 'SALVO'
        } <br />COM SUCESSO!`
      "
      :show="showSuccessModal"
      link="/scratchcard/prizes"
    ></success-modal>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import scratchcardPrizeService from '../../services/Scratchcard/scratchcardPrizeService';
import { SuccessModal } from 'src/components';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
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
      imagePath: '',
      customToolbar: [],
      model: {
        id: 0,
        name: '',
        title: '',
        image: '',
        idScratchcard: 0,
        quantity: 0,
        description: ''
      },
      scratchcards: [],
      customErrors: new Map(),
      showSuccessModal: false
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_scratchcardPrize' ? 'edit' : 'new';
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (self.model.name == '') {
        self.customErrors.set('name', 'Campo obrigatório');
      } else if (self.model.name.length > 200) {
        self.customErrors.set('name', 'Este campo aceita no máximo 200 caracteres');
      }
      if (self.imagePath == '' && self.image == null) {
        self.customErrors.set('image', 'Campo obrigatório');
      }
      if (self.model.title == '') {
        self.customErrors.set('title', 'Campo obrigatório');
      } else if (self.model.title.length > 200) {
        self.customErrors.set('title', 'Este campo aceita no máximo 200 caracteres');
      }
      if (self.model.quantity <= 0) {
        self.customErrors.set('quantity', 'Campo obrigatório');
      }
      if (self.model.description == '') {
        self.customErrors.set('description', 'Campo obrigatório');
      } else if (self.model.description.length > 2000) {
        self.customErrors.set('description', 'Este campo aceita no máximo 2000 caracteres');
      }

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          scratchcardService.uploadImage(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'warning',
                  message: response.message
                });
                self.submitLoading = false;
                return;
              }
              self.model.image = response.data.fileName;
              self.image = response.data.url;
              self.save(self);
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.submitLoading = false;
            }
          );
        } else {
          self.save(self);
        }
      }
    },
    save(vm) {
      vm = vm ? vm : this;
      if (vm.model.id === 0) {
        scratchcardPrizeService.create(vm.model).then(
          data => {
            if (data.status === 'ok') {
              vm.showSuccessModal = true;
            } else {
              vm.$notify({
                type: 'warning',
                message: data.message
              });
            }
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
        scratchcardPrizeService.update(vm.model).then(
          response => {
            if (response.status === 'ok') {
              vm.showSuccessModal = true;
            } else {
              vm.$notify({
                type: 'warning',
                message: response.message
              });
            }
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
      self.customToolbar = config.customToolbar;
      if (self.viewAction == 'edit') {
        self.formLoading = true;
        scratchcardPrizeService.get(self.id).then(
          response => {
            self.model = response.data;
            self.imagePath = response.data.imagePath + response.data.image;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      } else {
        self.model.canEdit = true;
      }

      self.selectLoading = true;
      scratchcardService.list({
            page: 0,
            pageItems: 999,
            searchWord: '',
            sort: 'name ASC',
            status: '',
            idOperation: null
          }).then(
        response => {
          _.each(response.data, function(el) {
            self.scratchcards.push({ code: el.id, label: el.name });
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
    },
    onImageChange(file) {
      this.image = file;
      if (file == null) {
        this.model.image = file;
        this.imagePath = file;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
textarea {
  margin-bottom: 10px;
}
</style>
