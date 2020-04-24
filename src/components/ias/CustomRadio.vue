<template>
  <div class="ias-radio">
    <label :for="cbId">
      <input
        :id="cbId"
        type="radio"
        :disabled="disabled"
        :value="name"
        v-model="model"
      />
      <slot></slot>
      <span></span>
    </label>
  </div>
</template>
<script>
export default {
  name: 'ias-radio',
  props: {
    name: {
      type: [String, Number],
      description: 'Radio label'
    },
    disabled: {
      type: Boolean,
      description: 'Whether radio is disabled'
    },
    value: {
      type: [Number, Boolean],
      description: 'Radio value'
    }
  },
  data() {
    return {
      cbId: ''
    };
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    inlineClass() {
      if (this.inline) {
        return `form-check-inline`;
      }
      return '';
    }
  },
  created() {
    this.cbId = Math.random()
      .toString(16)
      .slice(2);
  }
};
</script>
