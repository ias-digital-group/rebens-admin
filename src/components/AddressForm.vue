<template>
  <div class="form-horizontal" :loading="addressFormLoading">
    <div class="row">
      <label class="col-md-3 col-form-label">Nome</label>
      <div class="col-md-9">
        <base-input
          required
          v-model="address.name"
          v-validate="modelValidations.addressName"
          type="text"
          :error="getError('addressName')"
          name="addressName"
          placeholder="Nome"
          maxlength="200"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Cep</label>
      <div class="col-md-3 col-lg-2">
        <base-input
          required
          v-model="address.zipcode"
          v-validate="modelValidations.cep"
          type="tel"
          :error="getError('cep')"
          name="cep"
          placeholder="Cep"
          maxlength="9"
          ref="zipcode"
          :inputMask="['#####-####']"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Endereço</label>
      <div class="col-md-6 col-lg-4">
        <base-input
          required
          v-model="address.street"
          v-validate="modelValidations.logradouro"
          type="text"
          :error="getError('logradouro')"
          name="logradouro"
          placeholder="Endereço"
          maxlength="400"
        ></base-input>
      </div>
      <div class="col-md-3 col-lg-2">
        <base-input
          required
          v-model="address.number"
          v-validate="modelValidations.numero"
          type="text"
          :error="getError('numero')"
          name="numero"
          placeholder="Numero"
          maxlength="50"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Complemento</label>
      <div class="col-md-4 col-lg-2">
        <base-input
          v-model="address.complement"
          type="text"
          placeholder="Complemento"
          maxlength="50"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Bairro</label>
      <div class="col-md-4 col-lg-2">
        <base-input
          required
          v-model="address.neighborhood"
          v-validate="modelValidations.bairro"
          type="text"
          name="bairro"
          :error="getError('bairro')"
          placeholder="Bairro"
          maxlength="200"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Cidade</label>
      <div class="col-md-5">
        <base-input
          required
          v-model="address.city"
          v-validate="modelValidations.cidade"
          type="text"
          :error="getError('cidade')"
          name="cidade"
          placeholder="Cidade"
          maxlength="200"
        ></base-input>
      </div>
    </div>
    <div class="row">
      <label class="col-md-3 col-form-label">Estado</label>
      <div class="col-md-2">
        <div class="form-group">
          <el-select
            :class="{ 'select-info': true, 'has-danger': errors.has('estado') }"
            placeholder="Estado"
            v-model="address.state"
            v-validate="modelValidations.estado"
            name="estado"
            lock
          >
            <el-option
              v-for="state in stateList"
              class="select-primary"
              :value="state"
              :label="state"
              :key="state"
            >
            </el-option>
          </el-select>
          <label
            v-show="errors.has('estado')"
            class="error"
            v-html="getError('estado')"
          ></label>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import helperService from '../services/Helper/helperService';
import { Select, Option } from 'element-ui';
export default {
  name: 'address-form',
  inject: {
    $validator: '$validator'
  },
  components: {
    [Option.name]: Option,
    [Select.name]: Select
  },
  props: {
    address: Object
  },
  data() {
    return {
      zipCodeFocused: false,
      zipCodeTouched: false,
      addressFormLoading: false,
      modelValidations: {
        cep: {
          required: true
        },
        logradouro: {
          required: true
        },
        numero: {
          required: true
        },
        bairro: {
          required: true
        },
        cidade: {
          required: true
        },
        estado: {
          required: true
        },
        addressName: {
          required: true,
          max: 200
        }
      },
      stateList: [
        'AC',
        'AL',
        'AM',
        'AP',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MG',
        'MS',
        'MT',
        'PA',
        'PB',
        'PE',
        'PI',
        'PR',
        'RJ',
        'RN',
        'RO',
        'RR',
        'RS',
        'SC',
        'SE',
        'SP',
        'TO'
      ]
    };
  },
  watch: {
    'address.zipcode': function(value) {
      if (value && value.length == 8) {
        this.getAddressData(value);
      }
    }
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    getAddressData(zipCode) {
      this.addressFormLoading = true;
      const self = this;
      helperService.getAddressFromZipCode(zipCode).then(
        response => {
          self.address.street = response.logradouro;
          self.address.complement = response.complemento;
          self.address.neighborhood = response.bairro;
          self.address.city = response.localidade;
          self.address.state = response.uf;
          self.addressFormLoading = false;
        },
        () => {
          self.addressFormLoading = false;
        }
      );
    },
    clearZipCodeValue() {
      this.$refs.zipcode.clearValue();
    }
  }
};
</script>
