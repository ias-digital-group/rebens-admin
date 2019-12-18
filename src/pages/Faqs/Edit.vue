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
                :error="getError('question')"
                name="question"
                placeholder="Pergunta"
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Resposta</label>
            <div class="col-md-9">
              <wysiwyg v-model="model.answer" placeholder="Resposta" />
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
        question: '',
        answer: '',
        order: 0,
        idOperation: 0,
        active: true
      },
      modelValidations: {
        question: {
          required: true,
          max: 200
        },
        order: {
          required: true,
          max: 4
        },
        answer: {
          required: true,
          max: 2000
        }
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
      if (
        self.model.question !== '' &&
        self.model.question.length <= 1000 &&
        self.model.answer !== '' &&
        self.model.answer.length <= 1000 &&
        self.model.order !== ''
      ) {
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
      if (this.viewAction == 'edit') {
        this.formLoading = true;
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
