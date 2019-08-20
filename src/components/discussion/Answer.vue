<template>
  <div>
    <b-card class="mb-2 ml-2">
      <Highlight class="pull-right" edit="true" starred="false"></Highlight>
        <span
        v-if="$store.getters.debug"
        class="float-right"
        style="color: lightgray"
      >
        {{ answer.author.username }} #{{ answer.id }}</span
      >
        <annotation-select
        class="annotation-select"
        v-if="
          answer.pointAnnotations.length > 0 ||
            answer.rectangleAnnotations.length > 0
        "
        :point-annotations="answer.pointAnnotations"
        :rectangle-annotations="answer.rectangleAnnotations"
        :annotation-color="answer.color"
        :edit="false"
        @select-annotation="selectAnnotation"
      />
      <div class="body">
        <editor-content class="editor__content" :editor="editor" />
      </div>
      <b-button
        v-if="!$store.getters.currentEdit"
        @click="answerPost"
        variant="primary"
      >
        Comment
      </b-button>
        <vote></vote>
      <b-button @click="editAnswer" class="float-right" variant="light"
        >Edit</b-button
      >
    </b-card>
    <comment
      v-for="comment in comments.filter(
        c => c !== $store.getters.getCurrentPost
      )"
      :key="comment.id"
      :comment="comment"
      @edit-comment="editComment"
    />
    <comment-editor
      v-if="currentEdit"
      :comment="$store.getters.getCurrentPost"
      :point-annotations="$store.getters.currentPointAnnotations"
      :rectangle-annotations="$store.getters.currentRectangleAnnotations"
      @select-annotation="selectAnnotation"
      @delete-annotation="deleteAnnotation"
      @save-comment="saveComment"
      @update-comment="updateComment"
      @delete-comment="deleteComment"
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
} from 'tiptap-extensions';
import AnnotationSelect from '@/components/discussion/annotation/AnnotationSelect.vue';
import Comment from '@/components/discussion/Comment.vue';
import CommentEditor from '@/components/discussion/CommentEditor.vue';
import APIService from '@/service/APIService';
import Vote from '@/components/discussion/vote/Vote.vue';
import Highlight from '@/components/discussion/vote/Highlight.vue';


export default {
  name: 'Answer',
  components: {
    Vote,
    Highlight,
    CommentEditor,
    Comment,
    EditorContent,
    AnnotationSelect,
  },
  props: {
    answer: {
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
        ],
        editable: false,
        content: this.answer.body,
      }),
      comments: [],
      currentEdit: null,
    };
  },
  created() {
    this.comments = this.answer.comments;
    this.comments.forEach((comment) => {
      if (comment.color) {
        this.$store.commit('addUsedColor', comment.color);
      }
      if (comment.pointAnnotations.length > 0) {
        this.$store.commit('addPointAnnotations', comment.pointAnnotations);
      }
      if (comment.rectangleAnnotations.length > 0) {
        this.$store.commit(
          'addRectangleAnnotations',
          comment.rectangleAnnotations,
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
     * Answer Handling
     */
    editAnswer() {
      this.$emit('edit-answer', this.answer);
    },
    /**
     * Annotation Handling
     */
    selectAnnotation(annotation) {
      if (annotation.color === 'gray') {
        this.clearAnnotation();
      } else {
        this.answer.pointAnnotations.forEach((a) => {
          const pointAnnotation = a;
          if (pointAnnotation.id === annotation.id) {
            pointAnnotation.color = 'gray';
          } else {
            pointAnnotation.color = this.answer.color;
          }
        });
        this.answer.rectangleAnnotations.forEach((a) => {
          const rectangleAnnotation = a;
          if (rectangleAnnotation.id === annotation.id) {
            rectangleAnnotation.color = 'gray';
          } else {
            rectangleAnnotation.color = this.answer.color;
          }
        });
        this.$emit('select-annotation', annotation);
      }
    },
    clearAnnotation() {
      this.comment.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        pointAnnotation.color = this.answer.color;
      });
      this.comment.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        rectangleAnnotation.color = this.answer.color;
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
      const comment = {
        annotations: {
          pointAnnotations: [],
          rectangleAnnotations: [],
        },
        comments: [],
      };
      this.currentEdit = comment;
      this.$store.commit('disableSelectable');
      this.$store.commit('setCurrentPost', comment);
    },
    saveComment(comment) {
      this.currentEdit = null;
      this.$store.commit('removeCurrentPost');
      this.$store.commit('enableSelectable');
      this.$store.commit('mergeCurrentAnnotations');
      this.$store.commit('clearCurrentAnnotations');
      if (comment.color) {
        this.$store.commit('addUsedColor', comment.color);
      }
      this.comments.push(comment);
      APIService.addComment(this.answer.id, comment).then((response) => {
        console.log(response);
        this.$set(
          this.comments,
          this.comments.findIndex(a => a.id === comment.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$store.commit(
            'removePointAnnotations',
            comment.pointAnnotations,
          );
          this.$store.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$store.commit(
            'removeRectangleAnnotations',
            comment.rectangleAnnotations,
          );
          this.$store.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color && response.color !== comment.color) {
          this.$store.commit('addUsedColor', comment.color);
        }
        this.$forceUpdate(); // todo check if necessary
      });
    },
    updateComment(comment) {
      this.currentEdit = null;
      this.$store.commit('removeCurrentPost');
      this.$store.commit('enableSelectable');
      this.$store.commit('mergeCurrentAnnotations');
      this.$store.commit('clearCurrentAnnotations');
      if (comment.color) {
        this.$store.commit('addUsedColor', comment.color);
      }
      APIService.updateComment(comment).then((response) => {
        this.$set(
          this.comments,
          this.comments.findIndex(a => a.id === comment.id),
          response,
        );
        if (response.pointAnnotations.length > 0) {
          this.$store.commit(
            'removePointAnnotations',
            comment.pointAnnotations,
          );
          this.$store.commit('addPointAnnotations', response.pointAnnotations);
        }
        if (response.rectangleAnnotations.length > 0) {
          this.$store.commit(
            'removeRectangleAnnotations',
            comment.rectangleAnnotations,
          );
          this.$store.commit(
            'addRectangleAnnotations',
            response.rectangleAnnotations,
          );
        }
        if (response.color && response.color !== comment.color) {
          this.$store.commit('addUsedColor', comment.color);
        }
      });
    },
    deleteComment(comment) {
      this.currentEdit = null;
      this.$store.commit('removeCurrentPost');
      this.$store.commit('enableSelectable');
      this.$store.commit('clearCurrentAnnotations');
      if (comment.color) {
        this.$store.commit('removeUsedColor', comment.color);
      }
      this.comments = this.comments.filter(a => a.id !== comment.id);
      APIService.deleteComment(comment).then((response) => {
        console.log(response);
      });
    },
    editComment(comment) {
      if (!this.$store.getters.hasCurrentPost) {
        this.currentEdit = comment;
        this.$store.commit('setCurrentPost', comment);
        if (comment.pointAnnotations.length > 0) {
          this.$store.commit(
            'removePointAnnotations',
            comment.pointAnnotations,
          );
          this.$store.commit(
            'setCurrentPointAnnotations',
            comment.pointAnnotations,
          );
        }
        if (comment.rectangleAnnotations.length > 0) {
          this.$store.commit(
            'removeRectangleAnnotations',
            comment.rectangleAnnotations,
          );
          this.$store.commit(
            'setCurrentRectangleAnnotations',
            comment.rectangleAnnotations,
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
