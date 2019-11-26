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
                :error="getError('name')"
                name="name"
                placeholder="Nome"
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Regulamento</label>
            <div class="col-md-8">
              <wysiwyg
                placeholder="Regulamento"
                v-model="model.data.regulation"
              />
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
      model: {
        id: 0,
        page: 'course-regulation',
        name: '',
        data: {
          regulation: ''
        },
        idOperation: 1,
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
      self.submitLoading = true;
      self.saveStaticText(self);
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
  },
  created() {
    this.fetchData();
  }
};
</script>
