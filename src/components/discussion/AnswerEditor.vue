<template>
  <div>
    <b-card class="mb-2 ml-2">
      <annotation-select
        class="annotation-select"
        v-if="pointAnnotations.length > 0 || rectangleAnnotations.length > 0"
        :point-annotations="pointAnnotations"
        :rectangle-annotations="rectangleAnnotations"
        :annotation-color="answer.color"
        :edit="true"
        @select-annotation="selectAnnotation"
        @hide-annotation="hideAnnotation"
        @delete-annotation="deleteAnnotation"
        @update-annotation="updateAnnotation"
        @update-color="updateAnnotationColor"
      />
      <b-button
        :disabled="$annomlstore.getters.visualizationSelectable"
        class="float-right"
        size="sm"
        @click="addNewAnnotation"
        variant="outline-primary"
        >Add Annotation
      </b-button>
      <div class="editor">
        <div class="editor-toolbar">
          <b-button-toolbar>
            <editor-menu-bar
              class="menubar"
              :editor="editor"
              v-slot="{ commands, isActive }"
            >
              <b-button-group size="sm">
                <b-button
                  class="menubar__b-button"
                  :class="{ active: isActive.bold() }"
                  @click="commands.bold"
                >
                  <font-awesome-icon icon="bold"
                /></b-button>

                <b-button
                  class="menubar__b-button"
                  :class="{ active: isActive.italic() }"
                  @click="commands.italic"
                >
                  <font-awesome-icon icon="italic"
                /></b-button>

                <b-button
                  class="menubar__b-button"
                  :class="{ active: isActive.strike() }"
                  @click="commands.strike"
                >
                  <font-awesome-icon icon="strikethrough"
                /></b-button>

                <b-button
                  class="menubar__b-button"
                  :class="{ active: isActive.underline() }"
                  @click="commands.underline"
                >
                  <font-awesome-icon icon="underline"
                /></b-button>

                <b-button
                  class="menubar__button"
                  :class="{ active: isActive.bullet_list() }"
                  @click="commands.bullet_list"
                >
                  <font-awesome-icon icon="list-ul" />
                </b-button>

                <b-button
                  class="menubar__button"
                  :class="{ active: isActive.ordered_list() }"
                  @click="commands.ordered_list"
                >
                  <font-awesome-icon icon="list-ol" />
                </b-button>

                <b-button
                  class="menubar__button"
                  :class="{ active: isActive.blockquote() }"
                  @click="commands.blockquote"
                >
                  <font-awesome-icon icon="quote-left" />
                </b-button>

                <b-button
                  class="menubar__button"
                  :class="{ active: isActive.code_block() }"
                  @click="commands.code_block"
                >
                  <font-awesome-icon icon="code" />
                </b-button>
                <b-button class="menubar__button" @click="commands.undo">
                  <font-awesome-icon icon="undo" />
                </b-button>

                <b-button class="menubar__button" @click="commands.redo">
                  <font-awesome-icon icon="undo" flip="horizontal" />
                </b-button>
              </b-button-group>
            </editor-menu-bar>
          </b-button-toolbar>
        </div>
        <editor-content class="editor__content" id="editor" :editor="editor" />
      </div>

      <b-button v-if="answer.author" @click="updateAnswer" variant="primary"
        >Save
      </b-button>
      <b-button v-else @click="submitAnswer" variant="success">Submit</b-button>
      <b-button class="ml-2" @click="deleteAnswer" variant="danger"
        >Delete
      </b-button>
    </b-card>
    <comment
      v-for="comment in answer.comments"
      :key="comment.id"
      :comment="comment"
      :question="question"
      @up-vote-comment="upVoteComment"
      @down-vote-comment="downVoteComment"
    />
  </div>
</template>

<script>
/* eslint-disable vue/require-default-prop,no-console,no-alert */
import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
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
import AnnotationSelect from './annotation/AnnotationSelect.vue';
import Comment from './Comment.vue';
import utils from '../../util';
import APIService from '../../service/APIService';

