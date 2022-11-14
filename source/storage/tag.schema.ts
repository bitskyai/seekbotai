const tagSchema = {
  title: 'Tag Schema',
  version: 0,
  primaryKey: 'name',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 50,
    },
  },
  required: ['name'],
};

export default tagSchema;
