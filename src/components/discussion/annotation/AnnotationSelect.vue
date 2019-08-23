<template>
  <b-container fluid>
    <b-row>
      <b-col class="pl-0" cols="1">
        <swatches
          v-if="edit"
          v-model="color"
          :colors="$store.getters.getColors"
          :show-fallback="
            $store.getters.getUsedColors.length >
              $store.getters.getColors.length
          "
          row-length="5"
          :exceptions="
            $store.getters.getUsedColors.filter(c => c !== annotationColor)
          "
          shapes="circles"
          exception-mode="hidden"
          popover-to="right"
        />
        <div
          v-else
          class="annotation-color-swatch"
          :style="{ backgroundColor: annotationColor }"
        />
      </b-col>
      <b-col>
        <b-card-group>
          <annotation-tile
            v-for="annotation in pointAnnotations
              .concat(rectangleAnnotations)
              .sort((a, b) => a.id - b.id)"
            :key="annotation.id"
            :annotation="annotation"
            :edit="edit"
            @select-annotation="selectAnnotation"
            @delete-annotation="deleteAnnotation"
            @update-annotation="updateAnnotation"
          />
        </b-card-group>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
/* eslint-disable vue/require-default-prop,no-console */

import Swatches from 'vue-swatches';
import BCol from 'bootstrap-vue/esm/components/layout/col';
import AnnotationTile from '@/components/discussion/annotation/AnnotationTile.vue';

export default {
  name: 'AnnotationList',
  components: {
    BCol,
    Swatches,
    AnnotationTile,
  },
  props: {
    pointAnnotations: {
      type: Array,
      default() {
        return [];
      },
    },
    rectangleAnnotations: {
      type: Array,
      default() {
        return [];
      },
    },
    annotationColor: {
      type: String,
      default() {
        return null;
      },
    },
    edit: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      color: this.annotationColor,
    };
  },
  created() {
    if (this.annotationColor) {
      this.color = this.annotationColor;
    } else {
      this.color = this.$annoml.store.getters.getFreeColor;
    }
  },
  watch: {
    color() {
      this.updateColor(this.color);
    },
  },
  methods: {
    selectAnnotation(annotation) {
      this.$emit('select-annotation', annotation);
    },
    deleteAnnotation(annotation) {
      this.$emit('delete-annotation', annotation);
    },
    updateAnnotation(annotation) {
      this.$emit('update-annotation', annotation);
    },
    updateColor(value) {
      this.$emit('update-color', value);
    },
  },
};
</script>

<style scoped>
.annotation-color-swatch {
  width: 42px;
  height: 42px;
  background-color: lightgray;
  border-radius: 50%;
}
</style>
