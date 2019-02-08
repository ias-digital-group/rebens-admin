<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Benefícios">
        <h4 slot="header" class="card-title">{{$t('pages.benefits.title')}}</h4>
        <el-tabs>
          <el-tab-pane label="Benefício">
            <form class="form-horizontal mt-3" v-loading="formLoading" @submit.prevent>
              <div class="row">
                <label class="col-md-3 col-form-label">Titulo</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.title"
                    v-validate="modelValidations.titulo"
                    type="text"
                    :error="getError('titulo')"
                    name="titulo"
                    placeholder="Titulo" 
                    maxlength='400'></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Site</label>
                <div class="col-md-9">
                  <base-input 
                    v-model="model.webSite"
                    placeholder="Site" 
                    maxlength='500'></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Validade</label>
                <div class="col-md-2">
                  <base-input>
                    <el-date-picker
                      type="date"
                      placeholder="Validade"
                      v-model="model.dueDate">
                    </el-date-picker>
                  </base-input>
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
              <div class="row">
                <label class="col-md-3 col-form-label">% On-line</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Max. desconto">
                    <money class="form-control" v-model="model.maxDiscountPercentageOnline" v-bind="money"></money>
                  </base-input>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
                  <base-input label="Cpv">
                    <money class="form-control" v-model="model.cpvpercentageOnline" v-bind="money"></money>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">% Off-line</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Max. desconto">
                    <money class="form-control" v-model="model.maxDiscountPercentageOffline" v-bind="money"></money>
                  </base-input>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
                  <base-input label="Cpv">
                    <money class="form-control" v-model="model.cpvpercentageOffline" v-bind="money"></money>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Tipo</label>
                <div class="col-md-2">
                  <div class="form-group">
                    <el-select
                      :class="{'select-info': true, 'has-danger': errors.has('tipo')}"
                      placeholder="Tipo"
                      v-model="model.idBenefitType"
                      v-validate="modelValidations.tipo"
                      name="tipo"
                      v-loading.lock="benefitTypeLoading">
                      <el-option
                        v-for="benefitType in benefitTypeList"
                        class="select-primary"
                        :value="benefitType.id"
                        :label="benefitType.name"
                        :key="benefitType.id">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('tipo')" class="error" v-html="getError('tipo')"></label>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Integração</label>
                <div class="col-md-2">
                  <div class="form-group">
                    <el-select
                      :class="{'select-info': true, 'has-danger': errors.has('integração')}"
                      placeholder="integração"
                      v-model="model.idIntegrationType"
                      v-validate="modelValidations.integração"
                      name="integração"
                      v-loading.lock="integrationTypeLoading">
                      <el-option
                        v-for="integrationType in integrationTypeList"
                        class="select-primary"
                        :value="integrationType.id"
                        :label="integrationType.name"
                        :key="integrationType.id">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('integração')" class="error" v-html="getError('integração')"></label>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Parceiro</label>
                <div class="col-md-2">
                  <div class="form-group">
                    <el-select
                      :class="{'select-info': true, 'has-danger': errors.has('parceiro')}"
                      placeholder="Parceiro"
                      v-model="model.idPartner"
                      v-validate="modelValidations.parceiro"
                      name="parceiro"
                      v-loading.lock="partnerLoading">
                      <el-option
                        v-for="partner in partnerList"
                        class="select-primary"
                        :value="partner.id"
                        :label="partner.name"
                        :key="partner.id">
                      </el-option>
                    </el-select>
                    <label v-show="errors.has('parceiro')" class="error" v-html="getError('parceiro')"></label>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"></label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.exclusive">Exclusivo</base-checkbox>
                  </div>
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
                <label class="col-md-3 col-form-label">Teaser do benefício</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.teaser" cols="30" rows="3"></textarea>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Chamada do benefício</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.benefitCall" cols="30" rows="3"></textarea>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Descrição do funcionamento on-line</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.descriptionOnLine" cols="30" rows="3"></textarea>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Descrição do funcionamento off-line</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.descriptionOffLine" cols="30" rows="3"></textarea>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Funcionamento voucher</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.voucherOperation" cols="30" rows="3"></textarea>
                  </base-input>
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
                  <base-link class="btn mt-3 btn-secondary" to="/benefits">Voltar</base-link>
                </div>
              </div>
            </form>
          </el-tab-pane>
          <el-tab-pane label="Endereços" :disabled="viewAction == 'new' ? true : false">
            <addresses v-loading="formLoading" parent="benefits" :parentId="id" ref="addresses"></addresses>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane, DatePicker } from 'element-ui';
import Addresses from 'src/components/Addresses';
import benefitService from '../../services/Benefit/benefitService';
import helperService from '../../services/Helper/helperService';
import partnerService from '../../services/Partner/partnerService';
import _ from 'lodash';
import { ImageUpload } from 'src/components/index';
import { Money } from 'v-money';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [DatePicker.name]: DatePicker,
    Addresses,
    ImageUpload,
    Money
  },
  props: {
    id: String
  },
  data() {
    return {
      formLoading: false,
      submitLoading: false,
      benefitTypeLoading: false,
      integrationTypeLoading: false,
      partnerLoading: false,
      image: null,
      benefitTypeList: [],
      integrationTypeList: [],
      partnerList: [],
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '%',
        precision: 2,
        masked: false
      },
      model: {
        title: '',
        image: '',
        dueDate: null,
        webSite: '',
        maxDiscountPercentageOnline: 0,
        cpvpercentageOnline: 0,
        maxDiscountPercentageOffline: 0,
        cpvpercentageOffline: 0,
        start: null,
        end: null,
        idBenefitType: 0,
        exclusive: false,
        idIntegrationType: 0,
        idPartner: 0,
        benefitCall: '',
        teaser: '',
        descriptionOnLine: '',
        descriptionOffLine: '',
        voucherOperation: '',
        active: false
      },
      modelValidations: {
        titulo: {
          required: true,
          max: 400
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_benefit' ? 'edit' : 'new';
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
                self.saveBenefit(self);
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
            self.saveBenefit(self);
          }
        }
      });
    },
    saveBenefit(vw) {
      vw = vw ? vw : this;
      if (vw.viewAction == 'new') {
        benefitService.create(vw.model).then(
          response => {
            vw.$notify({
              type: 'primary',
              message: 'Beneficio cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push(`/benefits/${response.id}/edit/`);
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
        benefitService.update(vw.model).then(
          response => {
            vw.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push('/benefits');
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
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        benefitService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.benefitTypeLoading = true;
      helperService.findAllBenefitsTypes().then(
        response => {
          self.benefitTypeList.push({ id: null, name: '' });
          _.each(response.data, function(el) {
            self.benefitTypeList.push(el);
          });
          self.benefitTypeLoading = false;
        },
        () => {
          self.benefitTypeLoading = false;
        }
      );
      this.integrationTypeLoading = true;
      helperService.findAllIntegrationTypes().then(
        response => {
          self.integrationTypeList.push({ id: null, name: '' });
          _.each(response.data, function(el) {
            self.integrationTypeList.push(el);
          });
          self.integrationTypeLoading = false;
        },
        () => {
          self.integrationTypeLoading = false;
        }
      );
      this.partnerLoading = true;
      partnerService.findAll(null).then(
        response => {
          self.partnerList.push({ id: null, name: '' });
          _.each(response.data, function(el) {
            self.partnerList.push(el);
          });
          self.partnerLoading = false;
        },
        () => {
          self.partnerLoading = false;
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
