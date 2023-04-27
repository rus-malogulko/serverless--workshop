const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          minimum: 1,
        }
      }
    }
  }
};

export default schema;
