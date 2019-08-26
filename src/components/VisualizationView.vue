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
        /><span v-if="$annomlstore.getters.debug" style="color: lightgray">
          Hash: {{ visualization.hash }}</span
        >
      </div>
      <loading v-else :message="'Loading Visualization'"></loading>
    </div>
    <p v-if="visualization.description">{{ visualization.description }}</p>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop,no-console,no-param-reassign,no-return-assign */

import d3annotation from 'd3-svg-annotation';
import JSum from 'jsum';
import VegaAnnotationOptions from '@/components/visualization/VegaAnnotationToolbar.vue';
import VegaChart from '@/components/visualization/VegaChart.vue';
import APIService from '@/service/APIService';
import utils from '@/util';
import Loading from '@/components/extra/Loading.vue';

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
          name: utils.annotation.types.POINT,
          type: d3annotation.annotationCalloutCircle,
        },
        freePointAnnotation: {
          name: utils.annotation.types.FREEPOINT,
          type: d3annotation.annotationCalloutCircle,
        },
        rectangleAnnotation: {
          name: utils.annotation.types.RECTANGLE,
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
        },
        freeRectangleAnnotation: {
          name: utils.annotation.types.FREERECTANGLE,
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
    this.$annomlstore.watch(
      (state, getters) => getters.pointAnnotations,
      (pointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = utils.annotation.concatAnnotations(
          [pointAnnotations, this.$annomlstore.getters.currentPointAnnotations],
        );
      },
    );
    this.$annomlstore.watch(
      (state, getters) => getters.rectangleAnnotations,
      (rectangleAnnotations) => {
        this.vegaAnnotations.rectangleAnnotations = utils.annotation.concatAnnotations(
          [
            rectangleAnnotations,
            this.$annomlstore.getters.currentRectangleAnnotations,
          ],
        );
      },
    );
    this.$annomlstore.watch(
      (state, getters) => getters.currentPointAnnotations,
      (currentPointAnnotations) => {
        this.vegaAnnotations.pointAnnotations = utils.annotation.concatAnnotations(
          [currentPointAnnotations, this.$annomlstore.getters.pointAnnotations],
        );
      },
    );
    this.$annomlstore.watch(
      (state, getters) => getters.currentRectangleAnnotations,
      (currentRectangleAnnotations) => {
        this.vegaAnnotations.rectangleAnnotations = utils.annotation.concatAnnotations(
          [
            currentRectangleAnnotations,
            this.$annomlstore.getters.rectangleAnnotations,
          ],
        );
      },
    );
    APIService(this.$serviceApi)
      .getVisualization(this.visualizationId)
      .then((data) => {
        this.visualization = data;
        console.log(this.visualization);
        if (this.visualization.schema) {
          this.chart = this.visualization.schema;
        } else if (this.visualization.reference) {
          APIService(this.$resourceApi)
            .getResourceVisualization(
              this.$annomlsettings.resourceProvider.endpoints.visualization,
              this.visualization.reference,
              this.$annomlsettings.resourceProvider.accessToken,
            )
            .then((visualization) => {
              this.visualization = visualization;
              this.chart = JSON.parse(visualization.schema);
            })
            .catch((error) => {
              console.log(error);
              this.resourceFailed = true;
            });
        } else {
          console.log(this.visualization.url);
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
      if (this.$annomlstore.getters.visualizationSelectable) {
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
      annotation.color = this.$annomlstore.getSelectColor;
      this.tempAnnotations.push(annotation);
    },
    addPointAnnotation(item) {
      this.$annomlstore.commit('disableSelectable');
      const annotation = {};
      annotation.annotationType = this.tools.pointAnnotation.name;
      annotation.id = Date.now();
      annotation.note = {
        title: 'Circle Annotation',
      };
      annotation.data = item.datum;
      if (this.$annomlstore.getters.hasCurrentPost) {
        annotation.color = this.$annomlstore.getters.getCurrentPost.color;
      } else {
        annotation.color = this.$annomlstore.getSelectColor;
      }
      this.$annomlstore.commit('addCurrentPointAnnotation', annotation);
    },
    addRectangleAnnotation(item) {
      const startPoint = this.tools.rectangleAnnotation.tempPoint;
      const annotation = {};
      annotation.annotationType = this.tools.rectangleAnnotation.name;
      annotation.id = Date.now();
      annotation.note = {
        title: 'Rectangle Annotation',
      };
      annotation.data = startPoint.datum;
      annotation.subject = {
        width: item.x - startPoint.x,
        height: item.y - startPoint.y,
      };
      if (this.$annomlstore.getters.hasCurrentPost) {
        annotation.color = this.$annomlstore.getters.getCurrentPost.color;
      } else {
        annotation.color = this.$annomlstore.getSelectColor;
      }
      this.$annomlstore.commit('addCurrentRectangleAnnotation', annotation);
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
