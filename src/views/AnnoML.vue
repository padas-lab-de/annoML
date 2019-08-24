<template>
  <div class="annoml-page">
    <b-container fluid v-if="discussion">
      <b-row>
        <b-col cols="12" md="6">
          <visualization-view
            v-if="visualization"
            :visualization-id="visualization.id"
          />
        </b-col>
        <b-col cols="12" md="6">
          <discussion-view :discussion="discussion" />
        </b-col>
      </b-row>
    </b-container>
    <loading v-else :message="message" :warning="warning"></loading>
  </div>
</template>

<script>
/* eslint-disable no-console */

import VisualizationView from '@/components/VisualizationView.vue';
import APIService from '@/service/APIService';
import DiscussionView from '@/components/DiscussionView.vue';
import Loading from '@/components/discussion/util/Loading.vue';

export default {
  name: 'AnnotationPage',
  components: {
    Loading,
    DiscussionView,
    VisualizationView,
  },
  data() {
    return {
      discussion: null,
      visualization: null,
      message: 'Loading Discussion',
      warning: null,
    };
  },
  mounted() {
    APIService(this.$serviceApiAuthenticated)
      .getDiscussion(this.$route.params.id)
      .then((result) => {
        this.discussion = result;
        this.visualization = result.visualization;
      })
      .catch((message) => {
        this.warning = message;
      });
  },
};
</script>

<style lang="scss">
/* Bootstrap */
@import "../../node_modules/bootstrap/scss/bootstrap";
@import "../../node_modules/bootstrap-vue/src/index";
</style>
