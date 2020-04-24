<template>
  <div
    class="ias-input-group"
    :class="{
      'ias-has-icon': hasIcon,
      'ias-focus': floatLabel,
      'ias-danger': error,
      'ias-success': !error && touched
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
      <span v-if="iconName === 'calendar'">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21.5023 24.0002H2.38914C1.08597 24.0002 0 22.9117 0 21.6056V4.02737C0 2.72124 0.868779 1.63281 2.00905 1.63281H3.20362V3.21104H2.00905C1.84615 3.21104 1.62896 3.53757 1.62896 4.02737V21.6056C1.62896 22.041 2.00905 22.4219 2.44344 22.4219H21.5566C21.9909 22.4219 22.371 22.041 22.371 21.6056V4.02737C22.371 3.53757 22.0995 3.21104 21.9909 3.21104H20.7964V1.63281H21.9909C23.0769 1.63281 24 2.72124 24 4.02737V21.6056C23.8914 22.9117 22.8054 24.0002 21.5023 24.0002Z"
            fill="#41B0CE"
          />
          <path
            d="M5.5928 4.84353C5.15841 4.84353 4.77832 4.46258 4.77832 4.02721V0.816326C4.77832 0.380952 5.15841 0 5.5928 0C6.02719 0 6.40728 0.380952 6.40728 0.816326V4.02721C6.35298 4.46258 6.02719 4.84353 5.5928 4.84353Z"
            fill="#41B0CE"
          />
          <path
            d="M18.2989 4.84353C17.8645 4.84353 17.4844 4.46258 17.4844 4.02721V0.816326C17.4844 0.380952 17.8645 0 18.2989 0C18.7332 0 19.1133 0.380952 19.1133 0.816326V4.02721C19.1133 4.46258 18.7332 4.84353 18.2989 4.84353Z"
            fill="#41B0CE"
          />
          <path
            d="M7.98193 1.63281H15.9095V3.26547H7.98193V1.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M1.57446 6.42188H22.3165V8.05453H1.57446V6.42188Z"
            fill="#41B0CE"
          />
          <path
            d="M19.113 9.63281H20.6877V11.211H19.113V9.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M15.9097 9.63281H17.5386V11.211H15.9097V9.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M12.76 9.63281H14.3347V11.211H12.76V9.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M9.5564 9.63281H11.1311V11.211H9.5564V9.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M6.35278 9.63281H7.98174V11.211H6.35278V9.63281Z"
            fill="#41B0CE"
          />
          <path
            d="M19.113 12.8438H20.6877V14.422H19.113V12.8438Z"
            fill="#41B0CE"
          />
          <path
            d="M15.9097 12.8438H17.5386V14.422H15.9097V12.8438Z"
            fill="#41B0CE"
          />
          <path
            d="M12.76 12.8438H14.3347V14.422H12.76V12.8438Z"
            fill="#41B0CE"
          />
          <path
            d="M9.5564 12.8438H11.1311V14.422H9.5564V12.8438Z"
            fill="#41B0CE"
          />
          <path
            d="M6.35278 12.8438H7.98174V14.422H6.35278V12.8438Z"
            fill="#41B0CE"
          />
          <path
            d="M3.20361 12.8438H4.77827V14.422H3.20361V12.8438Z"
            fill="#41B0CE"
          />
          <path d="M19.113 16H20.6877V17.6327H19.113V16Z" fill="#41B0CE" />
          <path d="M15.9097 16H17.5386V17.6327H15.9097V16Z" fill="#41B0CE" />
          <path d="M12.76 16H14.3347V17.6327H12.76V16Z" fill="#41B0CE" />
          <path d="M9.5564 16H11.1311V17.6327H9.5564V16Z" fill="#41B0CE" />
          <path d="M6.35278 16H7.98174V17.6327H6.35278V16Z" fill="#41B0CE" />
          <path d="M3.20361 16H4.77827V17.6327H3.20361V16Z" fill="#41B0CE" />
          <path
            d="M15.9097 19.2109H17.5386V20.7892H15.9097V19.2109Z"
            fill="#41B0CE"
          />
          <path
            d="M12.76 19.2109H14.3347V20.7892H12.76V19.2109Z"
            fill="#41B0CE"
          />
          <path
            d="M9.5564 19.2109H11.1311V20.7892H9.5564V19.2109Z"
            fill="#41B0CE"
          />
          <path
            d="M6.35278 19.2109H7.98174V20.7892H6.35278V19.2109Z"
            fill="#41B0CE"
          />
          <path
            d="M3.20361 19.2109H4.77827V20.7892H3.20361V19.2109Z"
            fill="#41B0CE"
          />
        </svg>
      </span>
      <span v-if="iconName === 'link'">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.7894 19.0414L7.575 20.2474C6.5223 21.2908 4.8102 21.2917 3.7581 20.2474C3.2523 19.7455 2.9745 19.0789 2.9745 18.3703C2.9745 17.6617 3.2526 16.9948 3.7578 16.4929L8.2278 12.058C9.1542 11.1394 10.8969 9.78667 12.1671 11.0464C12.75 11.6254 13.6914 11.6215 14.2701 11.0389C14.8491 10.4563 14.8455 9.51457 14.2626 8.93617C12.1035 6.79357 8.9124 7.18957 6.1332 9.94717L1.6629 14.3824C0.5904 15.4471 0 16.8631 0 18.3703C0 19.8775 0.5904 21.2932 1.6632 22.3579C2.7669 23.4529 4.2162 24.0001 5.6661 24.0001C7.1163 24.0001 8.5662 23.4529 9.6705 22.3573L10.8858 21.151C11.4684 20.5726 11.4717 19.6312 10.8927 19.0483C10.3146 18.466 9.3723 18.4627 8.7894 19.0414ZM22.3362 1.81327C20.0172 -0.487733 16.7748 -0.612533 14.628 1.51747L13.1142 3.02017C12.5313 3.59887 12.5277 4.53997 13.1067 5.12287C13.6857 5.70577 14.6271 5.70907 15.21 5.13037L16.7232 3.62857C17.8353 2.52427 19.2915 2.98207 20.2413 3.92437C20.7477 4.42627 21.0258 5.09317 21.0258 5.80177C21.0258 6.51067 20.7474 7.17757 20.2419 7.67947L15.4728 12.4105C13.2921 14.5741 12.2691 13.5586 11.8326 13.1254C11.2497 12.5467 10.3086 12.5503 9.7296 13.1329C9.1506 13.7155 9.1542 14.6572 9.7371 15.2356C10.7382 16.2292 11.8809 16.7218 13.0788 16.7218C14.5455 16.7218 16.0947 15.9832 17.5677 14.5207L22.3368 9.78967C23.409 8.72497 24 7.30867 24 5.80147C24 4.29487 23.409 2.87857 22.3362 1.81327Z"
            fill="#41B0CE"
          />
        </svg>
      </span>
    </div>
    <label v-if="error || $slots.error" class="error">{{ error }}</label>
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
      return this.focused || this.value !== '';
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
