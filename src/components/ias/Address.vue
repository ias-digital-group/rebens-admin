<template>
  <div>
    <div class="ias-row">
      <custom-input
        :required="true"
        v-model="address.name"
        type="text"
        name="addrName"
        label="Nome Endreço (Ex. Matriz, Paulista, Etc)."
        :error="customErrors.get('addrName')"
        maxlength="400"
      ></custom-input>
      <custom-input
        :required="true"
        v-model="address.zipcode"
        type="text"
        name="zipcode"
        label="CEP"
        :error="customErrors.get('zipcode')"
        :inputMask="['#####-###']"
        maxlength="50"
      ></custom-input>
    </div>
    <div class="ias-row">
      <custom-input
        :required="true"
        v-model="address.street"
        type="text"
        name="street"
        label="Endereço"
        :error="customErrors.get('street')"
        maxlength="800"
      ></custom-input>
    </div>
    <div class="ias-row">
      <custom-input
        :required="true"
        v-model="address.number"
        type="text"
        name="number"
        label="Número"
        :error="customErrors.get('number')"
        maxlength="100"
      ></custom-input>
      <custom-input
        v-model="address.complement"
        type="text"
        name="complement"
        label="Complemento"
        :error="customErrors.get('complement')"
        maxlength="100"
      ></custom-input>
    </div>
    <div class="ias-row">
      <custom-input
        :required="true"
        v-model="address.neighborhood"
        type="text"
        name="neighborhood"
        label="Bairro"
        :error="customErrors.get('neighborhood')"
        maxlength="400"
      ></custom-input>
      <custom-input
        v-model="address.city"
        type="text"
        name="city"
        label="Cidade"
        :error="customErrors.get('city')"
        maxlength="400"
      ></custom-input>
    </div>
    <div class="ias-row">
      <div class="select-holder">
        <v-select
          :options="stateList"
          :reduce="op => op.code"
          :key="address.state"
          v-model="address.state"
          placeholder="Estado"
        >
          <span slot="no-options">Nenhum Estado encontrado</span>
        </v-select>
      </div>
      <custom-input
        v-model="address.country"
        type="text"
        name="country"
        label="País"
        :error="customErrors.get('country')"
        maxlength="400"
        :disabled="true"
      ></custom-input>
    </div>
  </div>
</template>
<script>
import helperService from '../../services/Helper/helperService';
export default {
  name: 'ias-address',
  props: {
    address: Object,
    customErrors: Map
  },
  data() {
    return {
      stateList: [
        { code: 'AC', label: 'Acre' },
        { code: 'AL', label: 'Alagoas' },
        { code: 'AP', label: 'Amapá' },
        { code: 'AM', label: 'Amazonas' },
        { code: 'BA', label: 'Bahia' },
        { code: 'CE', label: 'Ceará' },
        { code: 'DF', label: 'Distrito Federal' },
        { code: 'ES', label: 'Espírito Santo' },
        { code: 'GO', label: 'Goiás' },
        { code: 'MA', label: 'Maranhão' },
        { code: 'MT', label: 'Mato Grosso' },
        { code: 'MS', label: 'Mato Grosso do Sul' },
        { code: 'MG', label: 'Minas Gerais' },
        { code: 'PA', label: 'Pará' },
        { code: 'PB', label: 'Paraíba' },
        { code: 'PR', label: 'Paraná' },
        { code: 'PE', label: 'Pernambuco' },
        { code: 'PI', label: 'Piauí' },
        { code: 'RJ', label: 'Rio de Janeiro' },
        { code: 'RN', label: 'Rio Grande do Norte' },
        { code: 'RO', label: 'Rondônia' },
        { code: 'RR', label: 'Roraima' },
        { code: 'RS', label: 'Rio Grande do Sul' },
        { code: 'SC', label: 'Santa Catarina' },
        { code: 'SP', label: 'São Paulo' },
        { code: 'SE', label: 'Sergipe' },
        { code: 'TO', label: 'Tocantins' }
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
    getAddressData(zipCode) {
      this.addressFormLoading = true;
      const self = this;
      helperService.getAddressFromZipCode(zipCode).then(
        response => {
          self.address.street = response.logradouro;
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
