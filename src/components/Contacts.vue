<template>
  <div class="row">
    <div class="col-12">
      <el-table ref="contactsTable" :data="tableData" v-loading="loading" empty-text="...">
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
    </div>
    <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
      <div class="">
        <el-select class="select-primary mb-3 pagination-select" v-model="pagination.perPage" placeholder="Por página" v-if="!loading">
          <el-option class="select-primary" v-for="item in pagination.perPageOptions" :key="item" :label="item"
            :value="item">
          </el-option>
        </el-select>
      </div>
      <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage"
        :total="total" v-on:input="onPageChanged">
      </base-pagination>
    </div>
    <div class="col-12">
      <hr>
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
            <base-input 
              label="Fixo"
              type="tel"
              placeholder="Telefone"
              v-model="model.phone"
              ref="phone"
              :inputMask="['(##) ####-####']">
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
            :inputMask="['(##) ####-####', '(##) #####-####']">
            </base-input>
          </div>
        </div>
        <h4>Endereço</h4>
        <address-form ref="addressForm" :address.sync="model.address"></address-form>
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
    <!-- Classic Modal -->
    <modal
      :show.sync="modal.visible"
      headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover contato</h4>
      <form class="modal-form" ref="modalForm" @submit.prevent v-loading="modal.formLoading" data-vv-scope="modalScope">
        <p>
          Nome do contato <strong>{{modal.model.name}}</strong>
        </p>
        <input type="hidden" name="nome" v-model="modal.model.name" ref="nome">
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite o nome do contato para confirmar"
          placeholder="Confirme o nome"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm" name="confirmação"
          data-vv-scope="modalScope">
        </base-input>
      </form>
      <template slot="footer">
        <base-button @click.native.prevent="validateModal" type="danger">Remover</base-button>
        <base-button
          type="info"
          @click.native="modal.visible = false;">Fechar</base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { AddressForm, BasePagination, Modal } from 'src/components';
import contactService from '../services/Contact/contactService';
import listPage from '../mixins/listPage';
import _ from 'lodash';
export default {
  mixins: [listPage],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    AddressForm,
    BasePagination,
    Modal
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      internalName: 'components.contacts.list',
      sortField: 'name',
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
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        parentId: this.parentId,
        parent: this.parent
      };
      this.$data.loading = true;
      contactService.findAllbyAssociation(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    handleEdit(index, row) {
      this.formLoading = true;
      this.clearModel();
      let obj = _.cloneDeep(row);
      this.model.id = obj.id;
      this.model.name = obj.name;
      this.model.email = obj.email;
      this.model.jobTitle = obj.jobTitle;
      this.$refs.phone.clearValue();
      this.model.phone = obj.phone;
      this.$refs.cellPhone.clearValue();
      this.model.cellPhone = obj.cellPhone;
      if (obj.address) {
        this.$refs.addressForm.clearZipCodeValue();
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
      this.formLoading = false;
    },
    saveContact() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.formLoading = true;
          if (self.model.id > 0) {
            contactService.update(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response
                    ? response.message
                    : 'Contato atualizado com sucesso.',
                  icon: 'tim-icons icon-bell-55'
                });
                self.clearModel();
                self.formLoading = false;
                self.fetchData();
              },
              err => {
                self.$notify({
                  type: 'primary',
                  message: err.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.formLoading = false;
              }
            );
          } else {
            contactService.create(self.model).then(
              response => {
                contactService
                  .assiciateContact({
                    parent: self.parent,
                    id: response.id,
                    parentId: self.parentId
                  })
                  .then(
                    response => {
                      self.$notify({
                        type: 'primary',
                        message: response
                          ? response.message
                          : 'Contato inserido com sucesso.',
                        icon: 'tim-icons icon-bell-55'
                      });
                      self.clearModel();
                      self.formLoading = false;
                      self.fetchData();
                    },
                    err => {
                      self.$notify({
                        type: 'primary',
                        message: err.message,
                        icon: 'tim-icons icon-bell-55'
                      });
                      self.formLoading = false;
                    }
                  );
              },
              err => {
                self.$notify({
                  type: 'primary',
                  message: err.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.formLoading = false;
              }
            );
          }
        }
      });
    },
    validateModal() {
      const self = this;
      this.$validator.validateAll('modalScope').then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          contactService
            .unlinkContact({
              parent: self.parent,
              id: self.modal.model.id,
              parentId: self.parentId
            })
            .then(
              () => {
                contactService.delete(self.modal.model.id).then(
                  response => {
                    self.$notify({
                      type: 'primary',
                      message: response.message,
                      icon: 'tim-icons icon-bell-55'
                    });
                    self.resetModal();
                    self.pagination.currentPage = 1;
                    self.fetchData();
                  },
                  err => {
                    self.$notify({
                      type: 'primary',
                      message: err.message,
                      icon: 'tim-icons icon-bell-55'
                    });
                    self.modal.formLoading = false;
                  }
                );
              },
              err => {
                self.$notify({
                  type: 'primary',
                  message: err.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.modal.formLoading = false;
              }
            );
        }
      });
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
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
    }
  }
};
</script>
