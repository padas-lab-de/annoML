<template>
  <div class="highlight" :class="{ edit: edit }" @click="toggleHighlight">
    <font-awesome-icon
      v-if="highlight"
      icon="star"
      size="2x"
      :style="{ color: '#ffbe3c' }"
    ></font-awesome-icon>
    <font-awesome-icon
      v-else
      icon="star"
      size="2x"
      :style="{ color: 'lightgray' }"
    ></font-awesome-icon>
  </div>
</template>

<script>
export default {
  name: 'Highlight',
  props: {
    highlight: {
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
  color: gray;
}
.highlight:hover .edit {
  color: #ffbe3c;
  transform: scale(0.9);
}
</style>
