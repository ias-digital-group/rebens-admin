<template>
  <div class="row">
    <div class="col-12">
      <el-table ref="contactsTable" :data="data" v-loading="loading" empty-text="...">
        <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
          :label="column.label">
        </el-table-column>
        <el-table-column :min-width="135" align="right" label="Ações">
          <div slot-scope="props">
            <base-button @click.native="handleEdit(props.$index, props.row);" class="edit btn-link" type="warning"
              size="sm" icon>
              <i class="tim-icons icon-pencil"></i>
            </base-button>
            <base-button @click.native="handleDelete(props.$index, props.row);" class="remove btn-link" type="danger"
              size="sm" icon>
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
      <hr>
      <form class="form-horizontal" :loading="contactformLoading" @submit.prevent>
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
          <label class="col-md-3 col-form-label">E-mail</label>
          <div class="col-md-5">
            <base-input 
              required
              v-model="model.email"
              v-validate="modelValidations.email"
              type="text"
              :error="getError('email')"
              name="email"
              placeholder="email" 
              maxlength='300'></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Cargo</label>
          <div class="col-md-3">
            <base-input 
              v-model="model.jobTitle"
              type="text"
              placeholder="Cargo" 
              maxlength='200'></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Telefones</label>
          <div class="col-md-9 col-lg-4">
            <div :class="{'form-group':true, 'has-label': true}">
              <label>Fixo</label>
              <the-mask type="tel"
              placeholder="Telefone"
              v-model="model.phone"
              :mask="['(##) ####-####']"
              ref="phone"
              class="form-control" aria-describedby="addon-right addon-left">
              </the-mask>
            </div> 
          </div>
          <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
            <div :class="{'form-group':true, 'has-danger': errors.has('celular'), 'has-success': !errors.has('celular'), 'has-label': true}">
              <label>Celular</label>
              <the-mask 
                v-validate="modelValidations.celular"
                name="celular"
                type="tel"
                placeholder="Celular"
                v-model="model.cellPhone"
                :mask="['(##) ####-####', '(##) #####-####']"
                ref="cellPhone"
                class="form-control" aria-describedby="addon-right addon-left">
              </the-mask>
              <label v-show="errors.has('celular')" class="error" v-html="getError('celular')"></label>
            </div>
          </div>
        </div>
        <h4>Endereço</h4>
        <address-form :address.sync="model.address"></address-form>
        <div class="row">
          <label class="col-md-3 col-form-label"></label>
          <div class="col-md-9">
            <base-button 
              class="mt-3" 
              native-type="submit" 
              type="info"
              @click.native.prevent="saveContact">
              Salvar
            </base-button>
            <a class="btn mt-3 btn-secondary" @click="clearModel()">Cancelar</a>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import AddressForm from './AddressForm';
import eventBus from '../eventbus.js';
import contactService from '../services/Contact/contactService';
import _ from 'lodash';
export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    AddressForm
  },
  props: {
    data: Array,
    parent: String
  },
  data() {
    return {
      loading: false,
      contactformLoading: false,
      tableColumns: [
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 200
        },
        {
          prop: 'email',
          label: 'E-mail',
          minWidth: 200
        }
      ],
      model: {
        id: 0,
        name: '',
        email: '',
        jobTitle: '',
        phone: null,
        cellPhone: null,
        idAddress: 0,
        address: {
          id: 0,
          zipcode: null,
          street: '',
          number: '',
          complement: '',
          neighborhood: '',
          city: '',
          state: '',
          country: 'BRA',
          latitude: '',
          longitude: '',
          name: ''
        }
      },
      modelValidations: {
        nome: {
          required: true,
          max: 300
        },
        email: {
          required: true,
          max: 400
        },
        celular: {
          required: true
        }
      }
    };
  },
  mounted() {
    const self = this;
    eventBus.$on(
      `${this.parent ? `${this.parent}.` : ''}contact.action.done`,
      response => {
        self.$notify({
          type: 'primary',
          message: response
            ? response.message
            : 'Contato atualizado com sucesso.',
          icon: 'tim-icons icon-bell-55'
        });
        self.clearModel();
      }
    );
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    saveContact() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          if (self.model.id > 0) {
            contactService.update(self.model).then(
              () => {
                self.createEventMessage(self, 'update', self.model);
              },
              () => {
                console.log('erro');
              }
            );
          } else {
            contactService.create(self.model).then(
              response => {
                self.createEventMessage(self, 'create', response.id);
              },
              () => {
                console.log('erro');
              }
            );
          }
        }
      });
    },
    handleEdit(index, row) {
      this.clearModel();
      let obj = _.cloneDeep(row);
      this.model.id = obj.id;
      this.model.name = obj.name;
      this.model.email = obj.email;
      this.model.jobTitle = obj.jobTitle;
      this.model.phone = obj.phone;
      this.$refs.phone.refresh(obj.phone);
      this.model.cellPhone = obj.cellPhone;
      this.$refs.cellPhone.refresh(obj.cellPhone);
      if (obj.address) {
        this.model.address.zipcode = obj.address.zipcode;
        this.model.address.street = obj.address.street;
        this.model.address.number = obj.address.number;
        this.model.address.complement = obj.address.complement;
        this.model.address.neighborhood = obj.address.neighborhood;
        this.model.address.city = obj.address.city;
        this.model.address.state = obj.address.state;
        this.model.address.country = 'BRA';
        this.model.address.latitude = obj.address.latitude;
        this.model.address.longitude = obj.address.longitude;
        this.model.address.name = obj.address.name;
        this.model.address.id = obj.address.id;
      }
    },
    clearModel() {
      this.model.id = 0;
      this.model.name = '';
      this.model.email = '';
      this.model.jobTitle = '';
      this.model.phone = null;
      this.model.cellPhone = null;
      this.model.address.zipcode = null;
      this.model.address.street = '';
      this.model.address.number = '';
      this.model.address.complement = '';
      this.model.address.neighborhood = '';
      this.model.address.city = '';
      this.model.address.state = '';
      this.model.address.country = 'BRA';
      this.model.address.latitude = '';
      this.model.address.longitude = '';
      this.model.address.name = '';
      this.model.address.id = 0;
      this.$validator.reset();
    },
    createEventMessage(vw, action, data) {
      eventBus.$emit(
        `${vw.parent ? `${vw.parent}.` : ''}contact.${action}`,
        data
      );
    }
  }
};
</script>
