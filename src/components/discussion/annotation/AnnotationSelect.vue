<!--suppress ALL -->
<template>
  <b-container fluid>
    <b-row>
      <b-col class="pl-0" cols="1">
        <swatches
          v-if="edit"
          v-model="color"
          :colors="$annomlutils.annotation.postColors"
          :show-fallback="
            $annomlstore.getters.getUsedColors.length >
              $annomlutils.annotation.postColors.length
          "
          row-length="5"
          :exceptions="
            $annomlstore.getters.getUsedColors.filter(
              c => c !== annotationColor
            )
          "
          shapes="circles"
          exception-mode="hidden"
          popover-to="right"
        />
        <div
          v-else
          class="annotation-color-swatch"
          :class="{
            annotationsHidden: annotationsHidden
          }"
          :style="{
            backgroundColor: annotationsHidden
              ? annotationColor
              : $annomlutils.annotation.stateColor.HIDDEN
          }"
          @click="hideAllAnnotations"
        />
      </b-col>
      <b-col>
        <b-card-group>
          <annotation-tile
            v-for="annotation in annotations"
            :key="annotation.id"
            :annotation="annotation"
            :edit="edit"
            @select-annotation="selectAnnotation"
            @hide-annotation="hideAnnotation"
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
import utils from '@/util';

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
      annotations: [],
      color: this.annotationColor,
      annotationsHidden: false,
    };
  },

  created() {
    if (this.annotationColor) {
      this.color = this.annotationColor;
    } else {
      this.color = utils.annotation.getFreeColor(this.$annomlstore.getters.getUsedColors);
    }
    this.annotations = utils.annotation.concatAndSortAnnotations(
      [this.rectangleAnnotations, this.pointAnnotations],
      (a, b) => a.id - b.id,
    );
    this.annotationsHidden = this.annotations.some(
      a => a.color !== utils.annotation.stateColor.HIDDEN,
    );
  },
  watch: {
    color() {
      this.updateColor(this.color);
    },
    pointAnnotations: {
      handler() {
        this.annotations = utils.annotation.concatAndSortAnnotations(
          [this.rectangleAnnotations, this.pointAnnotations],
          (a, b) => a.id - b.id,
        );
        this.annotationsHidden = this.annotations.some(
          a => a.color !== utils.annotation.stateColor.HIDDEN,
        );
      },
      deep: true,
    },
    rectangleAnnotations: {
      handler() {
        this.annotations = utils.annotation.concatAndSortAnnotations(
          [this.rectangleAnnotations, this.pointAnnotations],
          (a, b) => a.id - b.id,
        );
        this.annotationsHidden = this.annotations.some(
          a => a.color !== utils.annotation.stateColor.HIDDEN,
        );
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    selectAnnotation(annotation) {
      this.$emit('select-annotation', annotation);
    },
    hideAnnotation(annotation) {
      this.$emit('hide-annotation', annotation);
    },
    hideAllAnnotations() {
      this.$emit('hide-all-annotations', this.annotationsHidden);
      this.annotationsHidden = !this.annotationsHidden;
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

.annotation-color-swatch:hover {
  transform: scale(0.95);
}
</style>
