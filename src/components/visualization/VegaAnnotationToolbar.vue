<template>
  <div>
    <b-button-toolbar class="mb-2">
      <b-button-group class="annotation-tools">
        <b-button
          @click="selectNoTool"
          :disabled="!$annomlstore.getters.visualizationSelectable"
          :pressed="currentTool === tools.noTool"
          ><font-awesome-icon icon="hand-paper"
        /></b-button>
        <b-button
          @click="selectPointAnnotation"
          :disabled="
            !$annomlstore.getters.visualizationSelectable ||
              !$annomlstore.getters.showPointAnnotations
          "
          :pressed="currentTool === tools.pointAnnotation"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="bullseye" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-6 down-6 right-6"
              :style="{ color: 'gray' }"
            />
            <font-awesome-icon
              icon="database"
              transform="shrink-5 down-6 right-6"
            />
          </font-awesome-layers>
          Point</b-button
        >
        <b-button
          @click="selectFreePointAnnotation"
          :disabled="
            !$annomlstore.getters.visualizationSelectable ||
              !$annomlstore.getters.showFreePointAnnotations
          "
          :pressed="currentTool === tools.freePointAnnotation"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="bullseye" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-9 down-7 right-7"
              :style="{ color: 'black' }"
            />
            <font-awesome-icon
              icon="hand-pointer"
              transform="shrink-4 down-5 right-6"
            />
          </font-awesome-layers>
          Free Point</b-button
        >
        <b-button
          @click="selectRectangleAnnotation"
          :disabled="
            !$annomlstore.getters.visualizationSelectable ||
              !$annomlstore.getters.showRectangleAnnotations
          "
          :pressed="currentTool === tools.rectangleAnnotation"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="vector-square" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-6 down-6 right-6"
              :style="{ color: 'gray' }"
            />
            <font-awesome-icon
              icon="database"
              transform="shrink-5 down-6 right-6"
            />
          </font-awesome-layers>
          Rectangle</b-button
        >
        <b-button
          @click="selectFreeRectangleAnnotation"
          :disabled="
            !$annomlstore.getters.visualizationSelectable ||
              !$annomlstore.getters.showFreeRectangleAnnotations
          "
          :pressed="currentTool === tools.freeRectangleAnnotation"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="vector-square" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-9 down-6 right-7"
              :style="{ color: 'black' }"
            />
            <font-awesome-icon
              icon="hand-pointer"
              transform="shrink-4 down-4 right-6"
            />
          </font-awesome-layers>
          Free Rectangle</b-button
        >
      </b-button-group>
      <b-dropdown right class="mx-1 " text="Annotations">
        <b-dropdown-item
          :active="$annomlstore.getters.showPointAnnotations"
          @click="$annomlstore.commit('toggleShowPointAnnotations')"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="bullseye" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-6 down-6 right-6"
              :style="{ color: 'gray' }"
            />
            <font-awesome-icon
              icon="database"
              transform="shrink-5 down-6 right-6"
            />
          </font-awesome-layers>
          Point Annotations</b-dropdown-item
        >
        <b-dropdown-item
          :active="$annomlstore.getters.showFreePointAnnotations"
          @click="$annomlstore.commit('toggleShowFreePointAnnotations')"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="bullseye" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-9 down-7 right-7"
              :style="{ color: 'black' }"
            />
            <font-awesome-icon
              icon="hand-pointer"
              transform="shrink-4 down-5 right-6"
            />
          </font-awesome-layers>
          Free Point Annotations</b-dropdown-item
        >
        <b-dropdown-item
          :active="$annomlstore.getters.showRectangleAnnotations"
          @click="$annomlstore.commit('toggleShowRectangleAnnotations')"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="vector-square" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-6 down-6 right-6"
              :style="{ color: 'gray' }"
            />
            <font-awesome-icon
              icon="database"
              transform="shrink-5 down-6 right-6"
            />
          </font-awesome-layers>
          Rectangle Annotations</b-dropdown-item
        >
        <b-dropdown-item
          :active="$annomlstore.getters.showFreeRectangleAnnotations"
          @click="$annomlstore.commit('toggleShowFreeRectangleAnnotations')"
          ><font-awesome-layers class="mr-1">
            <font-awesome-icon icon="vector-square" />
            <font-awesome-icon
              icon="circle"
              transform="shrink-9 down-6 right-7"
              :style="{ color: 'black' }"
            />
            <font-awesome-icon
              icon="hand-pointer"
              transform="shrink-4 down-4 right-6"
            />
          </font-awesome-layers>
          Free Rectangle Annotations</b-dropdown-item
        >
      </b-dropdown>
      <b-dropdown right class="mx-1 " text="Options">
        <b-dropdown-item
          :active="$annomlstore.getters.visualizationFit"
          @click="$annomlstore.commit('toggleVisualizationFit')"
          ><font-awesome-icon icon="expand-arrows-alt" /> Fit
          Chat</b-dropdown-item
        >
        <b-dropdown-divider />
        <b-dropdown-item @click="downloadSVG"
          ><font-awesome-icon icon="download" /> Download SVG
        </b-dropdown-item>
      </b-dropdown>
    </b-button-toolbar>
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
    selectFreePointAnnotation() {
      this.setTool(this.tools.freePointAnnotation);
    },
    selectRectangleAnnotation() {
      this.setTool(this.tools.rectangleAnnotation);
    },
    selectFreeRectangleAnnotation() {
      this.setTool(this.tools.freeRectangleAnnotation);
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
