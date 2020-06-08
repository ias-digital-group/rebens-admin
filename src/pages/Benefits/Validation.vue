<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">Validação de Cupom</h4>
        </template>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                style="width:300px"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar beneficios"
                aria-controls="datatables"
                v-model="searchQuery"
              ></el-input>
            </base-input>
          </div>
          <el-table
            ref="table"
            :data="tableData"
            v-loading="loading"
            :empty-text="$t('pages.benefits.emptytext')"
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
            <el-table-column
              :min-width="150"
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
                >Validar</base-button>
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
    <!-- Classic Modal -->
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover benefício</h4>
      <form class="modal-form" ref="modalForm" @submit.prevent v-loading="modal.formLoading">
        <input type="hidden" name="nome" value="DELETE" ref="nome" />
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite DELETE para confirmar"
          placeholder="Digite DELETE para confirmar"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm"
          name="confirmação"
        ></base-input>
      </form>
      <template slot="footer">
        <base-button @click.native.prevent="validateModal" type="danger">Remover</base-button>
        <base-button type="info" @click.native="modal.visible = false">Fechar</base-button>
      </template>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination, Modal } from 'src/components';
import benefitService from '../../services/Benefit/benefitService';
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
      internalName: 'pages.benefits.list',
      partnerFilter: '',
      tableColumns: [
        {
          prop: 'customerName',
          label: 'Nome',
          minWidth: 150
        },
        {
          prop: 'customerCpf',
          label: 'cpf',
          minWidth: 150
        },
        {
          prop: 'partnerName',
          label: 'Parceiro',
          minWidth: 150
        },
        {
          prop: 'benefitName',
          label: 'Benefício',
          minWidth: 150
        },
        {
          prop: 'code',
          label: 'Código',
          minWidth: 150
        },
        {
          prop: 'usedDate',
          label: 'Data de utilização',
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
          `Tem certeza que deseja validar o ${row.benefitName}, código ${row.code} do cliente ${row.customerName}?`
        )
      ) {
        self.$data.loading = true;
        benefitService.validate(row.id).then(
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
        idPartner: this.partnerFilter
      };
      this.$data.loading = true;
      benefitService.findAllToValidate(request).then(
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
  },
  watch: {
    partnerFilter() {
      this.pagination.currentPage = 1;
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
