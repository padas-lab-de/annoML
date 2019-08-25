/* eslint-disable semi,no-console */


const service = instance => ({

  addQuestion: (discussionId, question) => {
    const url = `/discussions/${discussionId}/question`;
    return instance.post(url, question)
      .then(response => response.data);
  },

  updateQuestion: (question) => {
    const url = `/discussions/questions/${question.id}`;
    return instance.post(url, question)
      .then(response => response.data);
  },

  deleteQuestion: (discussionId, question) => {
    const url = `/discussions/questions/${question.id}`;
    return instance.delete(url)
      .then(response => response.data);
  },

  addAnswer: (questionId, answer) => {
    const url = `/discussions/questions/${questionId}/answer`;
    return instance.post(url, answer)
      .then(response => response.data);
  },
  updateAnswer: (answer) => {
    const url = `/discussions/answers/${answer.id}`;
    return instance.post(url, answer)
      .then(response => response.data);
  },
  deleteAnswer: (answer) => {
    const url = `/discussions/answers/${answer.id}`;
    return instance.delete(url)
      .then(response => response.data);
  },

  addComment: (answerId, comment) => {
    const url = `/discussions/answers/${answerId}/comment`;
    return instance.post(url, comment)
      .then(response => response.data);
  },
  updateComment: (comment) => {
    const url = `/discussions/comments/${comment.id}`;
    return instance.post(url, comment)
      .then(response => response.data);
  },
  deleteComment: (comment) => {
    const url = `/discussions/comments/${comment.id}`;
    return instance.delete(url)
      .then(response => response.data);
  },

  getVisualization: (visId) => {
    const url = `/visualizations/${visId}`;
    return instance.get(url)
      .then(response => response.data);
  },

  getDiscussion: (disId) => {
    const url = `/discussions/${disId}`;
    return instance.get(url)
      .then(response => response.data);
  },

  createDiscussionWithUrl: (visualizationUrl) => {
    const url = '/discussions/create/url';
    const body = {
      url: visualizationUrl,
    };
    return instance.post(url, body)
      .then(response => response.data);
  },
  createDiscussionWithId: (visualizationId) => {
    const url = '/discussions/create/reference';
    const body = {
      reference: visualizationId,
    };
    return instance.post(url, body)
      .then(response => response.data);
  },

  createDiscussionWithSchema: (schema) => {
    const url = '/discussions/create/reference';
    const body = schema;
    return instance.post(url, body)
      .then(response => response.data);
  },

  /**
     * User data from external provider
     */
  getUser(endpoint, userId) {
    const url = `${endpoint}/${userId}`;
    return instance.get(url)
      .then(response => response.data);
  },

  /**
     * Data from external resource server
     */
  getResourceVisualization(path, id) {
    const url = `${path}/${id}`;
    return instance.get(url)
      .then(response => response.data);
  },
});


export default service
