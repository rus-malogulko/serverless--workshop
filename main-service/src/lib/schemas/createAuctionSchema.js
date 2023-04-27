const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          default: 'My Auction',
        }
      },
      required: ['title'],
    }
  },
  required: ['body'],
};

export default schema;