export default {
  name: 'AnswerEditor',
  components: {
    EditorContent,
    EditorMenuBar,
    Comment,
    AnnotationSelect,
  },
  props: {
    answer: {
      type: Object,
      default() {
        return {};
      },
    },
    pointAnnotations: {
      type: Array,
      default() {
        return [];
      },
    },
    rectangleAnnotations: {
      type: Array,
      default() {
        return [];
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
        content: this.answer.body,
      }),
    };
  },
  created() {},
  watch: {},
  methods: {
    /**
     * Answer Operations
     */
    submitAnswer() {
      if (this.editorHasContent()) {
        this.clearAnnotation();
        const post = {
          id: this.answer.id,
          body: this.editor.getJSON(),
          pointAnnotations: this.pointAnnotations,
          rectangleAnnotations: this.rectangleAnnotations,
          upVotes: [],
          downVotes: [],
          comments: this.answer.comments,
        };
        if (
          this.pointAnnotations.length > 0
          || this.rectangleAnnotations.length > 0
        ) {
          post.color = this.answer.color;
        }
        this.$emit('save-answer', post);
      } else {
        alert('Enter a content');
      }
    },
    updateAnswer() {
      if (this.editorHasContent()) {
        this.pointAnnotations.forEach((a) => {
          const pointAnnotation = a;
          pointAnnotation.color = this.answer.color;
          console.log(pointAnnotation);
          return pointAnnotation;
        });
        this.rectangleAnnotations.forEach((a) => {
          const rectangleAnnotation = a;
          rectangleAnnotation.color = this.answer.color;
          return rectangleAnnotation;
        });
        const post = {
          id: this.answer.id,
          color: this.answer.color,
          pointAnnotations: this.pointAnnotations,
          rectangleAnnotations: this.rectangleAnnotations,
          comments: this.answer.comments,
        };
        this.$emit('update-answer', post);
      } else {
        alert('Enter title and content');
      }
    },
    deleteAnswer() {
      this.$emit('delete-answer', this.answer);
    },
    /**
     * Annotation Handling
     */
    selectAnnotation(annotation) {
      utils.annotation.selectAnnotation(
        [this.answer.pointAnnotations, this.answer.rectangleAnnotations],
        annotation,
        this.answer.color,
      );
    },
    hideAnnotation(annotation) {
      utils.annotation.hideAnnotation(
        [this.answer.pointAnnotations, this.answer.rectangleAnnotations],
        annotation,
        this.answer.color,
      );
    },
    hideAnnotations(hidden) {
      utils.annotation.hideAnnotations(
        [this.answer.pointAnnotations, this.answer.rectangleAnnotations],
        hidden,
        this.answer.color,
      );
    },
    addNewAnnotation() {
      this.$annomlstore.commit('enableSelectable');
    },
    clearAnnotation() {
      this.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        pointAnnotation.color = this.answer.color;
      });
      this.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        rectangleAnnotation.color = this.answer.color;
      });
    },
    deleteAnnotation(annotation) {
      if (annotation.annotationType === utils.annotation.types.POINT) {
        this.$annomlstore.commit('removeCurrentPointAnnotation', annotation);
      } else if (
        annotation.annotationType === utils.annotation.types.RECTANGLE
      ) {
        this.$annomlstore.commit(
          'removeCurrentRectangleAnnotation',
          annotation,
        );
      }
    },
    updateAnnotation(annotation) {
      if (annotation.annotationType === utils.annotation.types.POINT) {
        this.$set(
          this.pointAnnotations,
          this.pointAnnotations.findIndex(a => a.id === annotation.id),
          annotation,
        );
      } else if (
        annotation.annotationType === utils.annotation.types.RECTANGLE
      ) {
        this.$set(
          this.rectangleAnnotations,
          this.rectangleAnnotations.findIndex(a => a.id === annotation.id),
          annotation,
        );
      }
    },
    updateAnnotationColor(value) {
      if (this.answer.color) {
        this.$annomlstore.commit('removeUsedColor', value);
        this.answer.color = value;
      } else {
        this.answer.color = value;
      }
      this.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        if (
          pointAnnotation.color !== utils.annotation.stateColor.HIDDEN
          || pointAnnotation.color !== utils.annotation.stateColor.SELECTED
        ) {
          pointAnnotation.color = value;
        }
      });
      this.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        if (
          rectangleAnnotation.color !== utils.annotation.stateColor.HIDDEN
          || rectangleAnnotation.color !== utils.annotation.stateColor.SELECTED
        ) {
          rectangleAnnotation.color = value;
        }
      });
    },
    /**
     * Helpers
     */
    editorHasContent() {
      const body = this.editor.getHTML();
      return body !== '<p></p>';
    },
    /**
     * Vote Handling
     */
    upVoteComment(comment) {
      APIService(this.$serviceApiAuthenticated)
        .upVoteComment(comment)
        .then((response) => {
          this.$set(
            this.comments,
            this.comments.findIndex(q => q.id === comment.id),
            response,
          );
        });
    },
    downVoteComment(comment) {
      APIService(this.$serviceApiAuthenticated)
        .downVoteComment(comment)
        .then((response) => {
          this.$set(
            this.comments,
            this.comments.findIndex(q => q.id === comment.id),
            response,
          );
        });
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
$color-black: #000000;
$color-white: #ffffff;
$color-grey: #dddddd;

.annotation-select {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.editor-toolbar {
  margin-bottom: 0.5rem;
}
.icon-flipped {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

.editor {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  .ProseMirror {
    resize: vertical;
    position: relative;
    overflow-y: scroll;
    height: calc(1.5em + 5rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
  }

  .ProseMirror p {
  }

  .ProseMirror-focused {
    outline: none;
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
</style>
