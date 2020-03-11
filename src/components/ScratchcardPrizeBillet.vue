<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        :empty-text="$t('pages.faqs.emptytext')"
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
  </div>
</template>
<script>
import { Table, TableColumn } from 'element-ui';
import { BasePagination } from 'src/components';
import scratchcardService from '../services/Scratchcard/scratchcardService';
import listPage from '../mixins/listPage';

export default {
  mixins: [listPage],
  components: {
    BasePagination,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  props: {
    parentId: [String, Number]
  },
  data() {
    return {
      internalName: 'components.scratchcardPrizes.prizeBillets',
      sortField: 'name',
      formLoading: false,
      showForm: false,
      showTable: false,
      image: null,
      tableColumns: [
        {
          prop: 'id',
          label: 'ID',
          minWidth: 0
        },
        {
          prop: 'prize',
          label: 'Prêmio',
          minWidth: 0
        },
        {
          prop: 'validationCode',
          label: 'Código de validação',
          minWidth: 0
        },
        {
          prop: 'customer.email',
          label: 'Cliente',
          minWidth: 0
        },
        {
          prop: 'customer.cpf',
          label: 'Cliente',
          minWidth: 0
        }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      self.$data.loading = true;
      scratchcardService.prizeBillets(self.parentId).then(
        response => {
          self.$data.tableData = response.data;
          self.$data.loading = false;
          self.showTable = response.data.length > 0;
        },
        () => {
          self.$data.loading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
