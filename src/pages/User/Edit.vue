<template>
  <div class="row">
    <div class="col-md-12">
      <card :title="$t('pages.users.title')">
        <h4 slot="header" class="card-title">{{$t('pages.users.title')}}</h4>
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
                maxlength='300'></base-input>
            </div>
          </div>
          <div class="row">
              <label class="col-md-3 col-form-label">Email</label>
              <div class="col-md-9">
                <base-input 
                  required
                  v-model="model.email"
                  v-validate="modelValidations.email"
                  type="email"
                  :error="getError('email')"
                  name="email"
                  placeholder="Email" 
                  maxlength='300'></base-input>
              </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Papel</label>
            <div class="col-md-2">
                <div class="form-group">
                <el-select
                    class="select-info"
                    placeholder="Papel"
                    v-model="model.roles"
                    v-loading.lock="selectLoading"
                    v-validate="modelValidations.roles"
                    lock>
                    <el-option
                    class="select-primary"
                    value="master"
                    label="Master"
                    >
                    </el-option>
                    <el-option
                    class="select-primary"
                    value="publisher"
                    label="Publicador"
                    >
                    </el-option>
                    <el-option class="select-primary" value="administrator" label="Administrador">
                    </el-option>
                </el-select>
                </div>
            </div>
          </div>
          <div class="row" v-if="model.roles != 'master'">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-2">
                <div class="form-group">
                <el-select
                    class="select-info"
                    placeholder="Operação"
                    v-model="model.idOperation"
                    v-loading.lock="selectLoading"
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
              <label class="col-md-3 col-form-label"></label>
              <div class="col-md-9">
              <div class="form-group">
                  <base-checkbox v-model="model.active">Ativo</base-checkbox>
              </div>
              </div>
          </div>
          <div class="row">
            <div class="col-md-12">
                <base-link class="btn mt-3 btn-simple btn-primary" to="/users">Voltar</base-link>
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
import userService from '../../services/User/userService';
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
        name: '',
        email:'',
        status: false,
        idOperation:null,
        roles:''
      },
      modelValidations: {
        name: {
          required: true,
          max: 300
        },
        email: {
          required: true,
          max: 300
        },
        roles:{
          required:true
        }
      },
      operations: []
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_user' ? 'edit' : 'new';
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
          self.saveUser(self);
        }
      });
    },
    saveUser(vm) {
      vm = vm ? vm : this;
      if (vm.viewAction == 'new') {
        userService.create(vm.model).then(
          res => {
            vm.$notify({
              type: 'success',
              message: 'usuário cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/users');
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
        userService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/users');
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
        userService.get(self.id).then(
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
