/* eslint-disable no-param-reassign,no-console */

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

const postColors = [
  '#D32F2F',
  '#C2185B',
  '#7B1FA2',
  '#512DA8',
  '#303F9F',
  '#1976D2',
  '#0288D1',
  '#0097A7',
  '#00796B',
  '#388E3C',
  '#689F38',
  '#AFB42B',
  '#FBC02D',
  '#FFA000',
  '#F57C00',
  '#E64A19',
  '#5D4037',
  '#616161',
  '#455A64',
];

export default {
  types,
  stateColor,
  postColors,
  /*
   * Annotation Colors
   */
  getFreeColor(usedColors) {
    return postColors.filter(color => !usedColors.includes(color))[0];
  },

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
    return [].concat(...annotations).sort(sort);
  },
  concatAndFilterAnnotations(annotations, filter) {
    console.log(annotations);
    return [].concat(...annotations).filter(filter);
  },
  concatAnnotations(annotations) {
    console.log(annotations);
    return [].concat(...annotations);
  },
};
