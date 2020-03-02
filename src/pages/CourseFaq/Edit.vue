<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.courseFaq.title')">
        <h4 slot="header" class="card-title">
          {{ $t('pages.courseFaq.title') }}
        </h4>
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-6">
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
          <h4>
            Perguntas
            <a
              href="javascript:void(0)"
              @click="addItem"
              class="btn btn-icon btn-simple btn-sm btn-twitter"
              ><i class="tim-icons icon-simple-add"></i
            ></a>
          </h4>
          <div
            class="faq-item"
            v-for="(item, index) in model.data.items"
            :key="index"
          >
            <div class="row">
              <label class="col-md-3 col-form-label">Pergunta</label>
              <div class="col-md-8">
                <base-input
                  required
                  v-model="item.question"
                  type="text"
                  name="question"
                  placeholder="Pergunta"
                  maxlength="500"
                ></base-input>
              </div>
              <div class="col-md-1">
                <a
                  href="javascript:void(0)"
                  @click="removeItem(index)"
                  class="btn btn-icon btn-simple btn-sm btn-youtube"
                  ><i class="tim-icons icon-simple-add"></i
                ></a>
              </div>
            </div>
            <div class="row">
              <label class="col-md-3 col-form-label">Resposta</label>
              <div class="col-md-8">
                <wysiwyg placeholder="Resposta" v-model="item.answer" />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/courseFaq"
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
import { Select, Option } from 'element-ui';
import staticTextService from '../../services/StaticText/staticTextService';
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
      operations: [],
      customErros: [],
      model: {
        id: 0,
        page: 'course-faq',
        name: '',
        data: {
          default: false,
          items: []
        },
        idOperation: 0,
        active: true,
        idStaticTextType: 17
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_courseFaq' ? 'edit' : 'new';
    }
  },
  methods: {
    validateForm() {
      const self = this;
      if (self.model.idOperation == null || self.model.idOperation === 0) {
        self.customErros.push('operation');
      } else {
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
                : 'Perguntas salvas com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.submitLoading = false;
            self.formLoading = false;
            self.$router.push('/courseFaq');
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
                : 'Perguntas atualizada com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.submitLoading = false;
            self.formLoading = false;
            self.$router.push('/courseFaq');
          },
          () => {
            self.submitLoading = false;
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
    addItem() {
      this.model.data.items.push({ question: '', answer: '' });
    },
    removeItem(index) {
      this.model.data.items.splice(index, 1);
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
.faq-item {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
}
</style>
