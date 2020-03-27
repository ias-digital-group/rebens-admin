<template>
  <div class="form-horizontal" :loading="staticTextFormLoading">
    <div v-for="(field, idx) in staticText.data.fields" :key="idx" class="row">
      <label class="col-md-3 col-form-label">{{ field.label }}</label>
      <template v-if="field.type == 'text'">
        <div class="col-md-9">
          <base-input
            v-model="field.data"
            type="text"
            :placeholder="field.name"
          ></base-input>
        </div>
      </template>
      <template v-else-if="field.type == 'tel' || field.type == 'phone'">
        <div class="col-md-9">
          <base-input
            type="tel"
            :placeholder="field.name"
            v-model="field.data"
            masked="true"
            :inputMask="['(##) ####-####', '(##) #####-####']"
          >
          </base-input>
        </div>
      </template>
      <template v-else-if="field.type == 'boolean'">
        <div class="col-md-9">
          <base-checkbox v-model="field.checked">&nbsp;</base-checkbox>
        </div>
      </template>
      <template v-else-if="field.type == 'html'">
        <div class="col-md-9">
          <wysiwyg
            v-model="field.data"
            placeholder="Digite o texto ..."
            style="margin-bottom:10px;"
          />
        </div>
      </template>
      <template v-else-if="field.type == 'select'">
        <div class="col-md-9">
          <el-select
            class="select-info"
            required
            :placeholder="field.label"
            v-model="field.data"
          >
            <el-option
              v-for="t in field.options"
              class="select-primary"
              :value="t.value"
              :label="t.name"
              :key="t.value"
            >
            </el-option>
          </el-select>
        </div>
      </template>
      <template v-else>
        <template v-if="field.data">
          <div class="col-md-9">
            <div class="fileinput">
              <div class="thumbnail">
                <img :src="field.data" class="img-preview" />
              </div>
            </div>
            <div>
              <base-button
                @click="removeImage(field, idx)"
                class="btn-simple btn-file"
                type="danger"
              >
                <i class="fas fa-times"></i>
              </base-button>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="col-md-9">
            <image-upload
              @change="onImageChange"
              :optionalData="getOptionalData(field, idx)"
              change-text="Alterar"
              remove-text="Remover"
              select-text="Selecione uma imagem"
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { ImageUpload } from 'src/components/index';
import _ from 'lodash';
export default {
  name: 'static-text-form',
  inject: {
    $validator: '$validator'
  },
  props: {
    staticText: Object
  },
  components: {
    ImageUpload,
    [Option.name]: Option,
    [Select.name]: Select
  },
  data() {
    return {
      staticTextFormLoading: false
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    getOptionalData(field, idx) {
      return { field: field, index: idx, data: field.data, img: null };
    },
    removeImage(field, idx) {
      field.data = '';
      _.remove(this.staticText.images, el => {
        return el.index == idx;
      });
    },
    onImageChange(file, element) {
      if (file == null) {
        //const f = this.staticText.images[element.index];
        //this.staticText.data.fields[element.index].data = '';
        //_.pullAt(this.staticText.images, i);
        return;
      }
      if (this.staticText.images.length == 0) {
        element.img = file;
        this.staticText.images.push(element);
      } else {
        _.forEach(this.staticText.images, el => {
          if (el.index == element.index) {
            el.img = file;
          }
        });
      }
    }
  }
};
</script>
