<template>
<div class="row">
  <div class="col-md-12">
    <card title="Horizontal Form">
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
          <label class="col-md-3 col-form-label">Ordem</label>
          <div class="col-md-2">
            <base-input 
              required
              v-model="model.order"
              v-validate="modelValidations.order"
              type="tel"
              :error="getError('order')"
              name="order"
              placeholder="Ordem" 
              maxlength='4' 
              :inputMask="['####']">
            </base-input>
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
          <label class="col-md-3 col-form-label"></label>
          <div class="col-md-9">
            <base-button 
              class="mt-3" 
              native-type="submit" 
              type="info"
              @click.native.prevent="validate"
              :loading="submitLoading">
              Salvar
            </base-button>
            <base-link class="btn mt-3 btn-secondary" to="/categories">Voltar</base-link>
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
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    id: String
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      model: {
        name: '',
        order: null,
        idParent: null
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
          if (self.viewAction == 'new') {
            categoryService.create(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/categories');
                self.submitLoading = false;
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
            categoryService.update(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/categories');
                self.submitLoading = false;
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
          }
        }
      });
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
          self.categoriesList.push({ id: null, name: '' });
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
<style>
</style>
