<template>
  <div class="question-page">
    <b-container fluid>
      <b-row>
        <b-col cols="12" md="6">
          <visualization-view
            v-if="discussion"
            :visualization-id="discussion.visualization.id"
          />
        </b-col>
        <b-col cols="12" md="6">
          <discussion-view v-if="discussion" :discussion="discussion" />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
/* eslint-disable no-console */

import VisualizationView from '@/components/VisualizationView.vue';
import APIService from '@/service/APIService';
import DiscussionView from '@/components/DiscussionView.vue';

export default {
  name: 'AnnotationPage',
  components: {
    DiscussionView,
    VisualizationView,
  },
  data() {
    return {
      discussion: null,
      discussionId: 7,
    };
  },
  mounted() {
    APIService.getDiscussion(this.discussionId).then((data) => {
      console.log(data);
      this.discussion = data;
    });
  },
};
</script>


  <style lang="scss">
  /* Bootstrap */
  @import '../node_modules/bootstrap/scss/bootstrap';
  @import '../node_modules/bootstrap-vue/src/index.scss';
</style>
