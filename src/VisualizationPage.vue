<template>
  <div class="visualization-page">
    <b-container fluid>
      <h2>Start a discussion on one of the following visualizations</h2>
      <b-card-group deck>
        <b-card
          class="visualization-select"
          v-for="visualization in visualizations"
          :key="visualization.uid"
        >
          <h3>{{ visualization.description }}</h3>
          <div id="visualization-container">
            <vega-chart :chart="JSON.parse(visualization.schema)" />
          </div>
          <b-button @click="startDiscussion(visualization.uid)">
            Discuss
          </b-button>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
import APIService from '@/services/APIService';
import VegaChart from '@/components/visualization/VegaChart.vue';

export default {
  name: 'VisualizationPage',
  components: {
    VegaChart,
  },
  data() {
    return {
      visualizations: [],
      id: this.$route.params.dataset_id,
    };
  },
  mounted() {},
  created() {
    APIService.getDatasetVisualizations(this.id).then((response) => {
      this.visualizations = response;
    });
  },
  methods: {
    startDiscussion() {},
  },
};
</script>

<style scoped></style>
