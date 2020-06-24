<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Benefício</span>
        <span v-else>Editar Benefício</span>
      </h2>
      <div class="box-actions">
        <base-link to="/benefits" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="formLoading" @submit.prevent>
        <div class="form-left">
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="partnerList"
                :reduce="op => op.code"
                :key="model.idPartner"
                v-model="model.idPartner"
                placeholder="Parceiro"
                :class="{ 'has-error': customErrors.get('idPartner') }"
              >
                <span slot="no-options">Nenhum parceiro encontrado</span>
              </v-select>
              <label v-show="customErrors.get('idPartner')" class="ias-error">{{
                customErrors.get('idPartner')
              }}</label>
            </div>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.name"
              type="text"
              name="name"
              label="Nome"
              :error="customErrors.get('name')"
              maxlength="200"
            ></custom-input>
            <label v-show="customErrors.get('name')" class="ias-error">{{
              customErrors.get('name')
            }}</label>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.title"
              type="text"
              name="title"
              label="Título"
              :error="customErrors.get('title')"
              maxlength="200"
            ></custom-input>
            <label v-show="customErrors.get('title')" class="ias-error">{{
              customErrors.get('title')
            }}</label>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.benefitCall"
              type="text"
              name="title"
              label="Chamada do benefício *"
              :error="customErrors.get('benefitCall')"
              maxlength="200"
            ></custom-input>
            <label v-show="customErrors.get('benefitCall')" class="ias-error">{{
              customErrors.get('benefitCall')
            }}</label>
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('detail') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.detail"
              placeholder="Detalhes"
            />
            <label v-show="customErrors.get('detail')" class="ias-error">{{
              customErrors.get('detail')
            }}</label>
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('howToUse') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.howToUse"
              placeholder="Como usar"
            />
            <label v-show="customErrors.get('howToUse')" class="text-danger"
              >Campo obrigatório</label
            >
          </div>
          <div
            class="ias-row"
            :class="{ 'ias-has-error': customErrors.get('benefitType') }"
          >
            <ias-radio
              v-model="model.idBenefitType"
              name="1"
              :key="1"
              :value="1"
              >E-commerce</ias-radio
            >
            <ias-radio
              v-model="model.idBenefitType"
              name="2"
              :key="2"
              :value="2"
              >Varejo Local</ias-radio
            >
            <ias-radio
              v-model="model.idBenefitType"
              name="3"
              :key="3"
              :value="3"
              >Cashback</ias-radio
            >
            <label v-show="customErrors.get('benefitType')" class="text-danger"
              >Campo obrigatório</label
            >
          </div>
          <div
            class="ias-row"
            :class="{ 'ias-has-error': customErrors.get('integrationType') }"
          >
            <ias-radio
              v-model="model.idIntegrationType"
              name="1"
              :key="1"
              :value="1"
              >Rebens</ias-radio
            >
            <ias-radio
              v-model="model.idIntegrationType"
              name="2"
              :key="2"
              :value="2"
              >Zanox</ias-radio
            >
            <label
              v-show="customErrors.get('integrationType')"
              class="text-danger"
              >Campo obrigatório!</label
            >
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              v-model="model.minDiscountPercentage"
              type="text"
              name="minDiscountPercentage"
              :label="
                model.idBenefitType == 3
                  ? 'Porcentagem mínima'
                  : 'Desconto mínimo'
              "
              :error="customErrors.get('minDiscount')"
              :isMoney="true"
            ></custom-input>
            <custom-input
              :required="true"
              v-model="model.maxDiscountPercentage"
              type="text"
              name="maxDiscountPercentage"
              :label="
                model.idBenefitType == 3
                  ? 'Porcentagem máxima'
                  : 'Desconto máximo'
              "
              :error="customErrors.get('maxDiscount')"
              :isMoney="true"
            ></custom-input>
          </div>
          <div class="ias-row" v-if="model.idBenefitType == 3">
            <custom-input
              :required="true"
              v-model="model.taxAmount"
              type="text"
              name="taxAmount"
              label="Valor imposto (18,33%)"
              :error="customErrors.get('taxAmount')"
              :isMoney="true"
            ></custom-input>
            <custom-input
              :required="true"
              v-model="model.cashbackAmount"
              type="text"
              name="cashbackAmount"
              label="Cashback para o cliente"
              :error="customErrors.get('cashbackAmount')"
              :isMoney="true"
            ></custom-input>
          </div>
          <div class="ias-row" v-if="model.idBenefitType == 3">
            <custom-input
              v-model="cashbackMin"
              type="text"
              label="Cashback mínimo para o cliente"
              disabled
              readonly
              :isMoney="true"
            ></custom-input>
            <custom-input
              v-model="cashbackMax"
              type="text"
              label="Cashback máximo para o cliente"
              disabled
              readonly
              :isMoney="true"
            ></custom-input>
          </div>
          <div class="ias-row" v-if="model.idBenefitType == 3">
            <custom-input
              label="Validade (DD/MM/AAAA)"
              :class="{
                'ias-focus': model.dueDate != null && model.dueDate != ''
              }"
              :error="customErrors.get('dueDate')"
            >
              <el-date-picker
                type="date"
                required
                name="dueDate"
                data-vv-name="dueDate"
                v-model="model.dueDate"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </custom-input>
          </div>
          <div v-else class="ias-row">
            <custom-input
              :required="true"
              v-model="model.cpvPercentage"
              type="text"
              name="cpvPercentage"
              label="CPV"
              :isMoney="true"
              :error="customErrors.get('cpvPercentage')"
            ></custom-input>
            <custom-input
              label="Validade (DD/MM/AAAA)"
              :class="{
                'ias-focus': model.dueDate != null && model.dueDate != ''
              }"
              :error="customErrors.get('dueDate')"
            >
              <el-date-picker
                type="date"
                required
                name="dueDate"
                data-vv-name="dueDate"
                v-model="model.dueDate"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </custom-input>
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('voucherText') }"
            v-if="model.idBenefitType == 2"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.voucherText"
              placeholder="Texto do voucher"
            />
            <label v-show="customErrors.get('voucherText')" class="text-danger"
              >Campo obrigatório</label
            >
          </div>
          <div class="ias-row" v-else>
            <custom-input
              :required="true"
              v-model="model.link"
              type="text"
              name="link"
              label="Link"
              :error="customErrors.get('link')"
              maxlength="200"
            ></custom-input>
            <label v-show="customErrors.get('link')" class="ias-error">{{
              customErrors.get('link')
            }}</label>
          </div>
          <div class="ias-row">
            <custom-input
              label="Data início (DD/MM/AAAA)"
              :class="{ 'ias-focus': model.start != null && model.start != '' }"
              :error="customErrors.get('start')"
            >
              <el-date-picker
                type="date"
                required
                name="start"
                data-vv-name="start"
                v-model="model.start"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </custom-input>
            <custom-input
              label="Data Fim (DD/MM/AAAA)"
              :class="{ 'ias-focus': model.end != null && model.end != '' }"
              :error="customErrors.get('end')"
            >
              <el-date-picker
                type="date"
                required
                name="end"
                data-vv-name="end"
                v-model="model.end"
                format="dd/MM/yyyy"
              ></el-date-picker>
            </custom-input>
          </div>

          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="highlights.filter(item => item.code < 9)"
                :reduce="item => item.code"
                :key="model.homeHighlight"
                v-model="model.homeHighlight"
                placeholder="Destaque home?"
                :class="{ 'has-error': customErrors.get('homeHighlight') }"
              >
                <span slot="no-options">Nenhum destaque encontrado</span>
              </v-select>
              <label
                v-show="customErrors.get('homeHighlight')"
                class="ias-error"
                >{{ customErrors.get('homeHighlight') }}</label
              >
            </div>
            <div class="select-holder">
              <v-select
                :options="highlights"
                :reduce="item => item.code"
                :key="model.homeBenefitHighlight"
                v-model="model.homeBenefitHighlight"
                placeholder="Destaque home benefícios?"
                :class="{
                  'has-error': customErrors.get('homeBenefitHighlight')
                }"
              >
                <span slot="no-options">Nenhum destaque encontrado</span>
              </v-select>
              <label
                v-show="customErrors.get('homeBenefitHighlight')"
                class="ias-error"
                >{{ customErrors.get('homeBenefitHighlight') }}</label
              >
            </div>
          </div>
          <div class="ias-row" v-show="isRebens">
            <ias-checkbox v-model="model.exclusive">Exclusivo</ias-checkbox>
            <div class="select-holder">
              <v-select
                :options="operationList"
                :reduce="op => op.code"
                :key="model.idOperation"
                v-model="model.idOperation"
                placeholder="Operação"
                :disabled="!model.exclusive"
              ></v-select>
              <label v-show="customErrors.get('operation')" class="text-danger"
                >customErrors.get('operation')</label
              >
            </div>
          </div>

          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validate"
              >
                <span v-if="viewAction === 'new'">Cadastrar</span>
                <span v-else>Salvar</span>
              </button>
              <ias-checkbox v-model="model.active">Ativo</ias-checkbox>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <ias-image-upload
            @change="onImageChange"
            img-size="(1200x500)"
            :src="model.image"
            :error="customErrors.get('image')"
          />
          <div class="select-holder-right">
            <v-select
              :options="operationList"
              :reduce="op => op.code"
              :key="model.operations"
              v-model="model.operations"
              placeholder="Selecione o Clube"
              multiple
              :class="{ 'has-error': customErrors.get('operations') }"
            ></v-select>
            <label v-if="customErrors.get('operations')" class="ias-error">{{
              customErrors.get('operations')
            }}</label>
          </div>
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="viewAction !== 'new'"
      :show="showSuccessModal"
      link="/benefits"
    ></success-modal>
  </div>
