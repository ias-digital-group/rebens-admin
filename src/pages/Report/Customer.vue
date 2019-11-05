<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">{{ $t('pages.report.customer.title') }}</h4>
        </template>
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="pagination.perPage"
              :placeholder="$t('pages.operationPartners.perpage-placeholder')"
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
              v-model="operationFilter"
              v-if="!loading && idOperation == 0"
            >
              <el-option
                class="select-primary"
                value="0"
                label="Todas operações"
              ></el-option>
              <el-option
                v-for="op in operations"
                class="select-primary"
                :key="op"
                :value="op.id"
                :label="op.title"
              ></el-option>
            </el-select>
            <!-- <el-select class="select-primary mb-3 pagination-select" :disabled="!partners || partners.length <= 0" v-model="partnerFilter" v-if="!loading">
              <el-option class="select-primary" value="" label="Todos parceiros"></el-option>
              <el-option v-for="item in partners" class="select-primary" :key="item" :value="item.id" :label="item.name"></el-option>
            </el-select> -->
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="activeFilter"
              v-if="!loading"
            >
              <el-option
                class="select-primary"
                value="0"
                label="Todos"
              ></el-option>
              <el-option
                class="select-primary"
                value="1"
                label="Ativos"
              ></el-option>
              <el-option
                class="select-primary"
                value="2"
                label="Inativos"
              ></el-option>
              <el-option
                class="select-primary"
                value="3"
                label="Validação"
              ></el-option>
              <el-option
                class="select-primary"
                value="4"
                label="Trocar Senha"
              ></el-option>
              <el-option
                class="select-primary"
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
                placeholder="Procurar categorias"
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
            :empty-text="$t('pages.report.emptytext')"
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
          <div class=""></div>
          <base-pagination
            class="pagination-no-border"
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
import reportService from '../../services/Report/reportService';
import operationService from '../../services/Operation/operationService';
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
      internalName: 'pages.report.customer.list',
      activeFilter: 0,
      partnerFilter: 0,
      operationFilter: 0,
      operations: [],
      partners: [],
      idOperation: 0,
      firstAccess: true,
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
        }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      self.runOnce(self);

      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        idOperation: self.operationFilter,
        idPartner: self.partnerFilter,
        status: self.activeFilter
      };
      self.$data.loading = true;
      reportService.listCustomers(request).then(
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
    runOnce(self) {
      if (self.firstAccess) {
        if (
          self.idOperation == 0 &&
          self.$store.getters.currentUser.idOperation
        )
          self.idOperation = self.$store.getters.currentUser.idOperation;

        if (self.idOperation == 0) {
          let obj = self.tableColumns.find(x => x.prop === 'operationName');
          if (!obj) {
            self.tableColumns.push({
              prop: 'operationName',
              label: this.$i18n.t('pages.report.customer.grid.operation'),
              minWidth: 200
            });
          }
        }

        if (self.operations.length <= 0 && self.idOperation == 0) {
          operationService
            .findAll({
              page: 0,
              pageItems: 1000,
              searchWord: '',
              sort: 'name ASC',
              active: 'true'
            })
            .then(response => {
              self.operations = response.data;
            });
        }

        self.firstAccess = false;
      }
    }
  },
  watch: {
    activeFilter() {
      this.fetchData();
    },
    operationFilter() {
      this.fetchData();
    },
    partnerFilter() {
      this.fetchData();
    }
  }
};
</script>
