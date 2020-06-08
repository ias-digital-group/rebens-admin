<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">Validação de Ingresso</h4>
        </template>
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                style="width:300px"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar Ingersso"
                aria-controls="datatables"
                v-model="searchQuery"
              ></el-input>
            </base-input>
          </div>
          <el-table
            ref="table"
            :data="tableData"
            v-loading="loading"
            empty-text="Nenhum ingresso encontrado"
          >
            <el-table-column
              v-for="column in tableColumns"
              :key="column.label"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
              sortable="custom"
            ></el-table-column>
            <el-table-column
              :min-width="120"
              align="right"
              :label="$t('pages.benefits.grid.actions')"
            >
              <div slot-scope="props">
                <base-button
                  @click.native="validate(props.row)"
                  class="btn-link"
                  type="warning"
                  size="sm"
                  v-if="!props.row.used"
                  style="padding:0 5px;font-size:12px;font-weight:400;line-height:28px"
                  >Validar</base-button
                >
                <span v-else>Utilizado</span>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <div class></div>
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
import { BasePagination, Modal } from 'src/components';
import orderService from '../../services/Order/orderService';
import listPage from '../../mixins/listPage';
export default {
  mixins: [listPage],
  components: {
    Modal,
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      internalName: 'Validação de Ingressos',
      operationFilter: '',
      tableColumns: [
        {
          prop: 'customerName',
          label: 'Nome',
          minWidth: 200
        },
        {
          prop: 'customerCpf',
          label: 'Cpf',
          minWidth: 200
        },
        {
          prop: 'itemName',
          label: 'Produto',
          minWidth: 100
        },
        {
          prop: 'voucher',
          label: 'Código',
          minWidth: 0
        },
        {
          prop: 'usedDate',
          label: 'Data utilização',
          minWidth: 0
        }
      ]
    };
  },
  methods: {
    validate(row) {
      const self = this;
      if (
        confirm(
          `Tem certeza que deseja validar o ${row.itemName}, código ${row.voucher} do cliente ${row.customerName}?`
        )
      ) {
        self.$data.loading = false;
        orderService.validate(row.id).then(
          response => {
            if (response.status === 'ok') {
              row.used = true;
              const dt = new Date();
              row.usedDate = `${
                dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()
              }/${
                dt.getMonth() + 1 < 10
                  ? '0' + (dt.getMonth() + 1)
                  : dt.getMonth() + 1
              }/${dt.getFullYear()} ${
                dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()
              }:${
                dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes()
              }`;
            } else {
              self.$notify({
                type: 'danger',
                message: response.message
              });
            }
            self.$data.loading = false;
          },
          () => {
            self.$data.loading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        idOperation: this.operationFilter
      };
      this.$data.loading = true;
      orderService.findAllToValidate(request).then(
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
<style lang="scss" scoped>
.modal-form {
  .has-label::after {
    top: 43px !important;
  }
}
</style>
