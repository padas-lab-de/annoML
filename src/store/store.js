import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    debugging: true,
    visualization: {
      id: 5,
      selectable: true,
      fitChart: true,
    },
    annotation: {
      pointAnnotations: [],
      rectangleAnnotations: [],
      selectedAnnotation: null,
      currentPost: null,
      currentPointAnnotations: [],
      currentRectangleAnnotations: [],
      usedColors: [],
      colors: [
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
      ],
    },
  },
  getters: {
    getUsername: state => state.username,
    debug: state => state.debugging,
    visualizationSelectable: state => state.visualization.selectable,
    visualizationFit: state => state.visualization.fitChart,
    selectedAnnotation: state => state.annotation.selectedAnnotation,
    getColors: state => state.annotation.colors,
    getUsedColors: state => state.annotation.usedColors,
    getFreeColor: state => state.annotation.colors.filter(
      c => !state.annotation.usedColors.includes(c),
    )[0],
    getCurrentPost: state => state.annotation.currentPost,
    hasCurrentPost: state => state.annotation.currentPost !== null,
    pointAnnotations: state => state.annotation.pointAnnotations,
    rectangleAnnotations: state => state.annotation.rectangleAnnotations,
    currentPointAnnotations: state => state.annotation.currentPointAnnotations,
    currentRectangleAnnotations: state => state.annotation.currentRectangleAnnotations,
  },
  mutations: {
    toggleVisualizationFit(state) {
      state.visualization.fitChart = !state.visualization.fitChart;
    },
    enableSelectable(state) {
      state.visualization.selectable = true;
    },
    disableSelectable(state) {
      state.visualization.selectable = false;
    },
    addUsedColor(state, color) {
      if (!state.annotation.usedColors.includes(color)) {
        state.annotation.usedColors.push(color.toUpperCase());
      }
    },
    removeUsedColor(state, color) {
      if (color) {
        state.annotation.usedColors = state.annotation.usedColors.filter(
          c => c !== color.toUpperCase(),
        );
      }
    },
    setCurrentPost(state, post) {
      state.annotation.currentPost = post;
    },
    removeCurrentPost(state) {
      state.annotation.currentPost = null;
    },
    addPointAnnotation(state, pointAnnotation) {
      state.annotation.pointAnnotations.push(pointAnnotation);
    },
    addPointAnnotations(state, pointAnnotations) {
      state.annotation.pointAnnotations = state.annotation.pointAnnotations.concat(
        pointAnnotations,
      );
    },
    addRectangleAnnotation(state, rectangleAnnotation) {
      state.annotation.rectangleAnnotations.push(rectangleAnnotation);
    },
    addRectangleAnnotations(state, rectangleAnnotations) {
      state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.concat(
        rectangleAnnotations,
      );
    },
    addCurrentPointAnnotation(state, pointAnnotation) {
      state.annotation.currentPointAnnotations.push(pointAnnotation);
    },
    setCurrentPointAnnotations(state, pointAnnotations) {
      state.annotation.currentPointAnnotations = pointAnnotations;
    },
    addCurrentRectangleAnnotation(state, rectangleAnnotation) {
      state.annotation.currentRectangleAnnotations.push(rectangleAnnotation);
    },
    setCurrentRectangleAnnotations(state, rectangleAnnotations) {
      state.annotation.currentRecAnnotations = rectangleAnnotations;
    },
    removePointAnnotations(state, pointAnnotations) {
      state.annotation.pointAnnotations = state.annotation.pointAnnotations.filter(
        a => !pointAnnotations.find(a2 => a.id === a2.id),
      );
    },
    removeRectangleAnnotations(state, rectangleAnnotations) {
      state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.filter(
        a => !rectangleAnnotations.find(a2 => a.id === a2.id),
      );
    },
    clearCurrentAnnotations(state) {
      state.annotation.currentPointAnnotations = [];
      state.annotation.currentRectangleAnnotations = [];
    },
    mergeCurrentAnnotations(state) {
      state.annotation.pointAnnotations = state.annotation.pointAnnotations.concat(
        state.annotation.currentPointAnnotations,
      );
      state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.concat(
        state.annotation.rectangleAnnotations,
      );
    },
  },
  actions: {},
});
