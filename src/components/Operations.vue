<template>
    <div class="row">
        <div class="col-12">
            <el-table ref="addressTable" :data="tableData" v-loading="loading" empty-text="...">
            <el-table-column prop="checked" min-width="100">
                <div slot-scope="props">
                  <input type="checkbox" v-model="props.row.checked" />
                </div>
            </el-table-column>
            <el-table-column v-for="column in tableColumns" :key="column.label" :min-width="column.minWidth" :prop="column.prop"
                :label="column.label">
            </el-table-column>
            </el-table>
        </div>
        <div class="col-md-12">
          <base-button 
            class="mt-3 pull-right" 
            native-type="submit" 
            type="info"
            @click.native.prevent="saveOperations">
            Salvar
          </base-button>
        </div>
    </div>
    
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import operationService from '../services/Operation/operationService';
export default {
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    parent: String,
    parentId: [String, Number]
  }, 
  data() {
    return {
      loading: false,
      tableData: [],
      tableColumns: [
        {
          prop: 'operationName',
          label: 'Nome',
          minWidth: 200
        }
      ]
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const self = this;
      this.$data.loading = true;
      operationService.findAllByAssociation({
          parent: self.parent,
          parentId: self.parentId
        }).then(
        response => {
          self.$data.tableData = response.data;
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );     
    },
    saveOperations(){
      const self = this;
      this.$data.loading = true;
      var count = self.$data.tableData.length
      for(var i=0;i<self.$data.tableData.length ; i++)
      {
        const row = self.$data.tableData[i];
        if (row.checked) {
        operationService.associateOperation({
        parent: self.parent,
        parentId: self.parentId,
        id: row.idOperation,
        positionId: 1
        }).then(response => {
          count --;
          if(count == 0){
            self.$notify({
              type: 'primary',
              message: response
              ? response.message
              : 'Associações atualizadas com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.loading = false;
            self.fetchData();
          }
        });
      } else {
        operationService.unlinkAssociation({
        parent: self.parent,
        parentId: self.parentId,
        id: row.idOperation
        }).then(response => {
          count --;
          if(count == 0){
            self.$notify({
              type: 'primary',
              message: response
              ? response.message
              : 'Associações atualizadas com sucesso.',
              icon: 'tim-icons icon-bell-55'
            });
            self.loading = false;
            self.fetchData();
          }
        })
      }
      }
      
    }
  }
}
</script>
