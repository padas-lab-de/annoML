<template>
  <div>
    <b-card class="mb-2 ml-4">
      <highlight
        class="float-right"
        v-if="
          comment.author &&
            ($annomlsettings.currentUser !== comment.author.externalId ||
              question.highlight === comment.id)
        "
        :edit="$annomlsettings.currentUser === question.author.externalId"
        :highlight="question.highlight === comment.id"
      ></highlight>
      <span
        v-if="$annomlstore.getters.debug"
        class="float-right mr-1"
        style="color: lightgray"
      >
        #{{ comment.id }}
      </span>
      <post-meta v-bind:post="comment"></post-meta>
      <annotation-select
        class="annotation-select"
        v-if="
          comment.pointAnnotations.length > 0 ||
            comment.rectangleAnnotations.length > 0
        "
        :point-annotations="comment.pointAnnotations"
        :rectangle-annotations="comment.rectangleAnnotations"
        :annotation-color="comment.color"
        :edit="false"
        @select-annotation="selectAnnotation"
        @hide-annotation="hideAnnotation"
        @hide-all-annotations="hideAnnotations"
      />
      <div class="body">
        <editor-content class="editor__content" :editor="editor" />
      </div>
      <div v-if="comment.author">
        <vote
          class="float-right btn"
          :post="comment"
          :edit="$annomlsettings.isAuthenticated"
          @up-vote="upVoteComment"
          @down-vote="downVoteComment"
        ></vote>
        <b-button
          @click="editComment"
          class="float-right"
          variant="light"
          v-if="
            $annomlsettings.currentUser === comment.author.externalId &&
              !$annomlstore.getters.getCurrentPost
          "
          >Edit</b-button
        >
      </div>
    </b-card>
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
import AnnotationSelect from './annotation/AnnotationSelect.vue';
import Vote from './vote/Vote.vue';
import PostMeta from '../info/PostMeta.vue';
import utils from '../../util';

export default {
  name: 'Comment',
  components: {
    Vote,
    PostMeta,
    EditorContent,
    AnnotationSelect,
  },
  props: {
    comment: {
      type: Object,
      default() {
        return {};
      },
    },
    question: {
      type: Object,
      default() {
        return null;
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
        content: this.comment.body,
      }),
      currentEdit: null,
    };
  },
  created() {},
  mounted() {},
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    /**
     * Comment Handling
     */
    editComment() {
      this.$emit('edit-comment', this.comment);
    },
    upVoteComment() {
      this.$emit('up-vote-comment', this.comment);
    },
    downVoteComment() {
      this.$emit('down-vote-comment', this.comment);
    },
    /**
     * Annotation Handling
     */
    selectAnnotation(annotation) {
      utils.annotation.selectAnnotation(
        [this.comment.pointAnnotations, this.comment.rectangleAnnotations],
        annotation,
        this.comment.color,
      );
    },
    hideAnnotation(annotation) {
      utils.annotation.hideAnnotation(
        [this.comment.pointAnnotations, this.comment.rectangleAnnotations],
        annotation,
        this.comment.color,
      );
    },
    hideAnnotations(hidden) {
      utils.annotation.hideAnnotations(
        [this.comment.pointAnnotations, this.comment.rectangleAnnotations],
        hidden,
        this.comment.color,
      );
    },

    /**
     * Annotation Events
     */
    deleteAnnotation(annotation) {
      this.$emit('delete-annotation', annotation);
    },
  },
};
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

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
