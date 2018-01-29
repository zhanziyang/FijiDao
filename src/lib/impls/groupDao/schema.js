export default {
  title: 'group',
  version: 0,
  description: 'coversation groups',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    type: {
      type: ['string', 'null'],
    },
    name: {
      type: ['string', 'null'],
    },
    isPublic: {
      type: ['boolean', 'null'],
    },
    description: {
      type: ['string', 'null'],
    },
    creationTime: {
      type: 'string',
    },
    lastModifiedTime: {
      type: 'string',
      index: true,
    },
    members: {
      type: ['array', 'null'],
      items: {
        type: 'string',
      },
    },
  },
  required: ['creationTime', 'lastModifiedTime'],
};
