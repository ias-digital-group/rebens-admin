<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">Assinaturas</h4>
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
              ></el-option>
            </el-select>
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                style="width:300px"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar categorias"
                aria-controls="datatables"
                v-model="searchQuery"
              ></el-input>
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
            ></el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <div>
            <p class="card-category"></p>
          </div>
          <base-pagination
            class="pagination-no-border"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
            v-on:input="onPageChanged"
          ></base-pagination>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import wirecardService from '../../services/Wirecard/wirecardService';
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
      internalName: 'subscriptions',
      sortField: 'name',
      tableColumns: [
        {
          prop: 'code',
          label: 'Código',
          minWidth: 0
        },
        {
          prop: 'customer.name',
          label: 'Nome',
          minWidth: 100
        },
        {
          prop: 'planName',
          label: 'Plano',
          minWidth: 50
        },
        {
          prop: 'amountString',
          label: 'Valor',
          minWidth: 0
        },
        {
          prop: 'nextInvoiceDateString',
          label: 'Próxima cobrança',
          minWidth: 0
        },
        {
          prop: 'status',
          label: 'Status',
          minWidth: 0
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
        idOperation: ''
      };
      this.$data.loading = true;
      wirecardService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    }
  }
};
</script>
