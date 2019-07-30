<template>
  <div class="visualization-view" ref="vis" v-if="visualization">
    <h1>{{ visualization.title }} by {{ visualization.author.username }}</h1>
    <vega-annotation-options
      :tools="tools"
      :current-tool="currentTool"
      @tool="setTool"
    />
    <div id="visualization-container">
      <vega-chart
        v-if="chart"
        :chart="chart"
        :annotations="vegaAnnotations"
        :temp-annotations="tempAnnotations"
        :tools="tools"
        @click="createAnnotation"
      />
    </div>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop,no-console,no-param-reassign,no-return-assign */

import d3annotation from 'd3-svg-annotation';
import VegaAnnotationOptions from '@/components/visualization/VegaAnnotationToolbar.vue';
import VegaChart from '@/components/visualization/VegaChart.vue';
import APIService from '@/services/APIService';

export default {
  name: 'VisualizationView',
  components: {
    VegaAnnotationOptions,
    VegaChart,
  },
  props: {
    visId: Number,
  },
  data() {
    return {
      scaleFactor: 1,
      visualization: null,
      discussion: null,
      chart: null,
      questions: null,
      annotation: null,
      currentTool: null,
      tempAnnotations: [],
      vegaAnnotations: {
        pointAnnotations: [],
        rectangleAnnotations: [],
      },
      tools: {
        noTool: {
          type: d3annotation.annotationBadge,
        },
        pointAnnotation: {
          type: d3annotation.annotationCalloutCircle,
        },
        rectangleAnnotation: {
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
        },
      },
    };
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.pointAnnotations,
      (pointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = this.$store.getters
          .currentPointAnnotations.concat(pointAnnotations);
      },
    );
    this.$store.watch(
      (state, getters) => getters.rectangleAnnotations,
      (rectangleAnnotation) => {
        this.vegaAnnotations.rectangleAnnotations = this.$store.getters
          .currentRectangleAnnotations.concat(rectangleAnnotation);
      },
    );
    this.$store.watch(
      (state, getters) => getters.currentPointAnnotations,
      (currentPointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = this.$store.getters.pointAnnotations.concat(
          currentPointAnnotations,
        );
      },
    );
    this.$store.watch(
      (state, getters) => getters.currentRectangleAnnotations,
      (currentRectangleAnnotations) => {
        this.vegaAnnotations.rectangleAnnotations = this.$store.getters
          .currentRectangleAnnotations.concat(currentRectangleAnnotations);
      },
    );
    APIService.getVisualization(this.visId).then((data) => {
      console.log(data);
      this.visualization = data;
      this.chart = data.schema.spec;
    });
  },
  watch: {},
  methods: {
    createAnnotation(item) {
      if (this.$store.getters.visualizationSelectable) {
        if (this.currentTool === this.tools.pointAnnotation) {
          this.addPointAnnotation(item);
        } else if (this.currentTool === this.tools.rectangleAnnotation) {
          if (this.tools.rectangleAnnotation.tempPoint === null) {
            this.tools.rectangleAnnotation.tempPoint = item;
            this.addTempPointAnnotation(item);
          } else if (this.tools.rectangleAnnotation.tempPoint) {
            this.addRectangleAnnotation(item);
          }
        }
      }
    },
    clearTempPoints() {
      this.tempAnnotations = [];
      this.tools.rectangleAnnotation.tempPoint = null;
    },
    addTempPointAnnotation(item) {
      const annotation = {};
      annotation.annotationType = 'TEMP';
      annotation.data = item.datum;
      annotation.subject = {
        radius: 5,
      };
      annotation.color = 'grey';
      this.tempAnnotations.push(annotation);
    },
    addPointAnnotation(item) {
      this.$store.commit('disableSelectable');
      const annotation = {};
      annotation.annotationType = 'POINT';
      annotation.id = Date.now();
      annotation.note = {
        title: 'Circle Annotation',
      };
      annotation.data = item.datum;
      if (this.$store.getters.hasCurrentPost) {
        annotation.color = this.$store.getters.getCurrentPost.color;
      } else {
        annotation.color = 'grey';
      }
      this.$store.commit('addCurrentPointAnnotation', annotation);
    },
    addRectangleAnnotation(item) {
      const startPoint = this.tools.rectangleAnnotation.tempPoint;
      const annotation = {};
      annotation.annotationType = 'RECTANGLE';
      annotation.id = Date.now();
      annotation.note = {
        title: 'Rect Annotation',
      };
      annotation.data = startPoint.datum;
      annotation.subject = {
        width: item.x - startPoint.x,
        height: item.y - startPoint.y,
      };
      if (this.$store.getters.hasCurrentPost) {
        annotation.color = this.$store.getters.getCurrentPost.color;
      } else {
        annotation.color = 'grey';
      }
      this.$store.commit('addCurrentRectangleAnnotation', annotation);
      this.clearTempPoints();
    },
    setTool(newTool) {
      this.currentTool = newTool;
    },
  },
};
</script>

<style scoped>
#visualization-container {
}
</style>
