<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Pré-cadastro">
        <h4 slot="header" class="card-title">Cliente</h4>
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
            <label class="col-md-3 col-form-label">E-mail</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.email"
                v-validate="modelValidations.email"
                type="email"
                :error="getError('email')"
                name="email1"
                placeholder="email"
                maxlength="500"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <base-link class="btn mt-3 btn-simple btn-primary" to="/promoter"
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
import promoterService from '../../services/Promoter/promoterService';
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
        cpf: '',
        email: null
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
        email: {
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
    },
    clearForm() {
      const self = this;
      self.model.name = '';
      self.model.cpf = '';
      self.model.email = '';
    },
    saveCustomer() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          promoterService.create(self.model).then(
            response => {
              self.$notify({
                type: 'primary',
                message: response
                  ? response.message
                  : 'Cliente cadastrado com sucesso.',
                icon: 'tim-icons icon-bell-55'
              });
              self.clearForm();
              self.submitLoading = false;
              self.$router.push('/promoter');
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
  }
};
</script>
