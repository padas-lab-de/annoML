/*!
 * annoml v1.0.13 
 * (c) 2019 Thomas Haefeker <thomas@haefeker.net>
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios'), require('bootstrap-vue'), require('@fortawesome/fontawesome-svg-core'), require('@fortawesome/free-solid-svg-icons'), require('@fortawesome/vue-fontawesome'), require('vue'), require('vuex'), require('d3-svg-annotation'), require('jsum'), require('vega-embed'), require('d3'), require('lodash'), require('tiptap'), require('tiptap-extensions'), require('vue-swatches')) :
  typeof define === 'function' && define.amd ? define(['axios', 'bootstrap-vue', '@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons', '@fortawesome/vue-fontawesome', 'vue', 'vuex', 'd3-svg-annotation', 'jsum', 'vega-embed', 'd3', 'lodash', 'tiptap', 'tiptap-extensions', 'vue-swatches'], factory) :
  (global = global || self, global.Annoml = factory(global.axios, global.BootstrapVue, global.fontawesomeSvgCore, global.freeSolidSvgIcons, global.vueFontawesome, global.Vue, global.Vuex, global.d3annotation, global.JSum, global.VegaEmbed, global.d3, global.lodash, global.tiptap, global.tiptapExtensions, global.Swatches));
}(this, function (axios, BootstrapVue, fontawesomeSvgCore, freeSolidSvgIcons, vueFontawesome, Vue, Vuex, d3annotation, JSum, VegaEmbed, d3, lodash, tiptap, tiptapExtensions, Swatches) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;
  BootstrapVue = BootstrapVue && BootstrapVue.hasOwnProperty('default') ? BootstrapVue['default'] : BootstrapVue;
  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
  Vuex = Vuex && Vuex.hasOwnProperty('default') ? Vuex['default'] : Vuex;
  var d3annotation__default = 'default' in d3annotation ? d3annotation['default'] : d3annotation;
  JSum = JSum && JSum.hasOwnProperty('default') ? JSum['default'] : JSum;
  VegaEmbed = VegaEmbed && VegaEmbed.hasOwnProperty('default') ? VegaEmbed['default'] : VegaEmbed;
  lodash = lodash && lodash.hasOwnProperty('default') ? lodash['default'] : lodash;
  Swatches = Swatches && Swatches.hasOwnProperty('default') ? Swatches['default'] : Swatches;

  Vue.use(Vuex);
  var store = new Vuex.Store({
    state: {
      settings: {
        debug: true
      },
      discussion: {
        published: false
      },
      visualization: {
        showPointAnnotations: true,
        showFreePointAnnotations: true,
        showRectangleAnnotations: true,
        showFreeRectangleAnnotations: true,
        selectable: true,
        fitChart: true
      },
      annotation: {
        pointAnnotations: [],
        rectangleAnnotations: [],
        currentPost: null,
        currentPointAnnotations: [],
        currentRectangleAnnotations: [],
        usedColors: []
      }
    },
    getters: {
      debug: function debug(state) {
        return state.settings.debug;
      },
      getSettings: function getSettings(state) {
        return state.settings;
      },
      showPointAnnotations: function showPointAnnotations(state) {
        return state.visualization.showPointAnnotations;
      },
      showFreePointAnnotations: function showFreePointAnnotations(state) {
        return state.visualization.showFreePointAnnotations;
      },
      showRectangleAnnotations: function showRectangleAnnotations(state) {
        return state.visualization.showRectangleAnnotations;
      },
      showFreeRectangleAnnotations: function showFreeRectangleAnnotations(state) {
        return state.visualization.showFreeRectangleAnnotations;
      },
      visualizationSelectable: function visualizationSelectable(state) {
        return state.visualization.selectable;
      },
      visualizationFit: function visualizationFit(state) {
        return state.visualization.fitChart;
      },
      getUsedColors: function getUsedColors(state) {
        return state.annotation.usedColors;
      },
      getCurrentPost: function getCurrentPost(state) {
        return state.annotation.currentPost;
      },
      hasCurrentPost: function hasCurrentPost(state) {
        return state.annotation.currentPost !== null;
      },
      pointAnnotations: function pointAnnotations(state) {
        return state.annotation.pointAnnotations;
      },
      rectangleAnnotations: function rectangleAnnotations(state) {
        return state.annotation.rectangleAnnotations;
      },
      currentPointAnnotations: function currentPointAnnotations(state) {
        return state.annotation.currentPointAnnotations;
      },
      currentRectangleAnnotations: function currentRectangleAnnotations(state) {
        return state.annotation.currentRectangleAnnotations;
      }
    },
    mutations: {
      clearStore: function clearStore(state) {
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
      importSettings: function importSettings(state, settings) {
        state.settings = settings;
      },
      toggleShowPointAnnotations: function toggleShowPointAnnotations(state) {
        state.visualization.showPointAnnotations = !state.visualization.showPointAnnotations;
      },
      toggleShowFreePointAnnotations: function toggleShowFreePointAnnotations(state) {
        state.visualization.showFreePointAnnotations = !state.visualization.showFreeRectangleAnnotations;
      },
      toggleShowRectangleAnnotations: function toggleShowRectangleAnnotations(state) {
        state.visualization.showRectangleAnnotations = !state.visualization.showRectangleAnnotations;
      },
      toggleShowFreeRectangleAnnotations: function toggleShowFreeRectangleAnnotations(state) {
        state.visualization.showFreeRectangleAnnotations = !state.visualization.showFreeRectangleAnnotations;
      },
      toggleVisualizationFit: function toggleVisualizationFit(state) {
        state.visualization.fitChart = !state.visualization.fitChart;
      },
      enableSelectable: function enableSelectable(state) {
        state.visualization.selectable = true;
      },
      disableSelectable: function disableSelectable(state) {
        state.visualization.selectable = false;
      },
      addUsedColor: function addUsedColor(state, color) {
        if (!state.annotation.usedColors.includes(color)) {
          state.annotation.usedColors.push(color.toUpperCase());
        }
      },
      removeUsedColor: function removeUsedColor(state, color) {
        if (color) {
          state.annotation.usedColors = state.annotation.usedColors.filter(function (c) {
            return c !== color.toUpperCase();
          });
        }
      },
      setCurrentPost: function setCurrentPost(state, post) {
        state.annotation.currentPost = post;
      },
      removeCurrentPost: function removeCurrentPost(state) {
        state.annotation.currentPost = null;
      },
      addPointAnnotation: function addPointAnnotation(state, pointAnnotation) {
        state.annotation.pointAnnotations.push(pointAnnotation);
      },
      addPointAnnotations: function addPointAnnotations(state, pointAnnotations) {
        state.annotation.pointAnnotations = state.annotation.pointAnnotations.concat(pointAnnotations);
      },
      addRectangleAnnotation: function addRectangleAnnotation(state, rectangleAnnotation) {
        state.annotation.rectangleAnnotations.push(rectangleAnnotation);
      },
      addRectangleAnnotations: function addRectangleAnnotations(state, rectangleAnnotations) {
        state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.concat(rectangleAnnotations);
      },
      addCurrentPointAnnotation: function addCurrentPointAnnotation(state, pointAnnotation) {
        state.annotation.currentPointAnnotations.push(pointAnnotation);
      },
      removeCurrentPointAnnotation: function removeCurrentPointAnnotation(state, pointAnnotation) {
        state.annotation.currentPointAnnotations = state.annotation.currentPointAnnotations.filter(function (a) {
          return a.id !== pointAnnotation.id;
        });
      },
      setCurrentPointAnnotations: function setCurrentPointAnnotations(state, pointAnnotations) {
        state.annotation.currentPointAnnotations = pointAnnotations;
      },
      addCurrentRectangleAnnotation: function addCurrentRectangleAnnotation(state, rectangleAnnotation) {
        state.annotation.currentRectangleAnnotations.push(rectangleAnnotation);
      },
      removeCurrentRectangleAnnotation: function removeCurrentRectangleAnnotation(state, rectangleAnnotation) {
        state.annotation.currentRectangleAnnotations = state.annotation.currentRectangleAnnotations.filter(function (a) {
          return a.id !== rectangleAnnotation.id;
        });
      },
      setCurrentRectangleAnnotations: function setCurrentRectangleAnnotations(state, rectangleAnnotations) {
        state.annotation.currentRecAnnotations = rectangleAnnotations;
      },
      removePointAnnotations: function removePointAnnotations(state, pointAnnotations) {
        state.annotation.pointAnnotations = state.annotation.pointAnnotations.filter(function (a) {
          return !pointAnnotations.find(function (a2) {
            return a.id === a2.id;
          });
        });
      },
      removeRectangleAnnotations: function removeRectangleAnnotations(state, rectangleAnnotations) {
        state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.filter(function (a) {
          return !rectangleAnnotations.find(function (a2) {
            return a.id === a2.id;
          });
        });
      },
      clearCurrentAnnotations: function clearCurrentAnnotations(state) {
        state.annotation.currentPointAnnotations = [];
        state.annotation.currentRectangleAnnotations = [];
      },
      mergeCurrentAnnotations: function mergeCurrentAnnotations(state) {
        state.annotation.pointAnnotations = state.annotation.pointAnnotations.concat(state.annotation.currentPointAnnotations);
        state.annotation.rectangleAnnotations = state.annotation.rectangleAnnotations.concat(state.annotation.rectangleAnnotations);
      }
    },
    actions: {}
  });

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  /* eslint-disable no-param-reassign,no-console */
  var types = {
    POINT: 'POINT',
    FREEPOINT: 'FREEPOINT',
    RECTANGLE: 'RECTANGLE',
    FREERECTANGLE: 'FREERECTANGLE'
  };
  var stateColor = {
    HIDDEN: 'gray',
    SELECTED: 'black'
  };
  var postColors = ['#D32F2F', '#C2185B', '#7B1FA2', '#512DA8', '#303F9F', '#1976D2', '#0288D1', '#0097A7', '#00796B', '#388E3C', '#689F38', '#AFB42B', '#FBC02D', '#FFA000', '#F57C00', '#E64A19', '#5D4037', '#616161', '#455A64'];
  var annotation = {
    types: types,
    stateColor: stateColor,
    postColors: postColors,

    /*
     * Annotation Colors
     */
    getFreeColor: function getFreeColor(usedColors) {
      return postColors.filter(function (color) {
        return !usedColors.includes(color);
      })[0];
    },

    /*
     * Annotation Handling
     */
    selectAnnotation: function selectAnnotation(annotations, annotation, color) {
      if (annotation.color === stateColor.SELECTED) {
        annotation.color = color;
      } else {
        annotations.forEach(function (annotationList) {
          annotationList.forEach(function (a) {
            if (a.id === annotation.id) {
              a.color = stateColor.SELECTED;
            } else {
              a.color = color;
            }
          });
        });
      }
    },
    hideAnnotation: function hideAnnotation(annotations, annotation, color) {
      if (annotation.color === stateColor.HIDDEN) {
        annotation.color = color;
      } else {
        annotations.forEach(function (annotationList) {
          annotationList.forEach(function (a) {
            if (a.id === annotation.id) {
              a.color = stateColor.HIDDEN;
            } else {
              a.color = color;
            }
          });
        });
      }
    },
    hideAnnotations: function hideAnnotations(annotations, hidden, color) {
      if (!hidden) {
        annotations.forEach(function (annotationList) {
          annotationList.forEach(function (a) {
            a.color = color;
          });
        });
      } else {
        annotations.forEach(function (annotationList) {
          annotationList.forEach(function (a) {
            a.color = stateColor.HIDDEN;
          });
        });
      }
    },

    /*
     *  Annotation List Helpers
     */
    concatAndSortAnnotations: function concatAndSortAnnotations(annotations, sort) {
      var _ref;

      return (_ref = []).concat.apply(_ref, _toConsumableArray(annotations)).sort(sort);
    },
    concatAndFilterAnnotations: function concatAndFilterAnnotations(annotations, filter) {
      var _ref2;

      return (_ref2 = []).concat.apply(_ref2, _toConsumableArray(annotations)).filter(filter);
    },
    concatAnnotations: function concatAnnotations(annotations) {
      var _ref3;

      return (_ref3 = []).concat.apply(_ref3, _toConsumableArray(annotations));
    }
  };

  var utils = {
    annotation: annotation
  };

  /* eslint-disable semi,no-console */
  var service = function service(instance) {
    return {
      /**
       * annoML API requests
       */
      getRecentDiscussions: function getRecentDiscussions(results) {
        var url = "/api/discussions/recent?results=".concat(results);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },
      getDiscussionsForVisualization: function getDiscussionsForVisualization(visualizationReference) {
        var url = "/api/discussions/visualizations/".concat(visualizationReference);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * annoML API create requests
       */
      createDiscussionWithUrl: function createDiscussionWithUrl(visualizationUrl) {
        var url = '/api/create/url';
        var body = {
          url: visualizationUrl
        };
        return instance.post(url, body).then(function (response) {
          return response.data;
        });
      },
      createDiscussionWithId: function createDiscussionWithId(visualizationId) {
        var url = '/api/create/reference';
        var body = {
          reference: visualizationId
        };
        return instance.post(url, body).then(function (response) {
          return response.data;
        });
      },
      createDiscussionWithSchema: function createDiscussionWithSchema(schema) {
        var url = '/api/create/reference';
        var body = schema;
        return instance.post(url, body).then(function (response) {
          return response.data;
        });
      },

      /**
       * Discussion Requests
       */
      getDiscussion: function getDiscussion(disId) {
        var url = "/discussions/".concat(disId);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },
      updateDiscussion: function updateDiscussion(discussionId, hash, title) {
        var url = "discussions/".concat(discussionId);
        var body = {
          hash: hash,
          title: title
        };
        return instance.put(url, body).then(function (response) {
          return response.data;
        });
      },
      deleteDiscussion: function deleteDiscussion(discussionId) {
        var url = "discussions/".concat(discussionId);
        return instance.delete(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * Question Requests
       */
      addQuestion: function addQuestion(discussionId, question) {
        var url = "/discussions/".concat(discussionId, "/question");
        return instance.post(url, question).then(function (response) {
          return response.data;
        });
      },
      updateQuestion: function updateQuestion(question) {
        var url = "/discussions/questions/".concat(question.id);
        return instance.put(url, question).then(function (response) {
          return response.data;
        });
      },
      deleteQuestion: function deleteQuestion(discussionId, question) {
        var url = "/discussions/questions/".concat(question.id);
        return instance.delete(url).then(function (response) {
          return response.data;
        });
      },
      upVoteQuestion: function upVoteQuestion(question) {
        var url = "/discussions/questions/".concat(question.id, "/vote/up");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },
      downVoteQuestion: function downVoteQuestion(question) {
        var url = "/discussions/questions/".concat(question.id, "/vote/down");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * Answer Requests
       */
      addAnswer: function addAnswer(questionId, answer) {
        var url = "/discussions/questions/".concat(questionId, "/answer");
        return instance.post(url, answer).then(function (response) {
          return response.data;
        });
      },
      updateAnswer: function updateAnswer(answer) {
        var url = "/discussions/answers/".concat(answer.id);
        return instance.put(url, answer).then(function (response) {
          return response.data;
        });
      },
      deleteAnswer: function deleteAnswer(answer) {
        var url = "/discussions/answers/".concat(answer.id);
        return instance.delete(url).then(function (response) {
          return response.data;
        });
      },
      upVoteAnswer: function upVoteAnswer(answer) {
        var url = "/discussions/answers/".concat(answer.id, "/vote/up");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },
      downVoteAnswer: function downVoteAnswer(answer) {
        var url = "/discussions/answers/".concat(answer.id, "/vote/down");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * Comment Requests
       */
      addComment: function addComment(answerId, comment) {
        var url = "/discussions/answers/".concat(answerId, "/comment");
        return instance.post(url, comment).then(function (response) {
          return response.data;
        });
      },
      updateComment: function updateComment(comment) {
        var url = "/discussions/comments/".concat(comment.id);
        return instance.put(url, comment).then(function (response) {
          return response.data;
        });
      },
      deleteComment: function deleteComment(comment) {
        var url = "/discussions/comments/".concat(comment.id);
        return instance.delete(url).then(function (response) {
          return response.data;
        });
      },
      upVoteComment: function upVoteComment(comment) {
        var url = "/discussions/comments/".concat(comment.id, "/vote/up");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },
      downVoteComment: function downVoteComment(comment) {
        var url = "/discussions/comments/".concat(comment.id, "/vote/down");
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * Visualization Requests
       */
      getVisualization: function getVisualization(visId) {
        var url = "/visualizations/".concat(visId);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * Visualization requests from external resource server
       */
      getResourceVisualization: function getResourceVisualization(path, id) {
        var url = "".concat(path, "/").concat(id);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      },

      /**
       * User data requests from external provider
       */
      getUser: function getUser(endpoint, userId) {
        var url = "".concat(endpoint, "/").concat(userId);
        return instance.get(url).then(function (response) {
          return response.data;
        });
      }
    };
  };

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  /* eslint-disable vue/require-default-prop,no-console */
  var script = {
    name: 'VegaAnnotationToolbar',
    props: {
      tools: Object,
      currentTool: Object
    },
    data: function data() {
      return {};
    },
    created: function created() {
      this.setTool(this.tools.pointAnnotation);
    },
    methods: {
      selectNoTool: function selectNoTool() {
        this.setTool(this.tools.noTool); // todo look at -> bootstrap-vue Button style radios
      },
      selectPointAnnotation: function selectPointAnnotation() {
        this.setTool(this.tools.pointAnnotation);
      },
      selectFreePointAnnotation: function selectFreePointAnnotation() {
        this.setTool(this.tools.freePointAnnotation);
      },
      selectRectangleAnnotation: function selectRectangleAnnotation() {
        this.setTool(this.tools.rectangleAnnotation);
      },
      selectFreeRectangleAnnotation: function selectFreeRectangleAnnotation() {
        this.setTool(this.tools.freeRectangleAnnotation);
      },
      setTool: function setTool(tool) {
        this.$emit('tool', tool);
      }
    }
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
  /* server only */
  , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
      createInjectorSSR = createInjector;
      createInjector = shadowMode;
      shadowMode = false;
    } // Vue.extend constructor export interop.


    var options = typeof script === 'function' ? script.options : script; // render functions

    if (template && template.render) {
      options.render = template.render;
      options.staticRenderFns = template.staticRenderFns;
      options._compiled = true; // functional template

      if (isFunctionalTemplate) {
        options.functional = true;
      }
    } // scopedId


    if (scopeId) {
      options._scopeId = scopeId;
    }

    var hook;

    if (moduleIdentifier) {
      // server build
      hook = function hook(context) {
        // 2.3 injection
        context = context || // cached call
        this.$vnode && this.$vnode.ssrContext || // stateful
        this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
        // 2.2 with runInNewContext: true

        if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
          context = __VUE_SSR_CONTEXT__;
        } // inject component styles


        if (style) {
          style.call(this, createInjectorSSR(context));
        } // register component module identifier for async chunk inference


        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      }; // used by ssr in case component is cached and beforeCreate
      // never gets called


      options._ssrRegister = hook;
    } else if (style) {
      hook = shadowMode ? function () {
        style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
      } : function (context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook) {
      if (options.functional) {
        // register for functional component in vue file
        var originalRender = options.render;

        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }

    return script;
  }

  var normalizeComponent_1 = normalizeComponent;

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());

  function createInjector(context) {
    return function (id, style) {
      return addStyle(id, style);
    };
  }

  var HEAD = document.head || document.getElementsByTagName('head')[0];
  var styles = {};

  function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: new Set(),
      styles: []
    });

    if (!style.ids.has(id)) {
      style.ids.add(id);
      var code = css.source;

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (!style.element) {
        style.element = document.createElement('style');
        style.element.type = 'text/css';
        if (css.media) style.element.setAttribute('media', css.media);
        HEAD.appendChild(style.element);
      }

      if ('styleSheet' in style.element) {
        style.styles.push(code);
        style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
      } else {
        var index = style.ids.size - 1;
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  }

  var browser = createInjector;

  /* script */
  const __vue_script__ = script;

  /* template */
  var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-button-toolbar',{staticClass:"mb-2"},[_c('b-button-group',{staticClass:"annotation-tools"},[(!_vm.tools.noTool.disabled)?_c('b-button',{attrs:{"disabled":!_vm.$annomlstore.getters.visualizationSelectable,"pressed":_vm.currentTool === _vm.tools.noTool},on:{"click":_vm.selectNoTool}},[_c('font-awesome-icon',{attrs:{"icon":"hand-paper"}})],1):_vm._e(),_vm._v(" "),(!_vm.tools.pointAnnotation.disabled)?_c('b-button',{attrs:{"disabled":!_vm.$annomlstore.getters.visualizationSelectable ||
              !_vm.$annomlstore.getters.showPointAnnotations,"pressed":_vm.currentTool === _vm.tools.pointAnnotation},on:{"click":_vm.selectPointAnnotation}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1),_vm._v("\n        Point")],1):_vm._e(),_vm._v(" "),(!_vm.tools.freePointAnnotation.disabled)?_c('b-button',{attrs:{"disabled":!_vm.$annomlstore.getters.visualizationSelectable ||
              !_vm.$annomlstore.getters.showFreePointAnnotations,"pressed":_vm.currentTool === _vm.tools.freePointAnnotation},on:{"click":_vm.selectFreePointAnnotation}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"circle","transform":"shrink-9 down-7 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-5 right-6"}})],1),_vm._v("\n        Free Point")],1):_vm._e(),_vm._v(" "),(!_vm.tools.rectangleAnnotation.disabled)?_c('b-button',{attrs:{"disabled":!_vm.$annomlstore.getters.visualizationSelectable ||
              !_vm.$annomlstore.getters.showRectangleAnnotations,"pressed":_vm.currentTool === _vm.tools.rectangleAnnotation},on:{"click":_vm.selectRectangleAnnotation}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1),_vm._v("\n        Rectangle")],1):_vm._e(),_vm._v(" "),(!_vm.tools.freeRectangleAnnotation.disabled)?_c('b-button',{attrs:{"disabled":!_vm.$annomlstore.getters.visualizationSelectable ||
              !_vm.$annomlstore.getters.showFreeRectangleAnnotations,"pressed":_vm.currentTool === _vm.tools.freeRectangleAnnotation},on:{"click":_vm.selectFreeRectangleAnnotation}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"circle","transform":"shrink-9 down-6 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-4 right-6"}})],1),_vm._v("\n        Free Rectangle")],1):_vm._e()],1),_vm._v(" "),_c('b-dropdown',{staticClass:"mx-1 ",attrs:{"right":"","text":"Annotations"}},[(!_vm.tools.pointAnnotation.disabled)?_c('b-dropdown-item',{attrs:{"active":_vm.$annomlstore.getters.showPointAnnotations},on:{"click":function($event){return _vm.$annomlstore.commit('toggleShowPointAnnotations')}}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1),_vm._v("\n        Point Annotations")],1):_vm._e(),_vm._v(" "),(!_vm.tools.freePointAnnotation.disabled)?_c('b-dropdown-item',{attrs:{"active":_vm.$annomlstore.getters.showFreePointAnnotations},on:{"click":function($event){return _vm.$annomlstore.commit('toggleShowFreePointAnnotations')}}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'black' }),attrs:{"icon":"circle","transform":"shrink-9 down-7 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-5 right-6"}})],1),_vm._v("\n        Free Point Annotations")],1):_vm._e(),_vm._v(" "),(!_vm.tools.rectangleAnnotation.disabled)?_c('b-dropdown-item',{attrs:{"active":_vm.$annomlstore.getters.showRectangleAnnotations},on:{"click":function($event){return _vm.$annomlstore.commit('toggleShowRectangleAnnotations')}}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1),_vm._v("\n        Rectangle Annotations")],1):_vm._e(),_vm._v(" "),(!_vm.tools.freeRectangleAnnotation.disabled)?_c('b-dropdown-item',{attrs:{"active":_vm.$annomlstore.getters.showFreeRectangleAnnotations},on:{"click":function($event){return _vm.$annomlstore.commit('toggleShowFreeRectangleAnnotations')}}},[_c('font-awesome-layers',{staticClass:"mr-1"},[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'black' }),attrs:{"icon":"circle","transform":"shrink-9 down-6 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-4 right-6"}})],1),_vm._v("\n        Free Rectangle Annotations")],1):_vm._e()],1),_vm._v(" "),_c('b-dropdown',{staticClass:"mx-1 ",attrs:{"right":"","text":"Options"}},[_c('b-dropdown-item',{attrs:{"active":_vm.$annomlstore.getters.visualizationFit},on:{"click":function($event){return _vm.$annomlstore.commit('toggleVisualizationFit')}}},[_c('font-awesome-icon',{attrs:{"icon":"expand-arrows-alt"}}),_vm._v(" Fit\n        Chat")],1)],1)],1)],1)};
  var __vue_staticRenderFns__ = [];

    /* style */
    const __vue_inject_styles__ = function (inject) {
      if (!inject) return
      inject("data-v-288e7a4e_0", { source: ".status-tile[data-v-288e7a4e]{display:block;border-radius:20px;padding:5px;border:2px solid gray;color:gray}.selectable[data-v-288e7a4e]{border:2px solid green;color:green}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__ = "data-v-288e7a4e";
    /* module identifier */
    const __vue_module_identifier__ = undefined;
    /* functional template */
    const __vue_is_functional_template__ = false;
    /* style inject SSR */
    

    
    var VegaAnnotationOptions = normalizeComponent_1(
      { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
      __vue_inject_styles__,
      __vue_script__,
      __vue_scope_id__,
      __vue_is_functional_template__,
      __vue_module_identifier__,
      browser,
      undefined
    );

  //
  var script$1 = {
    name: 'VegaChart',
    props: {
      chart: {
        type: Object,
        default: function _default() {
          return null;
        }
      },
      annotations: {
        type: Object,
        default: function _default() {
          return {
            pointAnnotations: [],
            rectangleAnnotations: []
          };
        }
      },
      tempAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        view: null,
        hideAnnotations: false,
        svgAnnotations: {
          tempAnnotations: null,
          pointAnnotations: null,
          rectangleAnnotations: null
        },
        doubleClickTime: 0,
        doubleClickThreshold: 400,
        options: {
          logLevel: 'debug',
          renderer: 'svg',
          actions: false // set true to show vega-embed options

        },
        defaultWidth: 600,
        defaultHeight: 600,
        size: {},
        annotationOptions: {
          annotationSize: 2,
          editMode: false,
          hideOtherAnnotations: true
        }
      };
    },
    watch: {
      view: function view(newView, oldView) {
        if (this.view) {
          if (oldView) {
            this.unbindEvents(oldView);
          }

          if (newView) {
            this.bindEvents(newView);
          }
        }
      },
      chart: {
        handler: function handler() {
          if (this.chart) {
            this.updateChart();
          }
        }
      },
      annotations: {
        handler: function handler() {
          this.drawAnnotations();
        },
        deep: true
      },
      tempAnnotations: {
        handler: function handler() {
          this.drawAnnotations();
        },
        deep: true
      }
    },
    mounted: function mounted() {
      var _this = this;

      this.$annomlstore.watch(function (state, getters) {
        return getters.showPointAnnotations;
      }, function () {
        return _this.drawAnnotations();
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.showFreePointAnnotations;
      }, function () {
        return _this.drawAnnotations();
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.showRectangleAnnotations;
      }, function () {
        return _this.drawAnnotations();
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.showFreeRectangleAnnotations;
      }, function () {
        return _this.drawAnnotations();
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.visualizationFit;
      }, function (fit) {
        if (fit) {
          _this.createChart();
        } else {
          _this.chart.width = _this.defaultWidth;
          _this.chart.height = _this.defaultHeight;

          _this.updateChart();
        }
      });
      this.createChart();
      window.addEventListener('resize', function () {
        console.log('resize');
        setTimeout(_this.resize(), 300);
        /* Chrome dimensions update delay */
      });
    },
    beforeDestroy: function beforeDestroy() {
      window.removeEventListener('resize', function () {});
      this.unbindEvents(this.view);
      this.view.finalize();
    },
    methods: {
      createChart: function createChart() {
        var _this2 = this;

        this.setDefaultSize(this.chart);
        var size = this.calculateVisualizationSize();
        this.chart.width = size.width - 90; // Bootstrap sizing issue

        this.chart.height = size.height;
        var self = this;
        VegaEmbed(this.$refs.chart, this.chart, this.options).then(function (result) {
          self.view = result.view;

          _this2.drawAnnotations();

          var containerEl = document.getElementById('visualization-container');
          self.size.widthOffset = containerEl.clientWidth - self.view.width();
          self.size.heightOffset = containerEl.clientHeight - self.view.height();
        });
      },
      updateChart: function updateChart() {
        var _this3 = this;

        // Removes the added padding from the container dimensions added by vega-embed
        this.view.width(this.chart.width);
        this.view.height(this.chart.height);
        this.view.runAsync().then(function () {
          _this3.drawAnnotations();
        });
      },

      /**
       * Event Handling
       */
      bindEvents: function bindEvents(view) {
        var _this4 = this;

        view.addEventListener('click', this.clickHandler);
        view.addEventListener('wheel', function () {
          if (!_this4.hideAnnotations) {
            _this4.hideAnnotations = true;

            _this4.removeAnnotations();
          } else {
            _this4.redrawAnnoations(_this4);
          }
        });
        view.addEventListener('mousedown', function () {
          _this4.removeAnnotations();
        });
        view.addEventListener('mouseup', function () {
          _this4.drawAnnotations();
        });
      },
      unbindEvents: function unbindEvents(view) {
        view.removeEventListener('click');
      },
      clickHandler: function clickHandler(event, item) {
        // Only emits events if tooltip object is present means an distict datapoint is present
        if (item.tooltip) {
          this.$emit('click', item);
        }
      },
      redrawAnnoations: lodash.debounce(function (self) {
        self.hideAnnotations = false;
        self.drawAnnotations();
      }, 100),

      /**
       * Annotations
       */
      drawAnnotations: function drawAnnotations() {
        var svg = d3.select(this.$refs.chart.getElementsByTagName('svg')[0]); // CLEAR OLD ANNOTATIONS

        this.removeAnnotations(); // TEMP ANNOTATIONS

        if (this.tempAnnotations.length > 0) {
          this.svgAnnotations.tempAnnotations = this.makeAnnotations(this.tempAnnotations, d3annotation.annotationBadge);
          svg.append('g').attr('class', 'annotation-group-temp').call(this.svgAnnotations.tempAnnotations);
        }

        if (!this.annotationOptions.hideOtherAnnotations || this.tempAnnotations.length <= 0) {
          // POINT ANNOTATIONS
          if (this.annotations.pointAnnotations.length > 0 && this.$annomlstore.getters.showPointAnnotations) {
            this.svgAnnotations.pointAnnotations = this.makeAnnotations(this.annotations.pointAnnotations.filter(function (a) {
              return a.color !== utils.annotation.stateColor.HIDDEN;
            }), d3annotation.annotationCalloutCircle);
            svg.append('g').attr('class', 'annotation-group-points').call(this.svgAnnotations.pointAnnotations);
          } // RECTANGLE ANNOTATIONS


          if (this.annotations.rectangleAnnotations.length > 0 && this.$annomlstore.getters.showRectangleAnnotations) {
            this.svgAnnotations.rectangleAnnotations = this.makeRectangleAnnotations(this.annotations.rectangleAnnotations.filter(function (a) {
              return a.color !== utils.annotation.stateColor.HIDDEN;
            }), d3annotation.annotationCalloutRect);
            svg.append('g').attr('class', 'annotation-group-rectangles').call(this.svgAnnotations.rectangleAnnotations);
          }
        }
        /* FIX for missing check for item.mark.marktype in vega event-extend.js */


        d3.selectAll('.annotations').each(function (items) {
          items.annotations.forEach(function (i) {
            var item = i;
            item.mark = {
              marktype: null
            };
          });
        });
      },
      makeAnnotations: function makeAnnotations(annotations, annotationType) {
        var _this5 = this;

        return d3annotation.annotation().editMode(this.annotationOptions.editMode).type(annotationType).accessors({
          x: function x(d) {
            return _this5.calculateXCoordinate(d);
          },
          y: function y(d) {
            return _this5.calculateYCoordinate(d);
          }
        }).annotations(annotations);
      },
      makeRectangleAnnotations: function makeRectangleAnnotations(rectangleAnnotations, annotationType) {
        var _this6 = this;

        var annotations = [];
        rectangleAnnotations.forEach(function (rectangleAnnotation) {
          var annotation = {
            annotationType: rectangleAnnotation.annotationType,
            id: rectangleAnnotation.id,
            note: rectangleAnnotation.note,
            color: rectangleAnnotation.color,
            data: rectangleAnnotation.data.p1,
            subject: {
              width: _this6.calculateXCoordinate(rectangleAnnotation.data.p2) - _this6.calculateXCoordinate(rectangleAnnotation.data.p1),
              height: _this6.calculateYCoordinate(rectangleAnnotation.data.p2) - _this6.calculateYCoordinate(rectangleAnnotation.data.p1)
            }
          };
          annotations.push(annotation);
        });
        return d3annotation.annotation().editMode(this.annotationOptions.editMode).type(annotationType).accessors({
          x: function x(d) {
            return _this6.calculateXCoordinate(d);
          },
          y: function y(d) {
            return _this6.calculateYCoordinate(d);
          }
        }).annotations(annotations);
      },
      calculateXCoordinate: function calculateXCoordinate(datapoint) {
        var _this7 = this;

        var x = this.view.scale('x');
        return x(datapoint[// Search data object key for the field name at the end because
        // other encoding operations like e.g. bin will prepend thier name the field name
        Object.keys(datapoint).filter(function (d) {
          return d.endsWith(_this7.chart.encoding.x.field);
        })]) + this.view.origin()[0] // because of d3 and vega having a difference in padding measurement
        + this.view.padding().left // see https://vega.github.io/vega/docs/api/view/
        ;
      },
      calculateYCoordinate: function calculateYCoordinate(datapoint) {
        var _this8 = this;

        var y = this.view.scale('y');
        return y(datapoint[// Search data object key for the field name at the end because
        // other encoding operations like e.g. bin will prepend thier name to the field name
        Object.keys(datapoint).filter(function (d) {
          return d.endsWith(_this8.chart.encoding.y.field);
        })]) + this.view.origin()[1] // because of d3 and vega having a difference in padding measurement
        + this.view.padding().top // see https://vega.github.io/vega/docs/api/view/
        ;
      },
      removeAnnotations: function removeAnnotations() {
        d3.selectAll('.annotation-group-temp').remove();
        d3.selectAll('.annotation-group-points').remove();
        d3.selectAll('.annotation-group-rectangles').remove();
      },

      /**
       * HELPER FUNCTIONS
       */
      setDefaultSize: function setDefaultSize(spec) {
        if (spec.width) {
          this.defaultWidth = spec.width;
        } else if (spec.config && spec.config.view) {
          if (spec.config.view.width) {
            this.defaultWidth = spec.config.view.width;
          } else {
            console.log('SIZE: using deafault width');
          }
        }

        if (spec.height) {
          this.defaultHeight = spec.height;
        } else if (spec.config && spec.config.view) {
          if (spec.config.view.height) {
            this.defaultHeight = spec.config.view.height;
          } else {
            console.log('SIZE: using deafault height');
          }
        }
      },
      getContainerSize: function getContainerSize() {
        var container = document.getElementById('visualization-container');
        var width = container.clientWidth;
        var height = container.innerHeight;

        if (container.innerHeight > window.innerHeight) {
          height = window.innerHeight - 200;
        }

        return {
          width: width,
          height: height
        };
      },
      calculateVisualizationSize: function calculateVisualizationSize() {
        var containerWidth = this.getContainerSize().width;
        var containerHeight = this.getContainerSize().height;
        var width = this.defaultWidth;
        var height = this.defaultHeight;
        var scaleFactor = 1;

        if (this.$annomlstore.getters.visualizationFit) {
          var scaleFactorWidth = 1;

          if (containerWidth > 0) {
            scaleFactorWidth = containerWidth / width;
          }

          var scaleFactorHeight = 1;

          if (containerHeight > 0) {
            scaleFactorHeight = containerHeight / height;
          }

          scaleFactor = scaleFactorHeight > scaleFactorWidth ? scaleFactorHeight : scaleFactorWidth;
        } else {
          if (width > containerWidth && containerWidth > 0) {
            scaleFactor = containerWidth / width;
          }

          if (height > containerHeight && containerHeight > 0) {
            scaleFactor = containerHeight / height;
          }
        }

        if (scaleFactor !== 1) {
          width = Math.floor(width * scaleFactor);
          height = Math.floor(height * scaleFactor);
        }

        return {
          width: width,
          height: height,
          scaleFactor: scaleFactor
        };
      },
      resize: function resize() {
        // Removes the added padding from the container dimensions added by vega-embed
        var newSize = this.calculateVisualizationSize();

        if (newSize.width.valueOf() !== this.chart.width.valueOf() || newSize.height.valueOf() !== this.chart.height.valueOf()) {
          if (this.size.widthOffset && this.$annomlstore.visualizationFit) {
            this.chart.width = newSize.width - this.size.widthOffset;
          } else {
            this.chart.width = newSize.width;
          }

          if (this.size.heightOffset && this.$annomlstore.visualizationFit) {
            this.chart.height = newSize.height - this.size.heightOffset;
          } else {
            this.chart.height = newSize.height;
          }

          this.updateChart();
        }
      }
    }
  };

  /* script */
  const __vue_script__$1 = script$1;

  /* template */
  var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"chart",attrs:{"id":"chart"}})};
  var __vue_staticRenderFns__$1 = [];

    /* style */
    const __vue_inject_styles__$1 = function (inject) {
      if (!inject) return
      inject("data-v-c8f97854_0", { source: "#vis[data-v-c8f97854]{width:100%}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$1 = "data-v-c8f97854";
    /* module identifier */
    const __vue_module_identifier__$1 = undefined;
    /* functional template */
    const __vue_is_functional_template__$1 = false;
    /* style inject SSR */
    

    
    var VegaChart = normalizeComponent_1(
      { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
      __vue_inject_styles__$1,
      __vue_script__$1,
      __vue_scope_id__$1,
      __vue_is_functional_template__$1,
      __vue_module_identifier__$1,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$2 = {
    name: 'Loading',
    props: {
      message: {
        type: String,
        default: function _default() {
          return 'Loading';
        }
      },
      warning: {
        type: String,
        default: function _default() {
          return null;
        }
      }
    }
  };

  /* script */
  const __vue_script__$2 = script$2;

  /* template */
  var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"loading"},[(_vm.warning)?_c('div',[_c('font-awesome-icon',{style:({ color: 'black' }),attrs:{"size":"lg","icon":"exclamation-circle"}}),_vm._v(" "),_c('h4',[_vm._v(_vm._s(_vm.warning))])],1):_c('div',[(!_vm.warning)?_c('b-spinner',{staticStyle:{"width":"3rem","height":"3rem"},attrs:{"label":_vm.message}}):_vm._e(),_vm._v(" "),_c('h4',[_vm._v(_vm._s(_vm.message))])],1)])};
  var __vue_staticRenderFns__$2 = [];

    /* style */
    const __vue_inject_styles__$2 = function (inject) {
      if (!inject) return
      inject("data-v-50ca6424_0", { source: ".loading[data-v-50ca6424]{display:block;width:100%;height:100%;text-align:center;padding-top:20%}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$2 = "data-v-50ca6424";
    /* module identifier */
    const __vue_module_identifier__$2 = undefined;
    /* functional template */
    const __vue_is_functional_template__$2 = false;
    /* style inject SSR */
    

    
    var Loading = normalizeComponent_1(
      { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
      __vue_inject_styles__$2,
      __vue_script__$2,
      __vue_scope_id__$2,
      __vue_is_functional_template__$2,
      __vue_module_identifier__$2,
      browser,
      undefined
    );

  //
  var script$3 = {
    name: 'VisualizationView',
    components: {
      Loading: Loading,
      VegaAnnotationOptions: VegaAnnotationOptions,
      VegaChart: VegaChart
    },
    props: {
      discussion: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        visualization: null,
        chart: null,
        questions: null,
        annotation: null,
        currentTool: null,
        tempAnnotations: [],
        vegaAnnotations: {
          pointAnnotations: [],
          rectangleAnnotations: []
        },
        tools: {
          noTool: {
            type: d3annotation__default.annotationBadge,
            disabled: false
          },
          pointAnnotation: {
            name: utils.annotation.types.POINT,
            type: d3annotation__default.annotationCalloutCircle,
            disabled: false
          },
          freePointAnnotation: {
            name: utils.annotation.types.FREEPOINT,
            type: d3annotation__default.annotationCalloutCircle,
            disabled: true
          },
          rectangleAnnotation: {
            name: utils.annotation.types.RECTANGLE,
            type: d3annotation__default.annotationCalloutRect,
            tempPoint: null,
            disabled: false
          },
          freeRectangleAnnotation: {
            name: utils.annotation.types.FREERECTANGLE,
            type: d3annotation__default.annotationCalloutRect,
            tempPoint: null,
            disabled: true
          }
        },
        visualizationFailed: false,
        resourceFailed: false,
        modifiedWarning: false
      };
    },
    created: function created() {
      var _this = this;

      service(this.$serviceApi).getVisualization(this.discussion.visualization.id).then(function (data) {
        _this.visualization = data;

        if (_this.visualization.schema) {
          _this.chart = _this.visualization.schema;
        } else if (_this.visualization.reference) {
          service(_this.$resourceApi).getResourceVisualization(_this.$annomlsettings.resourceProvider.endpoints.visualization, _this.visualization.reference, _this.$annomlsettings.resourceProvider.accessToken).then(function (visualization) {
            _this.visualization = visualization;
            _this.chart = JSON.parse(visualization.schema);
          }).catch(function (error) {
            console.log(error);
            _this.resourceFailed = true;
          });
        } else {
          console.log(_this.visualization.url);
        }
      }).catch(function (error) {
        console.log(error);
        _this.visualizationFailed = false;
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.pointAnnotations;
      }, function (pointAnnotations) {
        _this.vegaAnnotations.pointAnnotations = utils.annotation.concatAnnotations([pointAnnotations, _this.$annomlstore.getters.currentPointAnnotations]);
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.rectangleAnnotations;
      }, function (rectangleAnnotations) {
        _this.vegaAnnotations.rectangleAnnotations = utils.annotation.concatAnnotations([rectangleAnnotations, _this.$annomlstore.getters.currentRectangleAnnotations]);
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.currentPointAnnotations;
      }, function (currentPointAnnotations) {
        _this.vegaAnnotations.pointAnnotations = utils.annotation.concatAnnotations([currentPointAnnotations, _this.$annomlstore.getters.pointAnnotations]);
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.currentRectangleAnnotations;
      }, function (currentRectangleAnnotations) {
        _this.vegaAnnotations.rectangleAnnotations = utils.annotation.concatAnnotations([currentRectangleAnnotations, _this.$annomlstore.getters.rectangleAnnotations]);
      });
    },
    watch: {
      chart: function chart() {
        if (this.chart) {
          if (this.discussion.visualizationHash) {
            var hash = JSum.digest(this.chart, 'SHA256', 'hex');

            if (hash !== this.discussion.visualizationHash) {
              this.modifiedWarning = true;
            }
          } else if (this.$annomlsettings.currentUser === this.discussion.author.externalId) {
            this.discussion.visualizationHash = JSum.digest(this.chart, 'SHA256', 'hex');
            this.modifiedWarning = false;
          }
        }
      }
    },
    methods: {
      /**
       * Annotation creation
       */
      createAnnotation: function createAnnotation(item) {
        if (item.datum) {
          if (this.$annomlstore.getters.visualizationSelectable) {
            if (this.currentTool === this.tools.pointAnnotation) {
              this.addPointAnnotation(item);
            } else if (this.currentTool === this.tools.rectangleAnnotation) {
              if (this.tools.rectangleAnnotation.tempPoint === null) {
                this.tools.rectangleAnnotation.tempPoint = item;
                this.addTempPointAnnotation(item);
              } else if (this.tools.rectangleAnnotation.tempPoint) {
                this.addRectangleAnnotation(item);
              }
            }
          }
        }
      },
      clearTempPoints: function clearTempPoints() {
        this.tempAnnotations = [];
        this.tools.rectangleAnnotation.tempPoint = null;
      },
      addTempPointAnnotation: function addTempPointAnnotation(item) {
        var annotation = {};
        annotation.annotationType = 'TEMP';
        annotation.data = item.datum;
        annotation.subject = {
          radius: 5
        };
        annotation.color = utils.annotation.stateColor.SELECTED;
        this.tempAnnotations.push(annotation);
      },
      addPointAnnotation: function addPointAnnotation(item) {
        this.$annomlstore.commit('disableSelectable');
        var annotation = {};
        annotation.annotationType = this.tools.pointAnnotation.name;
        annotation.id = Date.now();
        annotation.note = {
          title: 'Point Annotation'
        };
        annotation.subject = {
          radius: 8
        };
        annotation.data = item.datum;

        if (this.$annomlstore.getters.hasCurrentPost) {
          annotation.color = this.$annomlstore.getters.getCurrentPost.color;
        } else {
          annotation.color = utils.annotation.stateColor.SELECTED;
        }

        this.$annomlstore.commit('addCurrentPointAnnotation', annotation);
      },
      addRectangleAnnotation: function addRectangleAnnotation(item) {
        var startPoint = this.tools.rectangleAnnotation.tempPoint;
        var annotation = {};
        annotation.annotationType = this.tools.rectangleAnnotation.name;
        annotation.id = Date.now();
        annotation.note = {
          title: 'Rectangle Annotation'
        };
        annotation.data = {
          p1: startPoint.datum,
          p2: item.datum
        };
        annotation.subject = {
          width: item.x - startPoint.x,
          height: item.y - startPoint.y
        };

        if (this.$annomlstore.getters.hasCurrentPost) {
          annotation.color = this.$annomlstore.getters.getCurrentPost.color;
        } else {
          annotation.color = utils.annotation.stateColor.SELECTED;
        }

        this.$annomlstore.commit('addCurrentRectangleAnnotation', annotation);
        this.clearTempPoints();
      },
      setTool: function setTool(newTool) {
        this.currentTool = newTool;
      }
    }
  };

  /* script */
  const __vue_script__$3 = script$3;

  /* template */
  var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.visualization)?_c('div',{ref:"vis",staticClass:"visualization-view mt-4"},[_c('div',{staticClass:"visualization"},[_c('vega-annotation-options',{attrs:{"tools":_vm.tools,"current-tool":_vm.currentTool},on:{"tool":_vm.setTool}}),_vm._v(" "),_c('b-alert',{attrs:{"show":_vm.visualizationFailed,"variant":"danger"}},[_vm._v("\n      Loading visualization failed!\n    ")]),_vm._v(" "),_c('b-alert',{attrs:{"show":_vm.resourceFailed,"variant":"warning"}},[_vm._v("\n      Visualization cannot been loaded!\n    ")]),_vm._v(" "),_c('b-alert',{attrs:{"show":_vm.modifiedWarning,"dismissible":"","variant":"info"}},[_vm._v("\n      Visualization was modified by resource owner!\n    ")]),_vm._v(" "),(_vm.chart)?_c('div',{attrs:{"id":"visualization-container"}},[_c('vega-chart',{attrs:{"visualiazion-id":_vm.visualization.id,"chart":_vm.chart,"annotations":_vm.vegaAnnotations,"temp-annotations":_vm.tempAnnotations},on:{"click":_vm.createAnnotation}}),(_vm.$annomlstore.getters.debug)?_c('span',{staticStyle:{"color":"lightgray"}},[_vm._v("\n        Hash: "+_vm._s(_vm.discussion.visualizationHash))]):_vm._e()],1):_c('loading',{attrs:{"message":'Loading Visualization'}})],1),_vm._v(" "),(_vm.visualization.description)?_c('p',[_vm._v(_vm._s(_vm.visualization.description))]):_vm._e()]):_vm._e()};
  var __vue_staticRenderFns__$3 = [];

    /* style */
    const __vue_inject_styles__$3 = undefined;
    /* scoped */
    const __vue_scope_id__$3 = "data-v-429858f2";
    /* module identifier */
    const __vue_module_identifier__$3 = undefined;
    /* functional template */
    const __vue_is_functional_template__$3 = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var VisualizationView = normalizeComponent_1(
      { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
      __vue_inject_styles__$3,
      __vue_script__$3,
      __vue_scope_id__$3,
      __vue_is_functional_template__$3,
      __vue_module_identifier__$3,
      undefined,
      undefined
    );

  var _e = function e() {
    return (_e = Object.assign || function (e) {
      for (var t, r = 1, s = arguments.length; r < s; r++) {
        for (var a in t = arguments[r]) {
          Object.prototype.hasOwnProperty.call(t, a) && (e[a] = t[a]);
        }
      }

      return e;
    }).apply(this, arguments);
  },
      t = {
    kebab: /-(\w)/g,
    styleProp: /:(.*)/,
    styleList: /;(?![^(]*\))/g
  };

  function r(e, t) {
    return t ? t.toUpperCase() : "";
  }

  function s(e) {
    for (var s, a = {}, c = 0, o = e.split(t.styleList); c < o.length; c++) {
      var n = o[c].split(t.styleProp),
          i = n[0],
          l = n[1];
      (i = i.trim()) && ("string" == typeof l && (l = l.trim()), a[(s = i, s.replace(t.kebab, r))] = l);
    }

    return a;
  }

  function a() {
    for (var t, r, a = {}, c = arguments.length; c--;) {
      for (var o = 0, n = Object.keys(arguments[c]); o < n.length; o++) {
        switch (t = n[o]) {
          case "class":
          case "style":
          case "directives":
            if (Array.isArray(a[t]) || (a[t] = []), "style" === t) {
              var i = void 0;
              i = Array.isArray(arguments[c].style) ? arguments[c].style : [arguments[c].style];

              for (var l = 0; l < i.length; l++) {
                var y = i[l];
                "string" == typeof y && (i[l] = s(y));
              }

              arguments[c].style = i;
            }

            a[t] = a[t].concat(arguments[c][t]);
            break;

          case "staticClass":
            if (!arguments[c][t]) break;
            void 0 === a[t] && (a[t] = ""), a[t] && (a[t] += " "), a[t] += arguments[c][t].trim();
            break;

          case "on":
          case "nativeOn":
            a[t] || (a[t] = {});

            for (var p = 0, f = Object.keys(arguments[c][t] || {}); p < f.length; p++) {
              r = f[p], a[t][r] ? a[t][r] = [].concat(a[t][r], arguments[c][t][r]) : a[t][r] = arguments[c][t][r];
            }

            break;

          case "attrs":
          case "props":
          case "domProps":
          case "scopedSlots":
          case "staticStyle":
          case "hook":
          case "transition":
            a[t] || (a[t] = {}), a[t] = _e({}, arguments[c][t], a[t]);
            break;

          case "slot":
          case "key":
          case "ref":
          case "tag":
          case "show":
          case "keepAlive":
          default:
            a[t] || (a[t] = arguments[c][t]);
        }
      }
    }

    return a;
  }

  // --- Static ---
  var isArray = Array.isArray; // --- Instance ---

  var arrayIncludes = function arrayIncludes(array, value) {
    return array.indexOf(value) !== -1;
  };

  function _typeof$1(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$1 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$1 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$1(obj);
  }

  var assign = Object.assign;
  var keys = Object.keys;
  var freeze = Object.freeze;
  var create = Object.create;

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   * Note object could be a complex type like array, date, etc.
   */

  var isObject = function isObject(obj) {
    return obj !== null && _typeof$1(obj) === 'object';
  };
  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */

  var isPlainObject = function isPlainObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
  }; // @link https://gist.github.com/bisubus/2da8af7e801ffd813fab7ac221aa7afc
  /**
   * Deep-freezes and object, making it immutable / read-only.
   * Returns the same object passed-in, but frozen.
   * Freezes inner object/array/values first.
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
   * Note: this method will not work for property values using Symbol() as a key
   */

  var deepFreeze = function deepFreeze(obj) {
    // Retrieve the property names defined on object/array
    // Note: `keys` will ignore properties that are keyed by a `Symbol()`
    var props = keys(obj); // Iterate over each prop and recursively freeze it

    props.forEach(function (prop) {
      var value = obj[prop]; // If value is a plain object or array, we deepFreeze it

      obj[prop] = value && (isPlainObject(value) || isArray(value)) ? deepFreeze(value) : value;
    });
    return freeze(obj);
  };

  var memoize = function memoize(fn) {
    var cache = create(null);
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var argsKey = JSON.stringify(args);
      return cache[argsKey] = cache[argsKey] || fn.apply(null, args);
    };
  };

  function _typeof$2(obj) {
    if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
      _typeof$2 = function _typeof$1(obj) {
        return _typeof(obj);
      };
    } else {
      _typeof$2 = function _typeof$1(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof(obj);
      };
    }

    return _typeof$2(obj);
  }

  var toType = function toType(val) {
    return _typeof$2(val);
  };
  var isUndefined = function isUndefined(val) {
    return val === undefined;
  };
  var isNull = function isNull(val) {
    return val === null;
  };
  var isString = function isString(val) {
    return toType(val) === 'string';
  };

  /**
   * Transform the first character to uppercase
   * @param {string} str
   */

  var upperFirst = function upperFirst(str) {
    if (!isString(str)) {
      str = String(str);
    }

    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  /**
   * Suffix can be a falsey value so nothing is appended to string.
   * (helps when looping over props & some shouldn't change)
   * Use data last parameters to allow for currying.
   * @param {string} suffix
   * @param {string} str
   */

  var suffixPropName = function suffixPropName(suffix, str) {
    return str + (suffix ? upperFirst(suffix) : '');
  };

  //

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _nonIterableSpread$1();
  }

  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _iterableToArray$1(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }
  var cloneDeep = function cloneDeep(obj) {
    var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : obj;

    if (isArray(obj)) {
      return obj.reduce(function (result, val) {
        return [].concat(_toConsumableArray$1(result), [cloneDeep(val, val)]);
      }, []);
    }

    if (isPlainObject(obj)) {
      return keys(obj).reduce(function (result, key) {
        return _objectSpread({}, result, _defineProperty({}, key, cloneDeep(obj[key], obj[key])));
      }, {});
    }

    return defaultValue;
  };

  /**
   * Get property defined by dot/array notation in string.
   *
   * @link https://gist.github.com/jeneg/9767afdcca45601ea44930ea03e0febf#gistcomment-1935901
   *
   * @param {Object} obj
   * @param {string|Array} path
   * @param {*} defaultValue (optional)
   * @return {*}
   */

  var get = function get(obj, path) {
    var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null; // Handle array of path values

    path = isArray(path) ? path.join('.') : path; // If no path or no object passed

    if (!path || !isObject(obj)) {
      return defaultValue;
    } // Handle edge case where user has dot(s) in top-level item field key
    // See https://github.com/bootstrap-vue/bootstrap-vue/issues/2762
    // Switched to `in` operator vs `hasOwnProperty` to handle obj.prototype getters
    // https://github.com/bootstrap-vue/bootstrap-vue/issues/3463


    if (path in obj) {
      return obj[path];
    } // Handle string array notation (numeric indices only)


    path = String(path).replace(/\[(\d+)]/g, '.$1');
    var steps = path.split('.').filter(Boolean); // Handle case where someone passes a string of only dots

    if (steps.length === 0) {
      return defaultValue;
    } // Traverse path in object to find result
    // We use `!=` vs `!==` to test for both `null` and `undefined`
    // Switched to `in` operator vs `hasOwnProperty` to handle obj.prototype getters
    // https://github.com/bootstrap-vue/bootstrap-vue/issues/3463


    return steps.every(function (step) {
      return isObject(obj) && step in obj && (obj = obj[step]) != null;
    }) ? obj : defaultValue;
  };

  //
  // BREAKPOINT DEFINITIONS
  //
  // Some components (BCol and BFormGroup) generate props based on breakpoints, and this
  // occurs when the component is first loaded (evaluated), which may happen before the
  // config is created/modified
  //
  // To get around this we make these components async (lazy evaluation)
  // The component definition is only called/executed when the first access to the
  // component is used (and cached on subsequent uses)
  //
  // See: https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components
  //
  // PROP DEFAULTS
  //
  // For default values on props, we use the default value factory function approach so
  // so that the default values are pulled in at each component instantiation
  //
  //  props: {
  //    variant: {
  //      type: String,
  //      default: () => getConfigComponent('BAlert', 'variant')
  //    }
  //  }
  // prettier-ignore

  var DEFAULTS = deepFreeze({
    // Breakpoints
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl'],
    // Component Specific defaults are keyed by the component
    // name (PascalCase) and prop name (camelCase)
    BAlert: {
      dismissLabel: 'Close',
      variant: 'info'
    },
    BBadge: {
      variant: 'secondary'
    },
    BButton: {
      variant: 'secondary'
    },
    BButtonClose: {
      // `textVariant` is `null` to inherit the current text color
      textVariant: null,
      ariaLabel: 'Close'
    },
    BCardSubTitle: {
      // BCard and BCardBody also inherit this prop
      subTitleTextVariant: 'muted'
    },
    BCarousel: {
      labelPrev: 'Previous Slide',
      labelNext: 'Next Slide',
      labelGotoSlide: 'Goto Slide',
      labelIndicators: 'Select a slide to display'
    },
    BDropdown: {
      toggleText: 'Toggle Dropdown',
      variant: 'secondary',
      splitVariant: null
    },
    BFormFile: {
      browseText: 'Browse',
      // Chrome default file prompt
      placeholder: 'No file chosen',
      dropPlaceholder: 'Drop files here'
    },
    BFormText: {
      textVariant: 'muted'
    },
    BImg: {
      blankColor: 'transparent'
    },
    BImgLazy: {
      blankColor: 'transparent'
    },
    BJumbotron: {
      bgVariant: null,
      borderVariant: null,
      textVariant: null
    },
    BListGroupItem: {
      variant: null
    },
    BModal: {
      titleTag: 'h5',
      size: 'md',
      headerBgVariant: null,
      headerBorderVariant: null,
      headerTextVariant: null,
      headerCloseVariant: null,
      bodyBgVariant: null,
      bodyTextVariant: null,
      footerBgVariant: null,
      footerBorderVariant: null,
      footerTextVariant: null,
      cancelTitle: 'Cancel',
      cancelVariant: 'secondary',
      okTitle: 'OK',
      okVariant: 'primary',
      headerCloseLabel: 'Close'
    },
    BNavbar: {
      variant: null
    },
    BNavbarToggle: {
      label: 'Toggle navigation'
    },
    BPopover: {
      boundary: 'scrollParent',
      boundaryPadding: 5,
      customClass: null,
      delay: 0,
      variant: null
    },
    BProgress: {
      variant: null
    },
    BProgressBar: {
      variant: null
    },
    BSpinner: {
      variant: null
    },
    BTable: {
      selectedVariant: 'primary',
      headVariant: null,
      footVariant: null
    },
    BToast: {
      toaster: 'b-toaster-top-right',
      autoHideDelay: 5000,
      variant: null,
      toastClass: null,
      headerClass: null,
      bodyClass: null,
      solid: false
    },
    BToaster: {
      ariaLive: null,
      ariaAtomic: null,
      role: null
    },
    BTooltip: {
      boundary: 'scrollParent',
      boundaryPadding: 5,
      customClass: null,
      delay: 0,
      variant: null
    }
  });

  var PROP_NAME = '$bvConfig';
  var VueProto = Vue.prototype; // --- Getter methods ---

  var getConfigValue = function getConfigValue(key) {
    return VueProto[PROP_NAME] ? VueProto[PROP_NAME].getConfigValue(key) : cloneDeep(get(DEFAULTS, key));
  }; // Method to grab a config value for a particular component

  var getBreakpoints = function getBreakpoints() {
    return getConfigValue('breakpoints');
  }; // Private function for caching / locking-in breakpoint names

  var _getBreakpointsCached = memoize(function () {
    return getBreakpoints();
  }); // Convenience method for getting all breakpoint names.
  // Caches the results after first access.


  var getBreakpointsCached = function getBreakpointsCached() {
    return cloneDeep(_getBreakpointsCached());
  }; // Convenience method for getting breakpoints with
  // the smallest breakpoint set as ''.
  // Useful for components that create breakpoint specific props.
  // Caches the results after first access.

  var getBreakpointsUpCached = memoize(function () {
    var breakpoints = getBreakpointsCached();
    breakpoints[0] = '';
    return breakpoints;
  }); // Convenience method for getting breakpoints with

  function ownKeys$1(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys$1(source, true).forEach(function (key) {
          _defineProperty$1(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys$1(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var boolStrNum = function boolStrNum() {
    return {
      type: [Boolean, String, Number],
      default: false
    };
  }; // Generates a prop object with a type of `[String, Number]`


  var strNum = function strNum() {
    return {
      type: [String, Number],
      default: null
    };
  }; // Compute a breakpoint class name


  var computeBreakpoint = function computeBreakpoint(type, breakpoint, val) {
    var className = type;

    if (isUndefined(val) || isNull(val) || val === false) {
      return undefined;
    }

    if (breakpoint) {
      className += "-".concat(breakpoint);
    } // Handling the boolean style prop when accepting [Boolean, String, Number]
    // means Vue will not convert <b-col sm></b-col> to sm: true for us.
    // Since the default is false, an empty string indicates the prop's presence.


    if (type === 'col' && (val === '' || val === true)) {
      // .col-md
      return className.toLowerCase();
    } // .order-md-6


    className += "-".concat(val);
    return className.toLowerCase();
  }; // Memoized function for better performance on generating class names


  var computeBreakpointClass = memoize(computeBreakpoint); // Cached copy of the breakpoint prop names

  var breakpointPropMap = create(null); // Lazy evaled props factory for BCol

  var generateProps = function generateProps() {
    // Grab the breakpoints from the cached config (exclude the '' (xs) breakpoint)
    var breakpoints = getBreakpointsUpCached().filter(Boolean); // Supports classes like: .col-sm, .col-md-6, .col-lg-auto

    var breakpointCol = breakpoints.reduce(function (propMap, breakpoint) {
      if (breakpoint) {
        // We filter out the '' breakpoint (xs), as making a prop name ''
        // would not work. The `cols` prop is used for `xs`
        propMap[breakpoint] = boolStrNum();
      }

      return propMap;
    }, create(null)); // Supports classes like: .offset-md-1, .offset-lg-12

    var breakpointOffset = breakpoints.reduce(function (propMap, breakpoint) {
      propMap[suffixPropName(breakpoint, 'offset')] = strNum();
      return propMap;
    }, create(null)); // Supports classes like: .order-md-1, .order-lg-12

    var breakpointOrder = breakpoints.reduce(function (propMap, breakpoint) {
      propMap[suffixPropName(breakpoint, 'order')] = strNum();
      return propMap;
    }, create(null)); // For loop doesn't need to check hasOwnProperty
    // when using an object created from null

    breakpointPropMap = assign(create(null), {
      col: keys(breakpointCol),
      offset: keys(breakpointOffset),
      order: keys(breakpointOrder)
    }); // Return the generated props

    return _objectSpread$1({
      // Generic flexbox .col (xs)
      col: {
        type: Boolean,
        default: false
      },
      // .col-[1-12]|auto  (xs)
      cols: strNum()
    }, breakpointCol, {
      offset: strNum()
    }, breakpointOffset, {
      order: strNum()
    }, breakpointOrder, {
      // Flex alignment
      alignSelf: {
        type: String,
        default: null,
        validator: function validator(str) {
          return arrayIncludes(['auto', 'start', 'end', 'center', 'baseline', 'stretch'], str);
        }
      },
      tag: {
        type: String,
        default: 'div'
      }
    });
  }; // We do not use Vue.extend here as that would evaluate the props
  // immediately, which we do not want to happen
  // @vue/component


  var BCol = {
    name: 'BCol',
    functional: true,

    get props() {
      // Allow props to be lazy evaled on first access and
      // then they become a non-getter afterwards.
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get#Smart_self-overwriting_lazy_getters
      delete this.props; // eslint-disable-next-line no-return-assign

      return this.props = generateProps();
    },

    render: function render(h, _ref) {
      var _classList$push;

      var props = _ref.props,
          data = _ref.data,
          children = _ref.children;
      var classList = []; // Loop through `col`, `offset`, `order` breakpoint props

      for (var type in breakpointPropMap) {
        // Returns colSm, offset, offsetSm, orderMd, etc.
        var _keys = breakpointPropMap[type];

        for (var i = 0; i < _keys.length; i++) {
          // computeBreakpoint(col, colSm => Sm, value=[String, Number, Boolean])
          var c = computeBreakpointClass(type, _keys[i].replace(type, ''), props[_keys[i]]); // If a class is returned, push it onto the array.

          if (c) {
            classList.push(c);
          }
        }
      }

      var hasColClasses = classList.some(function (className) {
        return /^col-/.test(className);
      });
      classList.push((_classList$push = {
        // Default to .col if no other col-{bp}-* classes generated nor `cols` specified.
        col: props.col || !hasColClasses && !props.cols
      }, _defineProperty$1(_classList$push, "col-".concat(props.cols), props.cols), _defineProperty$1(_classList$push, "offset-".concat(props.offset), props.offset), _defineProperty$1(_classList$push, "order-".concat(props.order), props.order), _defineProperty$1(_classList$push, "align-self-".concat(props.alignSelf), props.alignSelf), _classList$push));
      return h(props.tag, a(data, {
        class: classList
      }), children);
    }
  };

  //
  var script$4 = {
    name: 'AnnotationTile',
    props: {
      annotation: {
        type: Object,
        default: function _default() {
          return null;
        }
      },
      edit: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      }
    },
    data: function data() {
      return {
        title: '',
        timer: null,
        clickCounter: 0,
        doubleClickTimeout: 200
      };
    },
    created: function created() {
      this.title = this.annotation.note.title;
    },
    watch: {
      title: function title() {
        this.updateAnnotationTitle(this);
      }
    },
    methods: {
      clickEvent: function clickEvent(event) {
        var _this = this;

        event.preventDefault();
        this.clickCounter = this.clickCounter + 1;

        if (this.clickCounter === 1) {
          this.timer = setTimeout(function () {
            _this.clickCounter = 0;

            _this.selectAnnotation();
          }, this.doubleClickTimeout);
        } else if (this.clickCounter === 2) {
          clearTimeout(this.timer);
          this.clickCounter = 0;
          this.hideAnnotation();
        }
      },
      selectAnnotation: function selectAnnotation() {
        this.$emit('select-annotation', this.annotation);
      },
      hideAnnotation: function hideAnnotation() {
        this.$emit('hide-annotation', this.annotation);
      },
      deleteAnnotation: function deleteAnnotation() {
        this.$emit('delete-annotation', this.annotation);
      },
      updateAnnotation: function updateAnnotation() {
        var annotation = {
          id: this.annotation.id,
          annotationType: this.annotation.annotationType,
          note: {
            title: this.title
          },
          data: this.annotation.data,
          color: this.annotation.color,
          subject: this.annotation.subject
        };
        this.$emit('update-annotation', annotation);
      },
      updateAnnotationTitle: lodash.debounce(function (self) {
        return self.updateAnnotation();
      }, 200)
    }
  };

  /* script */
  const __vue_script__$4 = script$4;

  /* template */
  var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"annotation-tile"},[_c('b-card',{staticClass:"bg-transparent border-0 m-1 ml-1",style:({ borderColor: _vm.annotation.color }),attrs:{"no-body":""}},[_c('b-input-group',[_c('b-input-group-prepend',{directives:[{name:"b-tooltip",rawName:"v-b-tooltip.hover",modifiers:{"hover":true}}],style:({ borderColor: _vm.annotation.color }),attrs:{"title":JSON.stringify(_vm.annotation.data)},on:{"click":_vm.clickEvent}},[_c('span',{staticClass:"input-group-text",style:({
              backgroundColor: _vm.annotation.color,
              borderColor: _vm.annotation.color
            })},[(
                _vm.annotation.annotationType ===
                  _vm.$annomlutils.annotation.types.POINT
              )?_c('font-awesome-layers',[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1):(
                _vm.annotation.annotationType ===
                  _vm.$annomlutils.annotation.types.FREEPOINT
              )?_c('font-awesome-layers',[_c('font-awesome-icon',{attrs:{"icon":"bullseye"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-9 down-7 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-5 right-6"}})],1):(
                _vm.annotation.annotationType ===
                  _vm.$annomlutils.annotation.types.RECTANGLE
              )?_c('font-awesome-layers',[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-6 down-6 right-6"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"database","transform":"shrink-5 down-6 right-6"}})],1):(
                _vm.annotation.annotationType ===
                  _vm.$annomlutils.annotation.types.FREERECTANGLE
              )?_c('font-awesome-layers',[_c('font-awesome-icon',{attrs:{"icon":"vector-square"}}),_vm._v(" "),_c('font-awesome-icon',{style:({ color: 'gray' }),attrs:{"icon":"circle","transform":"shrink-9 down-6 right-7"}}),_vm._v(" "),_c('font-awesome-icon',{attrs:{"icon":"hand-pointer","transform":"shrink-4 down-4 right-6"}})],1):_vm._e()],1)]),_vm._v(" "),_c('b-form-input',{style:({ borderColor: _vm.annotation.color }),attrs:{"readonly":!_vm.edit,"disabled":!_vm.edit,"id":"annotation-title"},model:{value:(_vm.title),callback:function ($$v) {_vm.title=(typeof $$v === 'string'? $$v.trim(): $$v);},expression:"title"}}),_vm._v(" "),(_vm.edit)?_c('b-input-group-append',{style:({ borderColor: _vm.annotation.color, width: '40px' })},[_c('b-button',{style:({
              backgroundColor: _vm.annotation.color,
              borderColor: _vm.annotation.color
            }),attrs:{"variant":"outline-secondary"},on:{"click":_vm.deleteAnnotation}},[_c('font-awesome-icon',{staticStyle:{"{color":"white}"},attrs:{"icon":"times"}})],1)],1):_vm._e()],1)],1)],1)};
  var __vue_staticRenderFns__$4 = [];

    /* style */
    const __vue_inject_styles__$4 = function (inject) {
      if (!inject) return
      inject("data-v-2888761c_0", { source: ".UniqueFullWidth .input-group-text[data-v-2888761c]{width:50px;flex:0 0 20%;border-right:none;background-color:#fff}.UniqueFullWidth [class^=fa-][data-v-2888761c],[class*=\" fa-\"][data-v-2888761c]{display:inline-block;color:#fff;width:100%}.form-control[data-v-2888761c]:disabled,.form-control[readonly][data-v-2888761c]{background-color:#fff;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$4 = "data-v-2888761c";
    /* module identifier */
    const __vue_module_identifier__$4 = undefined;
    /* functional template */
    const __vue_is_functional_template__$4 = false;
    /* style inject SSR */
    

    
    var AnnotationTile = normalizeComponent_1(
      { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
      __vue_inject_styles__$4,
      __vue_script__$4,
      __vue_scope_id__$4,
      __vue_is_functional_template__$4,
      __vue_module_identifier__$4,
      browser,
      undefined
    );

  //
  var script$5 = {
    name: 'AnnotationList',
    components: {
      BCol: BCol,
      Swatches: Swatches,
      AnnotationTile: AnnotationTile
    },
    props: {
      pointAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      rectangleAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      annotationColor: {
        type: String,
        default: function _default() {
          return null;
        }
      },
      edit: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      }
    },
    data: function data() {
      return {
        annotations: [],
        color: this.annotationColor,
        annotationsHidden: false
      };
    },
    created: function created() {
      if (this.annotationColor) {
        this.color = this.annotationColor;
      } else {
        this.color = utils.annotation.getFreeColor(this.$annomlstore.getters.getUsedColors);
      }

      this.annotations = utils.annotation.concatAndSortAnnotations([this.rectangleAnnotations, this.pointAnnotations], function (a, b) {
        return a.id - b.id;
      });
      this.annotationsHidden = this.annotations.some(function (a) {
        return a.color !== utils.annotation.stateColor.HIDDEN;
      });
    },
    watch: {
      color: function color() {
        this.updateColor(this.color);
      },
      pointAnnotations: {
        handler: function handler() {
          this.annotations = utils.annotation.concatAndSortAnnotations([this.rectangleAnnotations, this.pointAnnotations], function (a, b) {
            return a.id - b.id;
          });
          this.annotationsHidden = this.annotations.some(function (a) {
            return a.color !== utils.annotation.stateColor.HIDDEN;
          });
        },
        deep: true
      },
      rectangleAnnotations: {
        handler: function handler() {
          this.annotations = utils.annotation.concatAndSortAnnotations([this.rectangleAnnotations, this.pointAnnotations], function (a, b) {
            return a.id - b.id;
          });
          this.annotationsHidden = this.annotations.some(function (a) {
            return a.color !== utils.annotation.stateColor.HIDDEN;
          });
        },
        deep: true
      }
    },
    methods: {
      selectAnnotation: function selectAnnotation(annotation) {
        this.$emit('select-annotation', annotation);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        this.$emit('hide-annotation', annotation);
      },
      hideAllAnnotations: function hideAllAnnotations() {
        this.$emit('hide-all-annotations', this.annotationsHidden);
        this.annotationsHidden = !this.annotationsHidden;
      },
      deleteAnnotation: function deleteAnnotation(annotation) {
        this.$emit('delete-annotation', annotation);
      },
      updateAnnotation: function updateAnnotation(annotation) {
        this.$emit('update-annotation', annotation);
      },
      updateColor: function updateColor(value) {
        this.$emit('update-color', value);
      }
    }
  };

  /* script */
  const __vue_script__$5 = script$5;

  /* template */
  var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-container',{attrs:{"fluid":""}},[_c('b-row',[_c('b-col',{staticClass:"pl-0",attrs:{"cols":"1"}},[(_vm.edit)?_c('swatches',{staticClass:"vue-swatches",attrs:{"colors":_vm.$annomlutils.annotation.postColors,"show-fallback":_vm.$annomlstore.getters.getUsedColors.length >
              _vm.$annomlutils.annotation.postColors.length,"row-length":"5","exceptions":_vm.$annomlstore.getters.getUsedColors.filter(
              function (c) { return c !== _vm.annotationColor; }
            ),"shapes":"circles","exception-mode":"hidden","popover-to":"right"},model:{value:(_vm.color),callback:function ($$v) {_vm.color=$$v;},expression:"color"}}):_c('div',{staticClass:"annotation-color-swatch",class:{
            annotationsHidden: _vm.annotationsHidden
          },style:({
            backgroundColor: _vm.annotationsHidden
              ? _vm.annotationColor
              : _vm.$annomlutils.annotation.stateColor.HIDDEN
          }),on:{"click":_vm.hideAllAnnotations}})],1),_vm._v(" "),_c('b-col',[_c('b-card-group',_vm._l((_vm.annotations),function(annotation){return _c('annotation-tile',{key:annotation.id,attrs:{"annotation":annotation,"edit":_vm.edit},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"delete-annotation":_vm.deleteAnnotation,"update-annotation":_vm.updateAnnotation}})}),1)],1)],1)],1)};
  var __vue_staticRenderFns__$5 = [];

    /* style */
    const __vue_inject_styles__$5 = function (inject) {
      if (!inject) return
      inject("data-v-28f92f56_0", { source: ".annotation-color-swatch{width:42px;height:42px;background-color:#d3d3d3;border-radius:50%}.annotation-color-swatch:hover{transform:scale(.95)}fieldset[disabled] .vue-swatches{pointer-events:none}.vue-swatches{position:relative;outline:0}.vue-swatches__trigger{display:inline-block;cursor:pointer}.vue-swatches__trigger.vue-swatches--is-empty{border:2px solid #ccc}.vue-swatches__trigger.vue-swatches--is-disabled{cursor:not-allowed}.vue-swatches__container{box-sizing:content-box;padding:5px}.vue-swatches__container:not(.vue-swatches--inline){position:absolute;display:block;overflow:auto;border-radius:5px;box-shadow:0 2px 3px hsla(0,0%,4%,.2),0 0 0 1px hsla(0,0%,4%,.2);z-index:50}.vue-swatches__wrapper{background-color:inherit}.vue-swatches__row{font-size:0}.vue-swatches__fallback__wrapper{display:table}.vue-swatches__fallback__input--wrapper{display:table-cell;padding-right:10px;width:100%;font-size:14px}.vue-swatches__fallback__input{width:100%;padding-top:6px;padding-bottom:6px;border-radius:5px;border:1px solid #dcdcdc;color:#35495e;background:#fff}.vue-swatches__fallback__button{display:table-cell;padding:6px 15px;border:0;cursor:pointer;font-weight:700;color:#fff;background-color:#3571c8;border-radius:5px}.vue-swatches-show-hide-enter-active,.vue-swatches-show-hide-leave-active{transition:all .3s ease}.vue-swatches-show-hide-enter,.vue-swatches-show-hide-leave-active{opacity:0}.vue-swatches--has-children-centered{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.vue-swatches__diagonal--wrapper{width:100%;height:100%}.vue-swatches__diagonal{width:75%;height:75%;background:linear-gradient(to top right,transparent 0,transparent calc(50% - 2.4px),#de080a 50%,transparent calc(50% + 2.4px),transparent)}.vue-swatches__swatch{position:relative;font-size:0}.vue-swatches__swatch:focus,.vue-swatches__swatch:hover{opacity:.9;box-shadow:inset 0 0 2px rgba(0,0,0,.75);outline:0}.vue-swatches__swatch.vue-swatches__swatch--border,.vue-swatches__swatch.vue-swatches__swatch--selected{box-shadow:inset 0 0 2px rgba(0,0,0,.75)}.vue-swatches__swatch .vue-swatches__diagonal--wrapper{position:absolute}.vue-swatches__check__wrapper{position:absolute;width:100%;height:100%}.vue-swatches__check__circle{width:21px;height:21px;border-radius:50%;background-color:rgba(0,0,0,.15)}.vue-swatches__check__path{fill:#fff}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$5 = undefined;
    /* module identifier */
    const __vue_module_identifier__$5 = undefined;
    /* functional template */
    const __vue_is_functional_template__$5 = false;
    /* style inject SSR */
    

    
    var AnnotationSelect = normalizeComponent_1(
      { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
      __vue_inject_styles__$5,
      __vue_script__$5,
      __vue_scope_id__$5,
      __vue_is_functional_template__$5,
      __vue_module_identifier__$5,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

  /* eslint-disable no-console */
  var script$6 = {
    name: 'vote',
    data: function data() {
      return {
        votes: 0
      };
    },
    props: {
      edit: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      },
      post: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    watch: {
      post: {
        handler: function handler() {
          if (this.post.upVotes !== null && this.post.downVotes) {
            this.votes = this.post.upVotes.length - this.post.downVotes.length;
          }
        },
        deep: true
      }
    },
    created: function created() {
      this.votes = this.post.upVotes.length - this.post.downVotes.length;
    },
    methods: {
      voteCounter: function voteCounter() {
        if (this.votes > 0) {
          return "+".concat(this.votes);
        }

        if (this.votes < 0) {
          return this.votes;
        }

        return '0';
      },
      voteUp: function voteUp() {
        var _this = this;

        var user = this.post.upVotes.filter(function (vote) {
          return vote.externalId === _this.$annomlsettings.currentUser;
        });

        if (user.length === 0) {
          this.$emit('up-vote');
        }
      },
      voteDown: function voteDown() {
        var _this2 = this;

        var user = this.post.downVotes.filter(function (vote) {
          return vote.externalId === _this2.$annomlsettings.currentUser;
        });

        if (user.length === 0) {
          this.$emit('down-vote');
        }
      }
    }
  };

  /* script */
  const __vue_script__$6 = script$6;

  /* template */
  var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vote pull-right btn"},[(_vm.edit)?_c('span',{on:{"click":function($event){return _vm.voteUp()}}},[_c('font-awesome-icon',{attrs:{"icon":"chevron-up"}})],1):_vm._e(),_vm._v(" "),_c('div',[_vm._v(_vm._s(_vm.voteCounter()))]),_vm._v(" "),(_vm.edit)?_c('span',{on:{"click":function($event){return _vm.voteDown()}}},[_c('font-awesome-icon',{attrs:{"icon":"chevron-down"}})],1):_vm._e()])};
  var __vue_staticRenderFns__$6 = [];

    /* style */
    const __vue_inject_styles__$6 = function (inject) {
      if (!inject) return
      inject("data-v-51722740_0", { source: ".vote{display:block}.vote span{color:gray;text-align:center;margin-left:auto;margin-right:auto;height:30px;width:30px;display:inline-block}.vote div{color:#000;text-align:center;margin-left:auto;margin-right:auto;height:30px;width:30px;display:inline-block}.vote span:hover{color:#000;transform:scale(1.2)}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$6 = undefined;
    /* module identifier */
    const __vue_module_identifier__$6 = undefined;
    /* functional template */
    const __vue_is_functional_template__$6 = false;
    /* style inject SSR */
    

    
    var Vote = normalizeComponent_1(
      { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
      __vue_inject_styles__$6,
      __vue_script__$6,
      __vue_scope_id__$6,
      __vue_is_functional_template__$6,
      __vue_module_identifier__$6,
      browser,
      undefined
    );

  //
  var script$7 = {
    name: 'PostMeta',
    props: {
      post: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    created: function created() {},
    methods: {
      checkIfIsSameDate: function checkIfIsSameDate(date1, date2) {
        return date1 !== date2;
      },
      formatTimestamp: function formatTimestamp(timestamp) {
        var date = new Date(timestamp);
        return "".concat(date.toLocaleDateString(), " at ").concat(date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }));
      },
      formatEditTimestamp: function formatEditTimestamp(created, edit) {
        var createdate = new Date(created);
        var editdate = new Date(edit);

        if (createdate.getDate() === editdate.getDate()) {
          return "last edit at ".concat(editdate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }));
        }

        return "edited on ".concat(editdate.toLocaleDateString(), "at").concat(editdate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }));
      },
      requestUsername: function requestUsername(userId) {
        service(this.$authApi).getUser(this.$annomlstore.getters.getSettings.authenticationProvider.endpoints.userInfoById, userId).then(function (data) {
          console.log(data);
        });
      }
    }
  };

  /* script */
  const __vue_script__$7 = script$7;

  /* template */
  var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return (_vm.post.author)?_c('div',{staticClass:"post-info"},[(_vm.post.author.externalId)?_c('span',{staticClass:"username"},[_vm._v("\n    "+_vm._s(_vm.post.author.externalId))]):_c('span',{staticClass:"username"},[_vm._v("User #"+_vm._s(_vm.post.author.id))]),_vm._v(" "),(_vm.post.created)?_c('span',{staticClass:"created"},[_vm._v("\n    on "+_vm._s(_vm.formatTimestamp(_vm.post.created)))]):_vm._e(),_vm._v(" "),(_vm.checkIfIsSameDate(_vm.post.created, _vm.post.edited))?_c('span',{staticClass:"edited"},[_vm._v("\n    ("+_vm._s(_vm.formatEditTimestamp(_vm.post.created, _vm.post.edited))+")")]):_vm._e()]):_vm._e()};
  var __vue_staticRenderFns__$7 = [];

    /* style */
    const __vue_inject_styles__$7 = function (inject) {
      if (!inject) return
      inject("data-v-73e19b2f_0", { source: ".username[data-v-73e19b2f]{font-size:larger;font-weight:700}.edited[data-v-73e19b2f]{font-weight:lighter}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$7 = "data-v-73e19b2f";
    /* module identifier */
    const __vue_module_identifier__$7 = undefined;
    /* functional template */
    const __vue_is_functional_template__$7 = false;
    /* style inject SSR */
    

    
    var PostMeta = normalizeComponent_1(
      { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
      __vue_inject_styles__$7,
      __vue_script__$7,
      __vue_scope_id__$7,
      __vue_is_functional_template__$7,
      __vue_module_identifier__$7,
      browser,
      undefined
    );

  //
  var script$8 = {
    name: 'Comment',
    components: {
      Vote: Vote,
      PostMeta: PostMeta,
      EditorContent: tiptap.EditorContent,
      AnnotationSelect: AnnotationSelect
    },
    props: {
      comment: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      question: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline()],
          editable: false,
          content: this.comment.body
        }),
        currentEdit: null
      };
    },
    created: function created() {},
    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    },
    methods: {
      /**
       * Comment Handling
       */
      editComment: function editComment() {
        this.$emit('edit-comment', this.comment);
      },
      upVoteComment: function upVoteComment() {
        this.$emit('up-vote-comment', this.comment);
      },
      downVoteComment: function downVoteComment() {
        this.$emit('down-vote-comment', this.comment);
      },

      /**
       * Annotation Handling
       */
      selectAnnotation: function selectAnnotation(annotation) {
        utils.annotation.selectAnnotation([this.comment.pointAnnotations, this.comment.rectangleAnnotations], annotation, this.comment.color);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        utils.annotation.hideAnnotation([this.comment.pointAnnotations, this.comment.rectangleAnnotations], annotation, this.comment.color);
      },
      hideAnnotations: function hideAnnotations(hidden) {
        utils.annotation.hideAnnotations([this.comment.pointAnnotations, this.comment.rectangleAnnotations], hidden, this.comment.color);
      },

      /**
       * Annotation Events
       */
      deleteAnnotation: function deleteAnnotation(annotation) {
        this.$emit('delete-annotation', annotation);
      }
    }
  };

  /* script */
  const __vue_script__$8 = script$8;

  /* template */
  var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-card',{staticClass:"mb-2 ml-4"},[(
          _vm.comment.author &&
            (_vm.$annomlsettings.currentUser !== _vm.comment.author.externalId ||
              _vm.question.highlight === _vm.comment.id)
        )?_c('highlight',{staticClass:"float-right",attrs:{"edit":_vm.$annomlsettings.currentUser === _vm.question.author.externalId,"highlight":_vm.question.highlight === _vm.comment.id}}):_vm._e(),_vm._v(" "),(_vm.$annomlstore.getters.debug)?_c('span',{staticClass:"float-right mr-1",staticStyle:{"color":"lightgray"}},[_vm._v("\n      #"+_vm._s(_vm.comment.id)+"\n    ")]):_vm._e(),_vm._v(" "),_c('post-meta',{attrs:{"post":_vm.comment}}),_vm._v(" "),(
          _vm.comment.pointAnnotations.length > 0 ||
            _vm.comment.rectangleAnnotations.length > 0
        )?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.comment.pointAnnotations,"rectangle-annotations":_vm.comment.rectangleAnnotations,"annotation-color":_vm.comment.color,"edit":false},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"hide-all-annotations":_vm.hideAnnotations}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"body"},[_c('editor-content',{staticClass:"editor__content",attrs:{"editor":_vm.editor}})],1),_vm._v(" "),(_vm.comment.author)?_c('div',[_c('vote',{staticClass:"float-right btn",attrs:{"post":_vm.comment,"edit":_vm.$annomlsettings.isAuthenticated},on:{"up-vote":_vm.upVoteComment,"down-vote":_vm.downVoteComment}}),_vm._v(" "),(
            _vm.$annomlsettings.currentUser === _vm.comment.author.externalId &&
              !_vm.$annomlstore.getters.getCurrentPost
          )?_c('b-button',{staticClass:"float-right",attrs:{"variant":"light"},on:{"click":_vm.editComment}},[_vm._v("Edit")]):_vm._e()],1):_vm._e()],1)],1)};
  var __vue_staticRenderFns__$8 = [];

    /* style */
    const __vue_inject_styles__$8 = function (inject) {
      if (!inject) return
      inject("data-v-64501c2c_0", { source: ".body{margin-top:.5rem;margin-bottom:.5rem;pointer-events:none}.body__content{word-wrap:break-word}.body__content .ProseMirror{position:relative;padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box}.body__content__content{word-wrap:break-word}.body__content__content *{caret-color:currentColor}.body__content__content p{margin-top:.2rem;margin-bottom:.2rem}.body__content__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.body__content__content pre code{display:block}.body__content__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.body__content__content ol,.body__content__content ul{padding-left:1rem}.body__content__content li>ol,.body__content__content li>p,.body__content__content li>ul{margin:0}.body__content__content a{color:inherit}.body__content__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.body__content__content blockquote p{margin:0}.body__content__content img{max-width:100%;border-radius:3px}.body__content__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.body__content__content table td,.body__content__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.body__content__content table td>*,.body__content__content table th>*{margin-bottom:0}.body__content__content table th{font-weight:700;text-align:left}.body__content__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.body__content__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.body__content__content .tableWrapper{margin:1em 0;overflow-x:auto}.body__content__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$8 = undefined;
    /* module identifier */
    const __vue_module_identifier__$8 = undefined;
    /* functional template */
    const __vue_is_functional_template__$8 = false;
    /* style inject SSR */
    

    
    var Comment = normalizeComponent_1(
      { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
      __vue_inject_styles__$8,
      __vue_script__$8,
      __vue_scope_id__$8,
      __vue_is_functional_template__$8,
      __vue_module_identifier__$8,
      browser,
      undefined
    );

  //
  var script$9 = {
    name: 'CommentEditor',
    components: {
      EditorContent: tiptap.EditorContent,
      EditorMenuBar: tiptap.EditorMenuBar,
      AnnotationSelect: AnnotationSelect
    },
    props: {
      comment: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      pointAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      rectangleAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline(), new tiptapExtensions.History()],
          content: this.comment.body
        })
      };
    },
    methods: {
      /**
       * Answer Operations
       */
      submitComment: function submitComment() {
        if (this.editorHasContent()) {
          this.clearAnnotation();
          var post = {
            id: this.comment.id,
            body: this.editor.getJSON(),
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations,
            upVotes: [],
            downVotes: []
          };

          if (this.pointAnnotations.length > 0 || this.rectangleAnnotations.length > 0) {
            post.color = this.comment.color;
          }

          this.$emit('save-comment', post);
        } else {
          alert('Enter a content');
        }
      },
      updateComment: function updateComment() {
        var _this = this;

        if (this.editorHasContent()) {
          this.pointAnnotations.forEach(function (a) {
            var pointAnnotation = a;
            pointAnnotation.color = _this.comment.color;
            console.log(pointAnnotation);
            return pointAnnotation;
          });
          this.rectangleAnnotations.forEach(function (a) {
            var rectangleAnnotation = a;
            rectangleAnnotation.color = _this.comment.color;
            return rectangleAnnotation;
          });
          var post = {
            id: this.comment.id,
            color: this.comment.color,
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations
          };
          this.$emit('update-comment', post);
        } else {
          alert('Enter title and content');
        }
      },
      deleteComment: function deleteComment() {
        this.$emit('delete-comment', this.comment);
      },

      /**
       * Annotation Handling
       */
      selectAnnotation: function selectAnnotation(annotation) {
        utils.annotation.selectAnnotation([this.comment.pointAnnotations, this.comment.rectangleAnnotations], annotation, this.comment.color);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        utils.annotation.hideAnnotation([this.comment.pointAnnotations, this.comment.rectangleAnnotations], annotation, this.comment.color);
      },
      hideAnnotations: function hideAnnotations(hidden) {
        utils.annotation.hideAnnotations([this.comment.pointAnnotations, this.comment.rectangleAnnotations], hidden, this.comment.color);
      },
      addNewAnnotation: function addNewAnnotation() {
        this.$annomlstore.commit('enableSelectable');
      },
      clearAnnotation: function clearAnnotation() {
        var _this2 = this;

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;
          pointAnnotation.color = _this2.comment.color;
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;
          rectangleAnnotation.color = _this2.comment.color;
        });
      },
      deleteAnnotation: function deleteAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$annomlstore.commit('removeCurrentPointAnnotation', annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$annomlstore.commit('removeCurrentRectangleAnnotation', annotation);
        }
      },
      updateAnnotation: function updateAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$set(this.pointAnnotations, this.pointAnnotations.findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$set(this.rectangleAnnotations, this.$annomlstore.deleteCurrent().findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        }
      },
      updateAnnotationColor: function updateAnnotationColor(value) {
        if (this.comment.color) {
          this.$annomlstore.commit('removeUsedColor', value);
          this.comment.color = value;
        } else {
          this.comment.color = value;
        }

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;

          if (pointAnnotation.color !== utils.annotation.stateColor.HIDDEN || pointAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            pointAnnotation.color = value;
          }
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;

          if (rectangleAnnotation.color !== utils.annotation.stateColor.HIDDEN || rectangleAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            rectangleAnnotation.color = value;
          }
        });
      },

      /**
       * Helpers
       */
      editorHasContent: function editorHasContent() {
        var body = this.editor.getHTML();
        return body !== '<p></p>';
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    }
  };

  /* script */
  const __vue_script__$9 = script$9;

  /* template */
  var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-card',{staticClass:"mb-2 ml-4"},[(_vm.pointAnnotations.length > 0 || _vm.rectangleAnnotations.length > 0)?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.pointAnnotations,"rectangle-annotations":_vm.rectangleAnnotations,"annotation-color":_vm.comment.color,"edit":true},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"delete-annotation":_vm.deleteAnnotation,"update-annotation":_vm.updateAnnotation,"update-color":_vm.updateAnnotationColor}}):_vm._e(),_vm._v(" "),_c('b-button',{staticClass:"float-right",attrs:{"disabled":_vm.$annomlstore.getters.visualizationSelectable,"size":"sm","variant":"outline-primary"},on:{"click":_vm.addNewAnnotation}},[_vm._v("Add Annotation\n    ")]),_vm._v(" "),_c('div',{staticClass:"editor"},[_c('div',{staticClass:"editor-toolbar"},[_c('b-button-toolbar',[_c('editor-menu-bar',{staticClass:"menubar",attrs:{"editor":_vm.editor},scopedSlots:_vm._u([{key:"default",fn:function(ref){
  var commands = ref.commands;
  var isActive = ref.isActive;
  return [_c('b-button-group',{attrs:{"size":"sm"}},[_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.bold() },on:{"click":commands.bold}},[_c('font-awesome-icon',{attrs:{"icon":"bold"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.italic() },on:{"click":commands.italic}},[_c('font-awesome-icon',{attrs:{"icon":"italic"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.strike() },on:{"click":commands.strike}},[_c('font-awesome-icon',{attrs:{"icon":"strikethrough"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.underline() },on:{"click":commands.underline}},[_c('font-awesome-icon',{attrs:{"icon":"underline"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.bullet_list() },on:{"click":commands.bullet_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ul"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.ordered_list() },on:{"click":commands.ordered_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ol"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.blockquote() },on:{"click":commands.blockquote}},[_c('font-awesome-icon',{attrs:{"icon":"quote-left"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.code_block() },on:{"click":commands.code_block}},[_c('font-awesome-icon',{attrs:{"icon":"code"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.undo}},[_c('font-awesome-icon',{attrs:{"icon":"undo"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.redo}},[_c('font-awesome-icon',{attrs:{"icon":"undo","flip":"horizontal"}})],1)],1)]}}])})],1)],1),_vm._v(" "),_c('editor-content',{staticClass:"editor__content",attrs:{"id":"editor","editor":_vm.editor}})],1),_vm._v(" "),(_vm.comment.author)?_c('b-button',{attrs:{"variant":"primary"},on:{"click":_vm.updateComment}},[_vm._v("Save\n    ")]):_c('b-button',{attrs:{"variant":"success"},on:{"click":_vm.submitComment}},[_vm._v("Submit")]),_vm._v(" "),_c('b-button',{staticClass:"ml-2",attrs:{"variant":"danger"},on:{"click":_vm.deleteComment}},[_vm._v("Delete\n    ")])],1)],1)};
  var __vue_staticRenderFns__$9 = [];

    /* style */
    const __vue_inject_styles__$9 = function (inject) {
      if (!inject) return
      inject("data-v-a8425ab2_0", { source: ".annotation-select{margin-top:.5rem;margin-bottom:.5rem}.editor-toolbar{margin-bottom:.5rem}.icon-flipped{transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-ms-transform:scaleX(-1)}.editor{margin-top:.5rem;margin-bottom:.5rem}.editor .ProseMirror{resize:vertical;position:relative;overflow-y:scroll;height:calc(1.5em + 5rem + 2px);padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem}.editor .ProseMirror-focused{outline:0}.editor__content{word-wrap:break-word}.editor__content *{caret-color:currentColor}.editor__content p{margin-top:.2rem;margin-bottom:.2rem}.editor__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.editor__content pre code{display:block}.editor__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.editor__content ol,.editor__content ul{padding-left:1rem}.editor__content li>ol,.editor__content li>p,.editor__content li>ul{margin:0}.editor__content a{color:inherit}.editor__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.editor__content blockquote p{margin:0}.editor__content img{max-width:100%;border-radius:3px}.editor__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.editor__content table td,.editor__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.editor__content table td>*,.editor__content table th>*{margin-bottom:0}.editor__content table th{font-weight:700;text-align:left}.editor__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.editor__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.editor__content .tableWrapper{margin:1em 0;overflow-x:auto}.editor__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$9 = undefined;
    /* module identifier */
    const __vue_module_identifier__$9 = undefined;
    /* functional template */
    const __vue_is_functional_template__$9 = false;
    /* style inject SSR */
    

    
    var CommentEditor = normalizeComponent_1(
      { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
      __vue_inject_styles__$9,
      __vue_script__$9,
      __vue_scope_id__$9,
      __vue_is_functional_template__$9,
      __vue_module_identifier__$9,
      browser,
      undefined
    );

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$a = {
    name: 'Highlight',
    props: {
      highlight: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      },
      edit: {
        type: Boolean,
        default: function _default() {
          return false;
        }
      }
    },
    methods: {
      toggleHighlight: function toggleHighlight() {
        this.starred = !this.starred;
      }
    }
  };

  /* script */
  const __vue_script__$a = script$a;

  /* template */
  var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"highlight",class:{ edit: _vm.edit },on:{"click":_vm.toggleHighlight}},[(_vm.highlight)?_c('font-awesome-icon',{style:({ color: '#ffbe3c' }),attrs:{"icon":"star","size":"2x"}}):_c('font-awesome-icon',{style:({ color: 'lightgray' }),attrs:{"icon":"star","size":"2x"}})],1)};
  var __vue_staticRenderFns__$a = [];

    /* style */
    const __vue_inject_styles__$a = function (inject) {
      if (!inject) return
      inject("data-v-0d294ab6_0", { source: ".highlight[data-v-0d294ab6]{color:gray}.highlight:hover .edit[data-v-0d294ab6]{color:#ffbe3c;transform:scale(.9)}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$a = "data-v-0d294ab6";
    /* module identifier */
    const __vue_module_identifier__$a = undefined;
    /* functional template */
    const __vue_is_functional_template__$a = false;
    /* style inject SSR */
    

    
    var Highlight = normalizeComponent_1(
      { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
      __vue_inject_styles__$a,
      __vue_script__$a,
      __vue_scope_id__$a,
      __vue_is_functional_template__$a,
      __vue_module_identifier__$a,
      browser,
      undefined
    );

  //
  var script$b = {
    name: 'Answer',
    components: {
      Vote: Vote,
      Highlight: Highlight,
      PostMeta: PostMeta,
      CommentEditor: CommentEditor,
      Comment: Comment,
      EditorContent: tiptap.EditorContent,
      AnnotationSelect: AnnotationSelect
    },
    props: {
      answer: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      question: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline()],
          editable: false,
          content: this.answer.body
        }),
        comments: []
      };
    },
    created: function created() {
      var _this = this;

      this.comments = this.answer.comments;
      this.comments.forEach(function (comment) {
        if (comment.color) {
          _this.$annomlstore.commit('addUsedColor', comment.color);
        }

        if (comment.pointAnnotations.length > 0) {
          _this.$annomlstore.commit('addPointAnnotations', comment.pointAnnotations);
        }

        if (comment.rectangleAnnotations.length > 0) {
          _this.$annomlstore.commit('addRectangleAnnotations', comment.rectangleAnnotations);
        }
      });
    },
    mounted: function mounted() {},
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    },
    methods: {
      /**
       * Answer Handling
       */
      editAnswer: function editAnswer() {
        this.$emit('edit-answer', this.answer);
      },
      upVoteAnswer: function upVoteAnswer() {
        this.$emit('up-vote-answer', this.answer);
      },
      downVoteAnswer: function downVoteAnswer() {
        this.$emit('down-vote-answer', this.answer);
      },

      /**
       * Annotation Handling
       */
      selectAnnotation: function selectAnnotation(annotation) {
        utils.annotation.selectAnnotation([this.answer.pointAnnotations, this.answer.rectangleAnnotations], annotation, this.answer.color);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        utils.annotation.hideAnnotation([this.answer.pointAnnotations, this.answer.rectangleAnnotations], annotation, this.answer.color);
      },
      hideAnnotations: function hideAnnotations(hidden) {
        utils.annotation.hideAnnotations([this.answer.pointAnnotations, this.answer.rectangleAnnotations], hidden, this.answer.color);
      },

      /**
       * Annotation Events
       */
      deleteAnnotation: function deleteAnnotation(annotation) {
        this.$emit('delete-annotation', annotation);
      },

      /**
       * Comment Handling
       */
      commentPost: function commentPost() {
        var comment = {
          id: Date.now(),
          pointAnnotations: [],
          rectangleAnnotations: [],
          author: null,
          upVotes: [],
          downVotes: []
        };
        this.comments.push(comment);
        this.$annomlstore.commit('disableSelectable');
        this.$annomlstore.commit('setCurrentPost', comment);
      },
      saveComment: function saveComment(comment) {
        var _this2 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (comment.color) {
          this.$annomlstore.commit('addUsedColor', comment.color);
        }

        this.$set(this.comments, this.comments.findIndex(function (c) {
          return c.id === comment.id;
        }), comment);
        service(this.$serviceApiAuthenticated).addComment(this.answer.id, comment).then(function (response) {
          console.log(response);

          _this2.$set(_this2.comments, _this2.comments.findIndex(function (c) {
            return c.id === comment.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this2.$annomlstore.commit('removePointAnnotations', comment.pointAnnotations);

            _this2.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this2.$annomlstore.commit('removeRectangleAnnotations', comment.rectangleAnnotations);

            _this2.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color && response.color !== comment.color) {
            _this2.$annomlstore.commit('addUsedColor', comment.color);
          }

          _this2.$forceUpdate(); // todo check if necessary

        });
      },
      updateComment: function updateComment(comment) {
        var _this3 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (comment.color) {
          this.$annomlstore.commit('addUsedColor', comment.color);
        }

        this.$set(this.comments, this.comments.findIndex(function (c) {
          return c.id === comment.id;
        }), comment);
        service(this.$serviceApiAuthenticated).updateComment(comment).then(function (response) {
          _this3.$set(_this3.comments, _this3.comments.findIndex(function (a) {
            return a.id === comment.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this3.$annomlstore.commit('removePointAnnotations', comment.pointAnnotations);

            _this3.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this3.$annomlstore.commit('removeRectangleAnnotations', comment.rectangleAnnotations);

            _this3.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color && response.color !== comment.color) {
            _this3.$annomlstore.commit('addUsedColor', comment.color);
          }
        });
      },
      deleteComment: function deleteComment(comment) {
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (comment.color) {
          this.$annomlstore.commit('removeUsedColor', comment.color);
        }

        this.comments = this.comments.filter(function (a) {
          return a.id !== comment.id;
        });

        if (comment.author) {
          service(this.$serviceApiAuthenticated).deleteComment(comment).then(function (response) {
            console.log(response);
          });
        }
      },
      editComment: function editComment(comment) {
        if (!this.$annomlstore.getters.hasCurrentPost) {
          this.$annomlstore.commit('setCurrentPost', comment);

          if (comment.pointAnnotations.length > 0) {
            this.$annomlstore.commit('removePointAnnotations', comment.pointAnnotations);
            this.$annomlstore.commit('setCurrentPointAnnotations', comment.pointAnnotations);
          }

          if (comment.rectangleAnnotations.length > 0) {
            this.$annomlstore.commit('removeRectangleAnnotations', comment.rectangleAnnotations);
            this.$annomlstore.commit('setCurrentRectangleAnnotations', comment.rectangleAnnotations);
          }
        }
      },

      /**
       * Vote Handling
       */
      upVoteComment: function upVoteComment(comment) {
        var _this4 = this;

        service(this.$serviceApiAuthenticated).upVoteComment(comment).then(function (response) {
          _this4.$set(_this4.comments, _this4.comments.findIndex(function (q) {
            return q.id === comment.id;
          }), response);
        });
      },
      downVoteComment: function downVoteComment(comment) {
        var _this5 = this;

        service(this.$serviceApiAuthenticated).downVoteComment(comment).then(function (response) {
          _this5.$set(_this5.comments, _this5.comments.findIndex(function (q) {
            return q.id === comment.id;
          }), response);
        });
      }
    }
  };

  /* script */
  const __vue_script__$b = script$b;

  /* template */
  var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-card',{staticClass:"mb-2 ml-2"},[(
          _vm.answer.author &&
            (_vm.$annomlsettings.currentUser !== _vm.answer.author.externalId ||
              _vm.question.highlight === _vm.answer.id)
        )?_c('highlight',{staticClass:"float-right",attrs:{"edit":_vm.$annomlsettings.currentUser === _vm.question.author.externalId,"highlight":_vm.question.highlight === _vm.answer.id}}):_vm._e(),_vm._v(" "),(_vm.$annomlstore.getters.debug)?_c('span',{staticClass:"float-right mr-1",staticStyle:{"color":"lightgray"}},[_vm._v("\n      #"+_vm._s(_vm.answer.id))]):_vm._e(),_vm._v(" "),_c('post-meta',{attrs:{"post":_vm.answer}}),_vm._v(" "),(
          _vm.answer.pointAnnotations.length > 0 ||
            _vm.answer.rectangleAnnotations.length > 0
        )?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.answer.pointAnnotations,"rectangle-annotations":_vm.answer.rectangleAnnotations,"annotation-color":_vm.answer.color,"edit":false},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"hide-all-annotations":_vm.hideAnnotations}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"body"},[_c('editor-content',{staticClass:"editor__content",attrs:{"editor":_vm.editor}})],1),_vm._v(" "),(_vm.answer.author)?_c('div',[(!_vm.$annomlstore.getters.getCurrentPost)?_c('b-button',{attrs:{"variant":"primary"},on:{"click":_vm.commentPost}},[_vm._v("\n        Comment\n      ")]):_vm._e(),_vm._v(" "),_c('vote',{staticClass:"float-right btn",attrs:{"post":_vm.answer,"edit":_vm.$annomlsettings.isAuthenticated},on:{"up-vote":_vm.upVoteAnswer,"down-vote":_vm.downVoteAnswer}}),_vm._v(" "),(
            _vm.$annomlsettings.currentUser === _vm.answer.author.externalId &&
              !_vm.$annomlstore.getters.getCurrentPost
          )?_c('b-button',{staticClass:"float-right",attrs:{"variant":"light"},on:{"click":_vm.editAnswer}},[_vm._v("Edit")]):_vm._e()],1):_vm._e()],1),_vm._v(" "),_vm._l((_vm.comments),function(comment){return _c('div',{key:comment.id},[(comment === _vm.$annomlstore.getters.getCurrentPost)?_c('comment-editor',{attrs:{"comment":comment,"point-annotations":_vm.$annomlstore.getters.currentPointAnnotations,"rectangle-annotations":_vm.$annomlstore.getters.currentRectangleAnnotations},on:{"select-annotation":_vm.selectAnnotation,"delete-annotation":_vm.deleteAnnotation,"save-comment":_vm.saveComment,"update-comment":_vm.updateComment,"delete-comment":_vm.deleteComment}}):_c('comment',{key:comment.id,attrs:{"comment":comment,"question":_vm.question},on:{"edit-comment":_vm.editComment,"up-vote-comment":_vm.upVoteComment,"down-vote-comment":_vm.downVoteComment}})],1)})],2)};
  var __vue_staticRenderFns__$b = [];

    /* style */
    const __vue_inject_styles__$b = function (inject) {
      if (!inject) return
      inject("data-v-468868bb_0", { source: ".annotation-select{margin-top:.5rem;margin-bottom:.5rem}.body{margin-top:.5rem;margin-bottom:.5rem;pointer-events:none}.body__content{word-wrap:break-word}.body__content .ProseMirror{position:relative;padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box}.body__content__content{word-wrap:break-word}.body__content__content *{caret-color:currentColor}.body__content__content p{margin-top:.2rem;margin-bottom:.2rem}.body__content__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.body__content__content pre code{display:block}.body__content__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.body__content__content ol,.body__content__content ul{padding-left:1rem}.body__content__content li>ol,.body__content__content li>p,.body__content__content li>ul{margin:0}.body__content__content a{color:inherit}.body__content__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.body__content__content blockquote p{margin:0}.body__content__content img{max-width:100%;border-radius:3px}.body__content__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.body__content__content table td,.body__content__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.body__content__content table td>*,.body__content__content table th>*{margin-bottom:0}.body__content__content table th{font-weight:700;text-align:left}.body__content__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.body__content__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.body__content__content .tableWrapper{margin:1em 0;overflow-x:auto}.body__content__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$b = undefined;
    /* module identifier */
    const __vue_module_identifier__$b = undefined;
    /* functional template */
    const __vue_is_functional_template__$b = false;
    /* style inject SSR */
    

    
    var Answer = normalizeComponent_1(
      { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
      __vue_inject_styles__$b,
      __vue_script__$b,
      __vue_scope_id__$b,
      __vue_is_functional_template__$b,
      __vue_module_identifier__$b,
      browser,
      undefined
    );

  //
  var script$c = {
    name: 'AnswerEditor',
    components: {
      EditorContent: tiptap.EditorContent,
      EditorMenuBar: tiptap.EditorMenuBar,
      Comment: Comment,
      AnnotationSelect: AnnotationSelect
    },
    props: {
      answer: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      pointAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      rectangleAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline(), new tiptapExtensions.History()],
          content: this.answer.body
        })
      };
    },
    created: function created() {},
    watch: {},
    methods: {
      /**
       * Answer Operations
       */
      submitAnswer: function submitAnswer() {
        if (this.editorHasContent()) {
          this.clearAnnotation();
          var post = {
            id: this.answer.id,
            body: this.editor.getJSON(),
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations,
            upVotes: [],
            downVotes: [],
            comments: this.answer.comments
          };

          if (this.pointAnnotations.length > 0 || this.rectangleAnnotations.length > 0) {
            post.color = this.answer.color;
          }

          this.$emit('save-answer', post);
        } else {
          alert('Enter a content');
        }
      },
      updateAnswer: function updateAnswer() {
        var _this = this;

        if (this.editorHasContent()) {
          this.pointAnnotations.forEach(function (a) {
            var pointAnnotation = a;
            pointAnnotation.color = _this.answer.color;
            console.log(pointAnnotation);
            return pointAnnotation;
          });
          this.rectangleAnnotations.forEach(function (a) {
            var rectangleAnnotation = a;
            rectangleAnnotation.color = _this.answer.color;
            return rectangleAnnotation;
          });
          var post = {
            id: this.answer.id,
            color: this.answer.color,
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations,
            comments: this.answer.comments
          };
          this.$emit('update-answer', post);
        } else {
          alert('Enter title and content');
        }
      },
      deleteAnswer: function deleteAnswer() {
        this.$emit('delete-answer', this.answer);
      },

      /**
       * Annotation Handling
       */
      selectAnnotation: function selectAnnotation(annotation) {
        utils.annotation.selectAnnotation([this.answer.pointAnnotations, this.answer.rectangleAnnotations], annotation, this.answer.color);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        utils.annotation.hideAnnotation([this.answer.pointAnnotations, this.answer.rectangleAnnotations], annotation, this.answer.color);
      },
      hideAnnotations: function hideAnnotations(hidden) {
        utils.annotation.hideAnnotations([this.answer.pointAnnotations, this.answer.rectangleAnnotations], hidden, this.answer.color);
      },
      addNewAnnotation: function addNewAnnotation() {
        this.$annomlstore.commit('enableSelectable');
      },
      clearAnnotation: function clearAnnotation() {
        var _this2 = this;

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;
          pointAnnotation.color = _this2.answer.color;
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;
          rectangleAnnotation.color = _this2.answer.color;
        });
      },
      deleteAnnotation: function deleteAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$annomlstore.commit('removeCurrentPointAnnotation', annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$annomlstore.commit('removeCurrentRectangleAnnotation', annotation);
        }
      },
      updateAnnotation: function updateAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$set(this.pointAnnotations, this.pointAnnotations.findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$set(this.rectangleAnnotations, this.rectangleAnnotations.findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        }
      },
      updateAnnotationColor: function updateAnnotationColor(value) {
        if (this.answer.color) {
          this.$annomlstore.commit('removeUsedColor', value);
          this.answer.color = value;
        } else {
          this.answer.color = value;
        }

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;

          if (pointAnnotation.color !== utils.annotation.stateColor.HIDDEN || pointAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            pointAnnotation.color = value;
          }
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;

          if (rectangleAnnotation.color !== utils.annotation.stateColor.HIDDEN || rectangleAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            rectangleAnnotation.color = value;
          }
        });
      },

      /**
       * Helpers
       */
      editorHasContent: function editorHasContent() {
        var body = this.editor.getHTML();
        return body !== '<p></p>';
      },

      /**
       * Vote Handling
       */
      upVoteComment: function upVoteComment(comment) {
        var _this3 = this;

        service(this.$serviceApiAuthenticated).upVoteComment(comment).then(function (response) {
          _this3.$set(_this3.comments, _this3.comments.findIndex(function (q) {
            return q.id === comment.id;
          }), response);
        });
      },
      downVoteComment: function downVoteComment(comment) {
        var _this4 = this;

        service(this.$serviceApiAuthenticated).downVoteComment(comment).then(function (response) {
          _this4.$set(_this4.comments, _this4.comments.findIndex(function (q) {
            return q.id === comment.id;
          }), response);
        });
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    }
  };

  /* script */
  const __vue_script__$c = script$c;

  /* template */
  var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-card',{staticClass:"mb-2 ml-2"},[(_vm.pointAnnotations.length > 0 || _vm.rectangleAnnotations.length > 0)?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.pointAnnotations,"rectangle-annotations":_vm.rectangleAnnotations,"annotation-color":_vm.answer.color,"edit":true},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"delete-annotation":_vm.deleteAnnotation,"update-annotation":_vm.updateAnnotation,"update-color":_vm.updateAnnotationColor}}):_vm._e(),_vm._v(" "),_c('b-button',{staticClass:"float-right",attrs:{"disabled":_vm.$annomlstore.getters.visualizationSelectable,"size":"sm","variant":"outline-primary"},on:{"click":_vm.addNewAnnotation}},[_vm._v("Add Annotation\n    ")]),_vm._v(" "),_c('div',{staticClass:"editor"},[_c('div',{staticClass:"editor-toolbar"},[_c('b-button-toolbar',[_c('editor-menu-bar',{staticClass:"menubar",attrs:{"editor":_vm.editor},scopedSlots:_vm._u([{key:"default",fn:function(ref){
  var commands = ref.commands;
  var isActive = ref.isActive;
  return [_c('b-button-group',{attrs:{"size":"sm"}},[_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.bold() },on:{"click":commands.bold}},[_c('font-awesome-icon',{attrs:{"icon":"bold"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.italic() },on:{"click":commands.italic}},[_c('font-awesome-icon',{attrs:{"icon":"italic"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.strike() },on:{"click":commands.strike}},[_c('font-awesome-icon',{attrs:{"icon":"strikethrough"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.underline() },on:{"click":commands.underline}},[_c('font-awesome-icon',{attrs:{"icon":"underline"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.bullet_list() },on:{"click":commands.bullet_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ul"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.ordered_list() },on:{"click":commands.ordered_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ol"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.blockquote() },on:{"click":commands.blockquote}},[_c('font-awesome-icon',{attrs:{"icon":"quote-left"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.code_block() },on:{"click":commands.code_block}},[_c('font-awesome-icon',{attrs:{"icon":"code"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.undo}},[_c('font-awesome-icon',{attrs:{"icon":"undo"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.redo}},[_c('font-awesome-icon',{attrs:{"icon":"undo","flip":"horizontal"}})],1)],1)]}}])})],1)],1),_vm._v(" "),_c('editor-content',{staticClass:"editor__content",attrs:{"id":"editor","editor":_vm.editor}})],1),_vm._v(" "),(_vm.answer.author)?_c('b-button',{attrs:{"variant":"primary"},on:{"click":_vm.updateAnswer}},[_vm._v("Save\n    ")]):_c('b-button',{attrs:{"variant":"success"},on:{"click":_vm.submitAnswer}},[_vm._v("Submit")]),_vm._v(" "),_c('b-button',{staticClass:"ml-2",attrs:{"variant":"danger"},on:{"click":_vm.deleteAnswer}},[_vm._v("Delete\n    ")])],1),_vm._v(" "),_vm._l((_vm.answer.comments),function(comment){return _c('comment',{key:comment.id,attrs:{"comment":comment,"question":_vm.question},on:{"up-vote-comment":_vm.upVoteComment,"down-vote-comment":_vm.downVoteComment}})})],2)};
  var __vue_staticRenderFns__$c = [];

    /* style */
    const __vue_inject_styles__$c = function (inject) {
      if (!inject) return
      inject("data-v-09106637_0", { source: ".annotation-select{margin-top:.5rem;margin-bottom:.5rem}.editor-toolbar{margin-bottom:.5rem}.icon-flipped{transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-ms-transform:scaleX(-1)}.editor{margin-top:.5rem;margin-bottom:.5rem}.editor .ProseMirror{resize:vertical;position:relative;overflow-y:scroll;height:calc(1.5em + 5rem + 2px);padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem}.editor .ProseMirror-focused{outline:0}.editor__content{word-wrap:break-word}.editor__content *{caret-color:currentColor}.editor__content p{margin-top:.2rem;margin-bottom:.2rem}.editor__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.editor__content pre code{display:block}.editor__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.editor__content ol,.editor__content ul{padding-left:1rem}.editor__content li>ol,.editor__content li>p,.editor__content li>ul{margin:0}.editor__content a{color:inherit}.editor__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.editor__content blockquote p{margin:0}.editor__content img{max-width:100%;border-radius:3px}.editor__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.editor__content table td,.editor__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.editor__content table td>*,.editor__content table th>*{margin-bottom:0}.editor__content table th{font-weight:700;text-align:left}.editor__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.editor__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.editor__content .tableWrapper{margin:1em 0;overflow-x:auto}.editor__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$c = undefined;
    /* module identifier */
    const __vue_module_identifier__$c = undefined;
    /* functional template */
    const __vue_is_functional_template__$c = false;
    /* style inject SSR */
    

    
    var AnswerEditor = normalizeComponent_1(
      { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
      __vue_inject_styles__$c,
      __vue_script__$c,
      __vue_scope_id__$c,
      __vue_is_functional_template__$c,
      __vue_module_identifier__$c,
      browser,
      undefined
    );

  //
  var script$d = {
    name: 'Question',
    components: {
      Vote: Vote,
      PostMeta: PostMeta,
      EditorContent: tiptap.EditorContent,
      AnnotationSelect: AnnotationSelect,
      AnswerEditor: AnswerEditor,
      Answer: Answer
    },
    props: {
      question: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    data: function data() {
      return {
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline(), new tiptapExtensions.History()],
          editable: false,
          content: this.question.body
        }),
        answers: []
      };
    },
    created: function created() {
      var _this = this;

      this.answers = this.question.answers;
      this.answers.forEach(function (answer) {
        if (answer.color) {
          _this.$annomlstore.commit('addUsedColor', answer.color);
        }

        if (answer.pointAnnotations.length > 0) {
          _this.$annomlstore.commit('addPointAnnotations', answer.pointAnnotations);
        }

        if (answer.rectangleAnnotations.length > 0) {
          _this.$annomlstore.commit('addRectangleAnnotations', answer.rectangleAnnotations);
        }
      });
    },
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    },
    methods: {
      /**
       * Question Handling
       */
      editQuestion: function editQuestion() {
        this.$emit('edit-question', this.question);
      },
      upVoteQuestion: function upVoteQuestion() {
        this.$emit('up-vote-question', this.question);
      },
      downVoteQuestion: function downVoteQuestion() {
        this.$emit('down-vote-question', this.question);
      },

      /**
       * Annotation Handling
       */
      selectAnnotation: function selectAnnotation(annotation) {
        utils.annotation.selectAnnotation([this.question.pointAnnotations, this.question.rectangleAnnotations], annotation, this.question.color);
      },
      hideAnnotation: function hideAnnotation(annotation) {
        utils.annotation.hideAnnotation([this.question.pointAnnotations, this.question.rectangleAnnotations], annotation, this.question.color);
      },
      hideAnnotations: function hideAnnotations(hidden) {
        utils.annotation.hideAnnotations([this.question.pointAnnotations, this.question.rectangleAnnotations], hidden, this.question.color);
      },

      /**
       * Annotation Events
       */
      deleteAnnotation: function deleteAnnotation(annotation) {
        this.$emit('delete-annotation', annotation);
      },

      /**
       * Answer Handling
       */
      answerPost: function answerPost() {
        var answer = {
          id: Date.now(),
          pointAnnotations: [],
          rectangleAnnotations: [],
          comments: [],
          author: null,
          upVotes: [],
          downVotes: []
        };
        this.answers.push(answer);
        this.$annomlstore.commit('disableSelectable');
        this.$annomlstore.commit('setCurrentPost', answer);
      },
      saveAnswer: function saveAnswer(answer) {
        var _this2 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (answer.color) {
          this.$annomlstore.commit('addUsedColor', answer.color);
        }

        this.$set(this.answers, this.answers.findIndex(function (a) {
          return a.id === answer.id;
        }), answer);
        service(this.$serviceApiAuthenticated).addAnswer(this.question.id, answer).then(function (response) {
          _this2.$set(_this2.answers, _this2.answers.findIndex(function (a) {
            return a.id === answer.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this2.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);

            _this2.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this2.$annomlstore.commit('removeRectangleAnnotations', answer.rectangleAnnotations);

            _this2.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color && response.color !== answer.color) {
            _this2.$annomlstore.commit('addUsedColor', answer.color);
          }
        });
      },
      updateAnswer: function updateAnswer(answer) {
        var _this3 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (answer.color) {
          this.$annomlstore.commit('addUsedColor', answer.color);
        }

        this.$set(this.answers, this.answers.findIndex(function (a) {
          return a.id === answer.id;
        }), answer);
        service(this.$serviceApiAuthenticated).updateAnswer(answer).then(function (response) {
          _this3.$set(_this3.answers, _this3.answers.findIndex(function (a) {
            return a.id === answer.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this3.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);

            _this3.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this3.$annomlstore.commit('removeRectangleAnnotations', answer.rectangleAnnotations);

            _this3.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color && response.color !== answer.color) {
            _this3.$annomlstore.commit('addUsedColor', answer.color);
          }
        });
      },
      deleteAnswer: function deleteAnswer(answer) {
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (answer.color) {
          this.$annomlstore.commit('removeUsedColor', answer.color);
        }

        this.answers = this.answers.filter(function (a) {
          return a.id !== answer.id;
        });

        if (answer.author) {
          service(this.$serviceApiAuthenticated).deleteAnswer(answer).then(function (response) {
            console.log(response);
          });
        }
      },
      editAnswer: function editAnswer(answer) {
        if (!this.$annomlstore.getters.hasCurrentPost) {
          this.$annomlstore.commit('setCurrentPost', answer);

          if (answer.pointAnnotations.length > 0) {
            this.$annomlstore.commit('removePointAnnotations', answer.pointAnnotations);
            this.$annomlstore.commit('setCurrentPointAnnotations', answer.pointAnnotations);
          }

          if (answer.rectangleAnnotations.length > 0) {
            this.$annomlstore.commit('removeRectangleAnnotations', answer.rectangleAnnotations);
            this.$annomlstore.commit('setCurrentRectangleAnnotations', answer.rectangleAnnotations);
          }
        }
      },

      /**
       * Vote Handling
       */
      upVoteAnswer: function upVoteAnswer(answer) {
        var _this4 = this;

        service(this.$serviceApiAuthenticated).upVoteAnswer(answer).then(function (response) {
          _this4.$set(_this4.answers, _this4.answers.findIndex(function (q) {
            return q.id === answer.id;
          }), response);
        });
      },
      downVoteAnswer: function downVoteAnswer(answer) {
        var _this5 = this;

        service(this.$serviceApiAuthenticated).downVoteAnswer(answer).then(function (response) {
          _this5.$set(_this5.answers, _this5.answers.findIndex(function (q) {
            return q.id === answer.id;
          }), response);
        });
      }
    }
  };

  /* script */
  const __vue_script__$d = script$d;

  /* template */
  var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('b-card',{staticClass:"question mb-2 mt-4"},[_c('h2',{staticClass:"question-title"},[_vm._v("\n      "+_vm._s(_vm.question.title)+"\n      "),(_vm.$annomlstore.getters.debug)?_c('span',{staticClass:"float-right",staticStyle:{"color":"lightgray"}},[_vm._v("\n        #"+_vm._s(_vm.question.id))]):_vm._e()]),_vm._v(" "),_c('post-meta',{attrs:{"post":_vm.question}}),_vm._v(" "),(
          _vm.question.pointAnnotations.length > 0 ||
            _vm.question.rectangleAnnotations.length > 0
        )?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.question.pointAnnotations,"rectangle-annotations":_vm.question.rectangleAnnotations,"annotation-color":_vm.question.color,"edit":false},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"hide-all-annotations":_vm.hideAnnotations}}):_vm._e(),_vm._v(" "),_c('div',{staticClass:"body"},[_c('editor-content',{staticClass:"editor__content",attrs:{"editor":_vm.editor}})],1),_vm._v(" "),(_vm.question.author)?_c('div',[_c('b-button',{attrs:{"variant":"primary"},on:{"click":_vm.answerPost}},[_vm._v("\n        Answer\n      ")]),_vm._v(" "),_c('vote',{staticClass:"float-right btn",attrs:{"post":_vm.question,"edit":_vm.$annomlsettings.isAuthenticated},on:{"up-vote":_vm.upVoteQuestion,"down-vote":_vm.downVoteQuestion}}),_vm._v(" "),(
            _vm.$annomlsettings.currentUser === _vm.question.author.externalId &&
              !_vm.$annomlstore.getters.getCurrentPost
          )?_c('b-button',{staticClass:"float-right",attrs:{"variant":"light"},on:{"click":_vm.editQuestion}},[_vm._v("Edit")]):_vm._e(),_vm._v(" "),_c('small',{staticClass:"text-muted"},[_vm._v(" "+_vm._s(_vm.question.date))])],1):_vm._e()],1),_vm._v(" "),_vm._l((_vm.answers),function(answer){return _c('div',{key:answer.id},[(answer === _vm.$annomlstore.getters.getCurrentPost)?_c('answer-editor',{key:answer.id,attrs:{"answer":answer,"point-annotations":_vm.$annomlstore.getters.currentPointAnnotations,"rectangle-annotations":_vm.$annomlstore.getters.currentRectangleAnnotations},on:{"select-annotation":_vm.selectAnnotation,"delete-annotation":_vm.deleteAnnotation,"save-answer":_vm.saveAnswer,"update-answer":_vm.updateAnswer,"delete-answer":_vm.deleteAnswer}}):_c('answer',{key:answer.id,attrs:{"answer":answer,"question":_vm.question},on:{"edit-answer":_vm.editAnswer,"up-vote-answer":_vm.upVoteAnswer,"down-vote-answer":_vm.downVoteAnswer}})],1)})],2)};
  var __vue_staticRenderFns__$d = [];

    /* style */
    const __vue_inject_styles__$d = function (inject) {
      if (!inject) return
      inject("data-v-1909dbe1_0", { source: "#question-title{font-size:2rem;width:100%}.annotation-select{margin-top:.5rem;margin-bottom:.5rem}.body{margin-top:.5rem;margin-bottom:.5rem;pointer-events:none}.body__content{word-wrap:break-word}.body__content .ProseMirror{position:relative;padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box}.body__content__content{word-wrap:break-word}.body__content__content *{caret-color:currentColor}.body__content__content p{margin-top:.2rem;margin-bottom:.2rem}.body__content__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.body__content__content pre code{display:block}.body__content__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.body__content__content ol,.body__content__content ul{padding-left:1rem}.body__content__content li>ol,.body__content__content li>p,.body__content__content li>ul{margin:0}.body__content__content a{color:inherit}.body__content__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.body__content__content blockquote p{margin:0}.body__content__content img{max-width:100%;border-radius:3px}.body__content__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.body__content__content table td,.body__content__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.body__content__content table td>*,.body__content__content table th>*{margin-bottom:0}.body__content__content table th{font-weight:700;text-align:left}.body__content__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.body__content__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.body__content__content .tableWrapper{margin:1em 0;overflow-x:auto}.body__content__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$d = undefined;
    /* module identifier */
    const __vue_module_identifier__$d = undefined;
    /* functional template */
    const __vue_is_functional_template__$d = false;
    /* style inject SSR */
    

    
    var Question = normalizeComponent_1(
      { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
      __vue_inject_styles__$d,
      __vue_script__$d,
      __vue_scope_id__$d,
      __vue_is_functional_template__$d,
      __vue_module_identifier__$d,
      browser,
      undefined
    );

  //
  var script$e = {
    name: 'QuestionEditor',
    components: {
      EditorContent: tiptap.EditorContent,
      EditorMenuBar: tiptap.EditorMenuBar,
      AnnotationSelect: AnnotationSelect,
      Answer: Answer
    },
    props: {
      question: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      pointAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      rectangleAnnotations: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      discussion: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        title: null,
        editor: new tiptap.Editor({
          extensions: [new tiptapExtensions.Blockquote(), new tiptapExtensions.BulletList(), new tiptapExtensions.CodeBlock(), new tiptapExtensions.HardBreak(), new tiptapExtensions.HorizontalRule(), new tiptapExtensions.ListItem(), new tiptapExtensions.OrderedList(), new tiptapExtensions.TodoItem(), new tiptapExtensions.TodoList(), new tiptapExtensions.Bold(), new tiptapExtensions.Code(), new tiptapExtensions.Italic(), new tiptapExtensions.Link(), new tiptapExtensions.Strike(), new tiptapExtensions.Underline(), new tiptapExtensions.History()],
          content: this.question.body
        })
      };
    },
    created: function created() {
      this.title = this.question.title;
    },
    methods: {
      /**
       * Question Operations
       */
      submitQuestion: function submitQuestion() {
        var _this = this;

        if (this.title !== undefined && this.title !== '' && this.editorHasContent()) {
          this.pointAnnotations.forEach(function (a) {
            var pointAnnotation = a;
            pointAnnotation.color = _this.question.color;
            return pointAnnotation;
          });
          this.rectangleAnnotations.forEach(function (a) {
            var rectangleAnnotation = a;
            rectangleAnnotation.color = _this.question.color;
            return rectangleAnnotation;
          });
          var post = {
            id: this.question.id,
            title: this.title,
            body: this.editor.getJSON(),
            color: this.question.color,
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations,
            upVotes: [],
            downVotes: [],
            answers: this.question.answers
          };
          this.$emit('save-question', post);
        } else {
          alert('Enter title and content');
        }
      },
      updateQuestion: function updateQuestion() {
        if (this.title !== undefined && this.title !== '' && this.editorHasContent()) {
          this.clearAnnotation();
          var post = {
            id: this.question.id,
            title: this.title,
            color: this.question.color,
            pointAnnotations: this.pointAnnotations,
            rectangleAnnotations: this.rectangleAnnotations,
            answers: this.question.answers
          };
          this.$emit('update-question', post);
        } else {
          alert('Enter title and content');
        }
      },
      deleteQuestion: function deleteQuestion() {
        this.$emit('delete-question', this.question);
      },

      /**
       * Annotation Handling
       */
      addNewAnnotation: function addNewAnnotation() {
        this.$annomlstore.commit('enableSelectable');
      },
      selectAnnotation: function selectAnnotation(annotation) {
        var _this2 = this;

        if (annotation.color === utils.annotation.stateColor.SELECTED) {
          this.clearAnnotation();
        } else {
          this.pointAnnotations.forEach(function (a) {
            var pointAnnotation = a;

            if (pointAnnotation.id === annotation.id) {
              pointAnnotation.color = utils.annotation.stateColor.SELECTED;
            } else {
              pointAnnotation.color = _this2.question.color;
            }
          });
          this.rectangleAnnotations.forEach(function (a) {
            var rectangleAnnotation = a;

            if (rectangleAnnotation.id === annotation.id) {
              rectangleAnnotation.color = utils.annotation.stateColor.SELECTED;
            } else {
              rectangleAnnotation.color = _this2.question.color;
            }
          });
        }
      },
      hideAnnotation: function hideAnnotation(annotation) {
        var _this3 = this;

        if (annotation.color === utils.annotation.stateColor.HIDDEN) {
          this.clearAnnotation();
        } else {
          this.pointAnnotations.forEach(function (a) {
            var pointAnnotation = a;

            if (pointAnnotation.id === annotation.id) {
              pointAnnotation.color = utils.annotation.stateColor.HIDDEN;
            } else {
              pointAnnotation.color = _this3.question.color;
            }
          });
          this.rectangleAnnotations.forEach(function (a) {
            var rectangleAnnotation = a;

            if (rectangleAnnotation.id === annotation.id) {
              rectangleAnnotation.color = utils.annotation.stateColor.HIDDEN;
            } else {
              rectangleAnnotation.color = _this3.question.color;
            }
          });
        }
      },
      clearAnnotation: function clearAnnotation() {
        var _this4 = this;

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;
          pointAnnotation.color = _this4.question.color;
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;
          rectangleAnnotation.color = _this4.question.color;
        });
      },
      deleteAnnotation: function deleteAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$annomlstore.commit('removeCurrentPointAnnotation', annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$annomlstore.commit('removeCurrentRectangleAnnotation', annotation);
        }
      },
      updateAnnotation: function updateAnnotation(annotation) {
        if (annotation.annotationType === utils.annotation.types.POINT) {
          this.$set(this.pointAnnotations, this.pointAnnotations.findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        } else if (annotation.annotationType === utils.annotation.types.RECTANGLE) {
          this.$set(this.rectangleAnnotations, this.rectangleAnnotations.findIndex(function (a) {
            return a.id === annotation.id;
          }), annotation);
        }
      },
      updateAnnotationColor: function updateAnnotationColor(value) {
        if (this.question.color) {
          this.$annomlstore.commit('removeUsedColor', value);
          this.question.color = value;
        } else {
          this.question.color = value;
        }

        this.pointAnnotations.forEach(function (a) {
          var pointAnnotation = a;

          if (pointAnnotation.color !== utils.annotation.stateColor.HIDDEN || pointAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            pointAnnotation.color = value;
          }
        });
        this.rectangleAnnotations.forEach(function (a) {
          var rectangleAnnotation = a;

          if (rectangleAnnotation.color !== utils.annotation.stateColor.HIDDEN || rectangleAnnotation.color !== utils.annotation.stateColor.SELECTED) {
            rectangleAnnotation.color = value;
          }
        });
      },

      /**
       * Editor Helpers
       */
      editorHasContent: function editorHasContent() {
        var body = this.editor.getHTML();
        return body !== '<p></p>';
      },

      /**
       * Answer Handling
       */
      upVoteAnswer: function upVoteAnswer(answer) {
        var _this5 = this;

        service(this.$serviceApiAuthenticated).upVoteAnswer(answer).then(function (response) {
          _this5.$set(_this5.answers, _this5.answers.findIndex(function (q) {
            return q.id === answer.id;
          }), response);
        });
      },
      downVoteAnswer: function downVoteAnswer(answer) {
        var _this6 = this;

        service(this.$serviceApiAuthenticated).downVoteAnswer(answer).then(function (response) {
          _this6.$set(_this6.answers, _this6.answers.findIndex(function (q) {
            return q.id === answer.id;
          }), response);
        });
      }
    },
    beforeDestroy: function beforeDestroy() {
      this.editor.destroy();
    }
  };

  /* script */
  const __vue_script__$e = script$e;

  /* template */
  var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-card',{staticClass:"mt-4 mb-2"},[_c('div',{staticClass:"title"},[_c('input',{directives:[{name:"model",rawName:"v-model.trim",value:(_vm.title),expression:"title",modifiers:{"trim":true}}],attrs:{"id":"question-title","placeholder":"Question Title","required":""},domProps:{"value":(_vm.title)},on:{"input":function($event){if($event.target.composing){ return; }_vm.title=$event.target.value.trim();},"blur":function($event){return _vm.$forceUpdate()}}})]),_vm._v(" "),(_vm.pointAnnotations.length > 0 || _vm.rectangleAnnotations.length > 0)?_c('annotation-select',{staticClass:"annotation-select",attrs:{"point-annotations":_vm.pointAnnotations,"rectangle-annotations":_vm.rectangleAnnotations,"annotation-color":_vm.question.color,"edit":true},on:{"select-annotation":_vm.selectAnnotation,"hide-annotation":_vm.hideAnnotation,"delete-annotation":_vm.deleteAnnotation,"update-annotation":_vm.updateAnnotation,"update-color":_vm.updateAnnotationColor}}):_vm._e(),_vm._v(" "),_c('b-button',{staticClass:"float-right",attrs:{"disabled":_vm.$annomlstore.getters.visualizationSelectable,"size":"sm","variant":"outline-primary"},on:{"click":_vm.addNewAnnotation}},[_vm._v("Add Annotation\n  ")]),_vm._v(" "),_c('div',{staticClass:"editor"},[_c('div',{staticClass:"editor-toolbar"},[_c('b-button-toolbar',[_c('editor-menu-bar',{staticClass:"menubar",attrs:{"editor":_vm.editor},scopedSlots:_vm._u([{key:"default",fn:function(ref){
  var commands = ref.commands;
  var isActive = ref.isActive;
  return [_c('b-button-group',{attrs:{"size":"sm"}},[_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.bold() },on:{"click":commands.bold}},[_c('font-awesome-icon',{attrs:{"icon":"bold"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.italic() },on:{"click":commands.italic}},[_c('font-awesome-icon',{attrs:{"icon":"italic"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.strike() },on:{"click":commands.strike}},[_c('font-awesome-icon',{attrs:{"icon":"strikethrough"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__b-button",class:{ active: isActive.underline() },on:{"click":commands.underline}},[_c('font-awesome-icon',{attrs:{"icon":"underline"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.bullet_list() },on:{"click":commands.bullet_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ul"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.ordered_list() },on:{"click":commands.ordered_list}},[_c('font-awesome-icon',{attrs:{"icon":"list-ol"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.blockquote() },on:{"click":commands.blockquote}},[_c('font-awesome-icon',{attrs:{"icon":"quote-left"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",class:{ active: isActive.code_block() },on:{"click":commands.code_block}},[_c('font-awesome-icon',{attrs:{"icon":"code"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.undo}},[_c('font-awesome-icon',{attrs:{"icon":"undo"}})],1),_vm._v(" "),_c('b-button',{staticClass:"menubar__button",on:{"click":commands.redo}},[_c('font-awesome-icon',{attrs:{"icon":"undo","flip":"horizontal"}})],1)],1)]}}])})],1)],1),_vm._v(" "),_c('editor-content',{staticClass:"editor__content",attrs:{"id":"editor","editor":_vm.editor}})],1),_vm._v(" "),_c('div',[(_vm.question.author)?_c('b-button',{attrs:{"variant":"primary"},on:{"click":_vm.updateQuestion}},[_vm._v("Save\n    ")]):_c('b-button',{attrs:{"variant":"success","disabled":!_vm.discussion.published},on:{"click":_vm.submitQuestion}},[_vm._v("Submit")]),_vm._v(" "),_c('b-button',{staticClass:"ml-1",attrs:{"variant":"danger"},on:{"click":_vm.deleteQuestion}},[_vm._v("Delete\n    ")])],1),_vm._v(" "),_vm._l((_vm.question.answers),function(answer){return _c('answer',{key:answer.id,attrs:{"post":answer,"question":_vm.question}})})],2)};
  var __vue_staticRenderFns__$e = [];

    /* style */
    const __vue_inject_styles__$e = function (inject) {
      if (!inject) return
      inject("data-v-2a009bfd_0", { source: "#question-title{border:none;font-size:2rem;width:100%}#question-title:focus{outline:0}.annotation-select{margin-top:.5rem;margin-bottom:.5rem}.editor-toolbar{margin-bottom:.5rem}.icon-flipped{transform:scaleX(-1);-moz-transform:scaleX(-1);-webkit-transform:scaleX(-1);-ms-transform:scaleX(-1)}.editor{margin-top:.5rem;margin-bottom:.5rem}.editor .ProseMirror{resize:vertical;position:relative;overflow-y:scroll;height:calc(1.5em + 5rem + 2px);padding:.375rem .75rem;font-size:1rem;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:.25rem}.editor .ProseMirror-focused{outline:0}.editor__content{word-wrap:break-word}.editor__content *{caret-color:currentColor}.editor__content p{margin-top:.2rem;margin-bottom:.2rem}.editor__content pre{padding:.7rem 1rem;border-radius:5px;background:#000;color:#fff;font-size:.8rem;overflow-x:auto}.editor__content pre code{display:block}.editor__content p code{display:inline-block;padding:0 .4rem;border-radius:5px;font-size:.8rem;font-weight:700;background:rgba(0,0,0,.1);color:rgba(0,0,0,.8)}.editor__content ol,.editor__content ul{padding-left:1rem}.editor__content li>ol,.editor__content li>p,.editor__content li>ul{margin:0}.editor__content a{color:inherit}.editor__content blockquote{border-left:3px solid rgba(0,0,0,.1);color:rgba(0,0,0,.8);padding-left:.8rem;font-style:italic}.editor__content blockquote p{margin:0}.editor__content img{max-width:100%;border-radius:3px}.editor__content table{border-collapse:collapse;table-layout:fixed;width:100%;margin:0;overflow:hidden}.editor__content table td,.editor__content table th{min-width:1em;border:2px solid #ddd;padding:3px 5px;vertical-align:top;box-sizing:border-box;position:relative}.editor__content table td>*,.editor__content table th>*{margin-bottom:0}.editor__content table th{font-weight:700;text-align:left}.editor__content table .selectedCell:after{z-index:2;position:absolute;content:\"\";left:0;right:0;top:0;bottom:0;background:rgba(200,200,255,.4);pointer-events:none}.editor__content table .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.editor__content .tableWrapper{margin:1em 0;overflow-x:auto}.editor__content .resize-cursor{cursor:ew-resize;cursor:col-resize}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$e = undefined;
    /* module identifier */
    const __vue_module_identifier__$e = undefined;
    /* functional template */
    const __vue_is_functional_template__$e = false;
    /* style inject SSR */
    

    
    var QuestionEditor = normalizeComponent_1(
      { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
      __vue_inject_styles__$e,
      __vue_script__$e,
      __vue_scope_id__$e,
      __vue_is_functional_template__$e,
      __vue_module_identifier__$e,
      browser,
      undefined
    );

  //
  var script$f = {
    name: 'DiscussionView',
    components: {
      Question: Question,
      QuestionEditor: QuestionEditor
    },
    props: {
      discussion: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        questions: [],
        editorOpen: false,
        maxHeight: 0
      };
    },
    mounted: function mounted() {},
    created: function created() {
      var _this = this;

      this.questions = this.discussion.questions;
      this.questions.forEach(function (question) {
        if (question.color) {
          _this.$annomlstore.commit('addUsedColor', question.color);
        }

        if (question.pointAnnotations.length > 0) {
          _this.$annomlstore.commit('addPointAnnotations', question.pointAnnotations);
        }

        if (question.rectangleAnnotations.length > 0) {
          _this.$annomlstore.commit('addRectangleAnnotations', question.rectangleAnnotations);
        }
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.currentPointAnnotations;
      }, function (currentPointAnnotations) {
        if (currentPointAnnotations.length > 0 && !_this.$annomlstore.getters.hasCurrentPost) {
          _this.createQuestion();
        }
      });
      this.$annomlstore.watch(function (state, getters) {
        return getters.currentRectangleAnnotations;
      }, function (currentRectangleAnnotations) {
        if (currentRectangleAnnotations.length > 0 && !_this.$annomlstore.getters.hasCurrentPost) {
          _this.createQuestion();
        }
      });
    },
    methods: {
      /**
       * Question Events
       */
      createQuestion: function createQuestion() {
        var newQuestion = {
          id: Date.now(),
          pointAnnotations: [],
          rectangleAnnotations: [],
          answers: [],
          author: null,
          upVotes: [],
          downVotes: []
        };
        this.questions.push(newQuestion);
        this.$annomlstore.commit('setCurrentPost', newQuestion);
      },
      saveQuestion: function saveQuestion(question) {
        var _this2 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('addUsedColor', question.color);
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');
        this.$set(this.questions, this.questions.findIndex(function (q) {
          return q.id === question.id;
        }), question);
        service(this.$serviceApiAuthenticated).addQuestion(this.discussion.id, question).then(function (response) {
          _this2.$set(_this2.questions, _this2.questions.findIndex(function (q) {
            return q.id === question.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this2.$annomlstore.commit('removePointAnnotations', question.pointAnnotations);

            _this2.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this2.$annomlstore.commit('removeRectangleAnnotations', question.rectangleAnnotations);

            _this2.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color !== question.color) {
            _this2.$annomlstore.commit('addUsedColor', question.color);
          }
        });
      },
      updateQuestion: function updateQuestion(question) {
        var _this3 = this;

        this.$annomlstore.commit('mergeCurrentAnnotations');
        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');
        this.$set(this.questions, this.questions.findIndex(function (q) {
          return q.id === question.id;
        }), question);
        service(this.$serviceApiAuthenticated).updateQuestion(question).then(function (response) {
          _this3.$set(_this3.questions, _this3.questions.findIndex(function (q) {
            return q.id === question.id;
          }), response);

          if (response.pointAnnotations.length > 0) {
            _this3.$annomlstore.commit('removePointAnnotations', question.pointAnnotations);

            _this3.$annomlstore.commit('addPointAnnotations', response.pointAnnotations);
          }

          if (response.rectangleAnnotations.length > 0) {
            _this3.$annomlstore.commit('removeRectangleAnnotations', question.rectangleAnnotations);

            _this3.$annomlstore.commit('addRectangleAnnotations', response.rectangleAnnotations);
          }

          if (response.color !== question.color) {
            _this3.$annomlstore.commit('addUsedColor', question.color);
          }
        });
      },
      deleteQuestion: function deleteQuestion(question) {
        var _this4 = this;

        this.$annomlstore.commit('clearCurrentAnnotations');
        this.$annomlstore.commit('removeCurrentPost');
        this.$annomlstore.commit('enableSelectable');

        if (question.color) {
          this.$annomlstore.commit('removeUsedColor', question.color);
        }

        this.questions = this.questions.filter(function (q) {
          return q.id !== question.id;
        });

        if (question.author) {
          service(this.$serviceApiAuthenticated).deleteQuestion(this.discussion.id, question).then(function (response) {
            console.log(response);

            _this4.$set(_this4.questions, _this4.questions.findIndex(function (q) {
              return q.id === question.id;
            }), response);
          });
        }
      },
      editQuestion: function editQuestion(question) {
        if (!this.$annomlstore.getters.hasCurrentPost) {
          this.$annomlstore.commit('setCurrentPost', question);

          if (question.pointAnnotations.length > 0) {
            this.$annomlstore.commit('removePointAnnotations', question.pointAnnotations);
            this.$annomlstore.commit('setCurrentPointAnnotations', question.pointAnnotations);
          }

          if (question.rectangleAnnotations.length > 0) {
            this.$annomlstore.commit('removeRectangleAnnotations', question.rectangleAnnotations);
            this.$annomlstore.commit('setCurrentRectangleAnnotations', question.rectangleAnnotations);
          }
        }
      },

      /**
       * Vote Handling
       */
      upVoteQuestion: function upVoteQuestion(question) {
        var _this5 = this;

        service(this.$serviceApiAuthenticated).upVoteQuestion(question).then(function (response) {
          _this5.$set(_this5.questions, _this5.questions.findIndex(function (q) {
            return q.id === question.id;
          }), response);
        });
      },
      downVoteQuestion: function downVoteQuestion(question) {
        var _this6 = this;

        service(this.$serviceApiAuthenticated).downVoteQuestion(question).then(function (response) {
          _this6.$set(_this6.questions, _this6.questions.findIndex(function (q) {
            return q.id === question.id;
          }), response);
        });
      }
    }
  };

  /* script */
  const __vue_script__$f = script$f;

  /* template */
  var __vue_render__$f = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"discussion"},_vm._l((_vm.questions),function(question){return _c('div',{key:question.id},[(question === _vm.$annomlstore.getters.getCurrentPost)?_c('question-editor',{key:question.id,attrs:{"question":question,"point-annotations":_vm.$annomlstore.getters.currentPointAnnotations,"rectangle-annotations":_vm.$annomlstore.getters.currentRectangleAnnotations,"discussion":_vm.discussion},on:{"save-question":_vm.saveQuestion,"update-question":_vm.updateQuestion,"delete-question":_vm.deleteQuestion}}):_c('question',{key:question.id,attrs:{"question":question},on:{"edit-question":_vm.editQuestion,"up-vote-question":_vm.upVoteQuestion,"down-vote-question":_vm.downVoteQuestion}})],1)}),0)};
  var __vue_staticRenderFns__$f = [];

    /* style */
    const __vue_inject_styles__$f = undefined;
    /* scoped */
    const __vue_scope_id__$f = undefined;
    /* module identifier */
    const __vue_module_identifier__$f = undefined;
    /* functional template */
    const __vue_is_functional_template__$f = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var DiscussionView = normalizeComponent_1(
      { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
      __vue_inject_styles__$f,
      __vue_script__$f,
      __vue_scope_id__$f,
      __vue_is_functional_template__$f,
      __vue_module_identifier__$f,
      undefined,
      undefined
    );

  //
  var script$g = {
    name: 'DiscussionInfo',
    props: {
      discussion: {
        type: Object,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        showPublish: true,
        title: '',
        preventSubmit: true
      };
    },
    watch: {
      discussion: function discussion() {
        if (this.discussion.title) {
          this.title = this.discussion.title;
          this.preventSubmit = true;
        }

        this.showPublish = !this.discussion.published;
      },
      title: {
        handler: function handler() {
          this.preventSubmit = !(this.title !== this.discussion.title && this.title !== '');
        }
      }
    },
    created: function created() {
      if (this.discussion.title) {
        this.title = this.discussion.title;
        this.preventSubmit = true;
      }

      this.showPublish = !this.discussion.published;
    },
    methods: {
      checkIfIsSameDate: function checkIfIsSameDate(date1, date2) {
        return date1 !== date2;
      },
      formatTimestamp: function formatTimestamp(timestamp) {
        var date = new Date(timestamp);
        return "".concat(date.toLocaleDateString());
      },
      formatEditTimestamp: function formatEditTimestamp(created, edit) {
        var createDate = new Date(created);
        var editDate = new Date(edit);

        if (createDate.getDate() === editDate.getDate()) {
          return "last activity at ".concat(editDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          }));
        }

        return "last activity on ".concat(editDate.toLocaleDateString(), "at").concat(editDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        }));
      },
      requestUsername: function requestUsername(userId) {
        service(this.$authApi).getUser(this.$annomlstore.getters.getSettings.authenticationProvider.endpoints.userInfoById, userId).then(function (data) {
          console.log(data);
        });
      },
      updateDiscussion: function updateDiscussion() {
        var _this = this;

        if (this.discussion.title !== '') {
          service(this.$serviceApiAuthenticated).updateDiscussion(this.discussion.id, this.discussion.visualizationHash, this.title).then(function (discussion) {
            _this.$emit('update-discussion', discussion);
          }).catch(function (message) {
            return console.log(message);
          });
        }
      },
      deleteDiscussion: function deleteDiscussion() {
        var _this2 = this;

        service(this.$serviceApiAuthenticated).deleteDiscussion(this.discussion.id).then(function () {
          _this2.$router.back();
        }).catch(function (message) {
          return console.log(message);
        });
      }
    }
  };

  /* script */
  const __vue_script__$g = script$g;

  /* template */
  var __vue_render__$g = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('b-card',{staticClass:"discussion-info mt-2 "},[_c('b-container',{attrs:{"fluid":""}},[_c('b-row',[_c('b-col',{attrs:{"cols":"2"}},[_c('div',{staticClass:"discussion-meta align-top"},[_vm._v("\n          Created by\n          "),(_vm.discussion.author.externalId)?_c('span',{staticClass:"username"},[_vm._v("\n            "+_vm._s(_vm.discussion.author.externalId))]):_c('span',{staticClass:"username"},[_vm._v("User #"+_vm._s(_vm.discussion.author.id))]),_vm._v(" "),(_vm.discussion.created)?_c('span',{staticClass:"created"},[_vm._v("\n            on "+_vm._s(_vm.formatTimestamp(_vm.discussion.created)))]):_vm._e(),_vm._v(" "),(_vm.checkIfIsSameDate(_vm.discussion.created, _vm.discussion.edited))?_c('span',{staticClass:"edited"},[_vm._v("\n            ("+_vm._s(_vm.formatEditTimestamp(_vm.discussion.created, _vm.discussion.edited))+")\n          ")]):_vm._e()])]),_vm._v(" "),_c('b-col',{attrs:{"cols":"8"}},[_c('div',{staticClass:"discussion-title"},[(
                _vm.$annomlsettings.currentUser === _vm.discussion.author.externalId
              )?_c('input',{directives:[{name:"model",rawName:"v-model.trim",value:(_vm.title),expression:"title",modifiers:{"trim":true}}],attrs:{"placeholder":"Enter a discussion title","required":""},domProps:{"value":(_vm.title)},on:{"input":function($event){if($event.target.composing){ return; }_vm.title=$event.target.value.trim();},"blur":function($event){return _vm.$forceUpdate()}}}):_c('span',[_vm._v(_vm._s(_vm.discussion.title))])])]),_vm._v(" "),_c('b-col',{attrs:{"cols":"2"}},[(_vm.$annomlsettings.currentUser === _vm.discussion.author.externalId)?_c('div',{staticClass:"float-right mt-1"},[(!_vm.discussion.published)?_c('b-button',{attrs:{"disabled":_vm.preventSubmit,"id":"publish","variant":"success"},on:{"click":_vm.updateDiscussion}},[_vm._v("Publish")]):_c('b-button',{attrs:{"variant":"primary","disabled":_vm.preventSubmit},on:{"click":_vm.updateDiscussion}},[_vm._v("Save")]),_vm._v(" "),_c('b-button',{staticClass:"ml-2",attrs:{"variant":"danger"},on:{"click":_vm.deleteDiscussion}},[_vm._v("Delete")]),_vm._v(" "),(!_vm.discussion.published)?_c('b-popover',{attrs:{"target":"publish","placement":"bottom","show":_vm.showPublish,"title":"Please enter a title and publish!","content":"Otherwise all changes get lost after leaving this page","triggers":"none","delay":{ show: 100 }}}):_vm._e()],1):_vm._e()])],1)],1)],1)};
  var __vue_staticRenderFns__$g = [];

    /* style */
    const __vue_inject_styles__$g = function (inject) {
      if (!inject) return
      inject("data-v-2c1427a5_0", { source: ".discussion-title[data-v-2c1427a5]{font-size:2rem;width:100%}.discussion-title input[data-v-2c1427a5]{border:none;width:100%}.discussion-title input[data-v-2c1427a5]:focus{outline:0}.discussion-meta .username[data-v-2c1427a5]{font-size:larger;font-weight:700}.discussion-meta .edited[data-v-2c1427a5]{font-weight:lighter;display:block}", map: undefined, media: undefined });

    };
    /* scoped */
    const __vue_scope_id__$g = "data-v-2c1427a5";
    /* module identifier */
    const __vue_module_identifier__$g = undefined;
    /* functional template */
    const __vue_is_functional_template__$g = false;
    /* style inject SSR */
    

    
    var DiscussionInfo = normalizeComponent_1(
      { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
      __vue_inject_styles__$g,
      __vue_script__$g,
      __vue_scope_id__$g,
      __vue_is_functional_template__$g,
      __vue_module_identifier__$g,
      browser,
      undefined
    );

  //
  var script$h = {
    name: 'AnnoML',
    components: {
      DiscussionInfo: DiscussionInfo,
      Loading: Loading,
      DiscussionView: DiscussionView,
      VisualizationView: VisualizationView
    },
    props: {
      discussionId: {
        type: String,
        default: function _default() {
          return null;
        }
      }
    },
    data: function data() {
      return {
        discussion: null,
        message: 'Loading Discussion',
        warning: null
      };
    },
    created: function created() {
      this.$annomlstore.commit('clearStore');
    },
    mounted: function mounted() {
      var _this = this;

      service(this.$serviceApiAuthenticated).getDiscussion(this.discussionId).then(function (result) {
        _this.discussion = result;
      }).catch(function (message) {
        _this.warning = message.toString();
      });
    },
    methods: {
      updateDiscussion: function updateDiscussion(discussion) {
        this.discussion = discussion;
      }
    }
  };

  /* script */
  const __vue_script__$h = script$h;

  /* template */
  var __vue_render__$h = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"annoml-page h-100"},[(_vm.discussion)?_c('b-container',{attrs:{"fluid":""}},[_c('b-row',[_c('b-col',{attrs:{"cols":"12"}},[_c('discussion-info',{attrs:{"discussion":_vm.discussion},on:{"update-discussion":_vm.updateDiscussion}})],1)],1),_vm._v(" "),_c('b-row',[_c('b-col',{attrs:{"cols":"12","md":"6"}},[_c('visualization-view',{attrs:{"discussion":_vm.discussion}})],1),_vm._v(" "),_c('b-col',{attrs:{"cols":"12","md":"6"}},[_c('discussion-view',{attrs:{"discussion":_vm.discussion}})],1)],1)],1):_c('loading',{attrs:{"message":_vm.message,"warning":_vm.warning}})],1)};
  var __vue_staticRenderFns__$h = [];

    /* style */
    const __vue_inject_styles__$h = undefined;
    /* scoped */
    const __vue_scope_id__$h = undefined;
    /* module identifier */
    const __vue_module_identifier__$h = undefined;
    /* functional template */
    const __vue_is_functional_template__$h = false;
    /* style inject */
    
    /* style inject SSR */
    

    
    var AnnoML = normalizeComponent_1(
      { render: __vue_render__$h, staticRenderFns: __vue_staticRenderFns__$h },
      __vue_inject_styles__$h,
      __vue_script__$h,
      __vue_scope_id__$h,
      __vue_is_functional_template__$h,
      __vue_module_identifier__$h,
      undefined,
      undefined
    );

  /* eslint-disable no-console,no-param-reassign,max-len */
  var components = {
    AnnoML: AnnoML
  };
  var version = '1.0.13';

  var install = function install(Vue, config) {
    /*
     * NOTE:
     *   if you need to extend Vue contstructor, you can extend it in here.
     */
    if (!config) {
      throw new Error('Please initialise plugin with the required configs.');
    } // install annoML component


    Vue.component('AnnoML', AnnoML); // Bootstrap and icon import

    fontawesomeSvgCore.library.add(freeSolidSvgIcons.fas);
    Vue.use(BootstrapVue);
    Vue.component('font-awesome-icon', vueFontawesome.FontAwesomeIcon);
    Vue.component('font-awesome-layers', vueFontawesome.FontAwesomeLayers);
    Vue.component('font-awesome-layers-text', vueFontawesome.FontAwesomeLayersText); // Exports plugin settings and store to components

    Vue.prototype.$annomlsettings = config;
    Vue.prototype.$annomlstore = store;
    Vue.prototype.$annomlutils = utils;
    Vue.prototype.$resourceApi = axios.create({
      baseURL: config.resourceProvider.baseURL,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        Authorization: "Bearer ".concat(config.resourceProvider.accessToken)
      }
    });
    var serviceApi = axios.create({
      baseURL: config.baseURL,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    });

    var serviceApiAuthenticated = function serviceApiAuthenticated() {
      serviceApi.defaults.headers.common.Authorization = "Bearer ".concat(config.authenticationProvider.authToken);
      return serviceApi;
    };

    Vue.prototype.$serviceApi = serviceApi;
    Vue.prototype.$serviceApiAuthenticated = serviceApiAuthenticated();

    Vue.prototype.$startDiscussionWithUrl = function (visualizationUrl) {
      return service(serviceApiAuthenticated()).createDiscussionWithUrl(visualizationUrl).then(function (discussion) {
        return discussion.id;
      }).catch(function (message) {
        console.log(message);
      });
    };

    Vue.prototype.$startDiscussionWithReference = function (visualizationId) {
      return service(serviceApiAuthenticated()).createDiscussionWithId(visualizationId).then(function (discussion) {
        return discussion.id;
      }).catch(function (message) {
        console.log(message);
      });
    };

    Vue.prototype.$startDiscussionWithImport = function (visualizationSchema) {
      return service(serviceApiAuthenticated()).createDiscussionWithSchema(visualizationSchema).then(function (discussion) {
        return discussion.id;
      }).catch(function (message) {
        console.log(message);
      });
    };

    store.commit('importSettings', config);

    if (config.debug) {
      console.log('DEBUG MODE');
    }
  };

  var plugin = {
    install: install,
    version: version,
    components: components
  };

  return plugin;

}));
