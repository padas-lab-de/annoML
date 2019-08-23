<template>
    <div>
        <span v-if="postDate">Posted on {{ postDate }}</span>
        <span v-if="username"> by {{ username }}</span>
        <span v-else>User #{{ userId }}</span>
        <span v-if="editDate"> (last edited on {{ editDate }}</span>
    </div>
</template>

<script>
/* eslint-disable no-console */

import APIService from '@/service/APIService';

export default {
  name: 'Postinfo',
  props: {
    post: {
      type: Object,
      default() {
        return null;
      },
    },
    data() {
      return {
        userId: null,
        username: null,
        postDate: null,
        editDate: null,
      };
    },
  },
  created() {
    if (this.post) {
      console.log(this.post);
      this.userId = this.post.author.externalId;
      if (this.userId) {
        this.username = this.requestUsername(this.userId);
      }
      this.postDate = this.post.date;
      if (this.post.edit) {
        this.editDate = this.post.edit;
      }
    }
  },
  methods: {
    requestUsername(userId) {
      APIService(this.$authApi).getUser(
        this.$annoml
          .store.getters.getSettings.authenticationProvider.endpoints.userInfoById, userId,
      ).then((data) => {
        console.log(data);
      });
    },
  },
};
</script>

<style scoped>

</style>
