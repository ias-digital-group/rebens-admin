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
        <template v-if="model.icon">
          <div class="row">
            <label class="col-md-3 col-form-label">Icone</label>
            <div class="col-md-9">
              <div>
                <img :src="model.icon" class="img-preview" />
                <base-button @click="model.icon = ''" class="btn-simple btn-file" type="danger">
                  <i class="fas fa-times"></i>
                </base-button>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="row">
            <label class="col-md-3 col-form-label">Icone</label>
            <div class="col-md-9">
              <image-upload @change="onImageChange" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
            </div>
          </div>
        </template>
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
        order: null,
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
          if (self.image) {
            helperService.uploadFile(self.image).then(
              response => {
                if (response.status != 200) {
                  self.$notify({
                    type: 'primary',
                    message: response.message,
                    icon: 'tim-icons icon-bell-55'
                  });
                  self.submitLoading = false;
                  return;
                }
                self.model.icon = response.data.url;
                self.saveCategory(self);
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
            self.saveCategory(self);
          }
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
    },
    onImageChange(file) {
      this.image = file;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
.img-preview {
  max-width: 100px;
}
</style>
