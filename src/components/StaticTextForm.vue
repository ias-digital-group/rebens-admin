<template>
    <div class="form-horizontal" :loading="staticTextFormLoading">
      <div v-for="(field, idx) in staticText.data.fields" :key="idx" class="row">
          <label class="col-md-3 col-form-label">{{field.label}}</label>
          <template v-if="field.type == 'text'">
            <div class="col-md-9">
              <base-input 
              v-model="field.data"
              type="text"
              :placeholder="field.name"></base-input>
            </div>
          </template>
          <template v-else-if="field.type='html'">
            <div class="col-md-9">
              <wysiwyg v-model="field.data" style="margin-bottom:10px;" />
            </div>
          </template>
          <template v-else>
            <template v-if="field.data">
              <div class="row">
                <label class="col-md-3 col-form-label">Imagem</label>
                <div class="col-md-9">
                  <div class="fileinput">
                    <div class="thumbnail">
                      <img :src="field.data" class="img-preview" />
                    </div>
                  </div>
                  <div>
                    <base-button @click="field.data = ''" class="btn-simple btn-file" type="danger">
                      <i class="fas fa-times"></i>
                    </base-button>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="row">
                <label class="col-md-3 col-form-label">Imagem *</label>
                <div class="col-md-9">
                  <image-upload @change="onImageChange" :optionalData="field" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                </div>
              </div>
            </template>
          </template>
      </div>
    </div>
</template>
<script>
import { ImageUpload } from 'src/components/index';
export default {
  name: 'static-text-form',
  inject: {
    $validator: '$validator'
  },
  props: {
    staticText: Object
  },
  components:{
    ImageUpload
  },
  data() {
    return {
      staticTextFormLoading: false,
      selectedField: 0
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    onImageChange(file, field) {
      field.data = file;
    }
  }
};
</script>
