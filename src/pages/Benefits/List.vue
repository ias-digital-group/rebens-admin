<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Benefícios</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input type="text" v-model="searchQuery" placeholder="Digite aqui o que deseja encontrar" />
          <i v-if="searchQuery === ''" class="icon-icon-search"></i>
          <i v-else class="bt-clear-search icon-icon-times c-red" @click="searchQuery = ''"></i>
        </div>
        <div class="filter" :class="{ active: showFilters }">
          <a class="bt bt-square bg-white-2 c-light-blue" @click="showFilters = !showFilters">
            <i class="icon-icon-filter"></i>
          </a>
        </div>
        <base-link to="/benefit/new" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-plus"></i>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="types"
          :reduce="op => op.code"
          v-model="typeFilter"
          class="no-margin"
          placeholder="Filtre por tipo"
        >
          <span slot="no-options">Nenhum tipo encontrado</span>
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="activeFilter"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
        </v-select>
        <v-select
          :options="levels"
          :reduce="op => op.code"
          v-model="levelFilter"
          placeholder="Filtre por nível"
        >
          <span slot="no-options">Nenhum nível encontrado</span>
        </v-select>
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome Categoria</th>
            <th>Nível Categoria</th>
            <th>Tipo Categoria</th>
            <th>Usuário / Criação</th>
            <th>Usuário / Atualização</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <span>{{ item.name }}</span>
            </td>
            <td>
              <span>{{ item.idParent ? 'Secundária' : 'Primária' }}</span>
            </td>
            <td>
              <span>{{ item.type }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.createdUserName }}</span>
                <span class="blue">{{ item.created }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.modifiedUserName }}</span>
                <span class="blue">{{ item.modified }}</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button
                  @click="toggleActive(item)"
                  type="button"
                  :title="item.active ? 'Inativar' : 'Ativar'"
                  class="bt"
                  :class="{
                    'c-green': item.active,
                    'c-light-gray': !item.active
                  }"
                >
                  <i class="icon-icon-check"></i>
                </button>
                <button
                  @click="handleEdit(item)"
                  type="button"
                  title="Editar"
                  class="bt c-light-blue"
                >
                  <i class="icon-icon-edit"></i>
                </button>
                <button @click="handleDelete(item)" type="button" title="apagar" class="bt c-red">
                  <i class="icon-icon-delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination
        class="box-pagination"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total-items="pagination.totalItems"
        :total-pages="pagination.totalPages"
        :current-page="pagination.currentPage"
        v-on:input="onPageChanged"
        @update-per-page="changePerPage"
      ></pagination>
    </div>
    <delete-modal @confirmDelete="confirmDelete" :itemName="modal.itemName" :show="modal.visible"></delete-modal>
  </div>

  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">
            {{ $t('pages.benefits.title') }}
            <base-link to="/benefits/new" class="btn btn-icon btn-simple btn-twitter btn-sm">
              <i class="fas fa-plus"></i>
            </base-link>
          </h4>
        </template>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="pagination.perPage"
              :placeholder="$t('pages.benefits.perpage-placeholder')"
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
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="typeFilter"
              v-if="!loading"
            >
              <el-option class="select-primary" value label="Todos"></el-option>
              <el-option class="select-primary" value="1" label="E-commerce"></el-option>
              <el-option class="select-primary" value="2" label="Varejo Local"></el-option>
              <el-option class="select-primary" value="3" label="Cashback"></el-option>
            </el-select>
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="activeFilter"
              v-if="!loading"
            >
              <el-option class="select-primary" value label="Todos"></el-option>
              <el-option class="select-primary" value="true" label="Ativos"></el-option>
              <el-option class="select-primary" value="false" label="Inativos"></el-option>
            </el-select>
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
                  @click.native="toggleStatus(props.$index, props.row)"
                  class="btn-link"
                  type="warning"
                  size="sm"
                  v-text="props.row.active ? 'inativar' : 'ativar'"
                  style="padding:0 5px;font-size:12px;font-weight:400;line-height:28px"
                ></base-button>
                <base-button
                  @click.native="duplicate(props.$index, props.row)"
                  class="btn-link"
                  type="primary"
                  size="sm"
                  icon
                >
                  <i class="fas fa-copy"></i>
                </base-button>
                <base-button
                  @click.native="handleEdit(props.$index, props.row)"
                  class="edit btn-link"
                  type="info"
                  size="sm"
                  icon
                >
                  <i class="fas fa-edit"></i>
                </base-button>
                <base-button
                  @click.native="handleDelete(props.$index, props.row)"
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
      sortField: 'name',
      activeFilter: '',
      typeFilter: '',
      operationFilter: '',
      tableColumns: [
        {
          prop: 'id',
          label: this.$i18n.t('pages.benefits.grid.id'),
          minWidth: 0
        },
        {
          prop: 'name',
          label: this.$i18n.t('pages.benefits.grid.name'),
          minWidth: 200
        },
        {
          prop: 'title',
          label: this.$i18n.t('pages.benefits.grid.title'),
          minWidth: 200
        },
        {
          prop: 'benefitType',
          label: this.$i18n.t('pages.benefits.grid.benefitType'),
          minWidth: 100
        },
        {
          prop: 'statusName',
          label: this.$i18n.t('pages.benefits.grid.status'),
          minWidth: 0
        }
      ]
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push(`/benefits/${row.id}/edit/`);
    },
    duplicate(index, row) {
      const self = this;
      self.$data.loading = true;
      benefitService.duplicate(row.id).then(
        response => {
          self.$data.loading = false;
          if (response.status === 'ok') {
            this.$router.push(`/benefits/${response.message}/edit/`);
          } else {
            self.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    toggleStatus(index, row) {
      const self = this;
      debugger;
      self.$data.loading = true;
      benefitService.changeActive(row.id, !row.active).then(
        response => {
          if (response.status === 'ok') {
            row.active = !row.active;
            row.statusName = row.active ? 'Ativo' : 'Inativo';
            self.$data.loading = false;
          } else {
            self.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        active: this.activeFilter,
        type: this.typeFilter,
        idOperation: this.operationFilter
      };
      this.$data.loading = true;
      benefitService.findAll(request).then(
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
          benefitService.delete(self.modal.model.id).then(
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
  },
  watch: {
    activeFilter() {
      this.fetchData();
    },
    typeFilter() {
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
