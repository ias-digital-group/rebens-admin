<template>
    <div class="row">
        <div class="col-12">
            <el-table ref="operationsTable" :data="tableData" v-loading="loading" empty-text="..." @selection-change="handleSelectionChange">
              <el-table-column
                type="selection"
                width="55"
                prop="checked">
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
import _ from 'lodash';
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
      ],
      multipleSelection: []
    }
  },
  created() {
    this.fetchData();
  },
  updated() {
    const rowsToToggle = this.tableData.filter(row => row.checked);
    this.toggleSelection(rowsToToggle);
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        const self = this;
        rows.forEach(row => {
          self.$refs.operationsTable.toggleRowSelection(row, true);
        });
      } else {
        self.$refs.operationsTable.clearSelection();
      }
    },
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    saveOperations(){
      const self = this;
      this.$data.loading = true;
      var count = self.$data.tableData.length;
      for(var i=0;i<self.$data.tableData.length ; i++)
      {
        const row = self.tableData[i];
        if(self.multipleSelection && self.multipleSelection.length > 0) {
          var selected = _.find(self.multipleSelection, function(o) { return o.idOperation == row.idOperation; });
          row.checked = selected ? true : false;
        } else {
          row.checked = false;
        }
        
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
              message: 'Associações atualizadas com sucesso.',
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
              message: 'Associações atualizadas com sucesso.',
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
