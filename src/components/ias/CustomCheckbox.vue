<template>
  <div class="ias-check" :class="{ iasDisabled: disabled }">
    <label :for="cbId">
      <input :id="cbId" type="checkbox" :disabled="disabled" v-model="model" />
      <span> </span>
      <slot></slot>
    </label>
  </div>
</template>
<script>
export default {
  name: 'ias-checkbox',
  model: {
    prop: 'checked'
  },
  props: {
    checked: [Array, Boolean],
    disabled: Boolean,
    hasError: Boolean
  },
  data() {
    return {
      cbId: '',
      touched: false
    };
  },
  computed: {
    model: {
      get() {
        return this.checked;
      },
      set(check) {
        if (!this.touched) {
          this.touched = true;
        }
        this.$emit('input', check);
      }
    }
  },
  created() {
    this.cbId = Math.random()
      .toString(16)
      .slice(2);
  }
};
</script>
