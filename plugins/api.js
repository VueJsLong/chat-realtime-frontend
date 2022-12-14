import Vue from 'vue'

const api = {
  findUser: '/users/find',
  conversation: '/messages/conversations',
  getRequests: '/friends/request',
  getFriends: '/friends',
  getGroupMembers: '/groups',
  uploadSingleImage: '/uploads/single',
  uploadMultipleImage: '/uploads/multiple',
}

export default ({ app }, inject) => {
  inject('api', Vue.observable(api))
}
