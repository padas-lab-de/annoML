/* eslint-disable semi,no-console */
import axios from 'axios';

const API_URL = 'http://localhost:9999';
const USER_API_URL = 'http//:localhost:8080/api';


const instance = axios.create({
  baseURL: API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  },
});

const userProvider = axios.create({
  baseURL: USER_API_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  },
});


export default {
  addQuestion(discussionId, question) {
    const url = `/discussions/${discussionId}/question`;
    return instance.post(url, question).then(response => response.data);
  },
  updateQuestion(question) {
    const url = `/discussions/questions/${question.id}`;
    return instance.post(url, question).then(response => response.data);
  },
  deleteQuestion(discussionId, question) {
    const url = `/discussions/questions/${question.id}`;
    return instance.delete(url).then(response => response.data);
  },

  addAnswer(questionId, answer) {
    const url = `/discussions/questions/${questionId}/answer`;
    return instance.post(url, answer).then(response => response.data);
  },
  updateAnswer(answer) {
    const url = `/discussions/answers/${answer.id}`;
    return instance.post(url, answer).then(response => response.data);
  },
  deleteAnswer(answer) {
    const url = `/discussions/answers/${answer.id}`;
    return instance.delete(url).then(response => response.data);
  },

  addComment(answerId, comment) {
    const url = `/discussions/answers/${answerId}/comment`;
    return instance.post(url, comment).then(response => response.data);
  },
  updateComment(comment) {
    const url = `/discussions/comments/${comment.id}`;
    return instance.post(url, comment).then(response => response.data);
  },
  deleteComment(comment) {
    const url = `/discussions/comments/${comment.id}`;
    return instance.delete(url).then(response => response.data);
  },

  getVisualization(visId) {
    const url = `/visualizations/${visId}`;
    return instance.get(url).then(response => response.data);
  },

  getDiscussion(disId) {
    const url = `/discussions/${disId}`;
    return instance.get(url).then(response => response.data);
  },

  /**
   * User data from external provider
   */
  getUser(userId) {
    const url = `/users/${userId}`;
    return userProvider.get(url).then(response => response.data);
  },

  /**
   * Data from external resource server
   */
  getExternalVisualization(url) {
    return axios.get(url).then(response => response.data);
  },


};
