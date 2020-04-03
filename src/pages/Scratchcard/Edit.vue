<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Campanha de Raspadinhas">
        <h4 slot="header" class="card-title">
          Campanha de Raspadinhas
          <small v-if="model.id > 0">({{ model.statusName }})</small>
          <base-button
            class="pull-right"
            native-type="button"
            type="info"
            @click="generate"
            v-if="model.canPublish"
          >
            Gerar Raspadinhas</base-button
          >
        </h4>
        <el-tabs>
          <el-tab-pane label="Campanha">
            <form
              class="form-horizontal"
              v-loading="formLoading"
              @submit.prevent
            >
              <div class="row">
                <label class="col-md-3 col-form-label">Nome</label>
                <div class="col-md-9">
                  <base-input
                    :disabled="!model.canEdit"
                    required
                    v-model="model.name"
                    type="text"
                    :error="getError('name')"
                    name="name"
                    placeholder="Nome"
                    maxlength="200"
                  ></base-input>
                  <label
                    v-show="customErrors.includes('name')"
                    class="text-danger"
                    >O campo Nome é obrigatório.</label
                  >
                  <label
                    v-show="customErrors.includes('nameMax')"
                    class="text-danger"
                    >O campo Nome aceita no máximo 200 caracteres.</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Data</label>
                <div class="col-md-9 col-lg-4">
                  <base-input label="Início">
                    <el-date-picker
                      :disabled="!model.canEdit"
                      type="date"
                      name="start"
                      data-vv-name="start"
                      placeholder="Início"
                      v-model="model.start"
                    >
                    </el-date-picker>
                  </base-input>
                </div>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-4">
                  <base-input label="Fim">
                    <el-date-picker
                      :disabled="!model.canEdit"
                      type="date"
                      name="end"
                      data-vv-name="end"
                      placeholder="Fim"
                      v-model="model.end"
                    >
                    </el-date-picker>
                  </base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Quantidade</label>
                <div class="col-md-3">
                  <base-input
                    :disabled="!model.canEdit"
                    required
                    v-model="model.quantity"
                    type="number"
                    :error="getError('quantity')"
                    name="quantity"
                    placeholder="Quantidade"
                    maxlength="10"
                  ></base-input>
                  <label
                    v-show="customErrors.includes('qty')"
                    class="text-danger"
                    >O campo Quantidade é obrigatório.</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Operação</label>
                <div class="col-md-4">
                  <div class="form-group">
                    <v-select
                      v-if="model.canEdit"
                      :options="operations"
                      :reduce="op => op.code"
                      :key="model.idOperation"
                      v-model="model.idOperation"
                    >
                    </v-select>
                    <base-input
                      disabled
                      type="text"
                      name="operation"
                      v-if="!model.canEdit"
                      v-model="disabledOperation"
                    ></base-input>
                    <label
                      v-show="customErrors.includes('idOperation')"
                      class="text-danger"
                      >O campo Operação é obrigatório</label
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Tipo</label>
                <div class="col-md-3">
                  <div class="form-group">
                    <v-select
                      v-if="model.canEdit"
                      :options="typeOptions"
                      :reduce="op => op.code"
                      :key="model.type"
                      v-model="model.type"
                    >
                    </v-select>
                    <base-input
                      disabled
                      type="text"
                      name="quantity"
                      v-if="!model.canEdit"
                      v-model="disabledType"
                    ></base-input>
                    <label
                      v-show="customErrors.includes('type')"
                      class="text-danger"
                      >O campo Tipo é obrigatório</label
                    >
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Distribuição</label>
                <div class="col-md-3">
                  <div class="form-group has-label">
                    <label>Tipo</label>
                    <v-select
                      v-if="model.canEdit"
                      :options="distributionTypeOptions"
                      :reduce="op => op.code"
                      :key="model.distributionType"
                      v-model="model.distributionType"
                    >
                    </v-select>
                    <base-input
                      disabled
                      type="text"
                      name="distributionType"
                      v-if="!model.canEdit"
                      v-model="disabledDistributionType"
                    ></base-input>
                    <label
                      v-show="customErrors.includes('distributionType')"
                      class="text-danger"
                      >O campo Tipo de distribuição é obrigatório</label
                    >
                  </div>
                </div>
                <div class="col-md-3" v-show="model.distributionType != 1">
                  <div class="form-group">
                    <base-input
                      :disabled="!model.canEdit"
                      label="Quantidade"
                      required
                      v-model="model.distributionQuantity"
                      type="number"
                      :error="getError('distributionQuantity')"
                      name="distributionQuantity"
                      placeholder="Quantidade"
                      maxlength="3"
                    ></base-input>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"
                  >Instruções de resgate <br />(max. 500 caracteres)</label
                >
                <div class="col-md-8">
                  <vue-editor
                    :editorToolbar="customToolbar"
                    v-model="model.instructions"
                    placeholder="Instruções de resgate (max. 500 caracteres)"
                    v-if="model.canEdit"
                  />
                  <textarea
                    v-model="model.instructions"
                    class="form-control"
                    disabled
                    v-if="!model.canEdit"
                  ></textarea>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Regulamento</label>
                <div class="col-md-8">
                  <vue-editor
                    :editorToolbar="customToolbar"
                    v-model="model.regulation"
                    placeholder="Regulamento"
                    v-if="model.canEdit"
                  />
                  <textarea
                    v-model="model.regulation"
                    class="form-control"
                    disabled
                    v-if="!model.canEdit"
                  ></textarea>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">O bilhete expira</label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox
                      v-model="model.scratchcardExpire"
                      v-if="model.canEdit"
                      >&nbsp;</base-checkbox
                    >
                    <label class="col-form-label" v-if="!model.canEdit">{{
                      model.scratchcardExpire ? 'sim' : 'não'
                    }}</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"
                  >Receber notificações</label
                >
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox
                      v-model="model.getNotifications"
                      v-if="model.canEdit"
                      >&nbsp;</base-checkbox
                    >
                    <label class="col-form-label" v-if="!model.canEdit">{{
                      model.getNotifications ? 'sim' : 'não'
                    }}</label>
                  </div>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"
                  >Imagem sem prêmio <br />
                  <span>(200x200)</span>
                </label>
                <div class="col-md-9">
                  <template v-if="model.noPrizeImage1">
                    <div class="fileinput">
                      <div class="thumbnail">
                        <img :src="noPrizeImage" class="img-preview" />
                      </div>
                      <div>
                        <base-button
                          v-if="model.canEdit"
                          @click="model.noPrizeImage1 = ''"
                          class="btn-simple btn-file"
                          type="danger"
                        >
                          <i class="fas fa-times"></i> {{ removeText }}
                        </base-button>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <image-upload
                      @change="onImageChange"
                      change-text="Alterar"
                      remove-text="Remover"
                      select-text="Selecione uma imagem"
                    /><br />
                    <label
                      v-show="customErrors.includes('image')"
                      class="text-danger"
                      >O campo Logo é obrigatório.</label
                    >
                  </template>
                </div>
              </div>
              <div class="row">
                <div
                  class="col-md-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
                >
                  <base-link
                    class="btn mt-3 btn-simple btn-primary"
                    to="/scratchcard"
                    >Voltar</base-link
                  >
                  <base-button
                    class="mt-3"
                    native-type="submit"
                    type="info"
                    @click.native.prevent="validate"
                    :loading="submitLoading"
                    v-if="model.canEdit"
                  >
                    Salvar
                  </base-button>
                </div>
              </div>
            </form>
          </el-tab-pane>
          <el-tab-pane label="Prêmios" v-if="viewAction != 'new'">
            <scratchcardPrizes
              v-loading="formLoading"
              :canEdit="model.canEdit"
              :parentId="id"
              ref="scratchcard"
            ></scratchcardPrizes>
          </el-tab-pane>
          <el-tab-pane label="Raspadinhas" v-if="viewAction != 'new'">
            <scratchcardBillet
              v-loading="formLoading"
              :parentId="id"
              ref="scratchcard"
            ></scratchcardBillet>
          </el-tab-pane>
          <el-tab-pane label="Raspadinhas Premiadas" v-if="viewAction != 'new'">
            <scratchcardPrizeBillet
              v-loading="formLoading"
              :parentId="id"
              ref="scratchcard"
            ></scratchcardPrizeBillet>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, DatePicker, Tabs, TabPane } from 'element-ui';
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import { ImageUpload } from 'src/components/index';
import ScratchcardPrizes from 'src/components/ScratchcardPrize';
import ScratchcardBillet from 'src/components/ScratchcardBillet';
import scratchcardPrizeBillet from 'src/components/ScratchcardPrizeBillet';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [DatePicker.name]: DatePicker,
    ImageUpload,
    ScratchcardPrizes,
    ScratchcardBillet,
    scratchcardPrizeBillet
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
      customErrors: [],
      modelValidations: {
        question: {
          name: true,
          max: 200
        },
        quantity: {
          required: true,
          max: 10
        },
        noPrizeImage1: {
          required: true,
          max: 500
        },
        type: {
          required: true
        },
        distributionType: {
          required: true
        },
        idOperation: {
          required: true
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_scratchcard' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    generate() {
      const self = this;
      self.formLoading = true;
      scratchcardService.generate(self.model.id).then(response => {
        if (response.status === 'ok') {
          self.model.statusName = response.data;
          self.$notify({
            type: 'primary',
            message: response.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.model.canEdit = false;
          self.model.canPublish = false;
          self.formLoading = false;
        } else {
          self.$notify({
            type: 'primary',
            message: response.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.formLoading = false;
        }
      });
    },
    validate() {
      const self = this;
      self.customErrors = [];
      if (self.model.name == '') {
        self.customErrors.push('name');
      } else if (self.model.name.length > 200) {
        self.customErrors.push('nameMax');
      }
      if (self.model.quantity == '') {
        self.customErrors.push('qty');
      }
      if (self.model.type == 0) {
        self.customErrors.push('type');
      }
      if (self.model.distributionType == 0) {
        self.customErrors.push('distributionType');
      }
      if (self.model.noPrizeImage1 == '' && self.image == null) {
        self.customErrors.push('image');
      }
      if (self.model.idOperation == 0) {
        self.customErrors.push('idOperation');
      }
      if (self.customErrors.length == 0) {
        self.submitLoading = true;
        if (self.image) {
          scratchcardService.uploadImage(self.image).then(
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
              self.model.noPrizeImage1 = response.data.fileName;
              self.noPrizeImage = response.data.url;
              self.save(self);
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
            vm.$notify({
              type: 'success',
              message: 'Campanha criada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push(`/scratchcard/${data.id}/edit`);
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
        scratchcardService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
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
      self.customToolbar = config.customToolbar;
      if (self.viewAction == 'edit') {
        self.formLoading = true;
        scratchcardService.get(self.id).then(
          response => {
            self.model = response.data;
            for (const item of self.typeOptions) {
              if (item.value == self.model.type) {
                self.disabledType = item.label;
              }
            }
            for (const item of self.distributionTypeOptions) {
              if (item.value == self.model.distributionType) {
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
