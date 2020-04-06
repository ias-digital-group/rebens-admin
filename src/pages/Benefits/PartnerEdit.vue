<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Parceiros">
        <h4 slot="header" class="card-title">
          {{ $t('pages.partners.title') }}
        </h4>
        <form
          class="form-horizontal mt-3"
          v-loading="formLoading"
          @submit.prevent
        >
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.name"
                type="text"
                name="name"
                placeholder="Nome"
                maxlength="200"
              ></base-input>
              <label v-show="customErrors.includes('name')" class="text-danger"
                >Este campo é obrigatório!</label
              >
              <label
                v-show="customErrors.includes('nameLenght')"
                class="text-danger"
                >Este campo aceita no máximo 200 caracteres!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Descrição</label>
            <div class="col-md-9">
              <vue-editor
                :editorToolbar="customToolbar"
                v-model="model.description"
                placeholder="Descrição"
              />
              <label
                v-show="customErrors.includes('description')"
                class="text-danger"
                >Este campo é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Logo (250x250)</label>
            <div class="col-md-9">
              <template v-if="model.logo">
                <div>
                  <img :src="model.logo" class="img-preview" />
                  <base-button
                    @click="model.logo = ''"
                    class="btn-simple btn-file"
                    type="danger"
                  >
                    <i class="fas fa-times"></i>
                  </base-button>
                </div>
              </template>
              <template v-else>
                <image-upload
                  @change="onImageChange"
                  change-text="Alterar"
                  remove-text="Remover"
                  select-text="Selecione uma imagem"
                />
              </template>
              <br />
              <label v-show="customErrors.includes('logo')" class="text-danger"
                >Este campo é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Ativo</label>
            <div class="col-md-9">
              <div class="form-group">
                <base-checkbox v-model="model.active">&nbsp;</base-checkbox>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <base-link
                class="btn mt-3 btn-primary btn-simple"
                to="/benefits/partner"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validate"
                :loading="submitLoading"
              >
                Salvar
              </base-button>
            </div>
          </div>
        </form>
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import partnerService from '../../services/Partner/partnerService';
import helperService from '../../services/Helper/helperService';
import { ImageUpload } from 'src/components/index';
import config from '../../config';

export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
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
      customErrors: [],
      customToolbar: [],
      model: {
        name: '',
        active: false,
        logo: '',
        description: '',
        type: 1
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_partnerBenefit' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validate() {
      const self = this;
      self.customErrors = [];
      if (self.model.name === '') {
        self.customErrors.push('name');
      } else if (self.model.name.length > 200) {
        self.customErrors.push('nameLenght');
      }
      if (self.model.description === '') {
        self.customErrors.push('description');
      }
      if (!self.image && !self.model.logo) {
        self.customErrors.push('logo');
      }
      if (self.customErrors.length === 0) {
        self.submitLoading = true;
        if (self.image) {
          self.imgError = false;
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
        } else if (self.model.logo) {
          self.savePartner(self);
        } else {
          self.submitLoading = false;
        }
      }
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
            vw.$router.push(`/benefits/partner/${response.id}/edit/`);
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
            vw.$router.push('/benefits/partner/');
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
      self.customToolbar = config.customToolbar;
      if (self.viewAction == 'edit') {
        self.formLoading = true;
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
