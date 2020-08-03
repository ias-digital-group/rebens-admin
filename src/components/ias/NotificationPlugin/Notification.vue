<template>
  <transition name="modal" @click="tryClose">
    <div class="modal-mask">
      <div class="modal-container">
        <span @click="close" class="bt-remove">
          <svg
            width="23"
            height="23"
            viewBox="0 0 23 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0)">
              <path
                d="M17.6777 14.8492L14.1421 11.3137L17.6777 7.77817C18.0666 7.38927 18.0666 6.75287 17.6777 6.36396L16.2635 4.94975C15.8746 4.56084 15.2382 4.56084 14.8493 4.94975L11.3137 8.48528L7.77819 4.94975C7.38928 4.56084 6.75288 4.56084 6.36397 4.94975L4.94976 6.36396C4.56085 6.75287 4.56085 7.38927 4.94976 7.77817L8.48529 11.3137L4.94976 14.8492C4.56085 15.2382 4.56085 15.8745 4.94976 16.2635L6.36397 17.6777C6.75288 18.0666 7.38928 18.0666 7.77819 17.6777L11.3137 14.1421L14.8493 17.6777C15.2382 18.0666 15.8746 18.0666 16.2635 17.6777L17.6777 16.2635C18.0666 15.8745 18.0666 15.2382 17.6777 14.8492Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0">
                <rect
                  x="11.3137"
                  width="16"
                  height="16"
                  transform="rotate(45 11.3137 0)"
                  fill="white"
                />
              </clipPath>
            </defs>
          </svg>
        </span>
        <img :src="icon" v-show="hasIcon" :alt="title" />
        <p :class="alertType" v-if="message" v-html="message"></p>
      </div>
    </div>
    <!-- <div
      @click="tryClose"
      data-notify="container"
      class="ias-alert"
      :class="[
      { 'alert-with-icon': icon },
      alertType
    ]"
      role="alert"
      data-notify-position="top-center"
    >
      <button
        v-if="showClose"
        type="button"
        aria-hidden="true"
        class="close col-xs-1"
        data-notify="dismiss"
        @click="close"
      >
        <i class="fas fa-times"></i>
      </button>

      <span v-if="icon" data-notify="icon" :class="['ias-alert-icon', icon]"></span>
      <span data-notify="message">
        <span v-if="title" class="title">
          <b>
            {{ title }}
            <br />
          </b>
        </span>
        <span v-if="message" v-html="message"></span>
        <content-render v-if="!message && component" :component="component"></content-render>
      </span>
    </div>-->
  </transition>
</template>
<script>
export default {
  name: 'notification',
  components: {
    contentRender: {
      props: ['component'],
      render: h => h(this.component)
    }
  },
  props: {
    message: String,
    title: String,
    icon: String,
    type: {
      type: String,
      default: 'info',
      validator: value => {
        let acceptedValues = [
          'info',
          'primary',
          'danger',
          'warning',
          'success'
        ];
        return acceptedValues.indexOf(value) !== -1;
      }
    },
    timeout: {
      type: Number,
      default: 5000,
      validator: value => {
        return value >= 0;
      }
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    },
    component: {
      type: [Object, Function]
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    clickHandler: Function
  },
  data() {
    return {
      elmHeight: 0
    };
  },
  computed: {
    hasIcon() {
      return this.icon && this.icon.length > 0;
    },
    alertType() {
      return `ias-alert-${this.type}`;
    },
    customPosition() {
      let initialMargin = 20;
      let alertHeight = this.elmHeight + 10;
      let sameAlertsCount = this.$notifications.state.filter(alert => {
        return (
          alert.horizontalAlign === this.horizontalAlign &&
          alert.verticalAlign === this.verticalAlign &&
          alert.timestamp <= this.timestamp
        );
      }).length;
      if (this.$notifications.settings.overlap) {
        sameAlertsCount = 1;
      }
      let pixels = (sameAlertsCount - 1) * alertHeight + initialMargin;
      let styles = {};
      if (this.verticalAlign === 'top') {
        styles.top = `${pixels}px`;
      } else {
        styles.bottom = `${pixels}px`;
      }
      return styles;
    }
  },
  methods: {
    close() {
      this.$emit('close', this.timestamp);
    },
    tryClose(evt) {
      if (this.clickHandler) {
        this.clickHandler(evt, this);
      }
      if (this.closeOnClick) {
        this.close();
      }
    }
  },
  mounted() {
    this.elmHeight = this.$el.clientHeight;
    // if (this.timeout) {
    //   setTimeout(this.close, this.timeout);
    // }
  }
};
</script>
<style lang="scss">
.notifications .alert {
  position: fixed;
  z-index: 10000;

  &[data-notify='container'] {
    width: 400px;
  }

  &.center {
    margin: 0 auto;
  }
  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }
}
</style>
