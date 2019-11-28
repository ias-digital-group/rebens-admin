<template>
  <div class="row">
    <div class="col-md-12">
      <card title="Faculdade">
        <h4 slot="header" class="card-title">Curso</h4>
        <!-- <el-tabs>
          <el-tab-pane label="Cadastro"> -->
        <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
          <div class="row">
            <label class="col-md-3 col-form-label">Nome</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.name"
                type="text"
                :error="getError('name')"
                name="name"
                placeholder="Nome"
                maxlength="200"
              ></base-input>
              <label v-show="customErros.includes('name')" class="text-danger"
                >O campo Nome é obrigatório</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Título</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.title"
                type="text"
                :error="getError('title')"
                name="title"
                placeholder="Título"
                maxlength="500"
              ></base-input>
              <label v-show="customErros.includes('title')" class="text-danger"
                >O campo Título é obrigatório</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Operação</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Operação"
                  v-model="model.idOperation"
                  v-loading.lock="selectLoading"
                  @change="onOperationChange"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in operations"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('idOperation')"
                  class="text-danger"
                  >O campo Operação é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Faculdade</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Faculdade"
                  v-model="model.idCollege"
                  v-loading.lock="selectLoading"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in colleges"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('idCollege')"
                  class="text-danger"
                  >O campo Faculdade é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Tipo de Graduação</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Tipo de Graduação"
                  v-model="model.idGraduationType"
                  v-loading.lock="selectLoading"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in graduationTypes"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('idGraduationType')"
                  class="text-danger"
                  >O campo Tipo de Graduação é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Modalidade</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Modalidade"
                  v-model="model.idModality"
                  v-loading.lock="selectLoading"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in modalities"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('idModality')"
                  class="text-danger"
                  >O campo Modalidade é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Período</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Período"
                  v-loading.lock="selectLoading"
                  value-key="id"
                  v-model="model.periodIds"
                  ref="id"
                  multiple
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="type in periods"
                    :value="type.id"
                    :label="type.title"
                    :key="type.id"
                  >
                  </el-option>
                </el-select>
                <label
                  v-show="customErros.includes('period')"
                  class="text-danger"
                  >O campo Período é obrigatório</label
                >
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Perguntas Frequentes</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Perguntas Frequentes"
                  v-loading.lock="selectLoading"
                  value-key="value"
                  v-model="model.idFaq"
                  ref="value"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="faq in faqs"
                    :value="faq.value"
                    :label="faq.display"
                    :key="faq.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Regulamento</label>
            <div class="col-md-4">
              <div class="form-group">
                <el-select
                  class="select-info"
                  placeholder="Regulamento"
                  v-loading.lock="selectLoading"
                  value-key="value"
                  v-model="model.idRegulation"
                  ref="value"
                  lock
                >
                  <el-option
                    class="select-primary"
                    v-for="reg in regulations"
                    :value="reg.value"
                    :label="reg.display"
                    :key="reg.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Preço</label>
            <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-3">
              <base-input label="Preço Original">
                <money
                  class="form-control"
                  v-model="model.originalPrice"
                  v-bind="money"
                ></money>
              </base-input>
              <label
                v-show="customErros.includes('originalPrice')"
                class="text-danger"
                >O campo Preço original é obrigatório!</label
              >
            </div>
            <div class="col-md-9 col-lg-3">
              <base-input label="Desconto">
                <money
                  class="form-control"
                  v-model="model.discount"
                  v-bind="percentage"
                ></money>
              </base-input>
              <label
                v-show="customErros.includes('discount')"
                class="text-danger"
                >O campo Desconto é obrigatório!</label
              >
            </div>
            <div class="col-md-9 col-lg-3">
              <base-input label="Preço Final">
                <money
                  class="form-control"
                  v-model="model.finalPrice"
                  v-bind="money"
                ></money>
              </base-input>
              <label
                v-show="customErros.includes('finalPrice')"
                class="text-danger"
                >O campo Preço Final é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Duração</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.duration"
                type="text"
                :error="getError('duration')"
                name="duration"
                placeholder="duration"
                maxlength="200"
              ></base-input>
              <label
                v-show="customErros.includes('duration')"
                class="text-danger"
                >O campo Duração é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Data</label>
            <div class="col-md-9 col-lg-3">
              <base-input label="Validade">
                <el-date-picker
                  type="date"
                  placeholder="Validade"
                  v-model="model.dueDate"
                >
                </el-date-picker>
              </base-input>
            </div>
            <div class="col-md-9 col-lg-3">
              <base-input label="Início">
                <el-date-picker
                  type="date"
                  placeholder="Início"
                  v-model="model.startDate"
                >
                </el-date-picker>
              </base-input>
            </div>
            <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-3">
              <base-input label="Fim">
                <el-date-picker
                  type="date"
                  placeholder="Fim"
                  v-model="model.endDate"
                >
                </el-date-picker>
              </base-input>
            </div>
          </div>
          <div class="row" style="padding-bottom:10px;">
            <label class="col-md-3 col-form-label">Descrição</label>
            <div class="col-md-9">
              <wysiwyg v-model="model.description" placeholder="Descrição" />
              <label
                v-show="customErros.includes('description')"
                class="text-danger"
                >O campo Descrição é obrigatório!</label
              >
            </div>
          </div>
          <div class="row" style="padding-bottom:10px;">
            <label class="col-md-3 col-form-label">Texto do voucher</label>
            <div class="col-md-9">
              <wysiwyg
                v-model="model.voucherText"
                placeholder="Texto do voucher"
              />
              <label
                v-show="customErros.includes('voucherText')"
                class="text-danger"
                >O campo Texto do voucher é obrigatório!</label
              >
            </div>
          </div>
          <template v-if="model.image">
            <div class="row" style="padding-bottom:10px;">
              <label class="col-md-3 col-form-label">Imagem (1200x500)</label>
              <div class="col-md-9">
                <div>
                  <img :src="model.image" class="img-preview" />
                  <base-button
                    @click="model.image = ''"
                    class="btn-simple btn-file"
                    type="danger"
                  >
                    <i class="fas fa-times"></i>
                  </base-button>
                </div>
                <label
                  v-show="customErros.includes('image')"
                  class="text-danger"
                  >O campo Imagem é obrigatório!</label
                >
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row" style="padding-bottom:10px;">
              <label class="col-md-3 col-form-label">Imagem (1200x500)</label>
              <div class="col-md-9">
                <image-upload
                  @change="onImageChange"
                  change-text="Alterar"
                  remove-text="Remover"
                  select-text="Selecione uma imagem"
                />
                <label
                  v-show="customErros.includes('image')"
                  class="text-danger"
                  >O campo Imagem é obrigatório!</label
                >
              </div>
            </div>
          </template>
          <template v-if="model.listImage">
            <div class="row" style="padding-bottom:10px;">
              <label class="col-md-3 col-form-label"
                >Imagem da Listagem (216x174)</label
              >
              <div class="col-md-9">
                <div>
                  <img :src="model.listImage" class="img-preview" />
                  <base-button
                    @click="model.listImage = ''"
                    class="btn-simple btn-file"
                    type="danger"
                  >
                    <i class="fas fa-times"></i>
                  </base-button>
                </div>
                <label
                  v-show="customErros.includes('listImage')"
                  class="text-danger"
                  >O campo Imagem da Listagem é obrigatório!</label
                >
              </div>
            </div>
          </template>
          <template v-else>
            <div class="row" style="padding-bottom:10px;">
              <label class="col-md-3 col-form-label"
                >Imagem da Listagem (216x174)</label
              >
              <div class="col-md-9">
                <image-upload
                  @change="onListImageChange"
                  change-text="Alterar"
                  remove-text="Remover"
                  select-text="Selecione uma imagem"
                />
                <label
                  v-show="customErros.includes('listImage')"
                  class="text-danger"
                  >O campo Imagem da Listagem é obrigatório!</label
                >
              </div>
            </div>
          </template>
          <div class="row">
            <label class="col-md-3 col-form-label">Aviso</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.disclaimer"
                type="text"
                :error="getError('disclaimer')"
                name="disclaimer"
                placeholder="Aviso"
                maxlength="300"
              ></base-input>
              <label
                v-show="customErros.includes('disclaimer')"
                class="text-danger"
                >O campo Aviso é obrigatório!</label
              >
            </div>
          </div>
          <div class="row" style="padding-bottom:10px;">
            <label class="col-md-3 col-form-label"
              >Descrição dos tipos de curso</label
            >
            <div class="col-md-9">
              <wysiwyg
                v-model="model.courseTypeDescription"
                placeholder="Descrição dos tipos de curso"
              />
              <label
                v-show="customErros.includes('courseTypeDescription')"
                class="text-danger"
                >O campo Descrição dos tipos de curso é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Título box Benefícios</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.benefitBoxTitle"
                type="text"
                :error="getError('benefitBoxTitle')"
                name="benefitBoxTitle"
                placeholder="Título box Benefícios"
                maxlength="200"
              ></base-input>
              <label
                v-show="customErros.includes('benefitBoxTitle')"
                class="text-danger"
                >O campo Título box Benefícios é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Texto box Benefícios</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.benefitBoxDescription"
                type="text"
                :error="getError('benefitBoxDescription')"
                name="benefitBoxDescription"
                placeholder="Texto box Benefícios"
                maxlength="1000"
              ></base-input>
              <label
                v-show="customErros.includes('benefitBoxDescription')"
                class="text-danger"
                >O campo Texto box Benefícios é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Título Ajude um aluno</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.helpStudentTitle"
                type="text"
                :error="getError('helpStudentTitle')"
                name="helpStudentTitle"
                placeholder="Título Ajude um aluno"
                maxlength="200"
              ></base-input>
              <label
                v-show="customErros.includes('helpStudentTitle')"
                class="text-danger"
                >O campo Título Ajude um aluno é obrigatório!</label
              >
            </div>
          </div>
          <div class="row">
            <label class="col-md-3 col-form-label">Texto ajude um aluno</label>
            <div class="col-md-9">
              <base-input
                required
                v-model="model.helpStudentDescription"
                type="text"
                :error="getError('helpStudentDescription')"
                name="helpStudentDescription"
                placeholder="Texto ajude um aluno"
                maxlength="1000"
              ></base-input>
              <label
                v-show="customErros.includes('helpStudentDescription')"
                class="text-danger"
                >O campo Texto ajude um aluno é obrigatório!</label
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
              <base-link class="btn mt-3 btn-simple btn-primary" to="/course"
                >Voltar</base-link
              >
              <base-button
                class="mt-3 pull-right"
                native-type="submit"
                type="info"
                @click.native.prevent="validateCourse"
                :loading="submitLoading"
              >
                Salvar
              </base-button>
            </div>
          </div>
        </form>
        <!--</el-tab-pane>
           <el-tab-pane
            label="Endereços"
            :disabled="viewAction == 'new' ? true : false"
          >
            <addresses
              v-loading="formLoading"
              parent="courses"
              :parentId="id"
              ref="addresses"
            ></addresses>
          </el-tab-pane>
        </el-tabs> -->
      </card>
    </div>
  </div>
