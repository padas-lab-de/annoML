<!--suppress ALL -->
<template>
  <b-container fluid>
    <b-row>
      <b-col class="pl-0" cols="1">
        <swatches
          v-if="edit"
          v-model="color"
          class="vue-swatches"
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
import AnnotationTile from './AnnotationTile.vue';
import utils from '../../../util';

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
      this.color = utils.annotation.getFreeColor(
        this.$annomlstore.getters.getUsedColors,
      );
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

<style>
.annotation-color-swatch {
  width: 42px;
  height: 42px;
  background-color: lightgray;
  border-radius: 50%;
}

.annotation-color-swatch:hover {
  transform: scale(0.95);
}

/* Style of vue-swatches */
fieldset[disabled] .vue-swatches {
  pointer-events: none;
}
.vue-swatches {
  position: relative;
  outline: none;
}
.vue-swatches__trigger {
  display: inline-block;
  cursor: pointer;
}
.vue-swatches__trigger.vue-swatches--is-empty {
  border: 2px solid #ccc;
}
.vue-swatches__trigger.vue-swatches--is-disabled {
  cursor: not-allowed;
}
.vue-swatches__container {
  box-sizing: content-box;
  padding: 5px;
}
.vue-swatches__container:not(.vue-swatches--inline) {
  position: absolute;
  display: block;
  overflow: auto;
  border-radius: 5px;
  box-shadow: 0 2px 3px hsla(0, 0%, 4%, 0.2), 0 0 0 1px hsla(0, 0%, 4%, 0.2);
  z-index: 50;
}
.vue-swatches__wrapper {
  background-color: inherit;
}
.vue-swatches__row {
  font-size: 0;
}
.vue-swatches__fallback__wrapper {
  display: table;
}
.vue-swatches__fallback__input--wrapper {
  display: table-cell;
  padding-right: 10px;
  width: 100%;
  font-size: 14px;
}
.vue-swatches__fallback__input {
  width: 100%;
  padding-top: 6px;
  padding-bottom: 6px;
  border-radius: 5px;
  border: 1px solid #dcdcdc;
  color: #35495e;
  background: #fff;
}
.vue-swatches__fallback__button {
  display: table-cell;
  padding: 6px 15px;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  color: #fff;
  background-color: #3571c8;
  border-radius: 5px;
}
.vue-swatches-show-hide-enter-active,
.vue-swatches-show-hide-leave-active {
  transition: all 0.3s ease;
}
.vue-swatches-show-hide-enter,
.vue-swatches-show-hide-leave-active {
  opacity: 0;
}
.vue-swatches--has-children-centered {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: center;
  justify-content: center;
}
.vue-swatches__diagonal--wrapper {
  width: 100%;
  height: 100%;
}
.vue-swatches__diagonal {
  width: 75%;
  height: 75%;
  background: linear-gradient(
    to top right,
    transparent 0,
    transparent calc(50% - 2.4px),
    #de080a 50%,
    transparent calc(50% + 2.4px),
    transparent
  );
}
.vue-swatches__swatch {
  position: relative;
  font-size: 0;
}
.vue-swatches__swatch:focus,
.vue-swatches__swatch:hover {
  opacity: 0.9;
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.75);
  outline: none;
}
.vue-swatches__swatch.vue-swatches__swatch--border,
.vue-swatches__swatch.vue-swatches__swatch--selected {
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.75);
}
.vue-swatches__swatch .vue-swatches__diagonal--wrapper {
  position: absolute;
}
.vue-swatches__check__wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
}
.vue-swatches__check__circle {
  width: 21px;
  height: 21px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.15);
}
.vue-swatches__check__path {
  fill: #fff;
}
</style>
