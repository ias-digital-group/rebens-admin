import helperService from '../services/Helper/helperService';

export default {
  data() {
    return {
      addressFormLoading: false,
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
      ],
      address: {
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        country: 'BRA',
        latitude: '',
        longitude: '',
        name: ''
      }
    };
  },
  watch: {
    'address.zipCode': function(value) {
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
    }
  }
};
