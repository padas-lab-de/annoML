/* eslint-disable semi,no-console */


const service = instance => ({


  /**
   * annoML API requests
   */

  getRecentDiscussions: (results) => {
    const url = `/api/discussions/recent?results=${results}`;
    return instance.get(url).then(response => response.data);
  },


  /**
   * annoML API create requests
   */

  createDiscussionWithUrl: (visualizationUrl) => {
    const url = '/api/create/url';
    const body = {
      url: visualizationUrl,
    };
    return instance.post(url, body)
      .then(response => response.data);
  },
  createDiscussionWithId: (visualizationId) => {
    const url = '/api/create/reference';
    const body = {
      reference: visualizationId,
    };
    return instance.post(url, body)
      .then(response => response.data);
  },

  createDiscussionWithSchema: (schema) => {
    const url = '/api/create/reference';
    const body = schema;
    return instance.post(url, body)
      .then(response => response.data);
  },


  /**
   * Discussion Requests
   */

  getDiscussion: (disId) => {
    const url = `/discussions/${disId}`;
    return instance.get(url)
      .then(response => response.data);
  },

  updateDiscussion: (discussionId, hash, title) => {
    const url = `discussions/${discussionId}`;
    const body = {
      hash,
      title,
    };
    return instance.put(url, body).then(response => response.data);
  },

  deleteDiscussion: (discussionId) => {
    const url = `discussions/${discussionId}`;
    return instance.delete(url).then(response => response.data);
  },


  /**
   * Question Requests
   */

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

  upVoteQuestion: (question) => {
    const url = `/discussions/questions/${question.id}/vote/up`;
    return instance.get(url).then(response => response.data)
  },

  downVoteQuestion: (question) => {
    const url = `/discussions/questions/${question.id}/vote/down`;
    return instance.get(url).then(response => response.data)
  },


  /**
   * Answer Requests
   */

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

  upVoteAnswer: (answer) => {
    const url = `/discussions/answers/${answer.id}/vote/up`;
    return instance.get(url).then(response => response.data)
  },

  downVoteAnswer: (answer) => {
    const url = `/discussions/answers/${answer.id}/vote/down`;
    return instance.get(url).then(response => response.data)
  },


  /**
   * Comment Requests
   */

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

  upVoteComment: (comment) => {
    const url = `/discussions/comments/${comment.id}/vote/up`;
    return instance.get(url).then(response => response.data)
  },

  downVoteComment: (comment) => {
    const url = `/discussions/comments/${comment.id}/vote/down`;
    return instance.get(url).then(response => response.data)
  },


  /**
   * Visualization Requests
   */
  getVisualization: (visId) => {
    const url = `/visualizations/${visId}`;
    return instance.get(url)
      .then(response => response.data);
  },


  /**
   * Visualization requests from external resource server
   */

  getResourceVisualization(path, id) {
    const url = `${path}/${id}`;
    return instance.get(url)
      .then(response => response.data);
  },


  /**
   * User data requests from external provider
   */

  getUser(endpoint, userId) {
    const url = `${endpoint}/${userId}`;
    return instance.get(url)
      .then(response => response.data);
  },


});


export default service
