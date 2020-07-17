<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Categoria</span>
        <span v-else>Editar Categoria</span>
      </h2>
      <div class="box-actions">
        <base-link to="/category" class="bt bt-square bg-white-2 c-light-blue">
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
            <div class="opts-holder">
              <ias-radio
                v-model="level"
                name="root"
                value="root"
                :disabled="model.hasChild"
                >Raiz</ias-radio
              >
              <ias-radio
                v-model="level"
                name="sub"
                value="sub"
                :disabled="model.hasChild"
                >Subcategoria</ias-radio
              >
            </div>
          </div>
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="parentList"
                :reduce="op => op.code"
                :key="model.idParent"
                v-model="model.idParent"
                :disabled="level === 'root'"
                placeholder="Categoria Pai"
                :class="{ 'has-error': customErrors.get('idParent') }"
              >
                <span slot="no-options">Nenhuma Categoria encontrada</span>
              </v-select>
              <label v-if="customErrors.get('idParent')" class="ias-error">{{
                customErrors.get('idParent')
              }}</label>
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
        <div class="form-right"></div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/category"
    ></success-modal>
  </div>
</template>
<script>
import { SuccessModal } from 'src/components';
import categoryService from '../../services/Category/categoryService';
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
  data() {
    return {
      formLoading: false,
      customErrors: new Map(),
      parentList: [],
      showSuccessModal: false,
      level: 'root',
      types: [
        { code: 4, label: 'Benefícios' },
        { code: 19, label: 'Cursos Livres' }
      ],
      model: {
        id: 0,
        name: '',
        order: 1,
        idParent: '',
        active: false,
        icon: '',
        type: 4
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_category' ? 'edit' : 'new';
    }
  },
  watch: {
    'model.type': function() {
      this.loadParents();
    },
    level: function() {
      if (this.level === 'root') this.model.idParent = null;
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
      if (self.level !== 'root' && self.model.idParent === '')
        self.customErrors.set('idParent', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.formLoading = true;
        self.saveCategory(self);
      }
    },
    saveCategory(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        categoryService.create(vm.model).then(
          res => {
            vm.id = res.id;
            vm.formLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400 && err.response.data) {
              if (err.response.data.title) {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.title
                });
              } else {
                vm.$notify({
                  type: 'danger',
                  message: err.response.data.message
                });
              }
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
        categoryService.update(vm.model).then(
          () => {
            vm.formLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.formLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        categoryService.get(self.id).then(
          response => {
            self.level = response.data.idParent ? 'sub' : 'root';
            if (self.level === 'root') self.loadParents();
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
    },
    loadParents() {
      const self = this;
      self.parentList = [];
      categoryService.getListTree(self.model.type).then(
        response => {
          _.each(response.data, function(el) {
            if (el.id != self.model.id) {
              self.parentList.push({ code: el.id, label: el.name });
            }
          });
        },
        () => {}
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
