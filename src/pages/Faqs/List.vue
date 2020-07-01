<template>
  <div class="edit-box">
    <div class="page-header">
      <h2>
        <span>Perguntas Frequentes - {{ model.operation.title }}</span>
      </h2>
      <div class="box-actions">
        <base-link to="/pages" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-arrow-left"></i>
        </base-link>
      </div>
    </div>
    <div class="ias-card">
      <form v-loading="formLoading" @submit.prevent>
        <div class="form-left">
          <div
            class="ias-row ias-questions"
            v-for="item in model.faqs"
            :key="item.id"
          >
            <div class="question">{{ item.question }}</div>
            <div class="actions">
              <button
                @click="toggleActive(item)"
                type="button"
                :title="item.active ? 'Inativar' : 'Ativar'"
                class="bt"
                :class="{
                  'c-green': item.active,
                  'c-light-gray': !item.active
                }"
              >
                <i class="icon-icon-check"></i>
              </button>
              <button
                @click="handleEdit(item)"
                type="button"
                title="Editar"
                class="bt c-light-blue"
              >
                <i class="icon-icon-edit"></i>
              </button>
              <button
                @click="handleDelete(item)"
                type="button"
                title="apagar"
                class="bt c-red"
              >
                <i class="icon-icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="ias-row">
            <div
              class="form-actions"
              style="justify-content:flex-end;margin-top:20px"
            >
              <button
                class="bt bt-square bg-light-blue c-white"
                @click="createFaq"
              >
                <i class="icon-icon-plus" style="display:block"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="form-right"></div>
      </form>
    </div>
    <transition name="modal">
      <div class="modal-mask" v-show="showSuccessModal">
        <div class="modal-container">
          <img src="/img/icon-success.png" alt="Sucesso" />
          <p>
            CADASTRO SALVO
            <br />COM SUCESSO!
          </p>
          <button class="bg-green bt-modal" @click="showSuccessModal = false">
            IR PARA LISTAGEM
          </button>
        </div>
      </div>
    </transition>
    <transition name="modal">
      <div class="modal-mask modal-faq" v-show="showEditModal">
        <div class="modal-container">
          <span @click="showEditModal = false" class="bt-remove">
            <svg
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M17.6777 14.8492L14.1421 11.3137L17.6777 7.77817C18.0666 7.38927 18.0666 6.75287 17.6777 6.36396L16.2635 4.94975C15.8746 4.56084 15.2382 4.56084 14.8493 4.94975L11.3137 8.48528L7.77819 4.94975C7.38928 4.56084 6.75288 4.56084 6.36397 4.94975L4.94976 6.36396C4.56085 6.75287 4.56085 7.38927 4.94976 7.77817L8.48529 11.3137L4.94976 14.8492C4.56085 15.2382 4.56085 15.8745 4.94976 16.2635L6.36397 17.6777C6.75288 18.0666 7.38928 18.0666 7.77819 17.6777L11.3137 14.1421L14.8493 17.6777C15.2382 18.0666 15.8746 18.0666 16.2635 17.6777L17.6777 16.2635C18.0666 15.8745 18.0666 15.2382 17.6777 14.8492Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect
                    x="11.3137"
                    width="16"
                    height="16"
                    transform="rotate(45 11.3137 0)"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>
          <h4>
            {{ editFaq.id > 0 ? 'EDIÇÃO' : 'CADASTRO' }} DE PERGUNTAS FREQUENTES
          </h4>
          <div style="display:block">
            <form v-loading="modalLoading" @submit.prevent>
              <div class="ias-row">
                <custom-input
                  :required="true"
                  v-model="editFaq.question"
                  type="text"
                  name="question"
                  label="Digite a pergunta"
                  :error="customErrors.get('question')"
                  maxlength="200"
                ></custom-input>
              </div>
              <div
                class="ias-row-editor"
                :class="{ 'has-error': customErrors.get('answer') }"
              >
                <vue-editor
                  :editorToolbar="customToolbar"
                  v-model="editFaq.answer"
                  placeholder="Escreva aqui a resposta"
                />
                <label v-show="customErrors.get('answer')" class="ias-error">
                  {{ customErrors.get('answer') }}
                </label>
              </div>
              <div class="ias-row">
                <custom-input
                  :required="true"
                  v-model="editFaq.order"
                  type="number"
                  name="order"
                  label="Digite a ordem"
                  :error="customErrors.get('order')"
                  maxlength="50"
                ></custom-input>
                <div class="div-spacer"></div>
              </div>
              <div class="ias-row">
                <div class="form-actions">
                  <button class="bt bg-green c-white" @click="saveItem">
                    {{ editFaq.id > 0 ? 'Salvar' : 'Adicionar' }}
                  </button>
                  <ias-checkbox v-model="editFaq.active">Ativo</ias-checkbox>
                  <div class="div-spacer"></div>
                </div>
                <div class="div-spacer"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>
    <delete-modal
      @confirmDelete="confirmDelete"
      :itemName="modal.itemName"
      :show="modal.visible"
      :showSuccess="modal.showSuccess"
      @closeDeleteSuccess="closeDeleteSuccess"
    ></delete-modal>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import operationService from '../../services/Operation/operationService';
