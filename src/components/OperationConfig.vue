<template>
  <div class="row">
    <div class="col-12">
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <static-text-form ref="staticTextForm" :staticText.sync="model"></static-text-form>
        <div class="row">
          <div class="col-md-12">
            <base-button 
              class="mt-3 pull-right" 
              native-type="button" 
              type="info"
              @click="updateParent">
              Alterar Pai
            </base-button>

            <base-button 
              class="mt-3 pull-right" 
              native-type="submit" 
              type="info"
              @click.native.prevent="validateForm">
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import StaticTextForm from 'src/components/StaticTextForm.vue';
import Modal from 'src/components/Modal.vue';
import operationService from '../services/Operation/operationService';
import helperService from '../services/Helper/helperService';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [StaticTextForm.name]: StaticTextForm,
    [Modal.name]: Modal
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      loading: false,
      formLoading: false,
      model: {
        id: 0,
        page: '',
        name: '',
        data: {},
        idOperation: 0,
        active: true,
        images: []
      }
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        parentId: this.parentId,
        parent: this.parent
      };
      this.$data.loading = true;
      operationService.getConfiguration(this.parentId).then(
        response => {
            this.model.images = [];
            this.model.data = response.data;
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    validateForm() {
      const self = this;
      self.submitLoading = true;
      if (self.model.images && self.model.images.length > 0) {
        let promises = new Array(self.model.images.length);
        for(var i = 0; i <= self.model.images.length - 1; i++) {
          promises[i] = helperService.uploadFile(self.model.images[i].img);
        }
        Promise.all(promises).then(values => {
          for(var j = 0; j<= values.length - 1; j++) {
            const fieldIndex = self.model.images[j].index;
            self.model.data.fields[fieldIndex].data = values[j].data.url;
          }
          self.saveConfig(self);
        })
        .catch(reason => {
          self.$notify({
            type: 'primary',
            message: reason.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.submitLoading = false;
        });
      } else {
        self.saveConfig (self);
      }
    },
    saveConfig(self) {
      self.formLoading = true;
      operationService.saveConfiguration(self.parentId, self.model.data).then(
        response => {
          self.$notify({
            type: 'primary',
            message: response
              ? response.message
              : 'Configurações atualizadas com sucesso.',
            icon: 'tim-icons icon-bell-55'
          });
          self.formLoading = false;
          self.fetchData();
        },
        () => {
          console.log('erro');
          self.formLoading = false;
        }
      );
      self.formLoading = false;
    },
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    updateParent(){
      this.$emit('updateCanPublish', true);
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
