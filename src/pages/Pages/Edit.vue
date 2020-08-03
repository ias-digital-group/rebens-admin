<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span>{{ model.name }} - {{ model.operationName }}</span>
      </h2>
      <div class="box-actions">
        <base-link to="/pages" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card" v-loading="formLoading">
      <form @submit.prevent>
        <div class="form-left">
          <template v-for="(field, idx) in model.data.fields">
            <div class="ias-row" :key="idx" v-if="field.type == 'text'">
              <custom-input
                :required="true"
                v-model="field.data"
                type="text"
                :name="field.name"
                :label="field.label"
                :placeholder="field.label"
                maxlength="200"
              ></custom-input>
            </div>

            <div
              class="ias-row"
              :key="idx"
              v-else-if="field.type == 'tel' || field.type == 'phone'"
            >
              <custom-input
                :required="true"
                v-model="field.data"
                type="tel"
                :name="field.name"
                :label="field.label"
                :placeholder="field.label"
                :inputMask="['(##) ####-####', '(##) #####-####']"
                maxlength="50"
                :masked="true"
              ></custom-input>
            </div>
            <div class="ias-row" :key="idx" v-else-if="field.type == 'boolean'">
              <ias-checkbox v-model="field.checked">{{
                field.label
              }}</ias-checkbox>
            </div>
            <div
              class="ias-row-editor"
              :key="idx"
              v-else-if="field.type == 'html'"
            >
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="field.data"
                :placeholder="field.label"
              />
            </div>
          </template>
          <div class="ias-row">
            <div class="form-actions">
              <button
                class="bt bg-green c-white"
                type="button"
                @click.prevent="validateForm"
              >
                Salvar
              </button>
            </div>
            <div class="div-spacer"></div>
          </div>
        </div>
        <div class="form-right">
          <div v-for="(field, idx) in model.data.fields" :key="idx">
            <template v-if="field.type == 'image'">
              <ias-image-upload
                @change="onImageChange"
                :img-size="field.label"
                :src="field.data"
                :optionalData="getOptionalData(field, idx)"
              />
            </template>
          </div>
        </div>
      </form>
    </div>
    <success-modal
      :isEdit="true"
      :show="showSuccessModal"
      link="/pages"
    ></success-modal>
  </div>
</template>
<script>
import staticTextService from '../../services/StaticText/staticTextService';
import helperService from '../../services/Helper/helperService';
import { SuccessModal } from 'src/components';
import config from '../../config';
import _ from 'lodash';

export default {
  components: {
    SuccessModal
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
      showSuccessModal: false,
      formLoading: false,
      customToolbar: [],
      model: {
        id: 0,
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true,
        images: [],
        operationName: ''
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
    getOptionalData(field, idx) {
      return { field: field, index: idx, data: field.data, img: null };
    },
    validateForm() {
      const self = this;
      self.formLoading = true;
      if (self.model.images && self.model.images.length > 0) {
        let promises = new Array();
        for (var i = 0; i <= self.model.images.length - 1; i++) {
          if (self.model.images[i].img) {
            promises.push(helperService.uploadImage(self.model.images[i].img));
          }
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
              type: 'danger',
              message: reason.message
            });
            self.formLoading = false;
          });
      } else {
        self.saveStaticText(self);
      }
    },
    saveStaticText(self) {
      self.formLoading = true;
      staticTextService.update(self.model).then(
        () => {
          self.showSuccessModal = true;
          self.formLoading = false;
        },
        () => {
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
      self.customToolbar = config.customToolbar;
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
    },
    onImageChange(file, element) {
      const self = this;
      if (self.model.images.length == 0) {
        element.img = file;
        self.model.images.push(element);
      } else {
        _.forEach(self.model.images, el => {
          if (el.index == element.index) {
            el.img = file;
          }
        });
      }

      if (file === null) {
        _.forEach(self.model.data.fields, el => {
          if (el.type == 'image' && el.name == element.field.name) {
            el.data = file;
          }
        });
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
