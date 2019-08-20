<template>
    <div class="vote pull-right btn">
            <span @click="voteUp()" >
                <i class="fa fa-chevron-up" aria-hidden="true"></i>
            </span>
            <span >{{ voteCounter() }}</span>
            <span @click="voteDown()" >
            <i class="fa fa-chevron-down" aria-hidden="true">
            </i>
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
      console.log('up');
      this.votes = this.votes + 1;
    },
    voteDown() {
      console.log('down');
      this.votes = this.votes - 1;
    },
  },
};
</script>

<style scoped>
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

    .vote i:hover {
        color: black;
        transform: scale(1.2);
    }


</style>
