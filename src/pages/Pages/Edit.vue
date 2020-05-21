<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.pages.title')">
        <h4 slot="header" class="card-title">{{ $t('pages.pages.title') }}</h4>
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <static-text-form
            ref="staticTextForm"
            :staticText.sync="model"
          ></static-text-form>
          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/pages"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateForm"
                :loading="submitLoading"
                >Salvar</base-button
              >
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
import helperService from '../../services/Helper/helperService';

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
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true,
        images: []
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_banner' ? 'edit' : 'new';
    },
    activeName: {
      get: function() {
        if (this.$route.query && this.$route.query.tab)
          return this.$route.query.tab == 'op' ? 'operations' : 'banner';
        return 'banner';
      },
      set: function() {}
    }
  },
  methods: {
    validateForm() {
      const self = this;
      self.submitLoading = true;
      if (self.model.images && self.model.images.length > 0) {
        let promises = new Array(self.model.images.length);
        for (var i = 0; i <= self.model.images.length - 1; i++) {
          promises[i] = helperService.uploadImage(self.model.images[i].img);
        }
        Promise.all(promises)
          .then(values => {
            for (var j = 0; j <= values.length - 1; j++) {
              const fieldIndex = self.model.images[j].index;
              self.model.data.fields[fieldIndex].data = values[j].data.url;
            }
            self.saveStaticText(self);
          })
          .catch(reason => {
            self.$notify({
              type: 'primary',
              message: reason.message,
              icon: 'tim-icons icon-bell-55'
            });
            self.submitLoading = false;
          });
      } else {
        self.saveStaticText(self);
      }
    },
    saveStaticText(self) {
      self.formLoading = true;
      staticTextService.update(self.model).then(
        response => {
          self.$notify({
            type: 'primary',
            message: response
              ? response.message
              : 'Página atualizada com sucesso.',
            icon: 'tim-icons icon-bell-55'
          });
          self.formLoading = false;
          self.$router.push('/pages');
        },
        () => {
          console.log('erro');
          self.formLoading = false;
        }
      );
      self.formLoading = false;
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
          self.model.images = [];
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
