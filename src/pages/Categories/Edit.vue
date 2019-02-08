<template>
<div class="row">
  <div class="col-md-12">
    <card :title="$t('pages.categories.title')">
      <h4 slot="header" class="card-title">{{$t('pages.categories.title')}}</h4>
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <div class="row">
          <label class="col-md-3 col-form-label">Nome</label>
          <div class="col-md-9">
            <base-input 
              required
              v-model="model.name"
              v-validate="modelValidations.name"
              type="text"
              :error="getError('name')"
              name="name"
              placeholder="Nome" 
              maxlength='200'></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Categoria pai</label>
          <div class="col-md-9">
            <el-select
                class="select-info"
                placeholder="Categoria pai"
                v-model="model.idParent"
                v-loading.lock="selectLoading"
                lock>
                <el-option
                  v-for="category in categoriesList"
                  class="select-primary"
                  :value="category.id"
                  :label="category.name"
                  :key="category.id"
                >
                </el-option>
              </el-select>
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
          <div class="col-md-12">
            <base-link class="btn mt-3 btn-simple btn-primary" to="/categories">Voltar</base-link>
            <base-button 
              class="mt-3 pull-right" 
              native-type="submit" 
              type="info"
              @click.native.prevent="validate"
              :loading="submitLoading">
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
import categoryService from '../../services/Category/categoryService';
import helperService from '../../services/Helper/helperService';
import _ from 'lodash';
import { ImageUpload } from 'src/components/index';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    ImageUpload
  },
  props: {
    id: String
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      image: null,
      model: {
        name: '',
        order: 1,
        idParent: null,
        active: false,
        icon: ''
      },
      modelValidations: {
        name: {
          required: true,
          max: 200
        },
        order: {
          required: true,
          max: 4
        }
      },
      categoriesList: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_category' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.submitLoading = true;
            self.saveCategory(self);
        }
      });
    },
    saveCategory(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        categoryService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'primary',
              message: 'Categoria cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/categories');
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
        categoryService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/categories');
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
        categoryService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.selectLoading = true;
      categoryService.getListTree().then(
        response => {
          self.categoriesList.push({ id: null, name: 'Raiz' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.categoriesList.push({ id: el.id, name: el.name });
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
  created() {
    this.fetchData();
  }
};
</script>