<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Benefícios">
        <h4 slot="header" class="card-title">{{$t('pages.benefits.title')}}</h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Benefício" name="benefit">
            <form class="form-horizontal mt-3" v-loading="formLoading" @submit.prevent>
              <div class="row">
                <label class="col-md-3 col-form-label">Nome *</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.name"
                    type="text"
                    name="name"
                    placeholder="Nome" 
                    maxlength='300'></base-input>
                  <label v-show="customErros.includes('name')" class="text-danger">O campo Nome é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Título *</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.title"
                    type="text"
                    name="titulo"
                    placeholder="Título" 
                    maxlength='400'></base-input>
                  <label v-show="customErros.includes('title')" class="text-danger">O campo Título é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Chamada do benefício *</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.call"
                    type="text"
                    name="benefitCall"
                    placeholder="Chamada do benefício" 
                    maxlength='500'></base-input>
                  <label v-show="customErros.includes('call')" class="text-danger">O campo Chamada do Benefício é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Detalhes *</label>
                <div class="col-md-9">
                  <wysiwyg v-model="model.detail" />
                  <label v-show="customErros.includes('detail')" class="text-danger">O campo Detalhes é obrigatório!</label>
                </div>
              </div>
              <div class="row m-b-20">
                <label class="col-md-3 col-form-label">Como usar *</label>
                <div class="col-md-9">
                  <wysiwyg v-model="model.howToUse" />
                  <label v-show="customErros.includes('howToUse')" class="text-danger">O campo Como Usar é obrigatório</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Parceiro *</label>
                <div class="col-md-3">
                  <div class="form-group">
                    <el-autocomplete 
                      :fetch-suggestions="querySearch"
                      @select="handleSelect"
                      placeholder=""
                      v-model="partnerName"
                      :trigger-on-focus="false">
                    </el-autocomplete>
                    <input type="hidden" v-model="model.idPartner" />
                  </div>
                </div>
                <div class="col-md-6">
                  <label v-show="customErros.includes('partner')" class="text-danger">O campo Parceiro é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Tipo *</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-radio v-model="model.idBenefitType" :name="1" :value="1" :inline="true">E-commerce</base-radio>
                    <base-radio v-model="model.idBenefitType" :name="2" :value="2" :inline="true">Varejo Local</base-radio>
                    <base-radio v-model="model.idBenefitType" :name="3" :value="3" :inline="true">Cashback</base-radio>
                    <label v-show="customErros.includes('benefitType')" class="text-danger">O campo Tipo é obrigatório</label>
                  </div>
                </div>
              </div>
              <div class="row" v-if="model.idBenefitType != 3">
                <label class="col-md-3 col-form-label">% Desconto *</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Máximo *">
                    <money class="form-control" v-model="model.maxDiscountPercentage" v-bind="money"></money>
                  </base-input>
                  <label v-show="customErros.includes('maxDiscount')" class="text-danger">O campo Desconto Máximo é obrigatório!</label>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
                  <base-input label="Mínimo *">
                    <money class="form-control" v-model="model.minDiscountPercentage" v-bind="money"></money>
                  </base-input>
                  <label v-show="customErros.includes('minDiscount')" class="text-danger">O campo Desconto Mínimo é obrigatório!</label>
                </div>
              </div>
              <div class="row" v-if="model.idBenefitType != 3">
                <label class="col-md-3 col-form-label">CPV *</label>
                <div class="col-md-9 col-lg-4">
                  <base-input>
                    <money class="form-control" v-model="model.cpvPercentage" v-bind="money"></money>
                  </base-input>
                  <label v-show="customErros.includes('cpv')" class="text-danger">O campo CPV é obrigatório</label>
                </div>
              </div>
              <div class="row" v-if="model.idBenefitType != 2">
                <label class="col-md-3 col-form-label">Link *</label>
                <div class="col-md-9">
                  <base-input 
                    v-model="model.webSite"
                    placeholder="Link" 
                    maxlength='500'></base-input>
                  <label v-show="customErros.includes('link')" class="text-danger">O campo Link é obrigatório!</label>
                </div>
              </div>
              <div class="row" v-if="model.idBenefitType == 3">
                <label class="col-md-3 col-form-label">Valor do cashback *</label>
                <div class="col-md-9">
                  <base-input>
                    <money class="form-control" v-model="model.cashbackAmount" v-bind="money"></money>
                  </base-input>
                  <label v-show="customErros.includes('cashbackAmount')" class="text-danger">O campo Valor do cashback é obrigatório!</label>
                </div>
              </div>
              <div class="row" v-if="model.idBenefitType == 2">
                <label class="col-md-3 col-form-label">Texto do voucher *</label>
                <div class="col-md-9">
                  <base-input>
                    <textarea class="form-control" v-model="model.voucherText" cols="30" rows="3"></textarea>
                  </base-input>
                  <label v-show="customErros.includes('voucherText')" class="text-danger">O campo Texto do voucher é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Integração *</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-radio v-model="model.idIntegrationType" :name="1" :value="1" :inline="true">Rebens</base-radio>
                    <base-radio v-model="model.idIntegrationType" :name="2" :value="2" :inline="true">Zanox</base-radio>
                    <label v-show="customErros.includes('integrationType')" class="text-danger">O campo Integração é obrigatório!</label>
                  </div>
                </div>
              </div>
              <template v-if="model.image">
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem *</label>
                  <div class="col-md-9">
                    <div class="fileinput">
                      <div class="thumbnail">
                      <img :src="model.image" class="img-preview" />
                      </div>
                    </div>
                    <div>
                    <base-button @click="model.image = ''" class="btn-simple btn-file" type="danger">
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                    <label v-show="customErros.includes('image')" class="error">O campo Imagem é obrigatório!</label>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label">Imagem *</label>
                  <div class="col-md-9">
                    <image-upload @change="onImageChange" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                    <label v-show="customErros.includes('image')" class="text-danger">O campo Imagem é obrigatório!</label>
                  </div>
                </div>
              </template>
              <div class="row">
                <label class="col-md-3 col-form-label">Validade *</label>
                <div class="col-md-2">
                  <base-input>
                    <el-date-picker
                      type="date"
                      placeholder="Validade"
                      v-model="model.dueDate">
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-md-7">
                  <label v-show="customErros.includes('dueDate')" class="text-danger">O campo Validade é obrigatório!</label>
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
                  <label v-show="customErros.includes('start')" class="text-danger">O campo Início é obrigatório!</label>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
                  <base-input label="Fim">
                    <el-date-picker
                      type="date"
                      placeholder="Fim"
                      v-model="model.end">
                    </el-date-picker>
                  </base-input>
                  <label v-show="customErros.includes('end')" class="text-danger">O campo Fim é obrigatório!</label>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Exclusivo</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.exclusive">&nbsp;</base-checkbox>
                  </div>
                </div>
              </div>
              <div class="row" v-show="model.exclusive">
                <label class="col-md-3 col-form-label">Operação</label>
                <div class="col-md-3">
                  <div class="form-group">
                    <el-autocomplete 
                      :fetch-suggestions="querySearchOp"
                      @select="handleSelectOp"
                      placeholder=""
                      v-model="operationName"
                      :trigger-on-focus="false">
                    </el-autocomplete>
                    <input type="hidden" v-model="model.idOperation" />

                  </div>
                </div>
                <div class="col-md-6">
                  <label v-show="customErros.includes('operation')" class="text-danger">O campo Operação é obrigatório!</label>
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
                  <base-link class="btn btn-primary btn-simple mt-3" to="/benefits">Voltar</base-link>
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
          <el-tab-pane label="Operações"  name="operations" :disabled="viewAction == 'new' ? true : false">
            <operations v-loading="formLoading" parent="benefits" :parentId="id" :key="operationKey"></operations>
          </el-tab-pane>
          <el-tab-pane label="Categorias" name="categories" :disabled="viewAction == 'new' ? true : false">
            <categories v-loading="formLoading" parent="benefits" :parentId="id" :key="operationKey"></categories>
          </el-tab-pane>
          <el-tab-pane label="Endereços" name="addresses" :disabled="viewAction == 'new' ? true : false">
            <addresses v-loading="formLoading" parent="benefits" :parentId="id" ref="addresses" :key="operationKey"></addresses>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane, DatePicker } from 'element-ui';