</template>
<script>
import { Select, Option, DatePicker } from 'element-ui';
import benefitService from '../../services/Benefit/benefitService';
import helperService from '../../services/Helper/helperService';
import operationService from '../../services/Operation/operationService';
import partnerService from '../../services/Partner/partnerService';
import _ from 'lodash';
import { SuccessModal } from 'src/components';
import config from '../../config';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [DatePicker.name]: DatePicker,
    SuccessModal
  },
  props: {
    id: String
  },
  data() {
    return {
      customToolbar: [],
      formLoading: false,
      submitLoading: false,
      benefitTypeLoading: false,
      integrationTypeLoading: false,
      image: null,
      partnerList: [],
      operationList: [],
      customErrors: new Map(),
      operationKey: 0,
      isRebens: false,
      showSuccessModal: false,
      selectLoading: false,
      highlights: [
        { code: -1, label: 'Sem Destaque' },
        { code: 0, label: 'Randomico' },
        { code: 1, label: 'Posição 1' },
        { code: 2, label: 'Posição 2' },
        { code: 3, label: 'Posição 3' },
        { code: 4, label: 'Posição 4' },
        { code: 5, label: 'Posição 5' },
        { code: 6, label: 'Posição 6' },
        { code: 7, label: 'Posição 7' },
        { code: 8, label: 'Posição 8' },
        { code: 9, label: 'Posição 9' },
        { code: 10, label: 'Posição 10' },
        { code: 11, label: 'Posição 11' },
        { code: 12, label: 'Posição 12' }
      ],
      model: {
        name: '',
        title: '',
        image: '',
        dueDate: null,
        link: '',
        maxDiscountPercentage: 0,
        cpvPercentage: 0,
        minDiscountPercentage: 0,
        taxAmount: 0,
        availableCashback: 0,
        cashbackAmount: 0,
        start: null,
        end: null,
        idBenefitType: 0,
        exclusive: false,
        idIntegrationType: 0,
        idPartner: 0,
        benefitCall: '',
        detail: '',
        howToUse: '',
        idOperation: null,
        voucherText: '',
        active: false,
        homeHighlight: null,
        homeBenefitHighlight: null,
        operations: []
      }
    };
  },
  computed: {
    cashbackMax() {
      if (
        this.model.taxAmount &&
        this.model.taxAmount > 0 &&
        this.model.cashbackAmount &&
        this.model.cashbackAmount > 0 &&
        this.model.maxDiscountPercentage &&
        this.model.maxDiscountPercentage > 0
      ) {
        return (
          (this.model.maxDiscountPercentage -
            (this.model.maxDiscountPercentage * this.model.taxAmount) / 100) *
          (this.model.cashbackAmount / 100)
        );
      }
      return '';
    },
    cashbackMin() {
      if (
        this.model.taxAmount &&
        this.model.taxAmount > 0 &&
        this.model.cashbackAmount &&
        this.model.cashbackAmount > 0 &&
        this.model.minDiscountPercentage &&
        this.model.minDiscountPercentage > 0
      ) {
        return (
          (this.model.minDiscountPercentage -
            (this.model.minDiscountPercentage * this.model.taxAmount) / 100) *
          (this.model.cashbackAmount / 100)
        );
      }
      return '';
    },
    viewAction() {
      return this.$route.name == 'edit_benefit' ? 'edit' : 'new';
    },
    activeName: {
      get: function() {
        if (this.$route.query && this.$route.query.tab)
          return this.$route.query.tab == 'op'
            ? this.isRebens
              ? 'operations'
              : 'categories'
            : 'benefit';
        return 'benefit';
      },
      set: function() {}
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      self.customErrors = new Map();

      if (!self.model.name) self.customErrors.set('name', 'Campo obrigatório');
      if (!self.model.title)
        self.customErrors.set('title', 'Campo obrigatório');
      if (!self.model.benefitCall)
        self.customErrors.set('benefitCall', 'Campo obrigatório');
      if (!self.model.detail)
        self.customErrors.set('detail', 'Campo obrigatório');
      if (!self.model.howToUse)
        self.customErrors.set('howToUse', 'Campo obrigatório');
      if (!self.model.idPartner)
        self.customErrors.set('idPartner', 'Campo obrigatório');
      if (!self.model.idBenefitType)
        self.customErrors.set('benefitType', 'Campo obrigatório');
      if (self.model.idBenefitType == 2) {
        if (!self.model.voucherText)
          self.customErrors.set('voucherText', 'Campo obrigatório');
      } else {
        if (!self.model.link || self.model.link == '')
          self.customErrors.set('link', 'Campo obrigatório');
      }

      if (self.isRebens && self.model.idBenefitType != 3) {
        if (!self.model.maxDiscountPercentage)
          self.customErrors.set('maxDiscount', 'Campo obrigatório');
        if (!self.model.minDiscountPercentage)
          self.customErrors.set('minDiscount', 'Campo obrigatório');
      } else {
        if (self.isRebens && !self.model.cashbackAmount)
          self.customErrors.set('cashbackAmount', 'Campo obrigatório');
      }
      if (self.isRebens && !self.model.idIntegrationType)
        self.customErrors.set('integrationType', 'Campo obrigatório');
      if (!self.model.image && !self.image)
        self.customErrors.set('image', 'Campo obrigatório');
      if (!self.model.dueDate)
        self.customErrors.set('dueDate', 'Campo obrigatório');
      if (self.model.exclusive && !self.model.idOperation)
        self.customErrors.set('operation', 'Campo obrigatório');
      if (!self.model.homeHighlight && self.model.homeHighlight != 0)
        self.customErrors.set('homeHighlight', 'Campo obrigatório');
      if (
        !self.model.homeBenefitHighlight &&
        self.model.homeBenefitHighlight != 0
      )
        self.customErrors.set('homeBenefitHighlight', 'Campo obrigatório');
      if (!self.model.operations || self.model.operations.length === 0)
        self.customErrors.set('operations', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          helperService.uploadImage(self.image).then(
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
    },
    saveBenefit(vw) {
      vw = vw ? vw : this;
      if (!vw.isRebens) {
        vw.model.exclusive = true;
        vw.model.idOperation = vw.$store.getters.currentUser.idOperation;
      }
      if (vw.viewAction == 'new') {
        benefitService.create(vw.model).then(
          () => {
            vw.submitLoading = false;
            vw.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400) {
              vw.$notify({
                type: 'danger',
                message: err.response.data.message
              });
            } else {
              vw.$notify({
                type: 'danger',
                message: err.message
              });
            }
            vw.submitLoading = false;
          }
        );
      } else {
        benefitService.update(vw.model).then(
          () => {
            vw.submitLoading = false;
            vw.showSuccessModal = true;
          },
          err => {
            vw.$notify({
              type: 'danger',
              message: err.message
            });
            vw.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
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
      partnerService.listActive(4).then(response => {
        _.each(response.data, function(el) {
          self.partnerList.push({ label: el.name, code: el.id });
        });
      });
      operationService.findAll(null).then(response => {
        _.each(response.data, function(el) {
          self.operationList.push({ label: el.title, code: el.id });
        });
      });
    },
    onImageChange(file) {
      this.image = file;
    }
  },
  created() {
    this.fetchData();
    this.isRebens =
      this.$store.getters.currentUser.role != 'administrator' &&
      this.$store.getters.currentUser.role != 'publisher';
  }
};
</script>
