<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Tipo de graduação">
        <h4 slot="header" class="card-title">Tipo de graduação</h4>

        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.name"
                type="text"
                name="name"
                placeholder="Nome"
                maxlength="200"
              ></base-input>
              <label v-show="customErros.includes('name')" class="text-danger"
                >O campo Nome é obrigatório</label
              >
              <label
                v-show="customErros.includes('nameLength')"
                class="text-danger"
                >O campo Nome aceita no máximo 200 caracteres</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Tipo</label>
            <div class="col-md-4">
              <div class="form-group">
                <v-select
                  :options="parentTypes"
                  :reduce="op => op.code"
                  :key="model.parentId"
                  v-model="model.parentId"
                >
                </v-select>
                <label
                  v-show="customErros.includes('parent')"
                  class="text-danger"
                  >O campo Tipo é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-4">
              <div class="form-group">
                <v-select
                  :options="operations"
                  :reduce="op => op.code"
                  :key="model.idOperation"
                  v-model="model.idOperation"
                >
                </v-select>
                <label
                  v-show="customErros.includes('operation')"
                  class="text-danger"
                  >O campo Operação é obrigatório</label
                >
              </div>
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
              <base-link
                class="btn mt-3 btn-simple btn-primary"
                to="/courseGraduationType"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateGraduationType"
                :loading="submitLoading"
              >
                Salvar
              </base-button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import courseGraduationTypeService from '../../services/CourseGraduationType/courseGraduationTypeService';
import operationService from '../../services/Operation/operationService';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
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
      model: {
        id: 0,
        name: '',
        idOperation: 0,
        parentId: 0,
        active: true
      },
      operations: [],
      customErros: [],
      parentTypes: [
        { code: 1, label: 'Graduação' },
        { code: 2, label: 'Pós Graduação' }
      ]
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_graduationType' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateGraduationType() {
      const self = this;
      self.customErros = [];

      if (self.model.parentId == null || self.model.parentId === 0) {
        self.customErros.push('parent');
      }
      if (self.model.idOperation == null || self.model.idOperation === 0) {
        self.customErros.push('operation');
      }
      if (self.model.name == null || self.model.name === '') {
        self.customErros.push('name');
      }
      if (self.model.name.length > 200) {
        self.customErros.push('nameLength');
      }
      if (self.customErros.length === 0) {
        self.submitLoading = true;
        self.saveGraduationType(self);
      }
    },
    saveGraduationType(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        courseGraduationTypeService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Tipo de graduação cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push('/courseGraduationType');
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
        courseGraduationTypeService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/courseGraduationType');
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

      if (self.viewAction == 'edit') {
        self.formLoading = true;
        courseGraduationTypeService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }

      self.selectLoading = true;
      operationService.findAll().then(
        response => {
          _.each(response.data, function(el) {
            self.operations.push({ code: el.id, label: el.title });
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
