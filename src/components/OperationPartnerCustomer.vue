<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        :empty-text="$t('pages.operationPartners.emptytext')"
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
        <el-table-column
          :min-width="135"
          align="right"
          :label="$t('pages.operationPartners.grid.actions')"
        >
          <div slot-scope="props">
            <base-button
              v-show="props.row.status == 1"
              @click.native="approve(props.$index, props.row)"
              title="Aprovar"
              class="edit btn-link"
              type="success"
              size="sm"
              icon
            >
              <i class="tim-icons icon-check-2"></i>
            </base-button>
            <base-button
              v-show="props.row.status == 1"
              @click.native="disapprove(props.$index, props.row)"
              title="Reprovar"
              class="remove btn-link"
              type="danger"
              size="sm"
              icon
            >
              <i class="fas fa-times"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination } from 'src/components';
import operationPartnerService from '../services/OperationPartner/operationPartnerService';
import listPage from '../mixins/listPage';
export default {
  mixins: [listPage],
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      internalName: 'Clientes de parceiros',
      sortField: 'name',
      formLoading: false,
      showForm: false,
      showTable: false,
      tableColumns: [
        {
          prop: 'id',
          label: 'Id',
          minWidth: 0
        },
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 150
        },
        {
          prop: 'email',
          label: 'Email',
          minWidth: 200
        },
        {
          prop: 'cpf',
          label: 'CPF',
          minWidth: 100
        },
        {
          prop: 'operationPartnerName',
          label: 'Parceiro',
          minWidth: 150
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
        idOperation: this.parentId,
        status: 1,
        idOperationPartner: this.$store.getters.currentUser.idOperationPartner
      };
      this.$data.loading = true;
      operationPartnerService.findAllCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
          self.showTable = response.totalItems > 0;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    approve(index, row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 2 })
        .then(
          () => {
            self.$notify({
              type: 'primary',
              message: 'Cliente aprovado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            row.status = 2;
            row.statusName = 'aprovado';
          },
          err => {
            self.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
          }
        );
    },
    disapprove(index, row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 3 })
        .then(
          () => {
            self.$notify({
              type: 'primary',
              message: 'Cliente reprovado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            row.status = 3;
            row.statusName = 'reprovado';
          },
          err => {
            self.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
          }
        );
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
