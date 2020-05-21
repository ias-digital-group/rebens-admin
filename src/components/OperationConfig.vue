<template>
  <div class="row">
    <div class="col-12">
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <static-text-form
          ref="staticTextForm"
          :staticText.sync="model"
          :customErrors.sync="customErrors"
        ></static-text-form>
        <div
          class="form-horizontal"
          style="margin-top:10px"
          v-show="showWirecard"
        >
          <div class="row">
            <label class="col-md-3 col-form-label">Token Wirecard</label>
            <div class="col-md-9">
              <base-input
                v-model="wirecard.token"
                type="text"
                placeholder="Token Wirecard"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Token JS Wirecard</label>
            <div class="col-md-9">
              <base-input
                v-model="wirecard.jsToken"
                type="text"
                placeholder="Token JS Wirecard"
              ></base-input>
            </div>
          </div>
        </div>
        <hr />
        <div class="row">
          <div class="col-md-12">
            <h4>Módulos</h4>
          </div>
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
                ></base-input>
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
              >Salvar</base-button
            >
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
      customErrors: [],
      modules: [],
      wirecard: {
        token: '',
        jsToken: ''
      }
    };
  },
  computed: {
    showWirecard: function() {
      const self = this;
      let ret = false;
      if (self.model.data) {
        if (self.model.data.fields) {
          for (var field of self.model.data.fields) {
            if (field.name === 'register-type' && field.data === 'signature') {
              ret = true;
            }
          }
        }
        if (self.modules) {
          for (var mod of self.modules) {
            if (mod.info.needWirecard && mod.checked) {
              ret = true;
            }
          }
        }
      }

      return ret;
    }
  },
  methods: {
    fetchData() {
      const self = this;
      self.$data.loading = true;
      operationService.getConfiguration(self.parentId).then(
        response => {
          self.model.images = [];
          self.model.data = response.data;
          self.wirecard = response.data.wirecard;
          self.$data.loading = false;
          if (self.model.data && self.model.data.fields) {
            for (var field of self.model.data.fields) {
              if (field.name === 'register-type') {
                self.$emit('change', field.data);
              }
            }
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
      operationService.listModules(this.parentId).then(response => {
        self.modules = response;
      });
    },
    validateForm() {
      const self = this;
      self.submitLoading = true;

      if (self.model.images && self.model.images.length > 0) {
        let promises = new Array(self.model.images.length);
        for (var i = 0; i <= self.model.images.length - 1; i++) {
          promises[i] = helperService.UploadImage.uploadImage(
            self.model.images[i].img
          );
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
      self.customErrors = new Array();
      for (let i = 0; i < self.model.data.fields.length; i++) {
        if (
          self.model.data.fields[i].isRequired &&
          self.model.data.fields[i].data === ''
        ) {
          self.customErrors.push(self.model.data.fields[i].name);
        }
      }
      if (self.customErrors.length === 0) {
        operationService
          .saveConfiguration(
            self.parentId,
            self.model.data,
            self.modules,
            self.wirecard
          )
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
            },
            () => {
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
