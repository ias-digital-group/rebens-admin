<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Banner</span>
        <span v-else>Editar Banner</span>
      </h2>
      <div class="box-actions">
        <base-link to="/banners" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="formLoading" @submit.prevent>
        <div class="form-left">
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
          </div>
          <div class="ias-row">
            <ias-radio v-model="model.idType" name="1" :key="1" :value="1"
              >Banner Full</ias-radio
            >
            <ias-radio v-model="model.idType" name="3" :key="3" :value="3"
              >Imperdíveis</ias-radio
            >
          </div>
          <div
            class="ias-row"
            :class="{ 'ias-has-error': customErrors.get('whereToShow') }"
          >
            <ias-checkbox v-model="model.bannerShowHome">Home</ias-checkbox>
            <ias-checkbox v-model="model.bannerShowHomeLogged"
              >Home Logada</ias-checkbox
            >
            <ias-checkbox
              v-model="model.bannerShowBenefit"
              v-show="model.idType == 3"
              >Home de benefícios</ias-checkbox
            >
            <label v-if="customErrors.get('whereToShow')" class="ias-error">{{
              customErrors.get('whereToShow')
            }}</label>
          </div>
          <div class="ias-row">
            <custom-input
              label="Data Início (DD/MM/AAAA)"
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
            <custom-input
              :required="true"
              v-model="model.link"
              type="text"
              name="link"
              label="Link"
              :error="customErrors.get('link')"
              maxlength="500"
            ></custom-input>
          </div>
          <div class="ias-row">
            <ias-checkbox v-model="model.targetBlank"
              >Abrir em nova aba?</ias-checkbox
            >
            <div class="select-holder">
              <v-select
                :options="orderOptions"
                :reduce="op => op.code"
                :key="model.order"
                v-model="model.order"
                :class="{ 'has-error': customErrors.get('order') }"
                placeholder="Ordem"
              ></v-select>
              <label v-show="customErrors.get('order')" class="ias-error">{{
                customErrors.get('order')
              }}</label>
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
            :img-size="model.idType == 1 ? '(1200x500)' : '(554x277)'"
            :src="model.image"
            :error="customErrors.get('picture')"
          />
          <div class="select-holder-right" v-show="isRebens">
            <v-select
              :options="operations"
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
      link="/banners"
    ></success-modal>
  </div>
</template>
<script>
import { DatePicker } from 'element-ui';
import { SuccessModal } from 'src/components';
import bannerService from '../../services/Banner/bannerService';
import helperService from '../../services/Helper/helperService';
import operationService from '../../services/Operation/operationService';
import _ from 'lodash';

export default {
  components: {
    [DatePicker.name]: DatePicker,
    SuccessModal
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
      customErrors: new Map(),
      operations: [],
      showSuccessModal: false,
      orderOptions: [
        { code: 1, label: '1' },
        { code: 2, label: '2' },
        { code: 3, label: '3' },
        { code: 4, label: '4' },
        { code: 5, label: '5' },
        { code: 6, label: '6' },
        { code: 7, label: '7' },
        { code: 8, label: '8' },
        { code: 9, label: '9' },
        { code: 10, label: '10' }
      ],
      isRebens: false,
      model: {
        name: '',
        order: '',
        image: '',
        active: false,
        link: '',
        idType: 1,
        start: null,
        end: null,
        targetBlank: false,
        bannerShowHome: false,
        bannerShowHomeLogged: false,
        bannerShowBenefit: false,
        operations: []
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_banner' ? 'edit' : 'new';
    },
    activeName: {
      get: function() {
        if (this.$route.query && this.$route.query.tab)
          return this.$route.query.tab == 'op' ? 'operations' : 'banner';
        return 'banner';
      },
      set: function() {}
    }
  },
  methods: {
    querySearch(query, cb) {
      var list = this.benefits;
      var results = query ? list.filter(this.createFilter(query)) : list;
      var top3 = results.slice(0, 3);
      cb(top3);
    },
    createFilter(query) {
      return partner => {
        return partner.value.toLowerCase().includes(query.toLowerCase());
      };
    },
    handleSelect(item) {
      this.model.idBenefit = item.id;
    },
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.name || self.model.name === '')
        self.customErrors.set('name', 'Campo obrigatório');
      if (!self.model.link || self.model.link === '')
        self.customErrors.set('link', 'Campo obrigatório');
      if (!self.model.start)
        self.customErrors.set('start', 'Campo obrigatório');
      if (!self.model.end) self.customErrors.set('end', 'Campo obrigatório');
      if (
        !self.model.bannerShowHome &&
        !self.model.bannerShowHomeLogged &&
        !self.model.bannerShowBenefit
      )
        self.customErrors.set('whereToShow', 'Campo obrigatório');
      if (!self.model.order || self.model.order === '')
        self.customErrors.set('order', 'Campo obrigatório');

      if (!self.image && !self.model.image)
        self.customErrors.set('picture', 'Campo obrigatório');
      if (
        self.isRebens &&
        (!self.model.operations || self.model.operations.length === 0)
      )
        self.customErrors.set('operations', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          helperService.uploadImage(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'warning',
                  message: response.message
                });
                self.submitLoading = false;
                return;
              }
              self.model.image = response.data.url;
              self.saveBanner(self);
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.submitLoading = false;
            }
          );
        } else if (self.model.image) {
          self.saveBanner(self);
        }
      }
    },
    saveBanner(vm) {
      vm = vm ? vm : this;
      if (!vm.model.isBenefit) {
        vm.model.idBenefit = undefined;
      }
      if (vm.viewAction == 'new') {
        bannerService.create(vm.model).then(
          () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
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
          () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            if (err.response.status === 400 && err.response.data.message) {
              vm.$notify({
                type: 'warning',
                message: err.response.data.message
              });
            } else {
              vm.$notify({
                type: 'danger',
                message: err.message
              });
            }
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

      operationService.findAll().then(
        response => {
          self.operations.push({ code: 0, label: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
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
      if (file == null) {
        this.model.image = file;
      }
    }
  },
  created() {
    this.isRebens =
      this.$store.getters.currentUser.role != 'administrator' &&
      this.$store.getters.currentUser.role != 'publisher';
    this.fetchData();
  }
};
</script>
