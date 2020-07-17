import CustomInput from 'src/components/ias/CustomInput.vue';
import CustomRadio from 'src/components/ias/CustomRadio.vue';
import CustomCheckbox from 'src/components/ias/CustomCheckbox.vue';
import CustomImageUpload from 'src/components/ias/CustomImageUpload.vue';

import BaseDropdown from 'src/components/BaseDropdown.vue';
import Card from 'src/components/Cards/Card.vue';
import BaseButton from 'src/components/BaseButton.vue';
import { Input, InputNumber, Tooltip, Popover, Autocomplete } from 'element-ui';
import BaseRouterLink from 'src/components/BaseRouterLink.vue';

const GlobalComponents = {
  install(Vue) {
    Vue.component(CustomInput.name, CustomInput);
    Vue.component(CustomRadio.name, CustomRadio);
    Vue.component(CustomCheckbox.name, CustomCheckbox);
    Vue.component(CustomImageUpload.name, CustomImageUpload);

    Vue.component(BaseDropdown.name, BaseDropdown);
    Vue.component(Card.name, Card);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(Input.name, Input);
    Vue.component(InputNumber.name, InputNumber);
    Vue.component(Autocomplete.name, Autocomplete);
    Vue.component(BaseRouterLink.name, BaseRouterLink);
    Vue.use(Tooltip);
    Vue.use(Popover);
  }
};

export default GlobalComponents;
