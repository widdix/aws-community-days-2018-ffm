const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const STATUS_TABLE_NAME = process.env.DEPENDENCY1_ARN.split('/')[1];

exports.handler = async (event) => { // NOT idempotent: status updates can be duplicated or lost if putItem does not succeed within 3 tries
  const now = new Date();
  await dynamodb.putItem({
    TableName: STATUS_TABLE_NAME,
    Item: {
      user_id: {S: event.id},
      status_timestamp: {N: String(now.getTime())},
      status: {S: event.status},
      created_at: {S: now.toISOString()}
    }
  }).promise();
  return {};
};
