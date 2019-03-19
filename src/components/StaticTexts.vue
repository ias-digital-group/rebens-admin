<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table ref="staticTextTable" :data="tableData" v-loading="loading" empty-text="...">
        <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
          :label="column.label">
        </el-table-column>
        <el-table-column :min-width="135" align="right" label="Ações">
          <div slot-scope="props">
            <base-button @click.native="handleEdit(props.$index, props.row);" class="edit btn-link" type="info"
              size="sm" icon>
              <i class="tim-icons icon-pencil"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"  v-if="showTable">
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
    <div class="col-12" v-if="showForm">
      <hr>
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <static-text-form ref="staticTextForm" :staticText.sync="model"></static-text-form>
        <div class="row">
          <div class="col-md-12">
            <a class="btn mt-3 btn-secondary btn-simple" @click="clearModel()">Cancelar</a>
            <base-button 
              class="mt-3 pull-right" 
              native-type="submit" 
              type="info"
              @click.native.prevent="saveStaticText">
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import StaticTextForm from 'src/components/StaticTextForm.vue';
import Modal from 'src/components/Modal.vue';
import staticTextService from '../services/StaticText/staticTextService';
import listPage from '../mixins/listPage';
import _ from 'lodash';
export default {
  mixins: [listPage],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select,
    [StaticTextForm.name]: StaticTextForm,
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
      internalName: 'components.statictext.list',
      sortField: 'name',
      showForm: false,
      showTable: false,
      tableColumns: [
        {
          prop: 'page',
          label: 'Pagina',
          minWidth: 200
        },
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 200
        }
      ],
      model: {
        id: 0,
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true
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
      staticTextService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          if(response.data){
            self.showForm = false;
            self.showTable = response.data.length > 0;
          }
          else{
            self.showForm = false;
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
      this.showForm = true;
      let obj = _.cloneDeep(row);
      this.model.active = obj.active;
      this.model.data = obj.data;
      this.model.page = obj.page;
      this.model.name = obj.name;
      this.model.id = obj.id;
      this.formLoading = false;
    },
    saveStaticText() {
      const self = this;
      self.formLoading = true;
      staticTextService.update(self.model).then(
        response => {
          self.$notify({
            type: 'primary',
            message: response
              ? response.message
              : 'Página atualizada com sucesso.',
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
      self.formLoading = false;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    clearModel() {
      this.model.page = '';
      this.model.data = {},
      this.model.active = false;
      this.model.name = '';
      this.model.id = 0;
      this.$validator.reset();
      //this.showForm = false;
    }
  }
};
</script>
