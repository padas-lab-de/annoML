<!--suppress ALL -->
<template>
  <div ref="chart" />
</template>

<script>
/* eslint-disable no-console  */

import VegaEmbed from 'vega-embed';
import * as d3 from 'd3';
import * as d3annotation from 'd3-svg-annotation';
import lodash from 'lodash';

export default {
  name: 'VegaChart',
  props: {
    visualiazionId: {
      type: Number,
      default() {
        return 0;
      },
    },
    chart: {
      type: Object,
      default() {
        return null;
      },
    },
    annotations: {
      type: Object,
      default() {
        return null;
      },
    },
    tempAnnotations: {
      type: Array,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      view: null,
      hideAnnotations: false,
      svgAnnotations: {
        tempAnnotations: null,
        pointAnnotations: null,
        rectangleAnnotations: null,
      },
      doubleClickTime: 0,
      doubleClickThreshold: 400,
      options: {
        logLevel: 'debug',
        renderer: 'svg',
        actions: false, // set true to show vega-embed options
      },
      defaultWidth: 600,
      defaultHeight: 600,
      size: {},
      annotationOptions: {
        timeFormat: d3.timeFormat('%d-%b-%y'),
        annotationSize: 2,
        editMode: false,
        hideOtherAnnotations: true,
      },
    };
  },
  watch: {
    view(newView, oldView) {
      if (this.view) {
        if (oldView) {
          this.unbindEvents(oldView);
        }
        if (newView) {
          this.bindEvents(newView);
        }
      }
    },
    chart: {
      handler() {
        if (this.chart) {
          this.updateChart();
        }
      },
    },
    annotations: {
      handler() {
        this.drawAnnotations();
      },
      deep: true,
    },
    tempAnnotations: {
      handler() {
        this.drawAnnotations();
      },
      deep: true,
    },
  },
  mounted() {
    this.$store.watch(
      (state, getters) => getters.showPointAnnotations,
      () => this.drawAnnotations(),
    );
    this.$store.watch(
      (state, getters) => getters.showFreePointAnnotations,
      () => this.drawAnnotations(),
    );
    this.$store.watch(
      (state, getters) => getters.showRectangleAnnotations,
      () => this.drawAnnotations(),
    );
    this.$store.watch(
      (state, getters) => getters.showFreeRectangleAnnotations,
      () => this.drawAnnotations(),
    );
    this.$store.watch(
      (state, getters) => getters.visualizationFit,
      (fit) => {
        if (fit) {
          this.createChart();
        } else {
          this.chart.width = this.defaultWidth;
          this.chart.height = this.defaultHeight;
          this.updateChart();
        }
      },
    );
    this.createChart();
    window.addEventListener('resize', () => {
      console.log('resize');
      setTimeout(this.resize(), 300); /* Chrome dimensions update delay */ // todo debounce()
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {});
    this.unbindEvents();
    this.view.finalize();
  },
  methods: {
    createChart() {
      this.setDefaultSize(this.chart);
      const size = this.calculateVisualizationSize();
      this.chart.width = size.width - 90; // Bootstrap sizing issue
      this.chart.height = size.height;
      const self = this;
      VegaEmbed(this.$refs.chart, this.chart, this.options).then((result) => {
        self.view = result.view;
        this.drawAnnotations();
        const containerEl = document.getElementById('visualization-container');
        self.size.widthOffset = containerEl.clientWidth - self.view.width();
        self.size.heightOffset = containerEl.clientHeight - self.view.height();
      });
    },
    updateChart() {
      console.log('update');
      // Removes the added padding from the container dimensions added by vega-embed
      this.view.width(this.chart.width);
      this.view.height(this.chart.height);
      this.view.runAsync().then(() => {
        this.drawAnnotations();
      });
    },
    /**
     * Event Handling
     */
    bindEvents(view) {
      view.addEventListener('click', this.clickHandler);
      view.addEventListener('wheel', () => {
        if (!this.hideAnnotations) {
          this.hideAnnotations = true;
          this.removeAnnotations();
        } else {
          this.redrawAnnoations(this);
        }
      });
      view.addEventListener('mousedown', () => {
        this.removeAnnotations();
      });
      view.addEventListener('mouseup', () => {
        this.drawAnnotations();
      });
    },
    unbindEvents(view) {
      view.removeEventListener('click');
    },
    clickHandler(event, item) {
      if (item.datum) {
        this.$emit('click', item);
      }
    },
    redrawAnnoations: lodash.debounce((self) => {
      this.hideAnnotations = false;
      self.drawAnnotations();
    }, 100),
    /**
     * Annotations
     */
    drawAnnotations() {
      const svg = d3.select(this.$refs.chart.getElementsByTagName('svg')[0]);
      // CLEAR OLD ANNOTATIONS
      this.removeAnnotations();

      // TEMP ANNOTATIONS
      if (this.tempAnnotations.length > 0) {
        console.log(this.tempAnnotations);
        this.svgAnnotations.tempAnnotations = this.makeAnnotations(
          this.tempAnnotations,
          d3annotation.annotationBadge,
        );
        svg
          .append('g')
          .attr('class', 'annotation-group-temp')
          .call(this.svgAnnotations.tempAnnotations);
      }
      if (
        !this.annotationOptions.hideOtherAnnotations
        || this.tempAnnotations.length <= 0
      ) {
        // POINT ANNOTATIONS
        if (
          this.annotations.pointAnnotations.length > 0
          && this.$store.getters.showPointAnnotations) {
          this.svgAnnotations.pointAnnotations = this.makeAnnotations(
            this.annotations.pointAnnotations,
            d3annotation.annotationCalloutCircle,
          );
          svg
            .append('g')
            .attr('class', 'annotation-group-points')
            .call(this.svgAnnotations.pointAnnotations);
        }
        // RECTANGLE ANNOTATIONS
        if (
          this.annotations.rectangleAnnotations.length > 0
          && this.$store.getters.showRectangleAnnotations) {
          this.svgAnnotations.rectangleAnnotations = this.makeAnnotations(
            this.annotations.rectangleAnnotations,
            d3annotation.annotationCalloutRect,
          );
          svg
            .append('g')
            .attr('class', 'annotation-group-rectangles')
            .call(this.svgAnnotations.rectangleAnnotations);
        }
      }

      /* FIX for missing check for item.mark.marktype in vega event-extend.js */
      d3.selectAll('.annotations').each((items) => {
        items.annotations.forEach((i) => {
          const item = i;
          item.mark = {
            marktype: null,
          };
        });
      });
    },
    makeAnnotations(annotations, annotationType) {
      const x = this.view.scale('x');
      const y = this.view.scale('y');

      return d3annotation
        .annotation()
        .editMode(this.annotationOptions.editMode)
        .type(annotationType)
        .accessors({
          // because of d3 and vega difference in padding measurement
          // see https://vega.github.io/vega/docs/api/view/
          x: d => x(d[this.chart.encoding.x.field])
            + this.view.origin()[0]
            + this.view.padding().left,
          y: d => y(d[this.chart.encoding.y.field])
            + this.view.origin()[1]
            + this.view.padding().top,
        })
        .annotations(annotations);
    },
    removeAnnotations() {
      d3.selectAll('.annotation-group-temp').remove();
      d3.selectAll('.annotation-group-points').remove();
      d3.selectAll('.annotation-group-rectangles').remove();
    },
    /**
     * HELPER FUNCTIONS
     */
    setDefaultSize(spec) {
      if (spec.width) {
        this.defaultWidth = spec.width;
      } else if (spec.config.view.width) {
        this.defaultWidth = spec.config.view.width;
      } else {
        console.log('SIZE: using deafault width');
      }
      if (spec.height) {
        this.defaultHeight = spec.height;
      } else if (spec.config.view.height) {
        this.defaultHeight = spec.config.view.height;
      } else {
        console.log('SIZE: using deafault height');
      }
    },

    getContainerSize() {
      const container = document.getElementById('visualization-container');
      const width = container.clientWidth;
      let height = container.innerHeight;

      if (container.innerHeight > window.innerHeight) {
        height = window.innerHeight - 200;
      }
      return {
        width,
        height,
      };
    },
    calculateVisualizationSize() {
      const containerWidth = this.getContainerSize().width;
      const containerHeight = this.getContainerSize().height;
      let width = this.defaultWidth;
      let height = this.defaultHeight;

      let scaleFactor = 1;

      if (this.$store.getters.visualizationFit) {
        let scaleFactorWidth = 1;
        if (containerWidth > 0) {
          scaleFactorWidth = containerWidth / width;
        }
        let scaleFactorHeight = 1;
        if (containerHeight > 0) {
          scaleFactorHeight = containerHeight / height;
        }
        scaleFactor = scaleFactorHeight > scaleFactorWidth
          ? scaleFactorHeight
          : scaleFactorWidth;
      } else {
        if (width > containerWidth && containerWidth > 0) {
          scaleFactor = containerWidth / width;
        }
        if (height > containerHeight && containerHeight > 0) {
          scaleFactor = containerHeight / height;
        }
      }
      if (scaleFactor !== 1) {
        width = Math.floor(width * scaleFactor);
        height = Math.floor(height * scaleFactor);
      }
      return {
        width,
        height,
        scaleFactor,
      };
    },
    resize() {
      // Removes the added padding from the container dimensions added by vega-embed
      const newSize = this.calculateVisualizationSize();
      if (
        newSize.width.valueOf() !== this.chart.width.valueOf()
        || newSize.height.valueOf() !== this.chart.height.valueOf()
      ) {
        if (this.size.widthOffset && this.$store.visualizationFit) {
          this.chart.width = newSize.width - this.size.widthOffset;
        } else {
          this.chart.width = newSize.width;
        }
        if (this.size.heightOffset && this.$store.visualizationFit) {
          this.chart.height = newSize.height - this.size.heightOffset;
        } else {
          this.chart.height = newSize.height;
        }
        this.updateChart();
      }
    },
  },
};
</script>

<style scoped>
#vis {
  width: 100%;
}
</style>
