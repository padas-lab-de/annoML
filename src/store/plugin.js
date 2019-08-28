import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    settings: {
      debug: true,
    },
    discussion: {
      published: false,
    },
    visualization: {
      showPointAnnotations: true,
      showFreePointAnnotations: true,
      showRectangleAnnotations: true,
      showFreeRectangleAnnotations: true,
      selectable: true,
      fitChart: true,
    },
    annotation: {
      pointAnnotations: [],
      rectangleAnnotations: [],
      currentPost: null,
      currentPointAnnotations: [],
      currentRectangleAnnotations: [],
      usedColors: [],
    },
  },
  getters: {
    debug: state => state.settings.debug,
    getSettings: state => state.settings,
    showPointAnnotations: state => state.visualization.showPointAnnotations,
    showFreePointAnnotations: state => state.visualization.showFreePointAnnotations,
    showRectangleAnnotations: state => state.visualization.showRectangleAnnotations,
    showFreeRectangleAnnotations: state => state.visualization.showFreeRectangleAnnotations,
    visualizationSelectable: state => state.visualization.selectable,
    visualizationFit: state => state.visualization.fitChart,
    getUsedColors: state => state.annotation.usedColors,
    getCurrentPost: state => state.annotation.currentPost,
    hasCurrentPost: state => state.annotation.currentPost !== null,
    pointAnnotations: state => state.annotation.pointAnnotations,
    rectangleAnnotations: state => state.annotation.rectangleAnnotations,
    currentPointAnnotations: state => state.annotation.currentPointAnnotations,
    currentRectangleAnnotations: state => state.annotation.currentRectangleAnnotations,
  },
  mutations: {
    clearStore(state) {
      state.annotation.pointAnnotations = [];
      state.annotation.rectangleAnnotations = [];
      state.annotation.currentPointAnnotations = [];
      state.annotation.currentRectangleAnnotations = [];
      state.annotation.currentPost = null;
      state.annotation.stateColor = [];
      state.visualization.showPointAnnotations = true;
      state.visualization.showFreePointAnnotations = true;
      state.visualization.showRectangleAnnotations = true;
      state.visualization.showFreeRectangleAnnotations = true;
      state.visualization.selectable = true;
      state.visualization.fitChart = true;
    },
    importSettings(state, settings) {
      state.settings = settings;
    },
    toggleShowPointAnnotations(state) {
      state.visualization.showPointAnnotations = !state.visualization
        .showPointAnnotations;
    },
    toggleShowFreePointAnnotations(state) {
      state.visualization.showFreePointAnnotations = !state.visualization
        .showFreeRectangleAnnotations;
    },
    toggleShowRectangleAnnotations(state) {
      state.visualization.showRectangleAnnotations = !state.visualization
        .showRectangleAnnotations;
    },
    toggleShowFreeRectangleAnnotations(state) {
      state.visualization.showFreeRectangleAnnotations = !state.visualization
        .showFreeRectangleAnnotations;
    },
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
    removeCurrentPointAnnotation(state, pointAnnotation) {
      state.annotation.currentPointAnnotations = state.annotation
        .currentPointAnnotations.filter(
          a => a.id !== pointAnnotation.id,
        );
    },
    setCurrentPointAnnotations(state, pointAnnotations) {
      state.annotation.currentPointAnnotations = pointAnnotations;
    },
    addCurrentRectangleAnnotation(state, rectangleAnnotation) {
      state.annotation.currentRectangleAnnotations.push(rectangleAnnotation);
    },
    removeCurrentRectangleAnnotation(state, rectangleAnnotation) {
      state.annotation.currentRectangleAnnotations = state.annotation
        .currentRectangleAnnotations.filter(
          a => a.id !== rectangleAnnotation.id,
        );
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

export default store;
