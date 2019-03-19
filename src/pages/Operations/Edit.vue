<template>
<div class="row">
  <div class="col-md-12">
    <card title="Horizontal Form">
      <h4 slot="header" class="card-title">{{$t('pages.operations.title')}}</h4>
      <el-tabs>
        <el-tab-pane label="Operação">
          <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
            <div class="row">
              <label class="col-md-3 col-form-label">Código</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.code"
                  v-validate="modelValidations.codigo"
                  type="text"
                  :error="getError('codigo')"
                  name="codigo"
                  placeholder="Codigo" 
                  maxlength='300'></base-input>
              </div>
            </div>
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
                  placeholder="Documento" 
                  maxlength='18'
                  :inputMask="['##.###.###/####-##']"></base-input>
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
            <div class="row">
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
            <div class="row">
                <label class="col-md-3 col-form-label">Ativo</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.active">&nbsp;</base-checkbox>
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
                <base-link class="btn mt-3 btn-secondary" to="/operations">Voltar</base-link>
              </div>
            </div>
          </form>
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
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    StaticTexts
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
        title: '',
        companyName: '',
        companyDoc: '',
        domain: '',
        idOperationType: 0,
        cachbackPercentage: 0,
        active: false
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
          if (self.viewAction == 'new') {
            operationService.create(self.model).then(
              () => {
                self.$notify({
                  type: 'primary',
                  message: 'Operação cadastrada com sucesso!',
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/operations');
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
            operationService.update(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/operations');
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
        operationService.get(self.id).then(
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
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style>
</style>
