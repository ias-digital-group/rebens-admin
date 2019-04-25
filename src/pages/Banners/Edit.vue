<template>
<div class="row">
  <div class="col-md-12">
    <card :title="$t('pages.banners.title')">
      <h4 slot="header" class="card-title">{{$t('pages.banners.title')}}</h4>
      <el-tabs v-model="activeName">
          <el-tab-pane name="banner" label="Banner">
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
                <div class="col-md-9">
                  <div class="form-group">
                    <base-radio v-model="model.idType" :name="1" :value="1" :inline="true">Banner Full</base-radio>
                    <base-radio v-model="model.idType" :name="3" :value="3" :inline="true">Imperdíveis</base-radio>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Onde aparece?</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.bannerShowHome" :inline="true">Home</base-checkbox>
                    <base-checkbox v-model="model.bannerShowHomeLogged" :inline="true">Home Logada</base-checkbox>
                    <base-checkbox v-show="model.idType == 3" v-model="model.bannerShowBenefit" :inline="true">Home de benefícios</base-checkbox>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">É de benefício?</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.isBenefit">&nbsp;</base-checkbox>
                  </div>
                </div>
              </div>
              <div class="row" v-if="model.isBenefit">
                <label class="col-md-3 col-form-label">Benefício</label>
                <div class="col-md-9 col-lg-4">
                  <div class="form-group">
                    <el-autocomplete 
                      style="width:100%"
                      :fetch-suggestions="querySearch"
                      @select="handleSelect"
                      placeholder=""
                      v-model="benefitName"
                      :trigger-on-focus="false">
                    </el-autocomplete>
                    <input type="hidden" v-model="model.idBenefit" />
                  </div>
                </div>
              </div>
              <div class="row" v-if="!model.isBenefit">
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
              <div class="row" v-if="!model.isBenefit">
                <label class="col-md-3 col-form-label">Abrir em nova aba?</label>
                <div class="col-md-9">
                    <div class="form-group">
                      <base-checkbox v-model="model.targetBlank">&nbsp;</base-checkbox>
                    </div>
                  </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Data</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Início">
                    <el-date-picker
                      type="date"
                      name="start"
                      data-vv-name="start"
                      v-validate="modelValidations.start"
                      placeholder="Início"
                      :error="getError('start')"
                      v-model="model.start">
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-4">
                  <base-input label="Fim">
                    <el-date-picker
                      type="date"
                      name="end"
                      data-vv-name="end"
                      placeholder="Fim"
                      v-validate="modelValidations.end"
                      :error="getError('end')"
                      v-model="model.end">
                    </el-date-picker>
                  </base-input>
                </div>
              </div>
              <template v-if="model.image">
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem <br />
                    <span v-show="model.idType == 1">(1200x500)</span>
                    <span v-show="model.idType == 3">(578x578)</span>
                  </label>
                  <div class="col-md-9">
                    <div class="fileinput">
                      <div class="thumbnail">
                        <img :src="model.image" class="img-preview" />
                      </div>
                      <div>
                        <base-button @click="model.image = ''" class="btn-simple btn-file" type="danger">
                          <i class="fas fa-times"></i> {{ removeText }}
                        </base-button>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem <br />
                    <span v-show="model.idType == 1">(1200x500)</span>
                    <span v-show="model.idType == 3">(578x578)</span></label>
                  <div class="col-md-9">
                    <image-upload @change="onImageChange" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                  </div>
                </div>
              </template>
              
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
                  <label class="col-md-3 col-form-label">Ativo</label>
                  <div class="col-md-9">
                    <div class="form-group">
                      <base-checkbox v-model="model.active">&nbsp;</base-checkbox>
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
          <el-tab-pane name="operations" label="Operações" :disabled="viewAction == 'new' ? true : false">
            <operations v-loading="formLoading" parent="banners" :parentId="id" :key="operationKey"></operations>
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
    id: String,
     removeText: {
      type: String,
      default: 'Remove'
    }
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      image: null,
      operationKey: 0,
      benefitName: '',
      model: {
        name: '',
        order: 1,
        image: '',
        active: false,
        link: '',
        idType: 1,
        backgroundColor:null, 
        idBenefit:null,
        isBenefit:false,
        start: null,
        end: null,
        targetBlank:false,
        bannerShowHome: false,
        bannerShowHomeLogged: false,
        bannerShowBenefit: false
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
        start:{
          required:true
        },
        end:{
          required:true
        },
        benefit:{
          required:this.isBenefit
        },
        link:{
          required:!this.isBenefit
        }
      },
      benefits:[]
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_banner' ? 'edit' : 'new';
    },
    activeName:{
      get:function(){
      if(this.$route.query && this.$route.query.tab)
        return this.$route.query.tab == 'op' ? 'operations' : 'banner';
      return 'banner';
      },
      set:function(){

      }
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    querySearch(query, cb) {
      var list = this.benefits;
      var results = query ? list.filter(this.createFilter(query)) : list;
      var top3 = results.slice(0, 3);
      cb(top3);
    },
    createFilter(query) {
      return (partner) => {
        return partner.value.toLowerCase().includes(query.toLowerCase());
      };
    },
    handleSelect(item){
      this.model.idBenefit = item.id;
    },
    validate() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if(!self.model.start || !self.model.end)
        {
          self.$notify({
            type: 'danger',
            message: 'A data é obrigatória',
            icon: 'tim-icons icon-bell-55'
          });
        }
        else if(self.model.isBenefit && !self.model.idBenefit){
          self.$notify({
            type: 'danger',
            message: 'O benefício é obrigatório',
            icon: 'tim-icons icon-bell-55'
          });
        }
        else if (isValid) {
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
                  type: 'warning',
                  message: err.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.submitLoading = false;
              }
            );
          } else if(self.model.image){
            self.saveBanner(self);
          }
          else{
            self.$notify({
              type: 'danger',
              message: 'A imagem é obrigatória',
              icon: 'tim-icons icon-bell-55'
            });
            self.submitLoading = false;
          }
        }
      });
    },
    saveBanner(vm) {
      vm = vm ? vm : this;
      if(!vm.model.isBenefit){
        vm.model.idBenefit = undefined;
      }
      if (vm.viewAction == 'new') {
        bannerService.create(vm.model).then(
          res => {
            vm.$notify({
              type: 'success',
              message: 'Banner cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            //vm.$router.push('/banners');
            vm.$router.push({path: `/banners/${res.id}/edit/`, query:{tab:'op'}});
            vm.operationKey++;
            vm.id = res.id;
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
            self.populateBenefit();
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.selectLoading = true;
      benefitService.findAllActive().then(
        response => {
          _.each(response.data, function(el) {
            self.benefits.push({ id: el.id, value: el.name });
          });
          self.selectLoading = false;
          self.populateBenefit();
        },
        () => {
          self.selectLoading = false;
        }
      );
    },
    populateBenefit(){
      if(!this.formLoading && !this.selectLoading && this.model.idBenefit){
        var b = this.benefits.filter(o => o.id == this.model.idBenefit);
        if(b.length == 1)
          this.benefitName = op[0].value;
      }
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
