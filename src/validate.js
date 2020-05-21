export default {
  validateCpf(c) {
    if ((c = c.replace(/[^\d]/g, '')).length != 11) return false;
    if (
      c == '00000000000' ||
      c == '11111111111' ||
      c == '22222222222' ||
      c == '33333333333' ||
      c == '44444444444' ||
      c == '55555555555' ||
      c == '66666666666' ||
      c == '77777777777' ||
      c == '88888888888' ||
      c == '99999999999'
    )
      return false;

    let r;
    let s = 0;
    for (let i = 1; i <= 9; i++) s = s + parseInt(c[i - 1]) * (11 - i);
    r = (s * 10) % 11;

    if (r == 10 || r == 11) r = 0;
    if (r != parseInt(c[9])) return false;
    s = 0;

    for (let i = 1; i <= 10; i++) s = s + parseInt(c[i - 1]) * (12 - i);
    r = (s * 10) % 11;
    if (r == 10 || r == 11) r = 0;
    if (r != parseInt(c[10])) return false;
    return true;
  },
  validateCnpj(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj == '') return false;
    if (cnpj.length != 14) return false;

    if (
      cnpj == '00000000000000' ||
      cnpj == '11111111111111' ||
      cnpj == '22222222222222' ||
      cnpj == '33333333333333' ||
      cnpj == '44444444444444' ||
      cnpj == '55555555555555' ||
      cnpj == '66666666666666' ||
      cnpj == '77777777777777' ||
      cnpj == '88888888888888' ||
      cnpj == '99999999999999'
    )
      return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    let digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;
    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += numbers.charAt(size - i) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;

    return true;
  },
  validateEmail(email) {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
    return reg.test(email);
  }
};
