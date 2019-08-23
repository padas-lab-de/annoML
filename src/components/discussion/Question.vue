<template>
  <div>
    <b-card class="question mb-2 mt-4">
      <h2 class="question-title">
        {{ question.title }}
        <span
          v-if="$annomlstore.getters.debug"
          class="float-right"
          style="color: lightgray"
        >
          {{ question.author.username }} #{{ question.id }}</span
        >
      </h2>
      <Postinfo :post="question"></Postinfo>
      <annotation-select
        class="annotation-select"
        v-if="
          question.pointAnnotations.length > 0 ||
            question.rectangleAnnotations.length > 0
        "
        :point-annotations="question.pointAnnotations"
        :rectangle-annotations="question.rectangleAnnotations"
        :annotation-color="question.color"
        :edit="false"
        @select-annotation="selectAnnotation"
      />
      <div class="body">
        <editor-content class="editor__content" :editor="editor" />
      </div>
      <div>
        <b-button
          v-if="!$annomlstore.getters.currentEdit"
          @click="answerPost"
          variant="primary"
        >
          Answer
        </b-button>
        <vote class="float-right btn"></vote>
        <b-button @click="editQuestion" class="float-right" variant="light"
          >Edit</b-button
        >
        <small class="text-muted"> {{ question.date }}</small>
      </div>
    </b-card>
    <answer
      v-for="answer in answers.filter(a => a !== currentEdit)"
      :key="answer.id"
      :answer="answer"
      :favorite="answers.id === question.favorite"
      @edit-answer="editAnswer"
    />
    <answer-editor
      v-if="currentEdit"
      :answer="$annomlstore.getters.getCurrentPost"
      :point-annotations="$annomlstore.getters.currentPointAnnotations"
      :rectangle-annotations="$annomlstore.getters.currentRectangleAnnotations"
      @select-annotation="selectAnnotation"
      @delete-annotation="deleteAnnotation"
      @save-answer="saveAnswer"
      @update-answer="updateAnswer"
      @delete-answer="deleteAnswer"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop,no-console */
import { Editor, EditorContent } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
} from 'tiptap-extensions';
import AnnotationSelect from '@/components/discussion/annotation/AnnotationSelect.vue';
import Answer from '@/components/discussion/Answer.vue';
import AnswerEditor from '@/components/discussion/AnswerEditor.vue';
import APIService from '@/service/APIService';
import Vote from '@/components/discussion/vote/Vote.vue';
import Postinfo from '@/components/discussion/info/Postinfo.vue';


