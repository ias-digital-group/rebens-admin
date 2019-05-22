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
          v-if="viewAction != 'new'"
          :disabled="!model.canPublish"
          :loading="publishLoading">
          {{model.publishStatus}}</base-button>
          <base-button class="pull-right" 
          native-type="button"
          type="info"
          v-if="showTempPublishBtn"
          :disabled="model.temporaryPublishStatus == 'Publicado Temporário'"
          @click="publishTemp"
          :loading="publishTempLoading">{{model.temporaryPublishStatus}}</base-button>
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
                  :disabled="!isMaster"
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
                  :disabled="!isMaster"
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
                  :disabled="!isMaster"
                  :inputMask="['##.###.###/####-##']"></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Domínio</label>
              <div class="col-md-9">
                <base-input 
                  v-model="model.domain"
                  v-validate="modelValidations.domain"
                  type="text"
                  :error="getError('domain')"
                  name="domain"
                  :disabled="!isMaster"
                  placeholder="www.seudominio.com.br" 
                  maxlength='200'></base-input>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Subdomínio temporário</label>
              <div class="col-md-5">
                <base-input 
                  v-model="model.temporarySubdomain"
                  type="text"
                  :error="getError('temporarySubdomain')"
                  name="temporarySubdomain"
                  :disabled="!isMaster"
                  placeholder="" 
                  maxlength='50'></base-input>
                  <label style="position:absolute;top:11px;right:30px;">.sistemarebens.com.br</label>
              </div>
              <a :href="temporaryUrl" v-show="model.subdomainCreated" class="col-md-4 col-form-label text-left" target="_blank">preview</a>
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
                  :disabled="!isMaster"
                  :inputMask="['####']">
                </base-input>
              </div>
            </div>
            <div class="row mb-2">
              <label class="col-md-3 col-form-label">Tipo</label>
              <div class="col-md-9" :class="idOperationTypeError ? 'has-danger' : ''">
                <el-select
                    class="select-info"
                    required
                    placeholder="Tipo de operação"
                    v-model="model.idOperationType"
                    v-loading.lock="selectLoading"
                    v-validate="modelValidations.idOperationType"
                    :error="getError('idOperationType')"
                    :disabled="!isMaster"
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
                  <label v-show="idOperationTypeError" class="error">&nbsp;&nbsp;O campo Tipo é obrigatório.</label>
              </div>
            </div>
            <template v-if="model.logo">
                <div class="row mb-3">
                  <label class="col-md-3 col-form-label">Logo (160px X 68px)</label>
                  <div class="col-md-9">
                    <div>
                      <img style="max-width:160px;max-height:68px;" :src="model.logo" class="img-preview" />
                      <base-button @click="model.logo = ''" class="btn-simple btn-file" :disabled="!isMaster" type="danger">
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
                    <image-upload @change="onImageChange" style="max-width:160px;max-height:68px;" change-text="Alterar" :disabled="!isMaster" remove-text="Remover" select-text="Selecione uma imagem" />
                  </div>
                </div>
              </template>
            <div class="row">
                <label class="col-md-3 col-form-label">Ativo</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.active" :disabled="!isMaster">&nbsp;</base-checkbox>
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
                  v-show="isMaster"
                  :disabled="model.publishStatus == 'Processando' || model.temporaryPublishStatus == 'Processando'"
                  @click.native.prevent="validate"
                  :loading="submitLoading">
                  Salvar
                </base-button>
              </div>
            </div>
          </form>
        </el-tab-pane>
        <el-tab-pane label="Configurações" :disabled="viewAction == 'new' || !isMaster ? true : false">
          <operation-config v-loading="formLoading" parent="operations" :parentId="id" :key="configKey" ref="operationconfig"></operation-config>
        </el-tab-pane>
        <el-tab-pane  label="Páginas" :disabled="viewAction == 'new' ? true : false">
          <static-texts v-loading="formLoading" parent="operations" :parentId="id" ref="statictexts"></static-texts>
        </el-tab-pane>
        <el-tab-pane label="Perguntas Frequentes" :disabled="viewAction == 'new'">
          <faq v-loading="formLoading" parent="operations" :parentId="id" ref="faq"></faq>
        </el-tab-pane>
        <el-tab-pane label="Pré cadastro" :disabled="viewAction == 'new'">
          <customers v-loading="formLoading" parent="operations" :parentId="id" ref="customers"></customers>
        </el-tab-pane>
        <el-tab-pane label="Parceiros" :disabled="viewAction == 'new'">
          <partners v-loading="formLoading" parent="operations" :parentId="id" ref="partners"></partners>
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
import Faq from 'src/components/Faq';
import Partners from 'src/components/OperationPartner';
import Customers from 'src/components/Customers';
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
    Faq,
    Customers,
    Partners,
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
      publishTempLoading: false,
      showTempPublishBtn: false,
      image: null,
      isMaster:false,
      configKey:0,
      idOperationTypeError:false,
      model: {
        title: '',
        companyName: '',
        companyDoc: '',
        domain: '',
        idOperationType: 0,
        cachbackPercentage: 0,
        active: false,
        image: '',
        temporarySubdomain:'',
        subdomainCreated:false,
        canPublish:false,
        temporaryPublishStatus:'',
        publishStatus:'',
        canPublishTemporary:false
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
        temporarySubdomain:{
          max:20
        },
        companyDoc: {
          required: true,
          max: 18
        },
        domain: {
          max: 200
        },
        idOperationType: {
          required: true
        }
      },
      operationTypeList: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_operation' ? 'edit' : 'new';
    },
    temporaryUrl(){
      return 'http://' + this.model.temporarySubdomain + '.sistemarebens.com.br';
    }

  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      if(!self.idOperationType || self.idOperationType === '' || self.idOperationType === 0){
        self.idOperationTypeError = true;
      }
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
          response => {
            vw.$notify({
              type: 'primary',
              message: 'Operação cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push(`/operations/${response.id}/edit/`);
            setTimeout(() => {
              vw.fetchData();  
              vw.configKey++;
            }, 500);
            
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
            vw.$router.go();

            //window.location.reload(true);
            // vw.$router.push(`/operations/${vw.model.id}/edit/`);
            // vw.submitLoading = false;
            //vw.canPublish = response.data;
            //vw.fetchData();
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
      operationService.publish(self.id, false).then(
        () => {
            self.$notify({
              type: 'primary',
              message: 'A operação está sendo publicada, e assim que estiver concluído você verá aqui.',
              icon: 'tim-icons icon-bell-55'
            });
            self.model.publishStatus = "Processando";
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
    publishTemp(){
      const self = this;
      self.publishTempLoading = true;
      operationService.publish(self.id, true).then(
        () => {
            self.$notify({
              type: 'primary',
              message: 'A operação está sendo publicada, e assim que estiver concluído você verá aqui.',
              icon: 'tim-icons icon-bell-55'
            });
            self.model.temporaryPublishStatus = "Processando";
          },
          err => {
            self.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            self.publishTempLoading = false;
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
            self.publishLoading = response.data.publishStatus === 'Processando';
            self.formLoading = false;
            self.publishTempLoading = response.data.temporaryPublishStatus === 'Processando Temporário';
            self.showTempPublishBtn = response.data.temporaryPublishStatus !== 'Incompleto Temporário';
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
    this.isMaster = this.$store.getters.currentUser.role == "master";
    this.fetchData();
  }
};
</script>