<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <h4 slot="header" class="card-title">{{$t('pages.categories.title')}}</h4>
        <div>
          <div class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <el-select class="select-primary mb-3 pagination-select" v-model="pagination.perPage" placeholder="Per page" v-if="!loading">
              <el-option class="select-primary" v-for="item in pagination.perPageOptions" :key="item" :label="item"
                :value="item">
              </el-option>
            </el-select>
          </div>
          <el-table :data="tableData" v-loading="loading" empty-text="...">
            <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
              :label="column.label">
            </el-table-column>
            <el-table-column :min-width="135" align="right" label="Actions">
              <div slot-scope="props">
                <base-button @click.native="handleEdit(props.$index, props.row);" class="edit btn-link" type="warning"
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
            <p class="card-category" v-if="!loading">
              Total de categorias: {{ total }}
            </p>
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
import swal from 'sweetalert2';
import categoryService from '../../services/Category/categoryService';
export default {
  components: {
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  computed: {
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.total < highBound) {
        highBound = this.total;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    total() {
      return this.pagination.total;
    }
  },
  data() {
    return {
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      loading: false,
      tableColumns: [
        {
          prop: 'id',
          label: 'Id',
          minWidth: 0
        },
        {
          prop: 'name',
          label: 'Name',
          minWidth: 200
        }
      ],
      tableData: []
    };
  },
  methods: {
    handleEdit(index, row) {
      swal({
        title: `You want to edit ${row.name}`,
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-info btn-fill'
      });
    },
    handleDelete(index, row) {
      swal({
        title: 'Are you sure?',
        text: `You won't be able to revert this!`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonClass: 'btn btn-success btn-fill',
        cancelButtonClass: 'btn btn-danger btn-fill',
        confirmButtonText: 'Yes, delete it!',
        buttonsStyling: false
      }).then(result => {
        if (result.value) {
          this.deleteRow(row);
          swal({
            title: 'Deleted!',
            text: `You deleted ${row.name}`,
            type: 'success',
            confirmButtonClass: 'btn btn-success btn-fill',
            buttonsStyling: false
          });
        }
      });
    },
    deleteRow(row) {
      let indexToDelete = this.tableData.findIndex(
        tableRow => tableRow.id === row.id
      );
      if (indexToDelete >= 0) {
        this.tableData.splice(indexToDelete, 1);
      }
    },
    onPageChanged(page) {
      this.$data.pagination.currentPage = page;
      this.fetchData();
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage
      };
      this.$data.loading = true;
      categoryService.findAll(request).then(
        response => {
          self.$data.tableData = response.data.extra.page;
          self.$data.pagination.currentPage =
            response.data.extra.currentPage + 1;
          self.$data.pagination.total = response.data.extra.totalItems;
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {}
};
</script>
<style>
.pagination-select,
.search-input {
  width: 200px;
}
</style>
