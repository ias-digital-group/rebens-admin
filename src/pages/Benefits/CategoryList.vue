<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">
            {{ $t('pages.categories.title') }}
            <base-link
              to="/benefits/categories/new"
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
              :placeholder="$t('pages.categories.perpage-placeholder')"
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
              v-model="activeFilter"
              v-if="!loading"
            >
              <el-option
                class="select-primary"
                value=""
                label="Todas"
              ></el-option>
              <el-option
                class="select-primary"
                value="true"
                label="Ativas"
              ></el-option>
              <el-option
                class="select-primary"
                value="false"
                label="Inativas"
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
            :empty-text="$t('pages.categories.emptytext')"
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
              :label="$t('pages.categories.grid.actions')"
            >
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
          >
          </base-pagination>
        </div>
      </card>
    </div>
    <!-- Classic Modal -->
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover categoria</h4>
      <form
        class="modal-form"
        ref="modalForm"
        @submit.prevent
        v-loading="modal.formLoading"
      >
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
import { BasePagination, Modal } from 'src/components';
import categoryService from '../../services/Category/categoryService';
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
      internalName: 'pages.categories.list',
      sortField: 'name',
      activeFilter: '',
      parentFilter: '',
      typeName: '',
      tableColumns: [
        {
          prop: 'id',
          label: this.$i18n.t('pages.categories.grid.id'),
          minWidth: 0
        },
        {
          prop: 'name',
          label: this.$i18n.t('pages.categories.grid.name'),
          minWidth: 200
        },
        {
          prop: 'statusName',
          label: this.$i18n.t('pages.categories.grid.status'),
          minWidth: 200
        },
        {
          prop: 'order',
          label: this.$i18n.t('pages.categories.grid.order'),
          minWidth: 0
        }
      ]
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push(`/benefits/categories/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        active: self.activeFilter,
        idParent: self.parentFilter,
        type: 1
      };
      self.$data.loading = true;
      categoryService.findAll(request).then(
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
          categoryService.delete(self.modal.model.id).then(
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
                message:
                  err.response && err.response.data
                    ? err.response.data.message
                    : err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.modal.formLoading = false;
            }
          );
        }
      });
    }
  },
  watch: {
    activeFilter() {
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