</template>
<script>
import { Select, Option, Tabs, TabPane, DatePicker } from 'element-ui';
import courseService from '../../services/Course/courseService';
import courseCollegeService from '../../services/CourseCollege/courseCollegeService';
import coursePeriodService from '../../services/CoursePeriod/coursePeriodService';
import courseModalityService from '../../services/CourseModality/courseModalityService';
import courseGraduationTypeService from '../../services/CourseGraduationType/courseGraduationTypeService';
import Addresses from 'src/components/Addresses';
import operationService from '../../services/Operation/operationService';
import helperService from '../../services/Helper/helperService';
import { ImageUpload } from 'src/components/index';
import { Money } from 'v-money';
import _ from 'lodash';
export default {
  components: {
    [Option.name]: Option,
    [Select.name]: Select,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [DatePicker.name]: DatePicker,
    Money,
    Addresses,
    ImageUpload
  },
  props: {
    id: String,
    removeText: {
      type: String,
      default: 'Remove'
    }
  },
  data() {
    return {
      selectLoading: false,
      formLoading: false,
      submitLoading: false,
      model: {
        id: 0,
        title: '',
        name: '',
        idOperation: null,
        idCollege: null,
        idGraduationType: null,
        idModality: null,
        originalPrice: 0,
        discount: 0,
        finalPrice: 0,
        duration: '',
        dueDate: null,
        startDate: null,
        endDate: null,
        voucherText: '',
        description: '',
        image: '',
        listImage: '',
        active: true,
        periodIds: [],
        idFaq: 0,
        idRegulation: 0,
        disclaimer:
          'Consulte este curso no portal do MEC. Todos os cursos ofertados pelo UNICAMPI EDUCAÇÃO são autorizados pelo MEC',
        benefitBoxTitle: 'Beneficios',
        benefitBoxDescription:
          'Isenção da Taxa de vestibular<br />Primeira mensalidade isenta',
        courseTypeDescription:
          '<b>PRESENCIAL</b><p>O curso presencial é ideal para os que preferem ter mais contato com outros alunos de forma mais tradicional e também para quem aprecia estar com uma rotina mais fixa durante a semana.</p><b>EAD</b><p>As pessoas têm cada vez mais atividades, e neste sentido, um formato flexível é ideal, em que a pessoa estuda no horário e onde quiser! No parque, no café, na praia, no conforto de casa, não há distância entre você e o conhecimento! Econômico e prático e barato! Você pode estudar de onde e quando quiser, no seu tempo, com a mesma qualidade e profundidade de um curso presencial.</p><b>SEMIPRESENCIAL</b><p>A Graduação EAD é flexível. Você pode optar por Ensino a Distância totalmente on-line, ou uma imersão mais profunda, na modalidade semipresencial, na qual você comparece ao campus duas vezes por semana para interagir mais com os professores, os colegas e as matérias. Seja qual for a escolha, você tem a certeza de fazer o melhor para unir você ao sucesso.</p>',
        helpStudentTitle: 'AJUDE UM ALUNO',
        helpStudentDescription:
          'Torne o seu sonho realidade com a revenda de produtos UNICAMPI e conquiste sua independência financeira.'
      },
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false
      },
      percentage: {
        decimal: ',',
        thousands: '.',
        prefix: '',
        suffix: '%',
        precision: 2,
        masked: false
      },
      operations: [],
      colleges: [],
      periods: [],
      faqs: [],
      regulations: [],
      graduationTypes: [],
      modalities: [],
      customErros: [],
      image: null,
      listImage: null,
      modelValidations: {
        title: { required: true, max: 500 },
        idOperation: { required: true },
        idCollege: { required: true },
        idGraduationType: { required: true },
        idModality: { required: true },
        originalPrice: { required: true },
        discount: { required: true },
        finalPrice: { required: true },
        duration: { required: true, max: 200 }
      }
    };
  },
  computed: {
    viewAction() {
      return this.$route.name == 'edit_course' ? 'edit' : 'new';
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    validateCourse() {
      const self = this;
      self.customErros = [];

      if (!self.model.title) self.customErros.push('title');
      if (!self.model.name) self.customErros.push('name');
      if (!self.model.idOperation) self.customErros.push('idOperation');
      if (!self.model.idCollege || self.model.idCollege == 0)
        self.customErros.push('idCollege');
      if (!self.model.idGraduationType || self.model.idGraduationType == 0)
        self.customErros.push('idGraduationType');
      if (!self.model.idModality || self.model.idModality == 0)
        self.customErros.push('idModality');
      if (!self.model.originalPrice) self.customErros.push('originalPrice');
      if (!self.model.discount) self.customErros.push('discount');
      if (!self.model.finalPrice) self.customErros.push('finalPrice');
      if (!self.model.duration) self.customErros.push('duration');
      if (!self.model.periodIds || self.model.periodIds.length == 0)
        self.customErros.push('period');
      if (!self.model.listImage && !self.listImage)
        self.customErros.push('listImage');
      if (!self.model.image && !self.image) self.customErros.push('image');

      if (self.customErros.length == 0) {
        self.submitLoading = true;
        let imgCounter = 0;

        if (self.image) {
          imgCounter++;
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
              self.model.image = response.data.url;
              imgCounter--;
              if (imgCounter == 0) self.saveCourse(self);
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
        }

        if (self.listImage) {
          imgCounter++;
          helperService.uploadFile(self.listImage).then(
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
              self.model.listImage = response.data.url;
              imgCounter--;
              if (imgCounter == 0) self.saveCourse(self);
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
        }
        if (imgCounter == 0) self.saveCourse(self);
      }
    },
    saveCourse(vm) {
      vm = vm ? vm : this;
      if (!vm.model.idOperation)
        vm.model.idOperation = this.$store.getters.currentUser.idOperation;
      if (vm.model.id === 0) {
        courseService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Curso cadastrada com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
            vm.$router.push('/course');
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      } else {
        courseService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.$router.push('/course');
            vm.submitLoading = false;
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;

      if (self.viewAction == 'edit') {
        self.formLoading = true;
        courseService.get(self.id).then(
          response => {
            self.model = response.data;
            self.onOperationChange();
            self.formLoading = false;
          },
          () => {
            self.formLoading = false;
          }
        );
      }

      self.selectLoading = true;
      operationService.findAll().then(
        response => {
          _.each(response.data, function(el) {
            self.operations.push({ id: el.id, title: el.title });
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );

      courseService.listFaqs().then(
        response => {
          _.each(response.data, function(el) {
            self.faqs.push(el);
            if (
              self.model.idFaq === 0 &&
              el.display === 'Perguntas Frequentes - Padrão'
            ) {
              self.model.idFaq = el.value;
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );

      courseService.listRegulations().then(
        response => {
          _.each(response.data, function(el) {
            self.regulations.push(el);
            if (
              self.model.idRegulation === 0 &&
              el.display === 'Regulamento - Padrão'
            ) {
              self.model.idRegulation = el.value;
            }
          });
          self.selectLoading = false;
        },
        () => {
          self.selectLoading = false;
        }
      );
    },
    onImageChange(file) {
      this.image = file;
    },
    onListImageChange(file) {
      this.listImage = file;
    },
    onOperationChange() {
      const self = this;

      courseCollegeService
        .findAll({
          page: 0,
          pageItems: 300,
          searchWord: '',
          sort: 'Name ASC',
          idOperation: self.model.idOperation
        })
        .then(
          response => {
            _.each(response.data, function(el) {
              self.colleges.push({ id: el.id, title: el.name });
            });
            self.selectLoading = false;
          },
          () => {
            self.selectLoading = false;
          }
        );

      courseModalityService
        .findAll({
          page: 0,
          pageItems: 300,
          searchWord: '',
          sort: 'Name ASC',
          idOperation: self.model.idOperation
        })
        .then(
          response => {
            _.each(response.data, function(el) {
              self.modalities.push({ id: el.id, title: el.name });
            });
            self.selectLoading = false;
          },
          () => {
            self.selectLoading = false;
          }
        );

      courseGraduationTypeService
        .findAll({
          page: 0,
          pageItems: 300,
          searchWord: '',
          sort: 'Name ASC',
          idOperation: self.model.idOperation
        })
        .then(
          response => {
            _.each(response.data, function(el) {
              self.graduationTypes.push({ id: el.id, title: el.name });
            });
            self.selectLoading = false;
          },
          () => {
            self.selectLoading = false;
          }
        );

      coursePeriodService
        .findAll({
          page: 0,
          pageItems: 300,
          searchWord: '',
          sort: 'Name ASC',
          idOperation: self.model.idOperation
        })
        .then(
          response => {
            _.each(response.data, function(el) {
              self.periods.push({ id: el.id, title: el.name });
            });
            self.selectLoading = false;
          },
          () => {
            self.selectLoading = false;
          }
        );
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
