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
    <div class="col-md-12">
      <base-button 
        class="mt-3 pull-right" 
        native-type="submit" 
        type="info"
        @click.native.prevent="saveCategories">
        Salvar
      </base-button>
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
        if(self.selectedCategories.indexOf(data.id) < 0){
          self.selectedCategories.push(data.id);
        }
      } else if(self.selectedCategories.indexOf(data.id) >= 0){
        self.selectedCategories.splice(self.selectedCategories.indexOf(data.id), 1);
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
    },
    saveCategories(){
      var ids = '';
      for(var i=0;i<this.selectedCategories.length ; i++){
        ids += this.selectedCategories[i] + ',';
      }
      ids = ids.substring(0, ids.length-1)
      benefitService.saveCategories(this.parentId, ids).then(response => {
        this.$notify({
          type: 'primary',
          message: response
          ? response.message
          : 'Categorias atualizadas com sucesso.',
          icon: 'tim-icons icon-bell-55'
        });
        this.fetchData();
      });
    }
  }
};
</script>
