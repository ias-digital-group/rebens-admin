<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">{{$t('pages.partners.title')}}
            <base-link to="/partners/new" class="btn btn-icon btn-simple btn-twitter btn-sm"><i class="tim-icons icon-simple-add"></i></base-link>
          </h4>
        </template>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <el-select class="select-primary mb-3 pagination-select" v-model="pagination.perPage" :placeholder="$t('pages.partners.perpage-placeholder')" v-if="!loading">
              <el-option class="select-primary" v-for="item in pagination.perPageOptions" :key="item" :label="item"
                :value="item">
              </el-option>
            </el-select>
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar parceiros"
                aria-controls="datatables"
                v-model="searchQuery">
              </el-input>
            </base-input>
          </div>
          <el-table ref="table" :data="tableData" v-loading="loading" :empty-text="$t('pages.partners.emptytext')" @sort-change="onSortChanged" :default-sort="{prop: sortField, order: sortOrder}">
            <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
              :label="column.label" sortable="custom">
            </el-table-column>
            <el-table-column :min-width="135" align="right" :label="$t('pages.partners.grid.actions')">
              <div slot-scope="props">
                <base-button @click.native="handleEdit(props.$index, props.row);" class="edit btn-link" type="info"
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
        <div slot="footer" class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
          <div class="">
            
          </div>
          <base-pagination class="pagination-no-border" v-model="pagination.currentPage" :per-page="pagination.perPage"
            :total="total" v-on:input="onPageChanged">
          </base-pagination>
        </div>
      </card>
    </div>
    <!-- Classic Modal -->
    <modal
      :show.sync="modal.visible"
      headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover parceiro</h4>
      <form class="modal-form" ref="modalForm" @submit.prevent v-loading="modal.formLoading">
        <p>
          Nome do parceiro <strong>{{modal.model.name}}</strong>
        </p>
        <input type="hidden" name="nome" v-model="modal.model.name" ref="nome">
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite o nome do parceiro para confirmar"
          placeholder="Confirme o nome"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm" name="confirmação">
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
import { BasePagination, Modal } from 'src/components';
import partnerService from '../../services/Partner/partnerService';
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
      internalName: 'pages.partners.list',
      sortField: 'name',
      tableColumns: [
        {
          prop: 'id',
          label: this.$i18n.t('pages.partners.grid.id'),
          minWidth: 0
        },
        {
          prop: 'name',
          label: this.$i18n.t('pages.partners.grid.name'),
          minWidth: 200
        }
      ]
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push(`/partners/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam
      };
      this.$data.loading = true;
      partnerService.findAll(request).then(
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
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          partnerService.delete(self.modal.model.id).then(
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
        }
      });
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
