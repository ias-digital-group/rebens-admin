<template>
  <div class="row">
    <div class="col-12">
        <div class="row">
            <div class="col-4">
                <el-tree
                    :data="categoryList"
                    show-checkbox
                    node-key="id"
                    :default-expand-all="true"
                    :default-checked-keys="selectedCategories"
                    :props="defaultProps"
                    v-loading="loading"
                    @check-change="handleCheckChange"
                ></el-tree>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import { Tree } from 'element-ui';
import categoryService from '../services/Category/categoryService'
import benefitService from '../services/Benefit/benefitService'
export default {
  props: {
    parent: String,
    parentId: [String, Number]
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
        benefitService.addcategory(this.parentId, data.id).then(()=> self.fetchData());
      } else {
        benefitService.deleteCategory(this.parentId, data.id).then(()=> self.fetchData());
      }
    },
    fetchData() {
      const self = this;
      this.loading = true;
      categoryService.getListTree().then(response => {
        self.categoryList = response.data;
      });
      benefitService.getCategories(this.parentId).then(response => {
        self.selectedCategories = response.data;
        this.loading = false;
      });
    }
  }
};
</script>
