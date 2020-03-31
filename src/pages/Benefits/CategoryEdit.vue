<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.categories.title')">
        <h4 slot="header" class="card-title">
          {{ $t('pages.categories.title') }}
        </h4>
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
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Categoria pai</label>
            <div class="col-md-4">
              <v-select
                :options="parents"
                :reduce="op => op.code"
                :key="model.idParent"
                v-model="model.idParent"
              >
              </v-select>
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
                to="/benefits/categories"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validate"
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
import categoryService from '../../services/Category/categoryService';
import _ from 'lodash';
import { ImageUpload } from 'src/components/index';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    ImageUpload
  },
  props: {
    id: String
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      image: null,
      model: {
        name: '',
        order: 1,
        idParent: 0,
        active: false,
        icon: '',
        type: 1
      },
      modelValidations: {
        name: {
          required: true,
          max: 200
        },
        order: {
          required: true,
          max: 4
        }
      },
      parents: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_categoryBenefit' ? 'edit' : 'new';
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
          self.saveCategory(self);
        }
      });
    },
    saveCategory(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        categoryService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'primary',
              message: 'Categoria cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/benefits/categories');
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
      } else {
        categoryService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/benefits/categories');
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
      self.selectLoading = true;
      categoryService.getListTree(1).then(
        response => {
          self.parents.push({ code: 0, label: 'Raiz' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.parents.push({ code: el.id, label: el.name });
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );

      if (self.viewAction == 'edit') {
        self.formLoading = true;
        categoryService.get(self.id).then(
          response => {
            self.model = response.data;
            if (!self.model.idParent) self.model.idParent = 0;
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
