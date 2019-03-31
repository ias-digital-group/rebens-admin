<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">{{$t('pages.report.customer.title')}}</h4>
        </template>
        <div>
          <el-table ref="table" :data="tableData" v-loading="loading" :empty-text="$t('pages.report.emptytext')" @sort-change="onSortChanged" :default-sort="{prop: sortField, order: sortOrder}">
            <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
              :label="column.label" sortable="custom">
            </el-table-column>
          </el-table>
        </div>
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="">
            
          </div>
          <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage"
            :total="total" v-on:input="onPageChanged">
          </base-pagination>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import reportService from '../../services/Report/reportService';
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
      sortField: 'name',
      tableColumns: [
        {
          prop: 'id',
          label: this.$i18n.t('pages.report.customer.grid.id'),
          minWidth: 0
        },
        {
          prop: 'name',
          label: this.$i18n.t('pages.report.customer.grid.name'),
          minWidth: 200
        },
        {
          prop: 'email',
          label: this.$i18n.t('pages.report.customer.grid.email'),
          minWidth: 200
        },
        {
          prop: 'statusName',
          label: this.$i18n.t('pages.report.customer.grid.status'),
          minWidth: 200
        },
        {
          prop: 'operationName',
          label: this.$i18n.t('pages.report.customer.grid.operation'),
          minWidth: 200
        }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: 30,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        idOperation:''
      };
      this.$data.loading = true;
        reportService.listCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          self.$data.pagination.perPage = 30;
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
