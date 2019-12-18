<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Pré-cadastro">
        <h4 slot="header" class="card-title">Pré-cadastro</h4>
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
                maxlength="300"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">CPF</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.cpf"
                v-validate="modelValidations.cpf"
                type="text"
                :error="getError('cpf')"
                name="cpf"
                placeholder="CPF"
                :inputMask="['###.###.###-##']"
                maxlength="50"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Telefones</label>
            <div class="col-md-9 col-lg-4">
              <base-input
                label="Fixo"
                type="tel"
                placeholder="Telefone"
                v-model="model.phone"
                ref="phone"
                :inputMask="['(##) ####-####']"
              >
              </base-input>
            </div>
            <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
              <base-input
                required
                label="Celular"
                v-validate="modelValidations.celular"
                :error="getError('celular')"
                name="celular"
                type="tel"
                ref="cellPhone"
                placeholder="Celular"
                v-model="model.cellPhone"
                :inputMask="['(##) ####-####', '(##) #####-####']"
              >
              </base-input>
            </div>
          </div>

          <div class="row">
            <label class="col-md-3 col-form-label">E-mail 1</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.email1"
                v-validate="modelValidations.email1"
                type="email"
                :error="getError('email1')"
                name="email1"
                placeholder="email1"
                maxlength="500"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">E-mail 2</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.email2"
                v-validate="modelValidations.email2"
                type="email"
                :error="getError('email2')"
                name="email2"
                placeholder="email2"
                maxlength="500"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/customers"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateCustomer"
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
import operationService from '../../services/Operation/operationService';
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
      idOperation: 0,
      model: {
        id: 0,
        name: '',
        cpf: '',
        phone: null,
        cellPhone: null,
        email1: null,
        email2: null
      },
      modelValidations: {
        nome: {
          required: true,
          max: 300
        },
        cpf: {
          max: 50,
          required: true
        },
        phone: {
          max: 50
        },
        cellPhone: {
          max: 50
        },
        email1: {
          max: 500
        },
        email2: {
          max: 500
        }
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateCustomer() {
      const self = this;

      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.submitLoading = true;
          self.saveCustomer(self);
        }
      });
      // if(self.model.name !== '' && self.model.name.length <= 300
      //   && self.model.cpf !== '' && self.model.cpf.length <= 500){
      //     self.submitLoading = true;
      //     self.saveCustomer(self);
      //   }
    },
    clearForm() {
      const self = this;
      self.model.name = '';
      self.model.cpf = '';
      self.model.phone = '';
      self.model.cellPhone = '';
      self.model.email1 = '';
      self.model.email2 = '';
    },
    saveCustomer() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          operationService.createCustomer(self.idOperation, self.model).then(
            response => {
              self.$notify({
                type: 'primary',
                message: response
                  ? response.message
                  : 'Cliente pré cadastrado com sucesso.',
                icon: 'tim-icons icon-bell-55'
              });
              self.clearForm();
              self.submitLoading = false;
              self.$router.push('/customers');
            },
            err => {
              self.$notify({
                type: 'primary',
                message: err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.submitLoading = false;
            }
          );
        }
      });
    }
  },
  created() {
    this.idOperation = this.$store.getters.currentUser.idOperation;
  }
};
</script>
