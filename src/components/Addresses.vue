<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="addressTable"
        :data="tableData"
        v-loading="loading"
        empty-text="..."
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.label"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
        >
        </el-table-column>
        <el-table-column :min-width="135" align="right" label="Ações">
          <div slot-scope="props">
            <base-button
              @click.native="handleEdit(props.$index, props.row)"
              class="edit btn-link"
              type="info"
              size="sm"
              icon
            >
              <i class="tim-icons icon-pencil"></i>
            </base-button>
            <base-button
              @click.native="handleDelete(props.$index, props.row)"
              class="remove btn-link"
              type="danger"
              size="sm"
              icon
            >
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
      v-if="showTable"
    >
      <div class="">
        <el-select
          class="select-primary mb-3 pagination-select"
          v-model="pagination.perPage"
          placeholder="Por página"
          v-if="!loading"
        >
          <el-option
            class="select-primary"
            v-for="item in pagination.perPageOptions"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <base-pagination
        class="pagination-no-border"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total="total"
        v-on:input="onPageChanged"
      >
      </base-pagination>
    </div>
    <div class="col-12" v-if="!showForm">
      <a
        class="btn mt-3 btn-success btn-simple pull-right"
        @click="showForm = true"
        >Adicionar</a
      >
    </div>

    <div class="col-12" v-if="showForm">
      <hr />
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <div class="form-horizontal" :loading="addressFormLoading">
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.name"
                v-validate="modelValidations.addressName"
                type="text"
                :error="getError('addressName')"
                name="addressName"
                placeholder="Nome"
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Cep</label>
            <div class="col-md-3 col-lg-2">
              <base-input
                required
                v-model="model.zipcode"
                v-validate="modelValidations.cep"
                type="tel"
                :error="getError('cep')"
                name="cep"
                placeholder="Cep"
                maxlength="9"
                ref="zipcode"
                :inputMask="['#####-####']"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Endereço</label>
            <div class="col-md-6 col-lg-4">
              <base-input
                required
                v-model="model.street"
                v-validate="modelValidations.logradouro"
                type="text"
                :error="getError('logradouro')"
                name="logradouro"
                placeholder="Endereço"
                maxlength="400"
              ></base-input>
            </div>
            <div class="col-md-3 col-lg-2">
              <base-input
                required
                v-model="model.number"
                v-validate="modelValidations.numero"
                type="text"
                :error="getError('numero')"
                name="numero"
                placeholder="Numero"
                maxlength="50"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Complemento</label>
            <div class="col-md-4 col-lg-2">
              <base-input
                v-model="model.complement"
                type="text"
                placeholder="Complemento"
                maxlength="50"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Bairro</label>
            <div class="col-md-4 col-lg-2">
              <base-input
                required
                v-model="model.neighborhood"
                v-validate="modelValidations.bairro"
                type="text"
                name="bairro"
                :error="getError('bairro')"
                placeholder="Bairro"
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Cidade</label>
            <div class="col-md-5">
              <base-input
                required
                v-model="model.city"
                v-validate="modelValidations.cidade"
                type="text"
                :error="getError('cidade')"
                name="cidade"
                placeholder="Cidade"
                maxlength="200"
              ></base-input>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Estado</label>
            <div class="col-md-2">
              <div class="form-group">
                <el-select
                  :class="{
                    'select-info': true,
                    'has-danger': errors.has('estado')
                  }"
                  placeholder="Estado"
                  v-model="model.state"
                  v-validate="modelValidations.estado"
                  name="estado"
                  lock
                >
                  <el-option
                    v-for="state in stateList"
                    class="select-primary"
                    :value="state"
                    :label="state"
                    :key="state"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="errors.has('estado')"
                  class="error"
                  v-html="getError('estado')"
                ></label>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <a class="btn mt-3 btn-secondary btn-simple" @click="clearModel()"
              >Cancelar</a
            >
            <base-button
              class="mt-3 pull-right"
              native-type="submit"
              type="info"
              @click.native.prevent="saveAddress"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>

    <!-- Classic Modal -->
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover endereço</h4>
      <form
        class="modal-form"
        ref="modalForm"
        @submit.prevent
        v-loading="modal.formLoading"
        data-vv-scope="modalScope"
      >
        <p>
          Nome do endereço <strong>{{ modal.model.name }}</strong>
        </p>
        <input
          type="hidden"
          name="nome"
          v-model="modal.model.name"
          ref="nome"
        />
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite o nome do endereço para confirmar"
          placeholder="Confirme o nome"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm"
          name="confirmação"
          data-vv-scope="modalScope"
        >
        </base-input>
      </form>
      <template slot="footer">
        <base-button @click.native.prevent="validateModal" type="danger"
          >Remover</base-button
        >
        <base-button type="info" @click.native="modal.visible = false"
          >Fechar</base-button
        >
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
import helperService from '../services/Helper/helperService';

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
  inject: {
    $validator: '$validator'
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      internalName: 'components.addresses.list',
      sortField: 'name',
      showForm: false,
      showTable: false,
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
      zipCodeFocused: false,
      zipCodeTouched: false,
      addressFormLoading: false,
      modelValidations: {
        cep: {
          required: true
        },
        logradouro: {
          required: true
        },
        numero: {
          required: true
        },
        bairro: {
          required: true
        },
        cidade: {
          required: true
        },
        estado: {
          required: true
        },
        addressName: {
          required: true,
          max: 200
        }
      },
      stateList: [
        'AC',
        'AL',
        'AM',
        'AP',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MG',
        'MS',
        'MT',
        'PA',
        'PB',
        'PE',
        'PI',
        'PR',
        'RJ',
        'RN',
        'RO',
        'RR',
        'RS',
        'SC',
        'SE',
        'SP',
        'TO'
      ]
    };
  },
  watch: {
    'address.zipcode': function(value) {
      if (value && value.length == 8) {
        this.getAddressData(value);
      }
    }
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
          if (response.data) {
            self.showForm = response.data.length == 0;
            self.showTable = response.data.length > 0;
          } else {
            self.showForm = true;
            self.showTable = false;
          }
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
      //this.$refs.zipcode.clearValue();
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
      this.showForm = true;
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
      this.showForm = false;
    },
    getAddressData(zipCode) {
      this.addressFormLoading = true;
      const self = this;
      helperService.getAddressFromZipCode(zipCode).then(
        response => {
          self.address.street = response.logradouro;
          self.address.complement = response.complemento;
          self.address.neighborhood = response.bairro;
          self.address.city = response.localidade;
          self.address.state = response.uf;
          self.addressFormLoading = false;
        },
        () => {
          self.addressFormLoading = false;
        }
      );
    }
  }
};
</script>
