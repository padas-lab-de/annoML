<template>
  <b-card class="mt-4 mb-2">
    <div class="title">
      <input
        id="question-title"
        v-model.trim="title"
        placeholder="Question Title"
        required
      />
    </div>
    <annotation-select
      class="annotation-select"
      v-if="pointAnnotations.length > 0 || rectangleAnnotations.length > 0"
      :point-annotations="pointAnnotations"
      :rectangle-annotations="rectangleAnnotations"
      :annotation-color="question.color"
      :edit="true"
      @select-annotation="selectAnnotation"
      @delete-annotation="deleteAnnotation"
      @update-annotation="updateAnnotation"
      @update-color="updateAnnotationColor"
    />
    <b-button
      :disabled="$store.getters.visualizationSelectable"
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
                <i class="fa fa-bold"
              /></b-button>

              <b-button
                class="menubar__b-button"
                :class="{ active: isActive.italic() }"
                @click="commands.italic"
              >
                <i class="fa fa-italic"
              /></b-button>

              <b-button
                class="menubar__b-button"
                :class="{ active: isActive.strike() }"
                @click="commands.strike"
              >
                <i class="fa fa-strikethrough"
              /></b-button>

              <b-button
                class="menubar__b-button"
                :class="{ active: isActive.underline() }"
                @click="commands.underline"
              >
                <i class="fa fa-underline"
              /></b-button>
              <b-button
                class="menubar__button"
                :class="{ active: isActive.bullet_list() }"
                @click="commands.bullet_list"
              >
                <i class="fa fa-list-ul" />
              </b-button>

              <b-button
                class="menubar__button"
                :class="{ active: isActive.ordered_list() }"
                @click="commands.ordered_list"
              >
                <i class="fa fa-list-ol" />
              </b-button>

              <b-button
                class="menubar__button"
                :class="{ active: isActive.blockquote() }"
                @click="commands.blockquote"
              >
                <i class="fa fa-quote-left" />
              </b-button>

              <b-button
                class="menubar__button"
                :class="{ active: isActive.code_block() }"
                @click="commands.code_block"
              >
                <i class="fa fa-code" />
              </b-button>
              <b-button class="menubar__button" @click="commands.undo">
                <i class="fa fa-undo" />
              </b-button>

              <b-button class="menubar__button" @click="commands.redo">
                <i class="fa fa-undo icon-flipped" />
              </b-button>
            </b-button-group>
          </editor-menu-bar>
        </b-button-toolbar>
      </div>
      <editor-content class="editor__content" id="editor" :editor="editor" />
    </div>
    <div slot="footer">
      <b-button v-if="question.id" @click="updateQuestion" variant="success"
        >Save
      </b-button>
      <b-button v-else @click="submitQuestion" variant="success"
        >Submit</b-button
      >
      <b-button @click="deleteQuestion" variant="danger">Delete </b-button>
    </div>
    <answer
      v-for="answer in question.answers"
      :key="answer.id"
      :post="answer"
    />
  </b-card>
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
import AnnotationSelect from '@/components/discussion/annotation/AnnotationSelect.vue';
import Answer from '@/components/discussion/Answer.vue';

export default {
  name: 'QuestionEditor',
  components: {
    EditorContent,
    EditorMenuBar,
    AnnotationSelect,
    Answer,
  },
  props: {
    question: {
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
      title: null,
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
        content: this.question.body,
      }),
    };
  },
  created() {
    this.title = this.question.title;
  },
  methods: {
    /**
     * Question Operations
     */
    submitQuestion() {
      if (
        this.title !== undefined
        && this.title !== ''
        && this.editorHasContent()
      ) {
        this.pointAnnotations.forEach((a) => {
          const pointAnnotation = a;
          pointAnnotation.color = this.question.color;
          return pointAnnotation;
        });
        this.rectangleAnnotations.forEach((a) => {
          const rectangleAnnotation = a;
          rectangleAnnotation.color = this.question.color;
          return rectangleAnnotation;
        });
        const post = {
          title: this.title,
          body: this.editor.getJSON(),
          color: this.question.color,
          author: {
            username: '',
          },
          pointAnnotations: this.pointAnnotations,
          rectangleAnnotations: this.rectangleAnnotations,
          answers: this.question.answers,
        };
        this.$emit('save-question', post);
      } else {
        alert('Enter title and content');
      }
    },
    updateQuestion() {
      if (
        this.title !== undefined
        && this.title !== ''
        && this.editorHasContent()
      ) {
        this.clearAnnotation();
        const post = {
          id: this.question.id,
          title: this.title,
          color: this.question.color,
          pointAnnotations: this.pointAnnotations,
          rectangleAnnotations: this.rectangleAnnotations,
          answers: this.question.answers,
        };
        this.$emit('update-question', post);
      } else {
        alert('Enter title and content');
      }
    },
    deleteQuestion() {
      this.$emit('delete-question', this.question);
    },
    /**
     * Annotation Handling
     */
    addNewAnnotation() {
      this.$store.commit('enableSelectable');
    },
    selectAnnotation(annotation) {
      if (annotation.color === 'gray') {
        this.clearAnnotation();
      } else {
        this.pointAnnotations.forEach((a) => {
          const pointAnnotation = a;
          if (pointAnnotation.id === annotation.id) {
            pointAnnotation.color = 'gray';
          } else {
            pointAnnotation.color = this.question.color;
          }
        });
        this.rectangleAnnotations.forEach((a) => {
          const rectangleAnnotation = a;
          if (rectangleAnnotation.id === annotation.id) {
            rectangleAnnotation.color = 'gray';
          } else {
            rectangleAnnotation.color = this.question.color;
          }
        });
      }
    },
    clearAnnotation() {
      this.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        pointAnnotation.color = this.question.color;
      });
      this.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        rectangleAnnotation.color = this.question.color;
      });
    },
    deleteAnnotation(annotation) {
      if (annotation.annotationType === 'POINT') {
        this.pointAnnotations.filter(a => a.id !== annotation.id);
      } else if (annotation.annotationType === 'RECTANGLE') {
        this.rectangleAnnotations.filter(a => a.id !== annotation.id);
      }
    },
    updateAnnotation(annotation) {
      if (annotation.annotationType === 'POINT') {
        this.$set(
          this.pointAnnotations,
          this.pointAnnotations.findIndex(a => a.id === annotation.id),
          annotation,
        );
      } else if (annotation.annotationType === 'RECTANGLE') {
        this.$set(
          this.rectangleAnnotations,
          this.rectangleAnnotations.findIndex(a => a.id === annotation.id),
          annotation,
        );
      }
    },
    updateAnnotationColor(value) {
      if (this.question.color) {
        this.$store.commit('removeUsedColor', value);
        this.question.color = value;
      } else {
        this.question.color = value;
      }
      this.pointAnnotations.forEach((a) => {
        const pointAnnotation = a;
        if (pointAnnotation.color !== 'gray') {
          pointAnnotation.color = value;
        }
      });
      this.rectangleAnnotations.forEach((a) => {
        const rectangleAnnotation = a;
        if (rectangleAnnotation.color !== 'gray') {
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

#question-title {
  border: none;
  font-size: 2rem;
  width: 100%;
}

#question-title:focus {
  outline: none;
}

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
