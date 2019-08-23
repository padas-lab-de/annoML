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
          <b-button
            @click="startDiscussion(visualization.uid, visualization.links[0].href)"
          >
            Discuss
          </b-button>
        </b-card>
      </b-card-group>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable no-console */

import axios from 'axios';
import VegaChart from '@/components/visualization/VegaChart.vue';

export default {
  name: 'VisualizationPage',
  components: {
    VegaChart,
  },
  data() {
    return {
      visualizations: [
        {
          uid: 'fdfewklfhlkfe',
          url: 'http://localhost:3000/visualiaztions/1',
          schema:
            '{\n'
            + '  "data": {\n'
            + '    "values": [\n'
            + '      {"a": "C", "b": 2}, {"a": "C", "b": 7}, {"a": "C", "b": 4},\n'
            + '      {"a": "D", "b": 1}, {"a": "D", "b": 2}, {"a": "D", "b": 6},\n'
            + '      {"a": "E", "b": 8}, {"a": "E", "b": 4}, {"a": "E", "b": 7}\n'
            + '    ]\n'
            + '  },\n'
            + '  "mark": "bar",\n'
            + '  "encoding": {\n'
            + '    "y": {"field": "a", "type": "nominal"},\n'
            + '    "x": {\n'
            + '      "aggregate": "average", "field": "b", "type": "quantitative",\n'
            + '      "axis": {"title": "Mean of b"}\n'
            + '    }\n'
            + '  }\n'
            + '}',
        },
      ],
    };
  },
  mounted() {},
  created() {
    const provider = axios.create({
      baseURL: 'http://localhost:8080/api',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      },
    });
    provider.get('/datasets/1/visualizations').then((result) => {
      console.log(result);
      result.data.forEach((v) => {
        this.visualizations.push(v);
      });
    });
  },
  methods: {
    startDiscussion(visualizationId, visualizationUrl) {
      this.$startDiscussion(
        visualizationId,
        visualizationUrl,
        this.$annoml.store.getters.getUserId,
        this.$annoml.store.getters.getToken,
      ).then((discussion) => {
        this.$router.push({
          name: 'AnnoML',
          params: {
            id: discussion,
            username: this.$annoml.store.getters.getUsername,
            userId: this.$annoml.store.getters.getUserId,
            token: this.$annoml.store.getters.getToken,
          },
        });
      });
    },
  },
};
</script>

<style scoped></style>
