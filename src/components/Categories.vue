<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-4">
          <el-tree
            :data="categoryList"
            show-checkbox
            node-key="id"
            :default-expand-all="false"
            :default-checked-keys="selectedCategories"
            :props="defaultProps"
            v-loading="loading"
            @check-change="handleCheckChange"
          ></el-tree>
        </div>
      </div>
    </div>
    <div class="col-md-12">
      <base-button
        class="mt-3 pull-right"
        native-type="submit"
        type="info"
        @click.native.prevent="saveCategories"
      >
        Salvar
      </base-button>
    </div>
  </div>
</template>
<script>
import { Tree } from 'element-ui';
import categoryService from '../services/Category/categoryService';
import benefitService from '../services/Benefit/benefitService';
import freeCourseService from '../services/FreeCourse/freeCourseService';
export default {
  props: {
    parentId: [String, Number],
    type: Number
  },
  components: {
    [Tree.name]: Tree
  },
  data() {
    return {
      categoryList: [],
      selectedCategories: [],
      loading: false,
      defaultProps: {
        children: 'categories',
        label: 'name'
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    handleCheckChange(data, checked) {
      const self = this;
      if (checked) {
        if (self.selectedCategories.indexOf(data.id) < 0) {
          self.selectedCategories.push(data.id);
        }
      } else if (self.selectedCategories.indexOf(data.id) >= 0) {
        self.selectedCategories.splice(
          self.selectedCategories.indexOf(data.id),
          1
        );
      }
    },
    fetchData() {
      const self = this;
      if (!self.parentId || self.parentId < 1) {
        return false;
      }
      self.loading = true;
      categoryService.getListTree(self.type).then(response => {
        self.categoryList = response.data;
      });
      if (self.type === 1) {
        benefitService.getCategories(self.parentId).then(response => {
          if (response && response.data)
            self.selectedCategories = response.data;
          self.loading = false;
        });
      } else if (self.type === 2) {
        freeCourseService.getCategories(self.parentId).then(response => {
          if (response && response.data)
            self.selectedCategories = response.data;
          self.loading = false;
        });
      }
    },
    saveCategories() {
      var ids = '';
      for (var i = 0; i < this.selectedCategories.length; i++) {
        ids += this.selectedCategories[i] + ',';
      }
      ids = ids.substring(0, ids.length - 1);
      if (this.type === 1) {
        benefitService.saveCategories(this.parentId, ids).then(response => {
          this.$notify({
            type: 'primary',
            message: response
              ? response.message
              : 'Categorias atualizadas com sucesso.',
            icon: 'tim-icons icon-bell-55'
          });
          this.fetchData();
          this.loading = false;
        });
      } else if (this.type === 2) {
        freeCourseService.saveCategories(this.parentId, ids).then(response => {
          this.$notify({
            type: 'primary',
            message: response
              ? response.message
              : 'Categorias atualizadas com sucesso.',
            icon: 'tim-icons icon-bell-55'
          });
          this.fetchData();
          this.loading = false;
        });
      }
    }
  }
};
</script>
