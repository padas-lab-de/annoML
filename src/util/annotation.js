/* eslint-disable no-param-reassign,no-console */

// import store from '@/store/plugin';


const types = {
  POINT: 'POINT',
  FREEPOINT: 'FREEPOINT',
  RECTANGLE: 'RECTANGLE',
  FREERECTANGLE: 'FREERECTANGLE',
};

const stateColor = {
  HIDDEN: 'gray',
  SELECTED: 'black',
};

export default {

  types,
  stateColor,
  /*
    * Annotation Handling
    */
  selectAnnotation(annotations, annotation, color) {
    if (annotation.color === stateColor.SELECTED) {
      annotation.color = color;
    } else {
      annotations.forEach((annotationList) => {
        annotationList.forEach((a) => {
          if (a.id === annotation.id) {
            a.color = stateColor.SELECTED;
          } else {
            a.color = color;
          }
        });
      });
    }
  },
  hideAnnotation(annotations, annotation, color) {
    if (annotation.color === stateColor.HIDDEN) {
      annotation.color = color;
    } else {
      annotations.forEach((annotationList) => {
        annotationList.forEach((a) => {
          if (a.id === annotation.id) {
            a.color = stateColor.HIDDEN;
          } else {
            a.color = color;
          }
        });
      });
    }
  },
  hideAnnotations(annotations, hidden, color) {
    if (!hidden) {
      annotations.forEach((annotationList) => {
        annotationList.forEach((a) => {
          a.color = color;
        });
      });
    } else {
      annotations.forEach((annotationList) => {
        annotationList.forEach((a) => {
          a.color = stateColor.HIDDEN;
        });
      });
    }
  },
  /*
  *  Annotation List Helpers
  */
  concatAndSortAnnotations(annotations, sort) {
    return []
      .concat(...annotations)
      .sort(sort);
  },
  concatAndFilterAnnotations(annotations, filter) {
    console.log(annotations);
    return []
      .concat(...annotations)
      .filter(filter);
  },
  concatAnnotations(annotations) {
    console.log(annotations);
    return []
      .concat(...annotations);
  },
};
