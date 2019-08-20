<template>
    <div class="highlight" @click="toggleHighlight">
        <i v-if="starred" class="fa fa-star " aria-hidden="true" style="color: #ffbe3c;"></i>
        <i v-else class="fa fa-star-o light" aria-hidden="true"></i>
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
