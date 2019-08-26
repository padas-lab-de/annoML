<template>
    <div class="postinfo">
        <span class="username" v-if="post.author.externalId"> {{ post.author.externalId }}</span>
        <span class="username" v-else>User #{{ post.author.id }}</span>
        <span class="created" v-if="post.created"> on {{ formatTimestamp(post.created) }}</span>
        <span class="edited" v-if="checkIfIsSameDate(post.created, post.edited)">
            ({{formatEditTimestamp(post.created, post.edited)}})</span>
    </div>
</template>

<script>
/* eslint-disable no-console */

import APIService from '@/service/APIService';

export default {
  name: 'PostMeta',
  props: {
    post: {
      type: Object,
      default() {
        return null;
      },
    },

  },
  created() {

  },
  methods: {
    checkIfIsSameDate(date1, date2) {
      return date1 !== date2;
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    },
    formatEditTimestamp(created, edit) {
      const createdate = new Date(created);
      const editdate = new Date(edit);
      if (createdate.getDate() === editdate.getDate()) {
        return `last edit at ${editdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return `edited on ${editdate.toLocaleDateString()}at${editdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    },
    requestUsername(userId) {
      APIService(this.$authApi).getUser(
        this.$annomlstore.getters
          .getSettings.authenticationProvider.endpoints.userInfoById, userId,
      ).then((data) => {
        console.log(data);
      });
    },
  },
};
</script>

<style scoped>
    .username {
        font-size: larger;
        font-weight: bold;
    }

    .created, .edited {
    }

    .edited {
        font-weight: lighter;
    }

</style>
