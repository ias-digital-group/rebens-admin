<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">
            Clientes
            <base-link
              to="/promoter/new"
              class="btn btn-icon btn-simple btn-twitter btn-sm"
              ><i class="tim-icons icon-simple-add"></i
            ></base-link>
          </h4>
        </template>
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="pagination.perPage"
              :placeholder="$t('pages.banners.perpage-placeholder')"
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
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="customerStatus"
              v-if="!loading"
            >
              <el-option
                class="select-primary"
                value=""
                label="Todos status"
              ></el-option>
              <el-option
                class="select-primary"
                key="1"
                value="1"
                label="Completo"
              ></el-option>
              <el-option
                class="select-primary"
                key="3"
                value="3"
                label="Validação"
              ></el-option>
              <el-option
                class="select-primary"
                key="5"
                value="5"
                label="Incompleto"
              ></el-option>
            </el-select>
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                style="width:300px"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar cliente"
                aria-controls="datatables"
                v-model="searchQuery"
              >
              </el-input>
            </base-input>
          </div>
          <el-table
            ref="table"
            :data="tableData"
            v-loading="loading"
            :empty-text="$t('pages.banners.emptytext')"
            @sort-change="onSortChanged"
            :default-sort="{ prop: sortField, order: sortOrder }"
          >
            <el-table-column
              v-for="column in tableColumns"
              :key="column.label"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
              sortable="custom"
            >
            </el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <base-pagination
            class="pagination-no-border mt-3"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
            v-on:input="onPageChanged"
          >
          </base-pagination>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import promoterService from '../../services/Promoter/promoterService';
import listPage from '../../mixins/listPage';
export default {
  mixins: [listPage],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      internalName: 'Clientes',
      sortField: 'name',
      formLoading: false,
      customerStatus: '',
      tableColumns: [
        {
          prop: 'name',
          label: 'Nome'
        },
        {
          prop: 'cpf',
          label: 'CPF'
        },
        {
          prop: 'email',
          label: 'E-mail'
        },
        {
          prop: 'created',
          label: 'Data'
        },
        {
          prop: 'statusName',
          label: 'Status'
        }
      ]
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
        status: this.customerStatus
      };
      this.$data.loading = true;
      promoterService.list(request).then(
        response => {
          self.$data.tableData = response.data;
          if (response.data) {
            self.showForm = false;
            self.showTable = response.data.length > 0;
          } else {
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
    }
  },
  watch: {
    customerStatus() {
      this.fetchData();
    }
  }
};
</script>
<style lang="scss" scoped>
.modal-form {
  .has-label::after {
    top: 43px !important;
  }
}
</style>
