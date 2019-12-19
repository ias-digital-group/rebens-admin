<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Faculdade">
        <h4 slot="header" class="card-title">Faculdade</h4>
        <el-tabs>
          <el-tab-pane label="Cadastro">
            <form
              class="form-horizontal"
              v-loading="formLoading"
              @submit.prevent
            >
              <div class="row">
                <label class="col-md-3 col-form-label">Razão Social</label>
                <div class="col-md-9">
                  <base-input
                    required
                    v-model="model.legalName"
                    type="text"
                    :error="getError('legalName')"
                    name="legalName"
                    placeholder="Razão Social"
                    maxlength="500"
                  ></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Nome</label>
                <div class="col-md-9">
                  <base-input
                    required
                    v-model="model.name"
                    type="text"
                    :error="getError('name')"
                    name="name"
                    placeholder="Nome"
                    maxlength="200"
                  ></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">CNPJ</label>
                <div class="col-md-9">
                  <base-input
                    required
                    v-model="model.doc"
                    type="text"
                    :error="getError('doc')"
                    name="doc"
                    placeholder="CNPJ"
                    maxlength="50"
                    masked="true"
                    :inputMask="['##.###.###/####-##']"
                  ></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Operação</label>
                <div class="col-md-4">
                  <div class="form-group">
                    <el-select
                      class="select-info"
                      placeholder="Operação"
                      v-model="model.idOperation"
                      v-loading.lock="selectLoading"
                      lock
                    >
                      <el-option
                        class="select-primary"
                        v-for="type in operations"
                        :value="type.id"
                        :label="type.title"
                        :key="type.id"
                      >
                      </el-option>
                    </el-select>
                    <label
                      v-show="customErros.includes('operation')"
                      class="text-danger"
                      >O campo Operação é obrigatório</label
                    >
                  </div>
                </div>
              </div>
              <template v-if="model.logo">
                <div class="row">
                  <label class="col-md-3 col-form-label">Logo (184x36)</label>
                  <div class="col-md-9">
                    <div>
                      <img :src="model.logo" class="img-preview" />
                      <base-button
                        @click="model.logo = ''"
                        class="btn-simple btn-file"
                        type="danger"
                      >
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label">Logo (184x36)</label>
                  <div class="col-md-9">
                    <image-upload
                      @change="onImageChange"
                      change-text="Alterar"
                      remove-text="Remover"
                      select-text="Selecione uma imagem"
                    />
                  </div>
                </div>
              </template>
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
                    to="/courseCollege"
                    >Voltar</base-link
                  >
                  <base-button
                    class="mt-3 pull-right"
                    native-type="submit"
                    type="info"
                    @click.native.prevent="validateCollege"
                    :loading="submitLoading"
                  >
                    Salvar
                  </base-button>
                </div>
              </div>
            </form>
          </el-tab-pane>
          <el-tab-pane
            label="Endereços"
            :disabled="viewAction == 'new' ? true : false"
          >
            <addresses
              v-loading="formLoading"
              parent="colleges"
              :parentId="id"
              ref="addresses"
            ></addresses>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane } from 'element-ui';
import courseCollegeService from '../../services/CourseCollege/courseCollegeService';
import Addresses from 'src/components/Addresses';
import operationService from '../../services/Operation/operationService';
import helperService from '../../services/Helper/helperService';
import { ImageUpload } from 'src/components/index';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    Addresses,
    ImageUpload
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
        logo: '',
        active: true,
        legalName: '',
        doc: ''
      },
      operations: [],
      customErros: [],
      image: null,
      modelValidations: {
        name: {
          required: true,
          max: 200
        },
        legalName: {
          required: true,
          max: 500
        },
        doc: {
          required: true,
          max: 50
        },
        idOperation: {
          required: true
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_college' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateCollege() {
      const self = this;
      self.customErros = [];

      if (self.model.idOperation == null || self.model.idOperation === 0)
        self.customErros.push('operation');
      if (self.model.legalName == null || self.model.legalName.length < 3)
        self.customErros.push('legalName');
      if (self.model.doc == null || self.model.doc.length !== 18)
        self.customErros.push('doc');
      if (
        self.model.name !== '' &&
        self.model.name.length <= 200 &&
        self.customErros.length === 0
      ) {
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
              self.model.logo = response.data.url;
              self.saveCollege(self);
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
        } else if (self.model.logo) {
          self.saveCollege(self);
        } else {
          self.$notify({
            type: 'danger',
            message: 'O Logo é obrigatório',
            icon: 'tim-icons icon-bell-55'
          });
          self.submitLoading = false;
        }
      }
    },
    saveCollege(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        courseCollegeService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Faculdade cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push('/courseCollege');
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
        courseCollegeService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/courseCollege');
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
        courseCollegeService.get(self.id).then(
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
          self.operations.push({ id: null, title: 'selecione' });
          _.each(response.data, function(el) {
            self.operations.push({ id: el.id, title: el.title });
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
.img-preview {
  max-width: 100px;
}
</style>
