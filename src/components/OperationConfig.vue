<template>
  <div class="row">
    <div class="col-12">
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <static-text-form
          ref="staticTextForm"
          :staticText.sync="model"
        ></static-text-form>
        <hr />
        <div class="row">
          <div class="col-md-12"><h4>Módulos</h4></div>
        </div>
        <div
          v-for="(mod, idx) in modules"
          :key="idx"
          style="border-bottom:1px solid #eee"
        >
          <div class="row">
            <label class="col-md-3 col-form-label">{{ mod.title }}</label>
            <div class="col-md-9">
              <div class="form-group">
                <base-checkbox v-model="mod.checked">&nbsp;</base-checkbox>
              </div>
            </div>
          </div>
          <div
            class="row"
            v-show="mod.checked"
            v-for="(field, idx2) in mod.info.fields"
            :key="idx2"
          >
            <div class="col-md-1">&nbsp;</div>
            <label class="col-md-3 col-form-label">{{ field.label }}</label>
            <div class="col-md-8">
              <div class="form-group">
                <base-input
                  type="text"
                  :name="field.name"
                  :placeholder="field.label"
                  :requored="field.isRequired"
                  v-model="field.data"
                >
                </base-input>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <base-button
              class="mt-3 pull-right"
              native-type="submit"
              type="info"
              @click.native.prevent="validateForm"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import StaticTextForm from 'src/components/StaticTextForm.vue';
import Modal from 'src/components/Modal.vue';
import operationService from '../services/Operation/operationService';
import helperService from '../services/Helper/helperService';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [StaticTextForm.name]: StaticTextForm,
    [Modal.name]: Modal
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      model: {
        id: 0,
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true,
        images: []
      },
      modules: []
    };
  },
  methods: {
    fetchData() {
      const self = this;
      this.$data.loading = true;
      operationService.getConfiguration(this.parentId).then(
        response => {
          this.model.images = [];
          this.model.data = response.data;
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
      operationService.listModules(this.parentId).then(response => {
        this.modules = response;
      });
    },
    validateForm() {
      const self = this;
      self.submitLoading = true;

      if (self.model.images && self.model.images.length > 0) {
        let promises = new Array(self.model.images.length);
        for (var i = 0; i <= self.model.images.length - 1; i++) {
          promises[i] = helperService.uploadFile(self.model.images[i].img);
        }
        Promise.all(promises)
          .then(values => {
            for (var j = 0; j <= values.length - 1; j++) {
              const fieldIndex = self.model.images[j].index;
              self.model.data.fields[fieldIndex].data = values[j].data.url;
            }
            self.saveConfig(self);
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
        self.saveConfig(self);
      }
    },
    saveConfig(self) {
      self.formLoading = true;
      let errors = '';
      for (let i = 0; i < self.model.data.fields.length; i++) {
        if (
          self.model.data.fields[i].isRequired &&
          self.model.data.fields[i].data === ''
        ) {
          errors += ` ${self.model.data.fields[i].label} |`;
        }
      }
      if (errors !== '') {
        errors = `Campo(s) ${errors.substring(
          0,
          errors.length - 1
        )} obrigatório(s)!`;
        self.$notify({
          type: 'primary',
          message: errors,
          icon: 'tim-icons icon-bell-55'
        });
      } else {
        operationService
          .saveConfiguration(self.parentId, self.model.data, self.modules)
          .then(
            response => {
              self.$notify({
                type: 'primary',
                message: response
                  ? response.message
                  : 'Configurações atualizadas com sucesso.',
                icon: 'tim-icons icon-bell-55'
              });
              self.$router.go();
              //window.location.reload(true);
              // self.formLoading = false;
              // self.fetchData();
            },
            () => {
              console.log('erro');
              self.formLoading = false;
            }
          );
      }
      self.formLoading = false;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
