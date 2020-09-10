<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Campanha</span>
        <span v-else>Editar Campanha</span>
      </h2>
      <div class="box-actions">
        <base-link
          to="/scratchcard/campaigns"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form @submit.prevent v-loading="submitLoading">
        <div class="form-left">
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="operations"
                :reduce="op => op.code"
                :key="model.idOperation"
                v-model="model.idOperation"
                placeholder="Clube"
                :disabled="viewAction !== 'new'"
                :class="{ 'has-error': customErrors.get('idOperation') }"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
              <label v-if="customErrors.get('idOperation')" class="ias-error">{{
                customErrors.get('idOperation')
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
              v-model="model.quantity"
              type="number"
              name="quantity"
              label="Quantidade"
              :error="customErrors.get('quantity')"
              maxlength="3"
            ></custom-input>
            <div class="select-holder">
              <v-select
                :options="typeOptions"
                :reduce="op => op.code"
                :key="model.type"
                v-model="model.type"
                placeholder="Tipo"
                :disabled="viewAction !== 'new'"
                :class="{ 'has-error': customErrors.get('type') }"
              >
                <span slot="no-options">Nenhum Tipo encontrado</span>
              </v-select>
              <label v-if="customErrors.get('type')" class="ias-error">{{
                customErrors.get('type')
              }}</label>
            </div>
          </div>
          <div class="ias-row">
            <div class="select-holder">
              <v-select
                :options="distributionTypeOptions"
                :reduce="op => op.code"
                :key="model.distributionType"
                v-model="model.distributionType"
                placeholder="Distribuição"
                :disabled="viewAction !== 'new'"
                :class="{ 'has-error': customErrors.get('distributionType') }"
              >
                <span slot="no-options">Nenhuma Distribuição encontrada</span>
              </v-select>
              <label
                v-if="customErrors.get('distributionType')"
                class="ias-error"
                >{{ customErrors.get('distributionType') }}</label
              >
            </div>
            <custom-input
              :required="true"
              v-model="model.distributionQuantity"
              type="number"
              name="distributionQuantity"
              label="Quantidade"
              :error="customErrors.get('distributionQuantity')"
              maxlength="3"
              v-show="model.distributionType != 1"
            ></custom-input>
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('instructions') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.instructions"
              placeholder="Instruções de resgate (max. 500 caracteres)"
            />
            <label v-show="customErrors.get('instructions')" class="ias-error"
              >Campo obrigatório</label
            >
          </div>
          <div
            class="ias-row-editor"
            :class="{ 'has-error': customErrors.get('howToUse') }"
          >
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.regulation"
              placeholder="Instruções de resgate"
            />
            <label v-show="customErrors.get('regulation')" class="ias-error"
              >Campo obrigatório</label
            >
          </div>
          <div class="ias-row">
            <ias-checkbox v-model="model.scratchcardExpire"
              >Expira</ias-checkbox
            >
            <ias-checkbox v-model="model.getNotifications"
              >Notificações</ias-checkbox
            >
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
            </div>
            <div>
              <button
                class="bt bg-blue c-white"
                type="button"
                v-show="model.canPublish"
                @click.prevent="generate"
                style="margin-right:24px"
              >
                Gerar
              </button>
            </div>
          </div>
        </div>
        <div class="form-right">
          <ias-image-upload
            @change="onImageChange"
            img-size="(200x200)"
            :src="noPrizeImage"
            :error="customErrors.get('noPrizeImage')"
          />
        </div>
      </form>
    </div>
    <success-modal
      :boxMessage="
        `CADASTRO ${
          viewAction !== 'new' ? 'REALIZADO' : 'SALVO'
        } <br />COM SUCESSO!`
      "
      :show="showSuccessModal"
      link="/scratchcard/campaigns"
    ></success-modal>
  </div>
</template>
<script>
import { Select, Option, DatePicker } from 'element-ui';
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import { SuccessModal } from 'src/components';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
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
      submitLoading: false,
      image: null,
      noPrizeImage: '',
      disabledType: '',
      disabledDistributionType: '',
      disabledOperation: '',
      customToolbar: [],
      typeOptions: [
        { code: 1, label: 'Aberto' },
        { code: 2, label: 'Fechado' },
        { code: 3, label: 'Fechado + parceiro' },
        { code: 4, label: 'Assinatura' }
      ],
      distributionTypeOptions: [
        { code: 1, label: 'Diária' },
        { code: 2, label: 'Semanal' },
        { code: 3, label: 'Mensal' }
      ],
      model: {
        id: 0,
        name: '',
        start: null,
        end: null,
        quantity: 0,
        noPrizeImage1: '',
        type: 0,
        distributionType: 0,
        distributionQuantity: 0,
        idOperation: 0,
        scratchcardExpire: false,
        canEdit: false,
        canPublish: false,
        statusName: '',
        getNotifications: false,
        instructions: '',
        regulation: ''
      },
      operations: [],
      customErrors: new Map(),
      showSuccessModal: false
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_scratchcard' ? 'edit' : 'new';
    }
  },
  methods: {
    generate() {
      const self = this;
      self.formLoading = true;
      scratchcardService.generate(self.model.id).then(response => {
        if (response.status === 'ok') {
          self.model.statusName = response.data;
          self.$notify({
            type: 'success',
            message: response.message
          });
          self.model.canEdit = false;
          self.model.canPublish = false;
          self.formLoading = false;
        } else {
          self.$notify({
            type: 'warning',
            message: response.message
          });
          self.formLoading = false;
        }
      });
    },
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (self.model.name == '') {
        self.customErrors.set('name', 'Campo obrigatório');
      } else if (self.model.name.length > 200) {
        self.customErrors.set(
          'name',
          'Este campo aceita no máximo 200 caracteres'
        );
      }
      if (self.model.quantity == '') {
        self.customErrors.set('quantity', 'Campo obrigatório');
      }
      if (self.model.type == 0) {
        self.customErrors.set('type', 'Campo obrigatório');
      }
      if (self.model.distributionType == 0) {
        self.customErrors.set('distributionType', 'Campo obrigatório');
      }
      if (self.noPrizeImage == '' && self.image == null) {
        self.customErrors.set('noPrizeImage', 'Campo obrigatório');
      }
      if (self.model.idOperation == 0) {
        self.customErrors.set('idOperation', 'Campo obrigatório');
      }
      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          scratchcardService.uploadImage(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'warning',
                  message: response.message
                });
                self.submitLoading = false;
                return;
              }
              self.model.noPrizeImage1 = response.data.fileName;
              self.noPrizeImage = response.data.url;
              self.save(self);
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.submitLoading = false;
            }
          );
        } else {
          self.save(self);
        }
      }
    },
    save(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        scratchcardService.create(vm.model).then(
          data => {
            if (data.status === 'ok') {
              vm.showSuccessModal = true;
            } else {
              vm.$notify({
                type: 'warning',
                message: data.message
              });
            }
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'danger',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      } else {
        scratchcardService.update(vm.model).then(
          response => {
            if (response.status === 'ok') {
              vm.showSuccessModal = true;
            } else {
              vm.$notify({
                type: 'warning',
                message: response.message
              });
            }
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'danger',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      if (self.viewAction == 'edit') {
        self.formLoading = true;
        scratchcardService.get(self.id).then(
          response => {
            self.model = response.data;
            for (const item of self.typeOptions) {
              if (item.code == self.model.type) {
                self.disabledType = item.label;
              }
            }
            for (const item of self.distributionTypeOptions) {
              if (item.code == self.model.distributionType) {
                self.disabledDistributionType = item.label;
              }
            }
            self.noPrizeImage =
              response.data.imagesPath + self.model.noPrizeImage1;

            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      } else {
        self.model.canEdit = true;
      }

      self.selectLoading = true;
      scratchcardService.operations().then(
        response => {
          _.each(response.data, function(el) {
            self.operations.push({ code: el.id, label: el.title });
            if (self.model.id > 0 && el.id == self.model.idOperation) {
              self.disabledOperation = el.title;
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
        this.model.noPrizeImage1 = file;
        this.noPrizeImage = file;
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
textarea {
  margin-bottom: 10px;
}
</style>
