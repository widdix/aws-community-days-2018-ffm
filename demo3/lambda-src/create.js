const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const STATUS_TABLE_NAME = process.env.DEPENDENCY1_ARN.split('/')[1];

exports.handler = async (event) => { // idempotent (but relying on client time is dangerous) but status updates can be lost if putItem does not succeed within 3 tries
  const now = new Date(event.timestamp);
  await dynamodb.putItem({
    TableName: STATUS_TABLE_NAME,
    Item: {
      user_id: {S: event.id},
      status_timestamp: {N: String(event.timestamp)},
      status: {S: event.status},
      created_at: {S: now.toISOString()}
    }
  }).promise();
  return {};
};
