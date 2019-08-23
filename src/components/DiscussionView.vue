<template>
  <div class="discussion">
    <question
      v-for="question in questions.filter(q => q !== currentEdit)"
      :key="question.id"
      :question="question"
      @edit-question="editQuestion"
    />
    <question-editor
      v-if="currentEdit"
      :question="$annomlstore.getters.getCurrentPost"
      :point-annotations="$annomlstore.getters.currentPointAnnotations"
      :rectangle-annotations="$annomlstore.getters.currentRectangleAnnotations"
      @save-question="saveQuestion"
      @update-question="updateQuestion"
      @delete-question="deleteQuestion"
    />
  </div>
</template>

<script>
/* eslint-disable no-console,no-param-reassign */

import Question from '@/components/discussion/Question.vue';
import QuestionEditor from '@/components/discussion/QuestionEditor.vue';
import APIService from '@/service/APIService';

export default {
  name: 'DiscussionView',
  components: {
    Question,
    QuestionEditor,
  },
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
      currentEdit: null,
      questions: [],
      editorOpen: false,
      maxHeight: 0,
    };
  },
  mounted() {
    this.$annomlstore.watch(
      (state, getters) => getters.currentPointAnnotations,
      (currentPointAnnotations) => {
        if (
          currentPointAnnotations.length > 0
          && !this.$annomlstore.getters.hasCurrentPost
        ) {
          this.createQuestion();
        }
      },
    );
    this.$annomlstore.watch(
      (state, getters) => getters.currentRectangleAnnotations,
      (currentRectangleAnnotations) => {
        if (
          currentRectangleAnnotations.length > 0
          && !this.$annomlstore.getters.hasCurrentPost
        ) {
          this.createQuestion();
        }
      },
    );
  },
  created() {
    this.questions = this.discussion.questions;
    this.questions.forEach((question) => {
      if (question.color) {
        this.$annomlstore.commit('addUsedColor', question.color);
      }
      if (question.pointAnnotations.length > 0) {
        this.$annomlstore.commit('addPointAnnotations', question.pointAnnotations);
      }
      if (question.rectangleAnnotations.length > 0) {
        this.$annomlstore.commit(
          'addRectangleAnnotations',
          question.rectangleAnnotations,
        );
      }
    });
  },
  methods: {
    /**
     * Question Events
     */
    createQuestion() {
      const newQuestion = {
        answers: [],
      };
      this.currentEdit = newQuestion;
      this.$annomlstore.commit('setCurrentPost', newQuestion);
    },
    saveQuestion(question) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('mergeCurrentAnnotations');
      this.$annomlstore.commit('clearCurrentAnnotations');
      this.$annomlstore.commit('addUsedColor', question.color);
      this.questions.push(question);
      console.log(question);
      APIService(this.$serviceApi).addQuestion(this.discussion.id, question).then((response) => {
        console.log(response);
        this.$set(
          this.questions,
          this.questions.findIndex(q => q.id === question.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removePointAnnotations',
            question.pointAnnotations,
          );
          this.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            question.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color !== question.color) {
          this.$annomlstore.commit('addUsedColor', question.color);
        }
      });
    },
    updateQuestion(question) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('mergeCurrentAnnotations');
      this.$annomlstore.commit('clearCurrentAnnotations');
      APIService(this.$serviceApi).updateQuestion(question).then((response) => {
        this.$set(
          this.questions,
          this.questions.findIndex(q => q.id === question.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removePointAnnotations',
            question.pointAnnotations,
          );
          this.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            question.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color !== question.color) {
          this.$annomlstore.commit('addUsedColor', question.color);
        }
      });
    },
    deleteQuestion(question) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('clearCurrentAnnotations');
      if (question.color) {
        this.$annomlstore.commit('removeUsedColor', question.color);
      }
      this.questions.filter(q => q.id !== question.id);
      APIService(this.$serviceApi).deleteQuestion(this.discussion.id, question).then((response) => {
        console.log(response);
        this.$set(
          this.questions,
          this.questions.findIndex(q => q.id === question.id),
          response,
        );
      });
    },
    editQuestion(question) {
      if (!this.$annomlstore.getters.hasCurrentPost) {
        this.currentEdit = question;
        this.$annomlstore.commit('setCurrentPost', question);
        if (question.pointAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removePointAnnotations',
            question.pointAnnotations,
          );
          this.$annomlstore.commit(
            'setCurrentPointAnnotations',
            question.pointAnnotations,
          );
        }
        if (question.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            question.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'setCurrentRectangleAnnotations',
            question.rectangleAnnotations,
          );
        }
      }
    },
  },
};
</script>

<style></style>
