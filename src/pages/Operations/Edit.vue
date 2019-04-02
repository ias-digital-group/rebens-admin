<template>
<div class="row">
  <div class="col-md-12">
    <card title="Horizontal Form">
      <h4 slot="header" class="card-title col-md-12">
        {{$t('pages.operations.title')}}
        <base-button class="pull-right" 
          native-type="button"
          type="info"
          @click="publish"
          :disabled="!canPublish"
          :loading="publishLoading">
          {{publishLabel}}</base-button>
      </h4>
      
      <el-tabs>
        <el-tab-pane label="Operação">
          <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
            <div class="row">
              <label class="col-md-3 col-form-label">Titulo</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.title"
                  v-validate="modelValidations.title"
                  type="text"
                  :error="getError('title')"
                  name="title"
                  placeholder="Titulo" 
                  maxlength='300'></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Empresa</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.companyName"
                  v-validate="modelValidations.companyName"
                  type="text"
                  :error="getError('companyName')"
                  name="companyName"
                  placeholder="Empresa" 
                  maxlength='300'></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Documento</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.companyDoc"
                  v-validate="modelValidations.companyDoc"
                  type="text"
                  :error="getError('companyDoc')"
                  name="companyDoc"
                  placeholder="CNPJ" 
                  maxlength='18'
                  :inputMask="['##.###.###/####-##']"></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Domínio</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.domain"
                  v-validate="modelValidations.domain"
                  type="text"
                  :error="getError('domain')"
                  name="domain"
                  placeholder="www.seudominio.com.br" 
                  maxlength='200'></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Porcentagem</label>
              <div class="col-md-3">
                <base-input 
                  v-model="model.cachbackPercentage"
                  v-validate="modelValidations.cachbackPercentage"
                  type="tel"
                  :error="getError('cachbackPercentage')"
                  name="cachbackPercentage"
                  placeholder="Porcentagem" 
                  maxlength='4' 
                  :inputMask="['####']">
                </base-input>
              </div>
            </div>
            <div class="row mb-2">
              <label class="col-md-3 col-form-label">Tipo</label>
              <div class="col-md-9">
                <el-select
                    class="select-info"
                    placeholder="Tipo de operação"
                    v-model="model.idOperationType"
                    v-loading.lock="selectLoading"
                    lock>
                    <el-option
                      v-for="t in operationTypeList"
                      class="select-primary"
                      :value="t.id"
                      :label="t.name"
                      :key="t.id"
                    >
                    </el-option>
                  </el-select>
              </div>
            </div>
            <template v-if="model.logo">
                <div class="row mb-3">
                  <label class="col-md-3 col-form-label">Logo (160px X 68px)</label>
                  <div class="col-md-9">
                    <div>
                      <img style="max-width:160px;max-height:68px;" :src="model.logo" class="img-preview" />
                      <base-button @click="model.logo = ''" class="btn-simple btn-file" type="danger">
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row mb-3">
                  <label class="col-md-3 col-form-label">Logo (160px X 68px)</label>
                  <div class="col-md-9">
                    <image-upload @change="onImageChange" style="max-width:160px;max-height:68px;" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                  </div>
                </div>
              </template>
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
                <base-link class="btn mt-3 btn-simple btn-primary" to="/operations">Voltar</base-link>
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
        <el-tab-pane label="Configurações" :disabled="viewAction == 'new' ? true : false">
          <operation-config v-loading="formLoading" parent="operations" :parentId="id" ref="operationconfig"></operation-config>
        </el-tab-pane>
        <el-tab-pane  label="Páginas" :disabled="viewAction == 'new' ? true : false">
          <static-texts v-loading="formLoading" parent="operations" :parentId="id" ref="statictexts"></static-texts>
        </el-tab-pane>
      </el-tabs>
    </card>
  </div>
</div>
</template>
<script>
import { Select, Option, Tabs, TabPane } from 'element-ui';
import operationService from '../../services/Operation/operationService';
import helperService from '../../services/Helper/helperService';
import StaticTexts from 'src/components/StaticTexts';
import OperationConfig from 'src/components/OperationConfig';
import { ImageUpload } from 'src/components/index';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    StaticTexts,
    OperationConfig,
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
      publishLoading: false,
      canPublish: false,
      publishLabel:"Publicar",
      image: null,
      model: {
        title: '',
        companyName: '',
        companyDoc: '',
        domain: '',
        idOperationType: 0,
        cachbackPercentage: 0,
        active: false,
        image: ''
      },
      modelValidations: {
        title: {
          required: true,
          max: 300
        },
        companyName: {
          required: true,
          max: 300
        },
        companyDoc: {
          required: true,
          max: 18
        },
        domain: {
          required: true,
          max: 200
        },
        idOperationType: {
          required: true,
          max: 4
        }
      },
      operationTypeList: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_operation' ? 'edit' : 'new';
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
                self.model.logo = response.data.url;
                self.saveOperation(self);
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
            self.saveOperation(self);
          }
        }
      });
    },
    saveOperation(vw){
      if (vw.viewAction == 'new') {
        operationService.create(vw.model).then(
          () => {
            vw.$notify({
              type: 'primary',
              message: 'Operação cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push('/operations');
            vw.submitLoading = false;
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.submitLoading = false;
          }
        );
      } else {
        operationService.update(vw.model).then(
          response => {
            vw.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push('/operations');
            vw.submitLoading = false;
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.submitLoading = false;
          }
        );
      }
    },
    publish(){
      const self = this;
      self.publishLoading = true;
      self.publishLabel = "Processando";
      operationService.publish(self.id).then(
        response => {
            self.$notify({
              type: 'primary',
              message: 'A operação está sendo publicada, e assim que estiver concluído você verá aqui.',
              icon: 'tim-icons icon-bell-55'
            });
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
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        operationService.get(self.id).then(
          response => {
            self.model = response.data;
            self.publishLabel = response.data.publishStatus;
            self.canPublish = response.data.canPublish;
            self.publishLoading = response.data.publishStatus === "Processando";
            self.formLoading = false;
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
            if (el.id != self.id) {
              self.operationTypeList.push({ id: el.id, name: el.name });
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
<style>
</style>
