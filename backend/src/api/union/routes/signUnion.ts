export default {
  routes: [
    {
      method: 'POST',
      path: '/unions/:id/sign',
      handler: 'api::union.union.sign',
      // config: {
      //   policies: []
      // }
    }
  ]
}
