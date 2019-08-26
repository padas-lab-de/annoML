<template>
  <div class="annotation-tile">
    <b-card
      class="bg-transparent border-0 m-1 ml-1"
      :style="{ borderColor: annotation.color }"
      no-body
    >
      <b-input-group @click="clickEvent">
        <b-input-group-prepend :style="{ borderColor: annotation.color }">
          <span
            class="input-group-text"
            :style="{
              backgroundColor: annotation.color,
              borderColor: annotation.color
            }"
          >
            <font-awesome-layers
                    v-if="annotation.annotationType === $annomlutils.annotation.types.POINT">
              <font-awesome-icon icon="bullseye" />
              <font-awesome-icon
                icon="circle"
                transform="shrink-6 down-6 right-6"
                :style="{ color: 'gray' }"
              />
              <font-awesome-icon
                icon="database"
                transform="shrink-5 down-6 right-6"
              />
            </font-awesome-layers>

            <font-awesome-layers
              v-else-if="annotation.annotationType === $annomlutils.annotation.types.FREEPOINT"
            >
              <font-awesome-icon icon="bullseye" />
              <font-awesome-icon
                icon="circle"
                transform="shrink-9 down-7 right-7"
                :style="{ color: 'gray' }"

              />
              <font-awesome-icon
                icon="hand-pointer"
                transform="shrink-4 down-5 right-6"
              />
            </font-awesome-layers>

            <font-awesome-layers
              v-else-if="annotation.annotationType === $annomlutils.annotation.types.RECTANGLE"
            >
              <font-awesome-icon icon="vector-square" />
              <font-awesome-icon
                icon="circle"
                transform="shrink-6 down-6 right-6"
                :style="{ color: 'gray' }"
              />
              <font-awesome-icon
                icon="database"
                transform="shrink-5 down-6 right-6"
              />
            </font-awesome-layers>

            <font-awesome-layers
              v-else-if="annotation.annotationType === $annomlutils.annotation.types.FREERECTANGLE"
            >
              <font-awesome-icon icon="vector-square" />
              <font-awesome-icon
                icon="circle"
                transform="shrink-9 down-6 right-7"
                :style="{ color: 'gray' }"

              />
              <font-awesome-icon
                icon="hand-pointer"
                transform="shrink-4 down-4 right-6"
              />
            </font-awesome-layers>
          </span>
        </b-input-group-prepend>

        <b-form-input
          :readonly="!edit"
          :disabled="!edit"
          v-model.trim.lazy="title"
          :style="{ borderColor: annotation.color }"
          id="annotation-title"
        />
        <b-input-group-append
          v-if="edit"
          :style="{ borderColor: annotation.color, width: '40px', }"
        >
          <b-button
            :style="{
              backgroundColor: annotation.color,
              borderColor: annotation.color,
            }"
            variant="outline-secondary"
            @click="deleteAnnotation"
          ><font-awesome-icon icon="times" style="{color: white}" />
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
      timer: null,
      clickCounter: 0,
      doubleClickTimeout: 200,
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
    clickEvent(event) {
      event.preventDefault();
      this.clickCounter = this.clickCounter + 1;
      if (this.clickCounter === 1) {
        this.timer = setTimeout(() => {
          this.clickCounter = 0;
          this.selectAnnotation();
        }, this.doubleClickTimeout);
      } else if (this.clickCounter === 2) {
        clearTimeout(this.timer);
        this.clickCounter = 0;
        this.hideAnnotation();
      }
    },
    selectAnnotation() {
      this.$emit('select-annotation', this.annotation);
    },
    hideAnnotation() {
      this.$emit('hide-annotation', this.annotation);
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

.form-control:disabled,
.form-control[readonly] {
  background-color: #fff;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
