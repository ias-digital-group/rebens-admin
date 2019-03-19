<template>
  <div class="fileinput text-center">
    <div
      class="fileinput-new thumbnail"
      :class="{ 'img-circle': type === 'avatar' }"
    >
      <img :src="image" alt="preview" />
    </div>
    <div>
      <span class="btn btn-info   btn-simple btn-file">
        <span class="fileinput-new">{{
          fileExists ? changeText : selectText
        }}</span>
        <input type="hidden" value="" name="" />
        <input
          accept="image/*"
          @change="handlePreview"
          type="file"
          name="..."
          class="valid"
          :multiple="false"
          aria-invalid="false"
          ref="file"
        />
      </span>
      <base-button v-if="fileExists" @click="removeFile" class="btn btn-simple" type="danger">
        <i class="fas fa-times"></i> {{ removeText }}
      </base-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'image-upload',
  props: {
    type: {
      type: String,
      default: '',
      description: 'Image upload type (""|avatar)'
    },
    src: {
      type: String,
      default: '',
      description: 'Initial image to display'
    },
    selectText: {
      type: String,
      default: 'Select image'
    },
    changeText: {
      type: String,
      default: 'Change'
    },
    removeText: {
      type: String,
      default: 'Remove'
    },
    optionalData: {
      type: Object,
      default: null
    }
  },
  data() {
    let avatarPlaceholder = 'img/placeholder.jpg';
    let imgPlaceholder = 'img/image_placeholder.jpg';
    return {
      placeholder: this.type === 'avatar' ? avatarPlaceholder : imgPlaceholder,
      imagePreview: null
    };
  },
  computed: {
    fileExists() {
      return this.imagePreview !== null;
    },
    image() {
      return this.imagePreview || this.src || this.placeholder;
    }
  },
  methods: {
    handlePreview(event) {
      if (event.target.files.length == 0) {
        return;
      }
      let file = event.target.files[0];
      this.imagePreview = URL.createObjectURL(file);
      this.$emit('change', this.$refs.file.files[0], this.optionalData);
    },
    removeFile() {
      this.imagePreview = null;
      this.$emit('change', null, this.optionalData);
    }
  }
};
</script>
<style>
</style>
