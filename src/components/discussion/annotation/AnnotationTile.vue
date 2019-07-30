<template>
  <div class="annotation-tile">
    <b-card
      class="bg-transparent border-0 m-1 ml-1"
      :style="{ borderColor: annotation.color }"
      no-body
    >
      <b-input-group @click="selectAnnotation">
        <b-input-group-prepend :style="{ borderColor: annotation.color }">
          <span
            class="input-group-text"
            :style="{
              backgroundColor: annotation.color,
              borderColor: annotation.color
            }"
          >
            <i
              v-if="annotation.annotationType === 'POINT'"
              class="fa fa-dot-circle-o"
            />
            <i
              v-else-if="annotation.annotationType === 'RECTANGLE'"
              class="fa fa-object-ungroup"
            /> </span
        ></b-input-group-prepend>

        <b-form-input
          :readonly="!edit"
          :disabled="!edit"
          v-model.trim.lazy="title"
          :style="{ borderColor: annotation.color }"
        />
        <b-input-group-append
          v-if="edit"
          :style="{ borderColor: annotation.color }"
        >
          <b-button
            :style="{
              backgroundColor: annotation.color,
              borderColor: annotation.color
            }"
            variant="outline-secondary"
            @click="deleteAnnotation"
          >
            <i style="{color: white}" class="fa fa-times" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-card>
  </div>
</template>
<script>
/* eslint-disable vue/require-default-prop */
import lodash from 'lodash';

export default {
  name: 'AnnotationTile',
  props: {
    annotation: {
      type: Object,
      default() {
        return null;
      },
    },
    edit: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      title: '',
    };
  },
  created() {
    this.title = this.annotation.note.title;
  },
  watch: {
    title() {
      this.updateAnnotationTitle(this);
    },
  },
  methods: {
    selectAnnotation() {
      this.$emit('select-annotation', this.annotation);
    },
    deleteAnnotation() {
      this.$emit('delete-annotation', this.annotation);
    },
    updateAnnotation() {
      const annotation = {
        id: this.annotation.id,
        annotationType: this.annotation.annotationType,
        note: {
          title: this.title,
        },
        data: this.annotation.data,
        color: this.annotation.color,
        subject: this.annotation.subject,
      };
      this.$emit('update-annotation', annotation);
    },
    updateAnnotationTitle: lodash.debounce(self => self.updateAnnotation(), 200),
  },
};
</script>

<style scoped>
.UniqueFullWidth .input-group-text {
  width: 50px;
  flex: 0 0 20%;
  border-right: none;
  background-color: #ffffff;
}
.UniqueFullWidth [class^="fa-"],
[class*=" fa-"] {
  display: inline-block;
  color: white;
  width: 100%;
}
.UniqueFullWidth [class^="fa-"],
[class*=" fa-"]:hover {
  display: inline-block;
  color: lightgray;
  width: 100%;
}
.form-control:disabled,
.form-control[readonly] {
  background-color: #fff;
}
</style>
