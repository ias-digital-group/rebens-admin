<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Faculdade">
        <h4 slot="header" class="card-title">Curso</h4>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Cursos Livres" name="freeCourse">
            <form
              class="form-horizontal"
              v-loading="formLoading"
              @submit.prevent
            >
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
                  <label
                    v-show="customErros.includes('name')"
                    class="text-danger"
                    >O campo Nome é obrigatório</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Título</label>
                <div class="col-md-9">
                  <base-input
                    required
                    v-model="model.title"
                    type="text"
                    :error="getError('title')"
                    name="title"
                    placeholder="Título"
                    maxlength="300"
                  ></base-input>
                  <label
                    v-show="customErros.includes('title')"
                    class="text-danger"
                    >O campo Título é obrigatório</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Operação</label>
                <div class="col-md-4">
                  <v-select
                    :options="operations"
                    :reduce="op => op.code"
                    :key="model.idOperation"
                    v-model="model.idOperation"
                  >
                  </v-select>
                  <label
                    v-show="customErros.includes('idOperation')"
                    class="text-danger"
                    >O campo Operação é obrigatório</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Parceiro</label>
                <div class="col-md-4">
                  <v-select
                    :options="partners"
                    :reduce="op => op.code"
                    :key="model.idPartner"
                    v-model="model.idPartner"
                  >
                  </v-select>
                  <label
                    v-show="customErros.includes('idPartner')"
                    class="text-danger"
                    >O campo Parceiro é obrigatório</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Preço</label>
                <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-3">
                  <base-input label="">
                    <money
                      class="form-control"
                      v-model="model.price"
                      v-bind="money"
                    ></money>
                  </base-input>
                  <label
                    v-show="customErros.includes('price')"
                    class="text-danger"
                    >O campo Preço é obrigatório!</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"
                  >Descrição Listagem</label
                >
                <div class="col-md-9">
                  <base-input
                    v-model="model.summary"
                    type="text"
                    :error="getError('summary')"
                    name="summary"
                    placeholder="Título"
                    maxlength="500"
                  ></base-input>
                </div>
              </div>
              <div class="row" style="padding-bottom:10px;">
                <label class="col-md-3 col-form-label">Descrição</label>
                <div class="col-md-9">
                  <wysiwyg
                    v-model="model.description"
                    placeholder="Descrição"
                  />
                  <label
                    v-show="customErros.includes('description')"
                    class="text-danger"
                    >O campo Descrição é obrigatório!</label
                  >
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Como Funciona</label>
                <div class="col-md-9">
                  <wysiwyg
                    v-model="model.howToUse"
                    placeholder="Como Funciona"
                  />
                  <label
                    v-show="customErros.includes('howToUse')"
                    class="text-danger"
                    >O campo Como Funciona é obrigatório!</label
                  >
                </div>
              </div>
              <template v-if="model.image">
                <div class="row">
                  <label class="col-md-3 col-form-label"
                    >Imagem (1200x500)</label
                  >
                  <div class="col-md-9">
                    <div>
                      <img :src="model.image" class="img-preview" />
                      <base-button
                        @click="model.image = ''"
                        class="btn-simple btn-file"
                        type="danger"
                      >
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                    <label
                      v-show="customErros.includes('image')"
                      class="text-danger"
                      >O campo Imagem é obrigatório!</label
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label"
                    >Imagem (1200x500)</label
                  >
                  <div class="col-md-9">
                    <image-upload
                      @change="onImageChange"
                      change-text="Alterar"
                      remove-text="Remover"
                      select-text="Selecione uma imagem"
                    />
                    <label
                      v-show="customErros.includes('image')"
                      class="text-danger"
                      >O campo Imagem é obrigatório!</label
                    >
                  </div>
                </div>
              </template>
              <template v-if="model.listImage">
                <div class="row">
                  <label class="col-md-3 col-form-label"
                    >Imagem da Listagem (250x250)</label
                  >
                  <div class="col-md-9">
                    <div>
                      <img :src="model.listImage" class="img-preview" />
                      <base-button
                        @click="model.listImage = ''"
                        class="btn-simple btn-file"
                        type="danger"
                      >
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                    <label
                      v-show="customErros.includes('listImage')"
                      class="text-danger"
                      >O campo Imagem da Listagem é obrigatório!</label
                    >
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label"
                    >Imagem da Listagem (250x250)</label
                  >
                  <div class="col-md-9">
                    <image-upload
                      @change="onListImageChange"
                      change-text="Alterar"
                      remove-text="Remover"
                      select-text="Selecione uma imagem"
                    />
                    <label
                      v-show="customErros.includes('listImage')"
                      class="text-danger"
                      >O campo Imagem da Listagem é obrigatório!</label
                    >
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
                    to="/freeCourse"
                    >Voltar</base-link
                  >
                  <base-button
                    class="mt-3 pull-right"
                    native-type="submit"
                    type="info"
                    @click.native.prevent="validateCourse"
                    :loading="submitLoading"
                  >
                    Salvar
                  </base-button>
                </div>
              </div>
            </form>
          </el-tab-pane>
          <el-tab-pane
            label="Categorias"
            name="categories"
            :disabled="viewAction == 'new' ? true : false"
          >
            <categories
              v-loading="formLoading"
              :parentId="id"
              :type="2"
              :key="operationKey"
            ></categories>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane } from 'element-ui';
