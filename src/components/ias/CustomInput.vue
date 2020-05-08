<template>
  <div
    class="ias-input-group"
    :class="{
      'ias-has-icon': hasIcon,
      'ias-focus': floatLabel,
      'bg-red-20': error
    }"
  >
    <label class="ias-label"> {{ label }} </label>
    <slot>
      <template v-if="inputMask && inputMask.length > 0">
        <the-mask
          :value="value"
          ref="maskedInput"
          :mask="inputMask"
          v-bind="$attrs"
          v-on="listeners"
          class="ias-input"
        />
      </template>
      <template v-else>
        <input
          :value="value"
          v-bind="$attrs"
          v-on="listeners"
          class="ias-input"
        />
      </template>
    </slot>
    <div v-if="hasIcon" class="ias-icon-holder">
      <i :class="iconName"></i>
    </div>
    <label v-if="error" class="ias-error">{{ error }}</label>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  name: 'custom-input',
  props: {
    required: Boolean,
    label: {
      type: String,
      description: 'Input label'
    },
    error: {
      type: String,
      description: 'Input error',
      default: ''
    },
    value: {
      type: [String, Number, Boolean],
      description: 'Input value'
    },
    hasIcon: {
      type: String,
      description: 'Has icon'
    },
    iconName: {
      type: Boolean,
      description: 'Name of the icon'
    },
    inputMask: {
      type: Array,
      description: 'Input mask'
    },
    hasFocus: {
      type: Boolean,
      description: 'Input focus'
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      focused: false,
      touched: false
    };
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners,
        input: this.onInput,
        blur: this.onBlur,
        focus: this.onFocus
      };
    },
    floatLabel() {
      return this.focused || (this.value && this.value !== '') || this.hasFocus;
    }
  },
  methods: {
    onInput(evt) {
      if (!this.touched) {
        this.touched = true;
      }
      this.$emit('input', evt.target ? evt.target.value : evt);
    },
    onFocus() {
      this.focused = true;
    },
    onBlur() {
      this.focused = false;
    },
    clearValue() {
      if (this.$refs.maskedInput) {
        this.$refs.maskedInput.$data.lastValue = null;
      }
    }
  }
};
</script>
<style></style>
