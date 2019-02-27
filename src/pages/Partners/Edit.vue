<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Parceiros">
        <h4 slot="header" class="card-title">{{$t('pages.partners.title')}}</h4>
        <el-tabs>
          <el-tab-pane label="Parceiro">
            <form class="form-horizontal mt-3" v-loading="formLoading" @submit.prevent>
              <div class="row">
                <label class="col-md-3 col-form-label">Nome</label>
                <div class="col-md-9">
                  <base-input 
                    required
                    v-model="model.name"
                    v-validate="modelValidations.name"
                    type="text"
                    :error="getError('name')"
                    name="name"
                    placeholder="Nome" 
                    maxlength='200'></base-input>
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label">Descrição</label>
                <div class="col-md-9">
                  <wysiwyg v-model="model.description" />
                </div>
              </div>
              <div class="row">
                <label class="col-md-3 col-form-label"></label>
                <div class="col-md-9">
                  <div class="form-group">
                    <base-checkbox v-model="model.active">Ativo</base-checkbox>
                  </div>
                </div>
              </div>
              <template v-if="model.logo">
                <div class="row">
                  <label class="col-md-3 col-form-label">Logo</label>
                  <div class="col-md-9">
                    <div>
                      <img :src="model.logo" class="img-preview" />
                      <base-button @click="model.logo = ''" class="btn-simple btn-file" type="danger">
                        <i class="fas fa-times"></i>
                      </base-button>
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <div class="row">
                  <label class="col-md-3 col-form-label">Logo</label>
                  <div class="col-md-9">
                    <image-upload @change="onImageChange" change-text="Alterar" remove-text="Remover" select-text="Selecione uma imagem" />
                  </div>
                </div>
              </template>
              <div class="row">
                <div class="col-md-12">
                  <base-link class="btn mt-3 btn-primary btn-simple" to="/partners">Voltar</base-link>
                  <base-button 
                    class="mt-3 pull-right" 
                    native-type="submit" 
                    type="info"
                    @click.native.prevent="validate"
                    :loading="submitLoading">
                    Salvar
                  </base-button>
                  
                </div>
              </div>
            </form>
          </el-tab-pane>
          <el-tab-pane label="Contatos" :disabled="viewAction == 'new' ? true : false">
            <contacts v-loading="formLoading" parent="partners" :parentId="id" ref="contacts"></contacts>
            </el-tab-pane>
          <el-tab-pane label="Endereços" :disabled="viewAction == 'new' ? true : false">
            <addresses v-loading="formLoading" parent="partners" :parentId="id" ref="addresses"></addresses>
          </el-tab-pane>
        </el-tabs>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane } from 'element-ui';
import Contacts from 'src/components/Contacts';
import Addresses from 'src/components/Addresses';
import partnerService from '../../services/Partner/partnerService';
import helperService from '../../services/Helper/helperService';
import { ImageUpload } from 'src/components/index';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    Contacts,
    Addresses,
    ImageUpload
  },
  props: {
    id: String
  },
  data() {
    return {
      formLoading: false,
      submitLoading: false,
      image: null,
      model: {
        name: '',
        active: false,
        logo: '',
        description:''
      },
      modelValidations: {
        name: {
          required: true,
          max: 200
        }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_partner' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.submitLoading = true;
          if (self.image) {
            helperService.uploadFile(self.image).then(
              response => {
                if (response.status != 200) {
                  self.$notify({
                    type: 'primary',
                    message: response.message,
                    icon: 'tim-icons icon-bell-55'
                  });
                  self.submitLoading = false;
                  return;
                }
                self.model.logo = response.data.url;
                self.savePartner(self);
              },
              err => {
                self.$notify({
                  type: 'primary',
                  message: err.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.submitLoading = false;
              }
            );
          } else {
            self.savePartner(self);
          }
        }
      });
    },
    savePartner(vw) {
      if (vw.viewAction == 'new') {
        partnerService.create(vw.model).then(
          response => {
            vw.$notify({
              type: 'primary',
              message: 'Parceiro cadastrado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push(`/partners/${response.id}/edit/`);
            vw.submitLoading = false;
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.submitLoading = false;
          }
        );
      } else {
        partnerService.update(vw.model).then(
          response => {
            vw.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.$router.push('/partners');
            vw.submitLoading = false;
          },
          err => {
            vw.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vw.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      if (this.viewAction == 'edit') {
        this.formLoading = true;
        partnerService.get(self.id).then(
          response => {
            self.model = response.data;
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }
    },
    onImageChange(file) {
      this.image = file;
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
.img-preview {
  max-width: 100px;
}
</style>