import Addresses from 'src/components/Addresses';
import Categories from 'src/components/Categories';
import Operations from 'src/components/Operations';
import benefitService from '../../services/Benefit/benefitService';
import helperService from '../../services/Helper/helperService';
import operationService from '../../services/Operation/operationService';
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
    Money,
    Operations,
    Categories
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
      operationLoading: false,
      image: null,
      partnerList: [],
      customErros: [],
      operationList: [],
      operationKey: 0,
      partnerName:'',
      operationName:'',
      money: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '%',
        precision: 2,
        masked: false
      },
      model: {
        name: '',
        title: '',
        image: '',
        dueDate: null,
        link: '',
        maxDiscountPercentage: 0,
        cpvPercentage: 0,
        minDiscountPercentage: 0,
        cashbackAmount: 0,
        start: null,
        end: null,
        idBenefitType: 0,
        exclusive: false,
        idIntegrationType: 0,
        idPartner: 0,
        call: '',
        detail: '',
        howToUse: '',
        idOperation:null,
        voucherText:'',
        active: false,
        exclusive: false
      },
      modelValidations: {
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_benefit' ? 'edit' : 'new';
    },
    activeName:{
      get:function(){
      if(this.$route.query && this.$route.query.tab)
        return this.$route.query.tab == 'op' ? 'operations' : 'benefit';
      return 'benefit';
      },
      set:function(){

      }
    }
  },
  methods: {
    querySearch(query, cb) {
      var list = this.partnerList;
      var results = query ? list.filter(this.createFilter(query)) : list;
      var top3 = results.slice(0, 3);
      cb(top3);
    },
    querySearchOp(query, cb) {
      var list = this.operationList;
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
      this.model.idPartner = item.id;
    },
    handleSelectOp(item){
      this.model.idOperation = item.id;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      let error = false;
      self.customErros = [];

      if(!self.model.name)
        self.customErros.push('name');
      if(!self.model.title)
        self.customErros.push('title');
      if(!self.model.call)
        self.customErros.push('call');
      if(!self.model.detail)
        self.customErros.push('detail');
      if(!self.model.howToUse)
        self.customErros.push('howToUse');
      if(!self.model.idPartner)
        self.customErros.push('partner');
      if(!self.model.idBenefitType)
        self.customErros.push('benefitType');
      if(self.model.idBenefitType == 2){
        if(!self.model.voucherText)
          self.customErros.push('voucherText');
      }
      else{ 
        if(!self.model.link || self.model.link == '')
          self.customErros.push('link');
      }

      if(self.model.idBenefitType != 3){
        if(!self.model.maxDiscountPercentage)
            self.customErros.push('maxDiscount');
        if(!self.model.minDiscountPercentage)
          self.customErros.push('minDiscount');
        if(!self.model.cpvPercentage)
          self.customErros.push('cpv');
      }
      else{
        if(!self.model.cashbackAmount)
          self.customErros.push('cashbackAmount');
      }
      
      if(!self.model.idIntegrationType)
        self.customErros.push('integrationType');
      if(!self.model.image && !self.image)
        self.customErros.push('image');
      if(!self.model.dueDate)
        self.customErros.push('dueDate');
      if(self.model.exclusive && !self.model.idOperation)
        self.customErros.push('operation');

      this.$validator.validateAll().then(isValid => {
        if (isValid && self.customErros.length == 0) {
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
            vw.$router.push({path: `/benefits/${response.id}/edit/`, query:{tab:'op'}});
            vw.operationKey++;
            vw.id = response.id;
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
            this.populatePartner();
            this.populateOperation();
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.partnerLoading = true;
      partnerService.findAll(null).then(
        response => {
          _.each(response.data, function(el) {
            self.partnerList.push({ value: el.name, id: el.id });
          });
          self.partnerLoading = false;
          this.populatePartner();
        },
        () => {
          self.partnerLoading = false;
        }
      );
      this.operationLoading = true;
      operationService.findAll(null).then(
        response => {
          _.each(response.data, function(el){
            self.operationList.push({ value: el.title, id: el.id });
          });
          self.operationLoading = false;
          this.populateOperation();
        },
        () => {
          self.operationLoading = false;
        }
      );
    },
    populatePartner(){
      if(!this.formLoading && !this.partnerLoading){
        var part = this.partnerList.filter(o => o.id == this.model.idPartner);
        if(part.length == 1)
          this.partnerName = part[0].value;
      }
    },
    populateOperation(){
      if(!this.formLoading && !this.operationLoading && this.model.idOperation){
        var op = this.operationList.filter(o => o.id == this.model.idOperation);
        if(op.length == 1)
          this.operationName = op[0].value;
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