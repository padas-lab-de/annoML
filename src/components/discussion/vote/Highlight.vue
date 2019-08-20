<template>
  <div class="highlight" @click="toggleHighlight">
    <font-awesome-icon
      v-if="starred"
      icon="star"
      :style="{ color: '#ffbe3c' }"
    ></font-awesome-icon>
    <font-awesome-icon
      v-else
      icon="star"
      :style="{ color: 'lightgray' }"
    ></font-awesome-icon>
  </div>
</template>

<script>
export default {
  name: 'Highlight',
  props: {
    starred: {
      type: Boolean,
      default() {
        return false;
      },
    },
    edit: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  methods: {
    toggleHighlight() {
      this.starred = !this.starred;
    },
  },
};
</script>

<style scoped>
.highlight {
  height: 40px;
  width: 40px;
  color: gray;
}
.highlight:hover {
  color: #ffbe3c;
  transform: scale(1.2);
}
</style>