import courseService from '../../services/FreeCourse/freeCourseService';
import operationService from '../../services/Operation/operationService';
import helperService from '../../services/Helper/helperService';
import partnerService from '../../services/Partner/partnerService';
import Categories from 'src/components/Categories';
import { ImageUpload } from 'src/components/index';
import { Money } from 'v-money';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    Money,
    ImageUpload,
    Categories
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
      partnerName: '',
      formLoading: false,
      submitLoading: false,
      model: {
        id: 0,
        name: '',
        title: '',
        idOperation: null,
        idPartner: null,
        price: 0,
        summary: '',
        description: '',
        howToUse: '',
        image: '',
        listImage: '',
        active: true
      },
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false
      },
      operations: [],
      partners: [],
      customErros: [],
      image: null,
      listImage: null,
      operationKey: 0,
      modelValidations: {
        name: { required: true, max: 200 },
        title: { required: true, max: 300 },
        idOperation: { required: true },
        idPartner: { required: true },
        price: { required: true }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_freeCourse' ? 'edit' : 'new';
    },
    activeName: {
      get: function() {
        if (this.$route.query && this.$route.query.tab)
          return this.$route.query.tab == 'ct' ? 'categories' : 'freeCourse';
        return 'freeCourse';
      },
      set: function() {}
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateCourse() {
      const self = this;
      self.customErros = [];

      if (!self.model.name) self.customErros.push('name');
      if (!self.model.title) self.customErros.push('title');
      if (!self.model.idOperation) self.customErros.push('idOperation');
      if (!self.model.idPartner) self.customErros.push('idPartner');
      if (!self.model.price) self.customErros.push('price');
      if (!self.model.listImage && !self.listImage)
        self.customErros.push('listImage');
      if (!self.model.image && !self.image) self.customErros.push('image');
      if (!self.model.description && self.model.description === '')
        self.customErros.push('description');
      if (!self.model.howToUse && self.model.howToUse === '')
        self.customErros.push('howToUse');

      if (self.customErros.length == 0) {
        self.submitLoading = true;
        let imgCounter = 0;

        if (self.image) {
          imgCounter++;
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
              imgCounter--;
              if (imgCounter == 0) self.saveCourse(self);
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
        }

        if (self.listImage) {
          imgCounter++;
          helperService.uploadFile(self.listImage).then(
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
              self.model.listImage = response.data.url;
              imgCounter--;
              if (imgCounter == 0) self.saveCourse(self);
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
        }
        if (imgCounter == 0) self.saveCourse(self);
      }
    },
    saveCourse(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        courseService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Curso cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push('/freeCourse');
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
        courseService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/freeCourse');
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
        courseService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }

      operationService.findAll().then(response => {
        _.each(response.data, function(el) {
          self.operations.push({ code: el.id, label: el.title });
        });
      });

      partnerService.listActive(2).then(response => {
        _.each(response.data, function(el) {
          self.partners.push({ code: el.id, label: el.name });
        });
      });
    },
    onImageChange(file) {
      this.image = file;
    },
    onListImageChange(file) {
      this.listImage = file;
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
