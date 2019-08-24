<!--suppress ALL -->
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
      visualizations: [],
    };
  },
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
      const auth = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          Authorization: `Bearer ${this.$store.getters.getAccessToken}`,
        },
      });
      auth.get('/users/jwttoken').then((response) => {
        console.log(response.data.token);
        if (response.data.token) {
          window.localStorage.setItem('token', response.data.token);
          this.$startDiscussion(
            visualizationId,
            visualizationUrl,
          ).then((discussion) => {
            this.$router.push({
              name: 'AnnoML',
              params: {
                id: discussion,
              },
            });
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
