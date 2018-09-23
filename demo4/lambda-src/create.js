const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const STATUS_TABLE_NAME = process.env.DEPENDENCY1_ARN.split('/')[1];

exports.handler = async (event) => { // idempotent but status updates can be lost if putItem does not succeed within 3 tries
  let no;
  if ('previous_no' in event) {
    const previous = await dynamodb.getItem({
      TableName: STATUS_TABLE_NAME,
      Key: {
        user_id: {S: event.id},
        status_no: {N: String(event.previous_no)}
      }
    }).promise();
    if (previous.Item === undefined) {
      throw new Error('previous status not found (yet)');
    }
    no = parseInt(previous.Item.status_no.N, 10) + 1;
  } else {
    no = 1;
  }
  await dynamodb.putItem({
    TableName: STATUS_TABLE_NAME,
    Item: {
      user_id: {S: event.id},
      status_no: {N: String(no)},
      status: {S: event.status},
      created_at: {S: new Date().toISOString()} // strictly speaking, this is not idempotent
    }
  }).promise();
  return {};
};
