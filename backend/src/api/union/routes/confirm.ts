export default {
  routes: [
    {
      method: 'PUT',
      path: '/unions/:id/confirm',
      handler: 'api::union.union.confirm',
      // config: {
      //   policies: []
      // }
    }
  ]
}
