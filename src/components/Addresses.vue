<template>
  <div class="row">
    <div class="col-12">
      <el-table ref="addressTable" :data="tableData" v-loading="loading" empty-text="...">
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
        <address-form ref="addressForm" :address.sync="model"></address-form>
        <div class="row">
          
          <div class="col-md-12">
            <a class="btn mt-3 btn-secondary btn-simple" @click="clearModel()">Cancelar</a>
            <base-button 
              class="mt-3 pull-right" 
              native-type="submit" 
              type="info"
              @click.native.prevent="saveAddress">
              Salvar
            </base-button>
            
          </div>
        </div>
      </form>
    </div>
    <!-- Classic Modal -->
    <modal
      :show.sync="modal.visible"
      headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover endereço</h4>
      <form class="modal-form" ref="modalForm" @submit.prevent v-loading="modal.formLoading" data-vv-scope="modalScope">
        <p>
          Nome do endereço <strong>{{modal.model.name}}</strong>
        </p>
        <input type="hidden" name="nome" v-model="modal.model.name" ref="nome">
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite o nome do endereço para confirmar"
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
import { BasePagination } from 'src/components';
import AddressForm from 'src/components/AddressForm.vue';
import Modal from 'src/components/Modal.vue';
import addressService from '../services/Address/addressService';
import listPage from '../mixins/listPage';
import _ from 'lodash';
export default {
  mixins: [listPage],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    [AddressForm.name]: AddressForm,
    BasePagination,
    [Modal.name]: Modal
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      internalName: 'components.addresses.list',
      sortField: 'name',
      tableColumns: [
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 200
        },
        {
          prop: 'zipcode',
          label: 'Cep',
          minWidth: 200
        }
      ],
      model: {
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
      addressService.findAllbyAssociation(request).then(
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
      this.$refs.addressForm.clearZipCodeValue();
      this.model.zipcode = obj.zipcode;
      this.model.street = obj.street;
      this.model.number = obj.number;
      this.model.complement = obj.complement;
      this.model.neighborhood = obj.neighborhood;
      this.model.city = obj.city;
      this.model.state = obj.state;
      this.model.country = 'BRA';
      this.model.latitude = obj.latitude;
      this.model.longitude = obj.longitude;
      this.model.name = obj.name;
      this.model.id = obj.id;
      this.formLoading = false;
    },
    saveAddress() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.formLoading = true;
          if (self.model.id > 0) {
            addressService.update(self.model).then(
              response => {
                self.$notify({
                  type: 'primary',
                  message: response
                    ? response.message
                    : 'Endereço atualizado com sucesso.',
                  icon: 'tim-icons icon-bell-55'
                });
                self.clearModel();
                self.formLoading = false;
                self.fetchData();
              },
              () => {
                console.log('erro');
                self.formLoading = false;
              }
            );
          } else {
            addressService.create(self.model).then(
              response => {
                addressService
                  .assiciateAddress({
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
                          : 'Endereço inserido com sucesso.',
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
          addressService
            .unlinkAddress({
              parent: self.parent,
              id: self.modal.model.id,
              parentId: self.parentId
            })
            .then(
              () => {
                addressService.delete(self.modal.model.id).then(
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
      this.model.zipcode = null;
      this.model.street = '';
      this.model.number = '';
      this.model.complement = '';
      this.model.neighborhood = '';
      this.model.city = '';
      this.model.state = '';
      this.model.country = 'BRA';
      this.model.latitude = '';
      this.model.longitude = '';
      this.model.name = '';
      this.model.id = 0;
      this.$validator.reset();
    }
  }
};
</script>
