<template>
  <div class="visualization-view mt-4" ref="vis" v-if="visualization">
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
          Hash: {{ discussion.visualizationHash }}</span
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
    discussion: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
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
          disabled: false,
        },
        pointAnnotation: {
          name: utils.annotation.types.POINT,
          type: d3annotation.annotationCalloutCircle,
          disabled: false,
        },
        freePointAnnotation: {
          name: utils.annotation.types.FREEPOINT,
          type: d3annotation.annotationCalloutCircle,
          disabled: true,
        },
        rectangleAnnotation: {
          name: utils.annotation.types.RECTANGLE,
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
          disabled: false,
        },
        freeRectangleAnnotation: {
          name: utils.annotation.types.FREERECTANGLE,
          type: d3annotation.annotationCalloutRect,
          tempPoint: null,
          disabled: true,
        },
      },
      visualizationFailed: false,
      resourceFailed: false,
      modifiedWarning: false,
    };
  },
  created() {
    APIService(this.$serviceApi)
      .getVisualization(this.discussion.visualization.id)
      .then((data) => {
        this.visualization = data;
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
  },
  watch: {
    chart() {
      if (this.chart) {
        if (this.discussion.visualizationHash) {
          const hash = JSum.digest(this.chart, 'SHA256', 'hex');
          if (hash !== this.discussion.visualizationHash) {
            this.modifiedWarning = true;
          }
        } else if (
          this.$annomlsettings.currentUser === this.discussion.author.externalId
        ) {
          this.discussion.visualizationHash = JSum.digest(this.chart, 'SHA256', 'hex');
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
      if (item.datum) {
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
      annotation.color = utils.annotation.stateColor.SELECTED;
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
      annotation.subject = {
        radius: 8,
      };
      annotation.data = item.datum;
      if (this.$annomlstore.getters.hasCurrentPost) {
        annotation.color = this.$annomlstore.getters.getCurrentPost.color;
      } else {
        annotation.color = utils.annotation.stateColor.SELECTED;
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
      annotation.data = {
        p1: startPoint.datum,
        p2: item.datum,
      };
      annotation.subject = {
        width: item.x - startPoint.x,
        height: item.y - startPoint.y,
      };
      if (this.$annomlstore.getters.hasCurrentPost) {
        annotation.color = this.$annomlstore.getters.getCurrentPost.color;
      } else {
        annotation.color = utils.annotation.stateColor.SELECTED;
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
