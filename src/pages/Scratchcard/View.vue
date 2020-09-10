<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>Visualizar Campanha</h2>
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
                :disabled="true"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
            </div>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              :value="model.name"
              type="text"
              name="name"
              label="Nome"
              maxlength="200"
              :disabled="true"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              :value="getDate(model.start)"
              type="text"
              name="start"
              label="Data Início (DD/MM/AAAA)"
              maxlength="200"
              :disabled="true"
            ></custom-input>
            <custom-input
              :required="true"
              :value="getDate(model.end)"
              type="text"
              name="end"
              label="Data Fim (DD/MM/AAAA)"
              maxlength="200"
              :disabled="true"
            ></custom-input>
          </div>
          <div class="ias-row">
            <custom-input
              :required="true"
              :value="model.quantity"
              type="text"
              name="quantity"
              label="Quantidade"
              :disabled="true"
              maxlength="3"
            ></custom-input>
            <div class="select-holder">
              <v-select
                :options="typeOptions"
                :reduce="op => op.code"
                :key="model.type"
                v-model="model.type"
                placeholder="Tipo"
                :disabled="true"
              >
                <span slot="no-options">Nenhum Tipo encontrado</span>
              </v-select>
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
                :disabled="true"
              >
                <span slot="no-options">Nenhuma Distribuição encontrada</span>
              </v-select>
            </div>
            <custom-input
              :required="true"
              :value="model.distributionQuantity"
              type="number"
              name="distributionQuantity"
              label="Quantidade"
              maxlength="3"
              :disabled="true"
              v-show="model.distributionType != 1"
            ></custom-input>
          </div>
          <div class="ias-row-editor">
            <label for="instructions" class="ias-label">Instruções</label>
            <div class="box" v-html="model.instructions"></div>
          </div>
          <div class="ias-row-editor">
            <label for="regulation" class="ias-label"
              >Instruções de resgate</label
            >
            <div class="box" v-html="model.regulation"></div>
          </div>
          <div class="ias-row">
            <ias-checkbox v-model="model.scratchcardExpire" :disabled="true"
              >Expira</ias-checkbox
            >
            <ias-checkbox v-model="model.getNotifications" :disabled="true"
              >Notificações</ias-checkbox
            >
          </div>
        </div>
        <div class="form-right">
          <img :src="noPrizeImage" :alt="model.name" />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    id: String
  },
  data() {
    return {
      submitLoading: false,
      noPrizeImage: '',
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
      operations: []
    };
  },
  methods: {
    getDate(dt) {
      const date = new Date(dt);
      return (
        (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
        '/' +
        (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) +
        '/' +
        date.getFullYear()
      );
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
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
