export default {
  data() {
    return {
      loading: false,
      internalName: '',
      searchQuery: '',
      sortField: '',
      sortOrder: 'ascending',
      filters: {
        type: '',
        active: '',
        operation: '',
        place: '',
        level: '',
        company: '',
        status: '',
        role: ''
      },
      showFilters: false,
      pagination: {
        perPage: 10,
        currentPage: 1,
        totalPages: 0,
        totalItems: 0
      },
      tableData: [],
      modal: {
        visible: false,
        formLoading: false,
        model: {},
        itemName: '',
        showSuccess: false
      }
    };
  },
  computed: {
    to() {
      let highBound = this.from + this.pagination.perPage;
      if (this.totalPages < highBound) {
        highBound = this.totalPages;
      }
      return highBound;
    },
    from() {
      return this.pagination.perPage * (this.pagination.currentPage - 1);
    },
    totalPages() {
      return this.pagination.totalPages;
    },
    formatSortFieldParam() {
      return `${this.sortField} ${
        this.sortOrder == 'ascending' ? 'ASC' : 'DESC'
      }`;
    }
  },
  watch: {
    searchQuery() {
      this.pagination.currentPage = 1;
      this.fetchData();
    }
  },
  created() {
    const c = this.$store.getters.getPageSettings(this.internalName);
    if (c) {
      this.pagination.perPage = c.pagination.perPage;
      this.pagination.currentPage = c.pagination.currentPage;
      this.pagination.totalPages = c.pagination.totalPages;
      this.pagination.totalItems = c.pagination.totalItems;
      this.searchQuery = c.searchQuery;
      this.sortField = c.sortField;
      this.sortOrder = c.sortOrder;
      this.filters = c.filters;
    }
    this.fetchData();
  },
  methods: {
    toogleFilters() {
      this.showFilters = !this.showFilters;
    },
    changePerPage(val) {
      this.$data.pagination.perPage = val;
      this.$data.pagination.currentPage = 1;
      this.fetchData();
    },
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
    resetModal() {
      this.modal.visible = false;
      this.modal.model = {};
      this.modal.formLoading = false;
      this.modal.itemName = '';
    },
    showSuccess(val) {
      this.modal.showSuccess = val;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    fetchData() {},
    savePageSettings(vm, totalItems, totalPages) {
      vm.$store.commit('setPageSetting', {
        name: vm.internalName,
        pagination: {
          perPage: vm.$data.pagination.perPage,
          currentPage: vm.$data.pagination.currentPage
        },
        searchQuery: vm.searchQuery,
        sortField: vm.sortField,
        sortOrder: vm.sortOrder,
        filters: vm.filters
      });
      for (let prop in vm.filters) {
        if (
          vm.filters[prop] != null &&
          vm.filters[prop] != undefined &&
          vm.filters[prop] !== ''
        )
          vm.showFilters = true;
      }
      vm.$data.pagination.totalItems = totalItems;
      vm.$data.pagination.totalPages = totalPages;
    }
  }
};
