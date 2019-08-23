<template>
  <div class="visualization-view mt-3" ref="vis" v-if="visualization">
    <div class="visualization">
      <vega-annotation-options
        :tools="tools"
        :current-tool="currentTool"
        @tool="setTool"
      />
      <b-alert :show="visualizationFailed" variant="danger">
        Loading visualization failed!
      </b-alert>
      <b-alert :show="resourceFailed" variant="warning">
        Visualization cannot been loaded!
      </b-alert>
      <b-alert :show="modifiedWarning" dismissible variant="info">
        Visualization was modified by resource owner!
      </b-alert>
      <div id="visualization-container" v-if="chart">
        <vega-chart
          :visualiazion-id="visualization.id"
          :chart="chart"
          :annotations="vegaAnnotations"
          :temp-annotations="tempAnnotations"
          :tools="tools"
          @click="createAnnotation"
        /><span v-if="$store.getters.debug" style="color: lightgray">
          Hash: {{ visualization.hash }}</span>
      </div>
      <loading v-else :message="'Loading Visualization'"></loading>
    </div>
    <p v-if="visualization.description">{{visualization.description}}</p>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop,no-console,no-param-reassign,no-return-assign */

import d3annotation from 'd3-svg-annotation';
import JSum from 'jsum';
import VegaAnnotationOptions from '@/components/visualization/VegaAnnotationToolbar.vue';
import VegaChart from '@/components/visualization/VegaChart.vue';
import APIService from '@/service/APIService';
import Loading from '@/components/discussion/util/Loading.vue';

export default {
  name: 'VisualizationView',
  components: {
    Loading,
    VegaAnnotationOptions,
    VegaChart,
  },
  props: {
    visualizationId: {
      type: Number,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      scaleFactor: 1,
      discussion: null,
      visualization: null,
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
          name: 'POINT',
          type: d3annotation.annotationCalloutCircle,
        },
        freePointAnnotation: {
          name: 'FREEPOINT',
          type: d3annotation.annotationCalloutCircle,
        },
        rectangleAnnotation: {
          name: 'RECTANGLE',
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
        },
        freeRectangleAnnotation: {
          name: 'FREERECTANGEL',
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
        },
      },
      visualizationFailed: false,
      resourceFailed: false,
      modifiedWarning: false,
    };
  },
  mounted() {
    this.$annoml.store.watch(
      (state, getters) => getters.pointAnnotations,
      (pointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = this.$annoml.store
          .getters.currentPointAnnotations.concat(pointAnnotations);
      },
    );
    this.$annoml.store.watch(
      (state, getters) => getters.rectangleAnnotations,
      (rectangleAnnotation) => {
        this.vegaAnnotations.rectangleAnnotations = this.$annoml.store.getters
          .currentRectangleAnnotations.concat(rectangleAnnotation);
      },
    );
    this.$annoml.store.watch(
      (state, getters) => getters.currentPointAnnotations,
      (currentPointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = this.$annoml
          .store.getters.pointAnnotations.concat(currentPointAnnotations);
      },
    );
    this.$annoml.store.watch(
      (state, getters) => getters.currentRectangleAnnotations,
      (currentRectangleAnnotations) => {
        this.vegaAnnotations.rectangleAnnotations = this.$annoml.store.getters
          .currentRectangleAnnotations.concat(currentRectangleAnnotations);
      },
    );
    APIService(this.$serviceApi)
      .getVisualization(this.visualizationId)
      .then((data) => {
        this.visualization = data;
        if (this.visualization.schema) {
          this.chart = this.visualization.schema;
        } else if (this.visualization.visualizationUrl) {
          console.log(this.visualization.visualizationUrl);
          APIService(this.$serviceApi)
            .getExternalVisualization(this.visualization.visualizationUrl,
              'f71e164e-34df-4631-b5ea-1eee122164c4')
            .then((visualization) => {
              this.visualization = visualization;
              this.chart = JSON.parse(visualization.schema);
            })
            .catch((error) => {
              console.log(error);
              this.resourceFailed = true;
            });
        }
      })
      .catch((error) => {
        console.log(error);
        this.visualizationFailed = false;
      });
  },
  watch: {
    chart() {
      if (this.chart) {
        if (this.visualization.hash) {
          const hash = JSum.digest(this.chart, 'SHA256', 'hex');
          if (hash !== this.visualization.hash) {
            this.modifiedWarning = true;
          }
        } else {
          this.visualization.hash = JSum.digest(this.chart, 'SHA256', 'hex');
          this.modifiedWarning = false;
        }
      }
    },
  },
  methods: {
    /**
     * Annotation creation
     */
    createAnnotation(item) {
      if (this.$annoml.store.getters.visualizationSelectable) {
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
      this.$annoml.store.commit('disableSelectable');
      const annotation = {};
      annotation.annotationType = this.tools.pointAnnotation.name;
      annotation.id = Date.now();
      annotation.note = {
        title: 'Circle Annotation',
      };
      annotation.data = item.datum;
      if (this.$annoml.store.getters.hasCurrentPost) {
        annotation.color = this.$annoml.store.getters.getCurrentPost.color;
      } else {
        annotation.color = 'grey';
      }
      this.$annoml.store.commit('addCurrentPointAnnotation', annotation);
    },
    addRectangleAnnotation(item) {
      const startPoint = this.tools.rectangleAnnotation.tempPoint;
      const annotation = {};
      annotation.annotationType = this.tools.rectangleAnnotation.name;
      annotation.id = Date.now();
      annotation.note = {
        title: 'Rect Annotation',
      };
      annotation.data = startPoint.datum;
      annotation.subject = {
        width: item.x - startPoint.x,
        height: item.y - startPoint.y,
      };
      if (this.$annoml.store.getters.hasCurrentPost) {
        annotation.color = this.$annoml.store.getters.getCurrentPost.color;
      } else {
        annotation.color = 'grey';
      }
      this.$annoml.store.commit('addCurrentRectangleAnnotation', annotation);
      this.clearTempPoints();
    },
    setTool(newTool) {
      this.currentTool = newTool;
    },
    /**
     * Visualization Management
     */
  },
};
</script>

<style scoped>
#visualization-container {
}
</style>
