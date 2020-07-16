<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span v-if="viewAction === 'new'">Cadastro Parceiro</span>
        <span v-else>Editar Parceiro</span>
      </h2>
      <div class="box-actions">
        <base-link to="/operationPartner" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="formLoading" @submit.prevent>
        <div class="form-left">
          <div
            class="ias-row"
            v-show="$store.getters.currentUser.role === 'master' || $store.getters.currentUser.role === 'administratorRebens'"
          >
            <div class="select-holder">
              <v-select
                :options="operations"
                :reduce="op => op.code"
                :key="model.idOperation"
                v-model="model.idOperation"
                placeholder="Clube"
                :class="{ 'has-error': customErrors.get('operation') }"
              >
                <span slot="no-options">Nenhum Clube encontrado</span>
              </v-select>
              <label v-if="customErrors.get('operation')" class="ias-error">
                {{
                customErrors.get('operation')
                }}
              </label>
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
              :required="true"
              v-model="model.doc"
              type="text"
              name="doc"
              label="CNPJ"
              :inputMask="['##.###.###/####-##']"
              :error="customErrors.get('doc')"
              maxlength="50"
            ></custom-input>
          </div>
          <div class="ias-row">
            <div class="form-actions">
              <button class="bt bg-green c-white" type="button" @click.prevent="validate">
                <span v-if="viewAction === 'new'">Cadastrar</span>
                <span v-else>Salvar</span>
              </button>
              <ias-checkbox v-model="model.active">Ativo</ias-checkbox>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right"></div>
      </form>
    </div>
    <success-modal :isEdit="viewAction !== 'new'" :show="showSuccessModal" link="/operationParter"></success-modal>
  </div>
</template>
<script>
import { SuccessModal } from 'src/components';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import operationService from '../../services/Operation/operationService';
import _ from 'lodash';

export default {
  components: {
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
      idOperation: 0,
      operations: [],
      showOperations: false,
      showSuccessModal: false,
      model: {
        id: 0,
        name: '',
        idOperation: 0,
        active: true,
        doc: ''
      },
      customErrors: new Map()
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_operationPartner' ? 'edit' : 'new';
    }
  },
  methods: {
    validate() {
      const self = this;
      self.customErrors = new Map();
      if (!self.model.name || self.model.name === '')
        self.customErrors.set('name', 'Campo obrigatório');
      if (self.model.idOperation === 0)
        self.customErrors.set('operation', 'Campo obrigatório');
      if (self.model.doc != '' && self)
        if (self.customErrors.size === 0) self.savePartner(self);
    },
    clearForm() {
      const self = this;
      self.model.name = '';
    },
    savePartner(vm) {
      vm = vm ? vm : this;
      vm.submitLoading = true;
      if (vm.model.id === 0) {
        operationPartnerService.create(vm.model).then(
          () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      } else {
        operationPartnerService.update(vm.model).then(
          () => {
            vm.submitLoading = false;
            vm.showSuccessModal = true;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;

      if (self.viewAction == 'edit') {
        self.formLoading = true;
        operationPartnerService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }

      if (
        this.$store.getters.currentUser.role === 'master' ||
        this.$store.getters.currentUser.role === 'administratorRebens'
      )
        self.populateOperations(self);
    },
    populateOperations(self) {
      operationService.findAll().then(response => {
        _.each(response.data, function(el) {
          if (el.id != self.id) {
            self.operations.push({ code: el.id, label: el.title });
          }
        });
      });
    }
  },
  created() {
    if (
      this.$store.getters.currentUser.role != 'master' &&
      this.$store.getters.currentUser.role != 'administratorRebens'
    )
      this.model.idOperation = this.$store.getters.currentUser.idOperation;
    this.fetchData();
  }
};
</script>
