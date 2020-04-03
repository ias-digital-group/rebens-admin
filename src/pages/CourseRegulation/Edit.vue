<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.courseRegulation.title')">
        <h4 slot="header" class="card-title">
          {{ $t('pages.courseRegulation.title') }}
        </h4>
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-6">
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
            <label class="col-md-3 col-form-label">Regulamento</label>
            <div class="col-md-8">
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="model.data"
                placeholder="Regulamento"
              />
              <label
                v-show="customErros.includes('regulation')"
                class="text-danger"
                >O campo Regulamento é obrigatório</label
              >
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <base-link
                class="btn mt-3 btn-simple btn-primary"
                to="/courseRegulation"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateForm"
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
import { Select, Option, DatePicker } from 'element-ui';
import StaticTextForm from '../../components/StaticTextForm.vue';
import staticTextService from '../../services/StaticText/staticTextService';
import operationService from '../../services/Operation/operationService';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [DatePicker.name]: DatePicker,
    [StaticTextForm.name]: StaticTextForm
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
      operations: [],
      customErros: [],
      customToolbar: [],
      model: {
        id: 0,
        page: 'course-regulation',
        name: '',
        data: '',
        idOperation: 0,
        active: true,
        idStaticTextType: 18
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_courseRegulation' ? 'edit' : 'new';
    }
  },
  methods: {
    validateForm() {
      const self = this;
      self.customErros = new Array();
      if (self.model.idOperation == null || self.model.idOperation === 0) {
        self.customErros.push('operation');
      }
      if (self.model.name == null || self.model.name === '') {
        self.customErros.push('name');
      } else if (self.model.name.length > 200) {
        self.customErros.push('nameLength');
      }
      if (self.model.data == null || self.model.data === '') {
        self.customErros.push('regulation');
      }

      if (self.customErros.length <= 0) {
        self.submitLoading = true;
        self.saveStaticText(self);
      }
    },
    saveStaticText(self) {
      self.formLoading = true;
      if (self.model.id === 0) {
        staticTextService.create(self.model).then(
          response => {
            self.$notify({
              type: 'primary',
              message: response
                ? response.message
                : 'Regulamento criado com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.submitLoading = false;
            self.formLoading = false;
            self.$router.push('/courseRegulation');
          },
          () => {
            self.submitLoading = false;
            self.formLoading = false;
          }
        );
      } else {
        staticTextService.update(self.model).then(
          response => {
            self.$notify({
              type: 'primary',
              message: response
                ? response.message
                : 'Regulamento atualizado com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.formLoading = false;
            self.$router.push('/courseRegulation');
          },
          () => {
            console.log('erro');
            self.formLoading = false;
          }
        );
      }
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      if (self.id > 0) {
        self.formLoading = true;
        staticTextService.get(self.id).then(
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
