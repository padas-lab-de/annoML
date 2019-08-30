<template>
  <b-card class="discussion-info mt-2 ">
    <b-container fluid>
      <b-row>
        <b-col cols="2">
          <div class="discussion-meta align-top">
            Created by
            <span class="username" v-if="discussion.author.externalId">
              {{ discussion.author.externalId }}</span
            >
            <span class="username" v-else
              >User #{{ discussion.author.id }}</span
            >
            <span class="created" v-if="discussion.created">
              on {{ formatTimestamp(discussion.created) }}</span
            >
            <span
              class="edited"
              v-if="checkIfIsSameDate(discussion.created, discussion.edited)"
            >
              ({{ formatEditTimestamp(discussion.created, discussion.edited) }})
            </span>
          </div>
        </b-col>
        <b-col cols="8">
          <div class="discussion-title">
            <input
              v-if="
                $annomlsettings.currentUser === discussion.author.externalId
              "
              v-model.trim="title"
              placeholder="Enter a discussion title"
              required
            />
            <span v-else>{{ discussion.title }}</span>
          </div>
        </b-col>
        <b-col cols="2">
          <div
            class="float-right mt-1"
            v-if="$annomlsettings.currentUser === discussion.author.externalId"
          >
            <b-button
              v-if="!discussion.published"
              :disabled="preventSubmit"
              @click="updateDiscussion"
              id="publish"
              variant="success"
              >Publish</b-button
            >
            <b-button
              v-else
              variant="primary"
              @click="updateDiscussion"
              :disabled="preventSubmit"
              >Save</b-button
            >
            <b-button class="ml-2" variant="danger" @click="deleteDiscussion"
              >Delete</b-button
            >
            <b-popover
              v-if="!discussion.published"
              target="publish"
              placement="bottom"
              :show="showPublish"
              title="Please enter a title and publish!"
              content="Otherwise all changes get lost after leaving this page"
              triggers="none"
              :delay="{ show: 100 }"
            ></b-popover></div
        ></b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
/* eslint-disable no-console */

import APIService from '../../service/APIService';

export default {
  name: 'DiscussionInfo',
  props: {
    discussion: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      showPublish: true,
      title: '',
      preventSubmit: true,
    };
  },
  watch: {
    discussion() {
      if (this.discussion.title) {
        this.title = this.discussion.title;
        this.preventSubmit = true;
      }
      this.showPublish = !this.discussion.published;
    },
    title: {
      handler() {
        this.preventSubmit = !(
          this.title !== this.discussion.title && this.title !== ''
        );
      },
    },
  },
  created() {
    if (this.discussion.title) {
      this.title = this.discussion.title;
      this.preventSubmit = true;
    }
    this.showPublish = !this.discussion.published;
  },
  methods: {
    checkIfIsSameDate(date1, date2) {
      return date1 !== date2;
    },
    formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()}`;
    },
    formatEditTimestamp(created, edit) {
      const createDate = new Date(created);
      const editDate = new Date(edit);
      if (createDate.getDate() === editDate.getDate()) {
        return `last activity at ${editDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`;
      }
      return `last activity on ${editDate.toLocaleDateString()}at${editDate.toLocaleTimeString(
        [],
        {
          hour: '2-digit',
          minute: '2-digit',
        },
      )}`;
    },
    requestUsername(userId) {
      APIService(this.$authApi)
        .getUser(
          this.$annomlstore.getters.getSettings.authenticationProvider.endpoints
            .userInfoById,
          userId,
        )
        .then((data) => {
          console.log(data);
        });
    },
    updateDiscussion() {
      if (this.discussion.title !== '') {
        APIService(this.$serviceApiAuthenticated)
          .updateDiscussion(
            this.discussion.id,
            this.discussion.visualizationHash,
            this.title,
          )
          .then((discussion) => {
            this.$emit('update-discussion', discussion);
          })
          .catch(message => console.log(message));
      }
    },
    deleteDiscussion() {
      APIService(this.$serviceApiAuthenticated)
        .deleteDiscussion(this.discussion.id)
        .then(() => {
          this.$router.back();
        })
        .catch(message => console.log(message));
    },
  },
};
</script>

<style scoped lang="scss">
.card-body {
}
.discussion-title {
  font-size: 2rem;
  width: 100%;
}
.discussion-title input {
  border: none;
  width: 100%;
}

.discussion-title input:focus {
  outline: none;
}

.discussion-meta {
}

.discussion-meta .username {
  font-size: larger;
  font-weight: bold;
}

.discussion-meta .created,
.edited {
}

.discussion-meta .edited {
  font-weight: lighter;
  display: block;
}
</style>
