<template>
<div class="row">
  <div class="col-md-12">
    <card :title="$t('pages.faqs.title')">
      <h4 slot="header" class="card-title">{{$t('pages.faqs.title')}}</h4>
      
      
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
            <div class="row">
            <label class="col-md-3 col-form-label">Pergunta</label>
            <div class="col-md-9">
                <base-input 
                required
                v-model="model.question"
                v-validate="modelValidations.question"
                type="text"
                :error="getError('question')"
                name="question"
                placeholder="Pergunta" 
                maxlength='200'></base-input>
            </div>
            </div>
            <div class="row">
                <label class="col-md-3 col-form-label">Resposta</label>
                <div class="col-md-9">
                    <wysiwyg v-model="model.answer" />
                </div>
            </div>
            <div class="row">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-2">
                <div class="form-group">
                <el-select
                    class="select-info"
                    placeholder="Operação"
                    v-model="model.idOperation"
                    v-loading.lock="selectLoading"
                    v-validate="modelValidations.operation"
                    lock>
                    <el-option
                    v-for="type in operations"
                    class="select-primary"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                    >
                    </el-option>
                </el-select>
                </div>
            </div>
            </div>
            <div class="row">
            <label class="col-md-3 col-form-label">Ordem</label>
            <div class="col-md-2">
                <base-input 
                required
                v-model="model.order"
                v-validate="modelValidations.order"
                type="number"
                :error="getError('order')"
                name="order"
                placeholder="Ordem" 
                maxlength='3'></base-input>
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
                <base-link class="btn mt-3 btn-simple btn-primary" to="/faqs">Voltar</base-link>
                <base-button 
                class="mt-3 pull-right" 
                native-type="submit" 
                type="info"
                @click.native.prevent="validate"
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
import faqService from '../../services/Faq/faqService';
import operationService from '../../services/Operation/operationService';
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
      model: {
        question: '',
        answer:'',
        order: 1,
        active: false,
        idOperation:null
      },
      modelValidations: {
        question: {
          required: true,
          max: 1000
        },
        answer: {
          required: true,
          max: 1000
        },
        order: {
          required: true,
          max: 4
        },
        operation:{
          required:true
        }
      },
      operations: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_faq' ? 'edit' : 'new';
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
          self.saveFaq(self);
        }
      });
    },
    saveFaq(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        faqService.create(vm.model).then(
          res => {
            vm.$notify({
              type: 'success',
              message: 'Pergunta cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/faqs');
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
        faqService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/faqs');
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
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        faqService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
      this.selectLoading = true;
      operationService.findAll().then(
        response => {
          self.operations.push({ id: null, title: 'selecione' });
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ id: el.id, title: el.title });
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
