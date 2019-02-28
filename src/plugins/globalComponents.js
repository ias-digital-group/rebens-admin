import BaseInput from 'src/components/Inputs/BaseInput.vue';
import BaseDropdown from 'src/components/BaseDropdown.vue';
import Card from 'src/components/Cards/Card.vue';
import BaseButton from 'src/components/BaseButton.vue';
import BaseCheckbox from 'src/components/Inputs/BaseCheckbox.vue';
import BaseRadio from 'src/components/Inputs/BaseRadio.vue';
import { Input, InputNumber, Tooltip, Popover } from 'element-ui';
import BaseRouterLink from 'src/components/BaseRouterLink.vue';
/**
 * You can register global components here and use them as a plugin in your main Vue instance
 */

const GlobalComponents = {
  install(Vue) {
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(BaseDropdown.name, BaseDropdown);
    Vue.component(Card.name, Card);
    Vue.component(BaseCheckbox.name, BaseCheckbox);
    Vue.component(BaseRadio.name, BaseRadio);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(Input.name, Input);
    Vue.component(InputNumber.name, InputNumber);
    Vue.component(BaseRouterLink.name, BaseRouterLink);
    Vue.use(Tooltip);
    Vue.use(Popover);
  }
};

export default GlobalComponents;
