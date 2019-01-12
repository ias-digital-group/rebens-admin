export default {
  data() {
    return {
      loading: false,
      internalName: '',
      searchQuery: '',
      sortField: '',
      sortOrder: 'ascending',
      pagination: {
        perPage: 5,
        currentPage: 1,
        perPageOptions: [5, 10, 25, 50],
        total: 0
      },
      tableData: [],
      modal: {
        visible: false,
        formLoading: false,
        model: {},
        nameConfirmation: '',
        modelValidations: {
          name_confirm: {
            required: true,
            confirmed: 'nome',
            max: 200
          }
        }
      }
    };
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
    },
    formatSortFieldParam() {
      return `${this.sortField} ${
        this.sortOrder == 'ascending' ? 'ASC' : 'DESC'
      }`;
    }
  },
  watch: {
    searchQuery(value) {
      if (this.searchQuery != value) {
        this.pagination.currentPage = 1;
      }
      this.fetchData();
    }
  },
  created() {
    const c = this.$store.getters.getPageSettings(this.internalName);
    if (c) {
      this.pagination.perPage = c.pagination.perPage;
      this.pagination.currentPage = c.pagination.currentPage;
      this.searchQuery = c.searchQuery;
      this.sortField = c.sortField;
      this.sortOrder = c.sortOrder;
    }
    this.fetchData();
  },
  methods: {
    onPageChanged(page) {
      this.$data.pagination.currentPage = page;
      this.fetchData();
    },
    onSortChanged(row) {
      if (this.sortField == row.prop && this.sortOrder == row.order) {
        return;
      }
      this.sortField = row.prop;
      this.sortOrder = row.order;
      this.fetchData();
    },
    handleDelete(index, row) {
      this.modal.model = row;
      this.modal.visible = true;
    },
    resetModal() {
      this.modal.visible = false;
      this.modal.model = {};
      this.modal.formLoading = false;
      this.modal.nameConfirmation = '';
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateModal() {},
    fetchData() {},
    savePageSettings(vm, totalItems) {
      vm.$store.commit('setPageSetting', {
        name: vm.internalName,
        pagination: {
          perPage: vm.pagination.perPage,
          currentPage: vm.pagination.currentPage
        },
        searchQuery: vm.searchQuery,
        sortField: vm.sortField,
        sortOrder: vm.sortOrder
      });
      vm.$data.pagination.total = totalItems;
    }
  }
};
