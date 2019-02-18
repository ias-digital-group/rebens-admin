<template>
<div class="row">
  <div class="col-md-12">
    <card :title="$t('pages.banners.title')">
      <h4 slot="header" class="card-title">{{$t('pages.banners.title')}}</h4>
      <el-tabs>
          <el-tab-pane label="Banner">
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
                <label class="col-md-3 col-form-label">Tipo</label>
                <div class="col-md-2">
                  <div class="form-group">
                  <el-select
                      class="select-info"
                      placeholder="Tipo"
                      v-model="model.idType"
                      v-loading.lock="selectLoading"
                      v-validate="modelValidations.type"
                      lock>
                      <el-option
                        v-for="type in bannersTypes"
                        class="select-primary"
                        :value="type.id"
                        :label="type.name"
                        :key="type.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Ordem</label>
                <div class="col-md-2">
                  <base-input 
                    required
                    v-model="model.order"
                    v-validate="modelValidations.order"
                    type="number"
                    :error="getError('order')"
                    name="order"
                    placeholder="Ordem" 
                    maxlength='3'></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Link</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.link"
                    v-validate="modelValidations.link"
                    type="text"
                    :error="getError('link')"
                    name="link"
                    placeholder="link" 
                    maxlength='500'></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Benefício</label>
                <div class="col-md-2">
                  <div class="form-group">
                  <el-select
                      class="select-info"
                      placeholder="Benefício"
                      v-model="model.idBenefit"
                      v-loading.lock="selectLoading"
                      v-validate="modelValidations.benefit"
                      lock>
                      <el-option
                        v-for="b in benefits"
                        class="select-primary"
                        :value="b.id"
                        :label="b.name"
                        :key="b.id"
                      >
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Data</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Início">
                    <el-date-picker
                      type="date"
                      placeholder="Início"
                      v-model="model.start">
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
                  <base-input label="Fim">
                    <el-date-picker
                      type="date"
                      placeholder="Fim"
                      v-model="model.end">
                    </el-date-picker>
                  </base-input>
                </div>
              </div>
              <template v-if="model.image">
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem</label>
                  <div class="col-md-9">
                    <div>
                      <img :src="model.image" class="img-preview" />
                      <base-button @click="model.image = ''" class="btn-simple btn-file" type="danger">
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem</label>
                  <div class="col-md-9">
                    <image-upload @change="onImageChange" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                  </div>
                </div>
              </template>
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
                  <base-link class="btn mt-3 btn-simple btn-primary" to="/banners">Voltar</base-link>
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
          </el-tab-pane>
          <el-tab-pane label="Operações" :disabled="viewAction == 'new' ? true : false">
            <operations v-loading="formLoading" parent="banners" :parentId="id"></operations>
          </el-tab-pane>
      </el-tabs>
    </card>
  </div>
</div>
</template>
<script>
import { Select, Option, Tabs, TabPane, DatePicker } from 'element-ui';
import bannerService from '../../services/Banner/bannerService';
import helperService from '../../services/Helper/helperService';
import benefitService from '../../services/Benefit/benefitService';
import _ from 'lodash';
import { ImageUpload } from 'src/components/index';
import Operations from 'src/components/Operations';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [DatePicker.name]: DatePicker,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    ImageUpload,
    Operations
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
        image: '',
        active: false,
        link: '',
        idType: null,
        backgroundColor:null, 
        idBenefit:null,
        start: null,
        end: null
      },
      modelValidations: {
        name: {
          required: true,
          max: 200
        },
        order: {
          required: true,
          max: 4
        },
        type:{
          required:true
        },
        link:{
          required:true,
          max:500
        },
        benefit:{
          required:true
        }
      },
      bannersTypes: [],
      benefits:[]
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_banner' ? 'edit' : 'new';
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
                self.model.image = response.data.url;
                self.saveBanner(self);
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
            self.saveBanner(self);
          }
        }
      });
    },
    saveBanner(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        bannerService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'primary',
              message: 'Banner cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/banners');
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
        bannerService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/banners');
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
        bannerService.get(self.id).then(
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
      helperService.findAllBannerTypes().then(
        response => {
          self.bannersTypes.push({ id: null, name: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.bannersTypes.push({ id: el.id, name: el.name });
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
      console.log('benefitService.findAllActive');
      benefitService.findAllActive().then(
        response => {
          console.log('ok');
          self.benefits.push({ id: null, name: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.benefits.push({ id: el.id, name: el.title });
            }
          });
          self.selectLoading = false;
        },
        () => {
          console.log('error');
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