export default {
  name: 'Question',
  components: {
    Vote,
    Postinfo,
    EditorContent,
    AnnotationSelect,
    AnswerEditor,
    Answer,
  },
  props: {
    question: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        editable: false,
        content: this.question.body,
      }),
      answers: [],
      currentEdit: null,
    };
  },
  created() {
    this.answers = this.question.answers;
    this.answers.forEach((answer) => {
      if (answer.color) {
        this.$annomlstore.commit('addUsedColor', answer.color);
      }
      if (answer.pointAnnotations.length > 0) {
        this.$annomlstore.commit('addPointAnnotations', answer.pointAnnotations);
      }
      if (answer.rectangleAnnotations.length > 0) {
        this.$annomlstore.commit(
          'addRectangleAnnotations',
          answer.rectangleAnnotations,
        );
      }
    });
  },
  mounted() {},
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    /**
     * Question Handling
     */
    editQuestion() {
      this.$emit('edit-question', this.question);
    },
    /**
     * Annotation Handling
     */
    selectAnnotation(annotation) {
      if (annotation.color === 'gray') {
        this.clearAnnotation();
      } else {
        this.question.pointAnnotations.forEach((a) => {
          const pointAnnotation = a;
          if (pointAnnotation.id === annotation.id) {
            pointAnnotation.color = 'gray';
          } else {
            pointAnnotation.color = this.question.color;
          }
        });
        this.question.rectangleAnnotations.forEach((a) => {
          const rectangleAnnotation = a;
          if (rectangleAnnotation.id === annotation.id) {
            rectangleAnnotation.color = 'gray';
          } else {
            rectangleAnnotation.color = this.question.color;
          }
        });
        this.$emit('select-annotation', annotation);
      }
    },
    clearAnnotation() {
      this.question.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        pointAnnotation.color = this.question.color;
      });
      this.question.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        rectangleAnnotation.color = this.question.color;
      });
    },
    /**
     * Annotation Events
     */
    deleteAnnotation(annotation) {
      this.$emit('delete-annotation', annotation);
    },
    updateColor(value) {
      this.currentEdit.color = value;
    },
    /**
     * Answer Handling
     */
    answerPost() {
      const answer = {
        annotations: {
          pointAnnotations: [],
          rectangleAnnotations: [],
        },
        comments: [],
      };
      this.currentEdit = answer;
      this.$annomlstore.commit('disableSelectable');
      this.$annomlstore.commit('setCurrentPost', answer);
    },
    saveAnswer(answer) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('mergeCurrentAnnotations');
      this.$annomlstore.commit('clearCurrentAnnotations');
      if (answer.color) {
        this.$annomlstore.commit('addUsedColor', answer.color);
      }
      this.answers.push(answer);
      APIService(this.$serviceApi).addAnswer(this.question.id, answer).then((response) => {
        this.$set(
          this.answers,
          this.answers.findIndex(a => a.id === answer.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);
          this.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            answer.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color && response.color !== answer.color) {
          this.$annomlstore.commit('addUsedColor', answer.color);
        }
        this.$forceUpdate(); // todo check if necessary
      });
    },
    updateAnswer(answer) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('mergeCurrentAnnotations');
      this.$annomlstore.commit('clearCurrentAnnotations');
      if (answer.color) {
        this.$annomlstore.commit('addUsedColor', answer.color);
      }
      APIService(this.$serviceApi).updateAnswer(answer).then((response) => {
        this.$set(
          this.answers,
          this.answers.findIndex(a => a.id === answer.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);
          this.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            answer.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color && response.color !== answer.color) {
          this.$annomlstore.commit('addUsedColor', answer.color);
        }
      });
    },
    deleteAnswer(answer) {
      this.currentEdit = null;
      this.$annomlstore.commit('removeCurrentPost');
      this.$annomlstore.commit('enableSelectable');
      this.$annomlstore.commit('clearCurrentAnnotations');
      if (answer.color) {
        this.$annomlstore.commit('removeUsedColor', answer.color);
      }
      this.answers = this.answers.filter(a => a.id !== answer.id);
      APIService(this.$serviceApi).deleteAnswer(answer).then((response) => {
        console.log(response);
      });
    },
    editAnswer(answer) {
      if (!this.$annomlstore.getters.hasCurrentPost) {
        this.currentEdit = answer;
        this.$annomlstore.commit('setCurrentPost', answer);
        if (answer.pointAnnotations.length > 0) {
          this.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);
          this.$annomlstore.commit(
            'setCurrentPointAnnotations',
            answer.pointAnnotations,
          );
        }
        if (answer.rectangleAnnotations.length > 0) {
          this.$annomlstore.commit(
            'removeRectangleAnnotations',
            answer.rectangleAnnotations,
          );
          this.$annomlstore.commit(
            'setCurrentRectangleAnnotations',
            answer.rectangleAnnotations,
          );
        }
      }
    },
  },
};
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

#question-title {
  font-size: 2rem;
  width: 100%;
}

.annotation-select {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.body {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  pointer-events: none;

  &__content {
    word-wrap: break-word;

    .ProseMirror {
      position: relative;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
    }

    .ProseMirror p {
    }

    &__content {
      word-wrap: break-word;

      * {
        caret-color: currentColor;
      }

      p {
        margin-top: 0.2rem;
        margin-bottom: 0.2rem;
      }

      pre {
        padding: 0.7rem 1rem;
        border-radius: 5px;
        background: $color-black;
        color: $color-white;
        font-size: 0.8rem;
        overflow-x: auto;

        code {
          display: block;
        }
      }

      p code {
        display: inline-block;
        padding: 0 0.4rem;
        border-radius: 5px;
        font-size: 0.8rem;
        font-weight: bold;
        background: rgba($color-black, 0.1);
        color: rgba($color-black, 0.8);
      }

      ul,
      ol {
        padding-left: 1rem;
      }

      li > p,
      li > ol,
      li > ul {
        margin: 0;
      }

      a {
        color: inherit;
      }

      blockquote {
        border-left: 3px solid rgba($color-black, 0.1);
        color: rgba($color-black, 0.8);
        padding-left: 0.8rem;
        font-style: italic;

        p {
          margin: 0;
        }
      }

      img {
        max-width: 100%;
        border-radius: 3px;
      }

      table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;

        td,
        th {
          min-width: 1em;
          border: 2px solid $color-grey;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
          > * {
            margin-bottom: 0;
          }
        }

        th {
          font-weight: bold;
          text-align: left;
        }

        .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .column-resize-handle {
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 4px;
          z-index: 20;
          background-color: #adf;
          pointer-events: none;
        }
      }

      .tableWrapper {
        margin: 1em 0;
        overflow-x: auto;
      }

      .resize-cursor {
        cursor: ew-resize;
        cursor: col-resize;
      }
    }
  }
}
</style>
