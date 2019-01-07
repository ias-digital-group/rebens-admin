<template>
<div class="row">
  <div class="col-md-12">
    <card title="Horizontal Form">
      <h4 slot="header" class="card-title">{{$t('pages.categories.title')}}</h4>
      <form class="form-horizontal" @submit.prevent>
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
              maxlength='100'></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Ordem</label>
          <div class="col-md-2">
            <base-input 
              required
              v-model="model.order"
              v-validate="modelValidations.order"
              type="tel"
              :error="getError('order')"
              name="order"
              placeholder="Ordem" 
              maxlength='4' 
              :inputMask="['####']">
            </base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Categoria pai</label>
          <div class="col-md-9">
            <el-select
                class="select-info"
                placeholder="Categoria pai"
                v-model="model.idParent"
              >
                <el-option
                  v-for="category in categoriesList"
                  class="select-primary"
                  :value="category.id"
                  :label="category.name"
                  :key="category.id"
                >
                </el-option>
              </el-select>
          </div>
        </div>
        <div class="row">
            <label class="col-md-3 col-form-label"></label>
            <div class="col-md-9">
              <div class="form-group">
                <base-checkbox>Ativo</base-checkbox>
              </div>
            </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label"></label>
          <div class="col-md-9">
            <base-button 
              class="mt-3" 
              native-type="submit" 
              type="primary"
              @click.native.prevent="validate"
              :loading="formLoading">
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
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
  },
  data() {
    return {
      formLoading: false,
      model: {
        name: '',
        order: null,
        idParent: 0
      },
      modelValidations: {
        name: {
          required: true,
          max:100
        },
        order: {
          required: true,
          max: 4
        }
      },
      categoriesList: [
        {
          id: 0,
          name: 'Sem categoria'
        },
        {
          id: 1,
          name: 'Categoria1'
        },
        {
          id: 2,
          name: 'Categoria2'
        }
      ]
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate(){
      const self = this;
      this.formLoading = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          self.formLoading = false;
        }
      });
    }
  }
};
</script>
<style></style>
