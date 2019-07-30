<template>
  <div>
    <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu">
      <b-button-group class="annotation-tools">
        <b-button @click="selectNoTool" :disabled="currentTool === tools.noTool"
          ><i class="fa fa-hand-stop-o"
        /></b-button>
        <b-button
          @click="selectPointAnnotation"
          :disabled="currentTool === tools.pointAnnotation"
          ><i class="fa fa-dot-circle-o" /> Point</b-button
        >
        <b-button
          @click="selectRectangleAnnotation"
          :disabled="currentTool === tools.rectangleAnnotation"
          ><i class="fa fa-object-ungroup" /> Rectangle</b-button
        >
      </b-button-group>

      <b-dropdown right class="mx-1 " text="Options">
        <b-dropdown-item
          :active="$store.getters.visualizationFit"
          @click="$store.commit('toggleVisualizationFit')"
          >Fit Chat</b-dropdown-item
        >
        <b-dropdown-divider />
        <b-dropdown-item @click="downloadSVG">Download SVG </b-dropdown-item>
      </b-dropdown>
    </b-button-toolbar>
    <div
      class="float-right status-tile selectable"
      v-if="$store.getters.visualizationSelectable"
    >
      Selectable
    </div>
    <div class="float-right status-tile" v-else>Selectable</div>
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop,no-console */
import * as d3 from 'd3';
import { saveAs } from 'file-saver';

export default {
  name: 'VegaAnnotationToolbar',
  props: {
    tools: Object,
    currentTool: Object,
  },
  data() {
    return {};
  },
  created() {
    this.setTool(this.tools.pointAnnotation);
  },
  methods: {
    selectNoTool() {
      this.setTool(this.tools.noTool); // todo look at -> bootstrap-vue Button style radios
    },
    selectPointAnnotation() {
      this.setTool(this.tools.pointAnnotation);
    },
    selectRectangleAnnotation() {
      this.setTool(this.tools.rectangleAnnotation);
    },
    setTool(tool) {
      this.$emit('tool', tool);
    },
    downloadSVG() {
      const svgEl = d3
        .select('svg')
        .attr('title', 'chart')
        .attr('version', 1.1)
        .attr('xmlns', 'http://www.w3.org/2000/svg')
        .node().parentNode.innerHTML;
      const svgBlob = new Blob([svgEl], { type: 'image/svg+xml' });
      saveAs(svgBlob, 'chart.svg', { autoBom: true });
    },
  },
};
</script>

<style scoped>
.status-tile {
  display: block;
  border-radius: 20px;
  padding: 5px;
  border: 2px solid gray;
  color: gray;
}

.selectable {
  border: 2px solid green;
  color: green;
}
</style>
