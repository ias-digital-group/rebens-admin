<template>
<div class="row">
  <div class="col-md-12">
    <card title="Horizontal Form">
      <h4 slot="header" class="card-title">{{$t('pages.categories.title')}}</h4>
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <div class="row">
          <label class="col-md-3 col-form-label">Nome</label>
          <div class="col-md-9">
            <base-input 
              required
              v-model="model.name"
              v-validate="modelValidations.name"
              type="text"
              :error="getError('name')"
              name="name"
              placeholder="Nome" 
              maxlength='200'></base-input>
          </div>
        </div>
        <div class="row">
            <label class="col-md-3 col-form-label"></label>
            <div class="col-md-9">
              <div class="form-group">
                <base-checkbox v-model="model.active">Ativo</base-checkbox>
              </div>
            </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label"></label>
          <div class="col-md-9">
            <base-button 
              class="mt-3" 
              native-type="submit" 
              type="info"
              @click.native.prevent="validate"
              :loading="submitLoading">
              Salvar
            </base-button>
            <base-link class="btn mt-3 btn-secondary" to="/categories">Voltar</base-link>
          </div>
        </div>
      </form>
    </card>
  </div>
</div>
</template>
<script>
import { Select, Option } from 'element-ui';
import partnerService from '../../services/Partner/partnerService';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    id: String
  },
  data() {
    return {
      formLoading: false,
      submitLoading: false,
      model: {
        name: '',
        active: false
      },
      modelValidations: {
        name: {
          required: true,
          max: 200
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_partner' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.submitLoading = true;
          if (self.viewAction == 'new') {
            partnerService.create(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: 'Parceiro cadastrado com sucesso!',
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/partners');
                self.submitLoading = false;
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
          } else {
            partnerService.update(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.$router.push('/partners');
                self.submitLoading = false;
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
        }
      });
    },
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        partnerService.get(self.id).then(
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
<style>
</style>
