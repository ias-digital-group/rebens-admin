<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.faqs.title')">
        <h4 slot="header" class="card-title">{{ $t('pages.faqs.title') }}</h4>

        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Pergunta</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.question"
                type="text"
                name="question"
                placeholder="Pergunta"
                maxlength="200"
              ></base-input>
              <label
                v-show="customErros.includes('question')"
                class="text-danger"
                >O campo Pergunta é obrigatório</label
              >
              <label
                v-show="customErros.includes('questionLength')"
                class="text-danger"
                >O campo Pergunta aceita no máximo 200 caracteres</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Resposta</label>
            <div class="col-md-9">
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="model.answer"
                placeholder="Resposta"
              />
              <label v-show="customErros.includes('answer')" class="text-danger"
                >O campo Resposta é obrigatório</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Ordem</label>
            <div class="col-md-2">
              <base-input
                required
                v-model="model.order"
                type="number"
                :error="getError('order')"
                name="order"
                placeholder="Ordem"
                maxlength="3"
              ></base-input>
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
              <base-link class="btn mt-3 btn-simple btn-primary" to="/faqs"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateFaq"
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
import faqService from '../../services/Faq/faqService';
import config from '../../config';

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
      customToolbar: [],
      customErros: [],
      model: {
        id: 0,
        question: '',
        answer: '',
        order: 0,
        idOperation: 0,
        active: true
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_faq' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateFaq() {
      const self = this;
      self.customErros = [];
      if (self.model.question === '') {
        self.customErros.push('question');
      } else if (self.model.question.length > 200) {
        self.customErros.push('questionLength');
      }
      if (self.model.answer === '') {
        self.customErros.push('answer');
      }
      if (self.model.order === '') {
        self.customErros.push('order');
      }
      if (self.customErros.length === 0) {
        self.submitLoading = true;
        self.saveFaq(self);
      }
    },
    saveFaq(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        faqService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Pergunta cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push('/faqs');
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
        faqService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/faqs');
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
        faqService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
