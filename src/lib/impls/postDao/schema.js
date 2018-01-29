export default {
  title: 'post',
  version: 0,
  description: 'coversation posts',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    type: {
      type: ['string', 'null'],
    },
    groupId: {
      type: ['string', 'null'],
    },
    creatorId: {
      type: ['string', 'null'],
    },
    text: {
      type: ['string', 'null'],
    },
    creationTime: {
      type: 'string',
    },
    lastModifiedTime: {
      type: 'string',
      index: true,
    },
    addedPersonIds: {
      type: ['array', 'null'],
      items: {
        type: 'string',
      },
    },
    attachments: {
      type: ['array', 'null'],
      items: {
        type: 'string',
      },
    },
    activity: {
      type: ['null'],
    },
    title: {
      type: ['string', 'null'],
    },
    iconUri: {
      type: ['string', 'null'],
    },
    iconEmoji: {
      type: ['string', 'null'],
    },
    mentions: {
      type: ['array', 'null'],
    },
  },
  required: ['creationTime', 'lastModifiedTime'],
};
