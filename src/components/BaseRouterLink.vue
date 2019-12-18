<template>
  <router-link v-bind="$attrs"><slot></slot></router-link>
</template>
<script>
export default {
  name: 'base-link'
};
</script>
