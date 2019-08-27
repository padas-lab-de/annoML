<template>
    <div class="vote pull-right btn">
            <span @click="voteUp()" v-if="edit">
                <font-awesome-icon icon="chevron-up"></font-awesome-icon>
            </span>
            <div>{{ voteCounter() }}</div>
            <span @click="voteDown()" v-if="edit">
            <font-awesome-icon icon="chevron-down">
            </font-awesome-icon>
            </span>
    </div>
</template>

<script>
/* eslint-disable no-console */

export default {
  name: 'vote',
  data() {
    return {
      votes: 0,
    };
  },
  props: {
    edit: {
      type: Boolean,
      default() {
        return false;
      },
    },
    post: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  watch: {
    post: {
      handler() {
        this.votes = this.post.upVotes.length - this.post.downVotes.length;
      },
      deep: true,
    },
  },
  created() {
    this.votes = this.post.upVotes.length - this.post.downVotes.length;
  },
  methods: {
    voteCounter() {
      if (this.votes > 0) {
        return `+${this.votes}`;
      } if (this.votes < 0) {
        return this.votes;
      }
      return '0';
    },
    voteUp() {
      this.$emit('up-vote');
    },
    voteDown() {
      this.$emit('down-vote');
    },
  },
};
</script>

<style lang="scss">
    .vote {
        display: block;
    }

    .vote span {
        color: gray;
        text-align: center;
        margin-left:auto;
        margin-right: auto;
        height: 30px;
        width: 30px;
        display: inline-block;
    }

    .vote div {
        color: black;
        text-align: center;
        margin-left:auto;
        margin-right: auto;
        height: 30px;
        width: 30px;
        display: inline-block;
    }

    .vote span:hover {
        color: black;
        transform: scale(1.2);
    }


</style>
