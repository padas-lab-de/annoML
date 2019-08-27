<template>
  <div class="annoml-page">
    <b-container fluid v-if="discussion">
      <b-row>
        <b-col cols="12">
          <discussion-info
            v-bind:discussion="discussion"
            @update-discussion="updateDiscussion"
          ></discussion-info>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" md="6">
          <visualization-view :discussion="discussion" />
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
import Loading from '@/components/extra/Loading.vue';
import DiscussionInfo from '@/components/info/DiscussionInfo.vue';

export default {
  name: 'AnnotationPage',
  components: {
    DiscussionInfo,
    Loading,
    DiscussionView,
    VisualizationView,
  },
  data() {
    return {
      discussion: null,
      message: 'Loading Discussion',
      warning: null,
    };
  },
  created() {
    this.$annomlstore.commit('clearStore');
  },
  mounted() {
    APIService(this.$serviceApiAuthenticated)
      .getDiscussion(this.$route.params.id)
      .then((result) => {
        this.discussion = result;
      })
      .catch((message) => {
        this.warning = message.toString();
      });
  },
  methods: {
    updateDiscussion(discussion) {
      this.discussion = discussion;
    },
  },
};
</script>

<style lang="scss">
/* Bootstrap */
@import "../../node_modules/bootstrap/scss/bootstrap";
@import "../../node_modules/bootstrap-vue/src/index";
</style>
