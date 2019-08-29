<!--suppress ALL -->
<template>
  <div class="overview-page">
    <div class="p-2 mt-4" v-if="discussions.length > 0">
      <h2>Open one of the following discussions</h2>

      <b-card-group deck>
        <b-card v-for="discussion in discussions" :key="discussion.id">
          Discussion #{{ discussion.id }} by
          {{ discussion.author.externalId }} with
          {{ discussion.questions.length }} active question(s)
          <b-button class="float-right" @click="openDiscussion(discussion.id)"
            >Open</b-button
          >
        </b-card>
      </b-card-group>
    </div>
    <div class="p-2 mt-4" v-if="visualizations.length > 0">
      <h2>Start a discussion on one of the following visualizations</h2>
      <b-card-group deck>
        <b-card
          class="visualization-select"
          v-for="visualization in visualizations"
          :key="visualization.uid"
        >
          <h3>{{ visualization.description }}</h3>
          <div id="visualization-container" v-if="false">
            <vega-chart :chart="JSON.parse(visualization.schema)" />
          </div>

          <b-button @click="startDiscussion(visualization.uid)">
            Discuss
          </b-button>

          <b-card-group class="mt-2" deck v-if="visualization.discussions">
            <b-card
              v-for="discussion in visualization.discussions"
              :key="discussion.id"
            >
                Available discussion #{{ discussion.id }} by
              {{ discussion.author.externalId }}
              <b-button
                class="float-right"
                @click="openDiscussion(discussion.id)"
                >Open</b-button
              >
            </b-card>
          </b-card-group>
        </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-console, no-alert */

import axios from 'axios';
import VegaChart from '@/components/visualization/VegaChart.vue';
import APIService from '@/service/APIService';

export default {
  name: 'OverviewPage',
  components: {
    VegaChart,
  },
  data() {
    return {
      visualizations: [],
      discussions: [],
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
        const visualiaztion = v;
        APIService(this.$serviceApi)
          .getDiscussionsForVisualization(visualiaztion.uid)
          .then((discussions) => {
            visualiaztion.discussions = discussions;
            this.visualizations.push(v);
          })
          .catch(message => console.log(message));
      });
    });
    APIService(this.$serviceApi)
      .getRecentDiscussions(20)
      .then((discussions) => {
        this.discussions = discussions;
      })
      .catch(message => console.log(message));
  },
  methods: {
    openDiscussion(discussionId) {
      this.$router.push({
        name: 'AnnoML',
        params: {
          id: discussionId,
        },
      });
    },
    startDiscussion(visualizationId) {
      const auth = axios.create({
        baseURL: 'http://localhost:8080/api',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          Authorization: `Bearer ${this.$store.getters.getAccessToken}`,
        },
      });
      auth.get('/users/jwttoken').then((response) => {
        console.log(response.data.token);
        if (response.data.token) {
          window.localStorage.setItem('token', response.data.token);
          this.$startDiscussionWithReference(visualizationId)
            .then((discussion) => {
              this.$router.push({
                name: 'AnnoML',
                params: {
                  id: discussion,
                },
              });
            })
            .catch(message => window.alert(message));
        }
      });
    },
  },
};
</script>

<style lang="scss"></style>