import { DeleteModal } from 'src/components';
import faqService from '../../services/Faq/faqService';
import config from '../../config';
import paging from '../../mixins/paging';

export default {
  mixins: [paging],
  components: {
    DeleteModal,
    [Select.name]: Select,
    [Option.name]: Option
  },
  props: {
    id: String
  },
  data() {
    return {
      internalName: 'pages.faqs.list',
      formLoading: false,
      customErrors: new Map(),
      customToolbar: [],
      showSuccessModal: false,
      showEditModal: false,
      modalLoading: false,
      editFaq: {
        id: 0,
        question: '',
        answer: '',
        idOperation: 0,
        order: 0,
        active: true
      },
      model: {
        operation: {},
        faqs: []
      }
    };
  },
  methods: {
    createFaq() {
      const self = this;
      self.editFaq.id = 0;
      self.editFaq.question = '';
      self.editFaq.answer = '';
      self.editFaq.idOperation = 0;
      self.editFaq.order = 0;
      self.editFaq.active = true;

      self.showEditModal = true;
    },
    handleEdit(row) {
      this.editFaq = row;
      this.showEditModal = true;
      // this.$router.push(`/faqs/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      const request = {
        page: 0,
        pageItems: 1000,
        sort: 'order asc',
        idOperation: self.id,
        searchWord: ''
      };
      this.formLoading = true;
      faqService.findAll(request).then(
        response => {
          self.model.faqs = response.data;
          operationService.get(self.id).then(
            response => {
              self.model.operation = response.data;
              self.formLoading = false;
            },
            () => {
              self.formLoading = false;
            }
          );
        },
        () => {
          self.formLoading = false;
        }
      );
    },
    handleDelete(item) {
      this.modal.model = item;
      this.modal.itemName = item.question;
      this.modal.visible = true;
    },
    confirmDelete(val) {
      const self = this;
      if (val) {
        this.$validator.validateAll().then(isValid => {
          if (isValid) {
            self.modal.formLoading = true;
            faqService.delete(self.modal.model.id).then(
              () => {
                self.resetModal();
                self.fetchData();
                self.showSuccess(true);
              },
              err => {
                if (err.response.status === 400 && err.response.data.message) {
                  self.$notify({
                    type: 'warning',
                    message: err.response.data.message
                  });
                } else {
                  self.$notify({
                    type: 'danger',
                    message: err.message
                  });
                }
                self.modal.formLoading = false;
              }
            );
          }
        });
      } else {
        this.resetModal();
      }
    },
    closeDeleteSuccess() {
      this.showSuccess(false);
    },
    saveItem() {
      const self = this;
      self.customErrors = new Map();
      if (!self.editFaq.question || self.editFaq.question === '')
        self.customErrors.set('question', 'Campo obrigatório');
      if (!self.editFaq.answer || self.editFaq.answer === '')
        self.customErrors.set('question', 'Campo obrigatório');

      if (self.customErrors.size === 0) {
        self.editFaq.idOperation = self.id;
        self.modalLoading = true;
        if (self.editFaq.id === 0) {
          faqService.create(self.editFaq).then(
            () => {
              self.modalLoading = false;
              self.showEditModal = false;
              self.showSuccessModal = true;
              self.fetchData();
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.modalLoading = false;
            }
          );
        } else {
          faqService.update(self.editFaq).then(
            () => {
              self.modalLoading = false;
              self.showEditModal = false;
              self.showSuccessModal = true;
              self.fetchData();
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
              });
              self.modalLoading = false;
            }
          );
        }
      }
    },
    toggleActive(row) {
      const self = this;
      faqService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.$notify({
            type: 'success',
            message: `Pergunta ${
              row.active ? 'ativada' : 'inativada'
            } com sucesso`
          });
        }
      });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style lang="scss" scoped>
.modal-form {
  .has-label::after {
    top: 43px !important;
  }
}
</style>
