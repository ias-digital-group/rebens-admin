<template>
<div class="row">
  <div class="col-md-12">
    <card title="Pré-cadastro">
      <h4 slot="header" class="card-title">Parceiro</h4>
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <div class="row">
          <label class="col-md-3 col-form-label">Nome</label>
          <div class="col-md-9">
            <base-input 
              required
              v-model="model.name"
              v-validate="modelValidations.nome"
              type="text"
              :error="getError('nome')"
              name="nome"
              placeholder="Nome" 
              maxlength='300'></base-input>
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
            <base-link class="btn mt-3 btn-simple btn-primary" to="/operationPartner">Voltar</base-link>
            <base-button 
              class="mt-3 pull-right" 
              native-type="submit" 
              type="info"
              @click.native.prevent="validatePartner"
              :loading="submitLoading">
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
import { Select, Option, Tabs, TabPane, DatePicker } from 'element-ui';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select
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
      idOperation:0,
      model: {
        id: 0,
        name: '',
        idOperation: 0,
        active: true
      },
      modelValidations: {
        nome: {
          required: true,
          max: 300
        }
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validatePartner() {
      const self = this;
      if(self.model.name !== '' && self.model.name.length <= 300){
            self.submitLoading = true;
            self.savePartner(self);
        }
    },
    clearForm(){
      const self = this;
      self.model.name = '';
    },
    savePartner(vm) {
      vm = vm ? vm : this;
      vm.model.idOperation = vm.idOperation;
      if (vm.model.id === 0) {
        operationPartnerService.create(vm.model).then(
          res => {
            vm.$notify({
              type: 'success',
              message: 'Parceiro com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.clearForm();
            vm.$router.push('/operationPartner');
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
        operationPartnerService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.clearForm();
            vm.$router.push('/operationPartner');
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
    }
  },
  created(){
    this.idOperation = this.$store.getters.currentUser.idOperation;
  }
};
</script>
