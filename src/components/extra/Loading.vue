<template>
  <div class="loading">
    <div v-if="warning">
      <font-awesome-icon
        size="lg"
        icon="exclamation-circle"
        :style="{ color: 'black' }"
      />
      <h4>{{ warning }}</h4>
    </div>
    <div v-else>
      <b-spinner
        style="width: 3rem; height: 3rem;"
        :label="message"
        v-if="!warning"
      >
      </b-spinner>
      <h4>{{ message }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    message: {
      type: String,
      default() {
        return 'Loading';
      },
    },
    warning: {
      type: String,
      default() {
        return null;
      },
    },
  },
};
</script>

<style scoped>
.loading {
  display: block;
  width: 100%;
  height: 100%;
  text-align: center;
  padding-top: 20%;
}
</style>
